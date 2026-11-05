import type { getDb } from "@/lib/db";

type RecoverDb = Awaited<ReturnType<typeof getDb>>;

export type ManageRecoverRequest = {
  email: string;
  companyName: string;
  companySlug: string;
  /** Honeypot — must stay empty. */
  website: string;
};

export const EMPTY_MANAGE_RECOVER: ManageRecoverRequest = {
  email: "",
  companyName: "",
  companySlug: "",
  website: "",
};

/** Public success copy — identical for match and no-match (anti-enumeration). */
export const MANAGE_RECOVER_SUCCESS_MESSAGE =
  "If we find a claimed listing for that email, we will send the manage link.";

export const RATE_LIMIT_WINDOW_HOURS = 1;
export const RATE_LIMIT_PER_IP = 5;
export const RATE_LIMIT_PER_EMAIL = 3;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type RecoverMatch = {
  slug: string;
  companyName: string;
  manageToken: string;
  notifyEmail: string;
};

export function normalizeRecoverEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateManageRecover(
  input: ManageRecoverRequest,
): string | null {
  const email = normalizeRecoverEmail(input.email);
  if (!email || !EMAIL_RE.test(email)) {
    return "A valid email is required";
  }
  return null;
}

/** Shape the public JSON body — never reveals whether a match was found. */
export function manageRecoverSuccessResponse() {
  return {
    ok: true as const,
    message: MANAGE_RECOVER_SUCCESS_MESSAGE,
  };
}

export function emailsMatch(
  stored: string | null | undefined,
  normalizedEmail: string,
): boolean {
  if (!stored?.trim() || !normalizedEmail) return false;
  return normalizeRecoverEmail(stored) === normalizedEmail;
}

/**
 * Pick the best single match from candidate rows.
 * Prefer explicit slug, then company-name substring, then most recent.
 */
export function selectRecoverMatch(
  candidates: RecoverMatch[],
  opts: { companySlug?: string; companyName?: string } = {},
): RecoverMatch | null {
  if (candidates.length === 0) return null;

  const slug = opts.companySlug?.trim().toLowerCase() ?? "";
  if (slug) {
    const bySlug = candidates.find((c) => c.slug.toLowerCase() === slug);
    if (bySlug) return bySlug;
    // Slug provided but no match under that slug — do not fall through to
    // other companies (avoids emailing a different listing's manage link).
    return null;
  }

  const name = opts.companyName?.trim().toLowerCase() ?? "";
  if (name) {
    const byName = candidates.filter((c) =>
      c.companyName.toLowerCase().includes(name),
    );
    if (byName.length === 1) return byName[0];
    if (byName.length > 1) return byName[0];
    return null;
  }

  return candidates[0];
}

async function hashValue(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashRecoverEmail(email: string): Promise<string> {
  return hashValue(normalizeRecoverEmail(email));
}

export async function hashRecoverIp(ip: string): Promise<string> {
  return hashValue(ip.trim() || "unknown");
}

export function clientIpFromRequest(request: Request): string {
  const forwarded =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "";
  return forwarded || "unknown";
}

type CandidateRow = {
  slug: string;
  name: string;
  manage_token: string;
  notify_email: string | null;
  source: string;
  sort_at: string | null;
};

/**
 * Find claimed companies with an existing manage_token whose notify_email
 * or an approved claim_requests.email matches the given address.
 */
export async function findManageRecoverMatches(
  db: RecoverDb,
  normalizedEmail: string,
): Promise<RecoverMatch[]> {
  if (!normalizedEmail) return [];

  const rows = await db
    .prepare(
      `SELECT slug, name, manage_token, notify_email, source, sort_at
       FROM (
         SELECT c.slug AS slug,
                c.name AS name,
                c.manage_token AS manage_token,
                c.notify_email AS notify_email,
                'notify_email' AS source,
                c.manage_token_created_at AS sort_at
         FROM companies c
         WHERE c.claimed = 1
           AND c.manage_token IS NOT NULL
           AND c.manage_token != ''
           AND lower(trim(c.notify_email)) = ?

         UNION

         SELECT c.slug AS slug,
                c.name AS name,
                c.manage_token AS manage_token,
                COALESCE(c.notify_email, cr.email) AS notify_email,
                'claim' AS source,
                COALESCE(cr.reviewed_at, cr.created_at) AS sort_at
         FROM claim_requests cr
         INNER JOIN companies c ON c.slug = cr.company_slug
         WHERE cr.status = 'approved'
           AND lower(trim(cr.email)) = ?
           AND c.claimed = 1
           AND c.manage_token IS NOT NULL
           AND c.manage_token != ''
       )
       ORDER BY sort_at DESC`,
    )
    .bind(normalizedEmail, normalizedEmail)
    .all<CandidateRow>();

  const seen = new Set<string>();
  const matches: RecoverMatch[] = [];
  for (const row of rows.results ?? []) {
    if (!row.slug || seen.has(row.slug)) continue;
    seen.add(row.slug);
    const notifyEmail =
      row.notify_email?.trim() || normalizedEmail;
    matches.push({
      slug: row.slug,
      companyName: row.name,
      manageToken: row.manage_token,
      notifyEmail,
    });
  }
  return matches;
}

export async function isRecoverRateLimited(
  db: RecoverDb,
  ipHash: string,
  emailHash: string,
): Promise<boolean> {
  const windowStart = `-${RATE_LIMIT_WINDOW_HOURS} hours`;
  const [ipCount, emailCount] = await Promise.all([
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM manage_link_recover_attempts
         WHERE ip_hash = ?
           AND created_at >= datetime('now', ?)`,
      )
      .bind(ipHash, windowStart)
      .first<{ n: number }>(),
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM manage_link_recover_attempts
         WHERE email_hash = ?
           AND created_at >= datetime('now', ?)`,
      )
      .bind(emailHash, windowStart)
      .first<{ n: number }>(),
  ]);

  return (
    Number(ipCount?.n ?? 0) >= RATE_LIMIT_PER_IP ||
    Number(emailCount?.n ?? 0) >= RATE_LIMIT_PER_EMAIL
  );
}

export async function recordRecoverAttempt(
  db: RecoverDb,
  input: {
    ipHash: string;
    emailHash: string;
    matched: boolean;
    companySlug?: string | null;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO manage_link_recover_attempts (
         email_hash, ip_hash, matched, company_slug
       ) VALUES (?, ?, ?, ?)`,
    )
    .bind(
      input.emailHash,
      input.ipHash,
      input.matched ? 1 : 0,
      input.companySlug ?? null,
    )
    .run();
}
