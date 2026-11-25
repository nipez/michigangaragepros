/**
 * HMAC-SHA256 signed tokens for homeowner check-in one-click links.
 * Pure helpers — no D1 / Resend / Cloudflare ALS. Safe for unit tests.
 *
 * Token format: base64url(payloadJson).base64url(hmac)
 * Payload: { v:1, leadId, action, exp } where action is yes|not_yet|unsub
 */

export const CHECKIN_TOKEN_VERSION = 1 as const;

/** Local copy — avoid importing admin.ts (pulls next/headers) in unit tests. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

/** Default link lifetime (7 days) — long enough for a 2–3 day send window. */
export const CHECKIN_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export type CheckinAction = "yes" | "not_yet" | "unsub";

export type CheckinTokenPayload = {
  v: typeof CHECKIN_TOKEN_VERSION;
  leadId: number;
  action: CheckinAction;
  /** Unix seconds expiry. */
  exp: number;
};

const ACTIONS = new Set<CheckinAction>(["yes", "not_yet", "unsub"]);

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const b64 =
    typeof btoa === "function"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array | null {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const b64 = padded + "=".repeat(padLen);
  try {
    if (typeof atob === "function") {
      const binary = atob(b64);
      const out = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        out[i] = binary.charCodeAt(i);
      }
      return out;
    }
    return new Uint8Array(Buffer.from(b64, "base64"));
  } catch {
    return null;
  }
}

function utf8Bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

async function hmacSha256(
  secret: string,
  message: string,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    utf8Bytes(secret) as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    utf8Bytes(message) as BufferSource,
  );
  return new Uint8Array(sig);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Canonical payload string used for signing (stable key order). */
export function serializeCheckinPayload(payload: CheckinTokenPayload): string {
  return JSON.stringify({
    v: payload.v,
    leadId: payload.leadId,
    action: payload.action,
    exp: payload.exp,
  });
}

export function isCheckinAction(value: string): value is CheckinAction {
  return ACTIONS.has(value as CheckinAction);
}

export async function signCheckinToken(
  secret: string,
  input: {
    leadId: number;
    action: CheckinAction;
    /** Override expiry unix seconds (tests). */
    exp?: number;
    /** Override "now" unix seconds (tests). */
    nowSec?: number;
    ttlSeconds?: number;
  },
): Promise<string> {
  const key = secret.trim();
  if (!key) throw new Error("check-in signing secret is required");
  const leadId = Number(input.leadId);
  if (!Number.isInteger(leadId) || leadId <= 0) {
    throw new Error("leadId must be a positive integer");
  }
  if (!isCheckinAction(input.action)) {
    throw new Error("invalid check-in action");
  }

  const nowSec = input.nowSec ?? Math.floor(Date.now() / 1000);
  const ttl = input.ttlSeconds ?? CHECKIN_TOKEN_TTL_SECONDS;
  const exp = input.exp ?? nowSec + ttl;

  const payload: CheckinTokenPayload = {
    v: CHECKIN_TOKEN_VERSION,
    leadId,
    action: input.action,
    exp,
  };
  const body = serializeCheckinPayload(payload);
  const bodyB64 = bytesToBase64Url(utf8Bytes(body));
  const sig = await hmacSha256(key, bodyB64);
  return `${bodyB64}.${bytesToBase64Url(sig)}`;
}

export type VerifyCheckinResult =
  | { ok: true; payload: CheckinTokenPayload }
  | { ok: false; error: string };

/**
 * Verify HMAC + expiry + shape. Does not touch the database.
 */
export async function verifyCheckinToken(
  secret: string,
  token: string,
  options?: {
    /** Require a specific action (optional). */
    expectedAction?: CheckinAction;
    nowSec?: number;
  },
): Promise<VerifyCheckinResult> {
  const key = secret.trim();
  if (!key) return { ok: false, error: "Signing is not configured" };

  const raw = (token ?? "").trim();
  const parts = raw.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, error: "Invalid link" };
  }

  const [bodyB64, sigB64] = parts;
  const expectedSig = await hmacSha256(key, bodyB64);
  const givenSig = base64UrlToBytes(sigB64);
  if (!givenSig || givenSig.length !== expectedSig.length) {
    return { ok: false, error: "Invalid link" };
  }
  if (!timingSafeEqual(bytesToHex(givenSig), bytesToHex(expectedSig))) {
    return { ok: false, error: "Invalid or expired link" };
  }

  const bodyBytes = base64UrlToBytes(bodyB64);
  if (!bodyBytes) return { ok: false, error: "Invalid link" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bodyBytes));
  } catch {
    return { ok: false, error: "Invalid link" };
  }

  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "Invalid link" };
  }
  const obj = parsed as Record<string, unknown>;
  const leadId = Number(obj.leadId);
  const action = String(obj.action ?? "");
  const exp = Number(obj.exp);
  const v = Number(obj.v);

  if (v !== CHECKIN_TOKEN_VERSION) {
    return { ok: false, error: "Invalid link" };
  }
  if (!Number.isInteger(leadId) || leadId <= 0) {
    return { ok: false, error: "Invalid link" };
  }
  if (!isCheckinAction(action)) {
    return { ok: false, error: "Invalid link" };
  }
  if (!Number.isFinite(exp)) {
    return { ok: false, error: "Invalid link" };
  }

  const nowSec = options?.nowSec ?? Math.floor(Date.now() / 1000);
  if (exp < nowSec) {
    return { ok: false, error: "This link has expired" };
  }

  if (options?.expectedAction && options.expectedAction !== action) {
    return { ok: false, error: "Wrong link for this action" };
  }

  return {
    ok: true,
    payload: {
      v: CHECKIN_TOKEN_VERSION,
      leadId,
      action,
      exp,
    },
  };
}

/**
 * Resolve signing secret: dedicated CHECKIN_SIGNING_SECRET, else ADMIN_TOKEN.
 * Empty string when neither is set (caller should skip signed sends).
 */
export function resolveCheckinSigningSecret(env: {
  CHECKIN_SIGNING_SECRET?: string;
  ADMIN_TOKEN?: string;
}): string {
  return (
    env.CHECKIN_SIGNING_SECRET?.trim() || env.ADMIN_TOKEN?.trim() || ""
  );
}
