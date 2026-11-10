/**
 * Claimed-company notification email (companies.notify_email).
 * Used for lead routing and related company notices. Editable live from
 * /manage/<token>/ — possession of the manage token is the only auth.
 *
 * Manage-link recovery continues to match BOTH companies.notify_email and
 * approved claim_requests.email. Updating notify_email does not rewrite
 * historical claim rows, so the original claim email still works for recovery.
 * Knowing an email alone cannot change this address (not an account-takeover path).
 */

import type { getDb } from "@/lib/db";
import {
  clientIpFromRequest,
  hashRecoverEmail,
  hashRecoverIp,
} from "@/lib/manage-recover";

type NotifyEmailDb = Awaited<ReturnType<typeof getDb>>;

export const NOTIFY_EMAIL_MAX_LEN = 254;

export const RATE_LIMIT_WINDOW_HOURS = 1;
/** Successful or attempted changes per claimed company per window. */
export const RATE_LIMIT_PER_COMPANY = 5;
/** Attempts from one IP across companies per window. */
export const RATE_LIMIT_PER_IP = 20;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNotifyEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateNotifyEmail(email: string): string | null {
  const normalized = normalizeNotifyEmail(email);
  if (!normalized) return "A valid email is required";
  if (normalized.length > NOTIFY_EMAIL_MAX_LEN) {
    return `Email must be ${NOTIFY_EMAIL_MAX_LEN} characters or fewer`;
  }
  if (!EMAIL_RE.test(normalized)) return "Enter a valid email address";
  // Reject obvious junk (no TLD, double @ already caught by EMAIL_RE).
  const [, domain] = normalized.split("@");
  if (!domain || !domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) {
    return "Enter a valid email address";
  }
  return null;
}

export async function getCompanyNotifyEmail(
  db: NotifyEmailDb,
  slug: string,
): Promise<string | null> {
  const row = await db
    .prepare(
      `SELECT notify_email FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<{ notify_email: string | null }>();
  const value = row?.notify_email?.trim() ?? "";
  return value || null;
}

export async function setCompanyNotifyEmail(
  db: NotifyEmailDb,
  slug: string,
  email: string,
): Promise<{ ok: true; email: string } | { ok: false }> {
  const normalized = normalizeNotifyEmail(email);
  const result = await db
    .prepare(
      `UPDATE companies SET notify_email = ? WHERE slug = ? AND claimed = 1`,
    )
    .bind(normalized, slug)
    .run();
  if ((result.meta.changes ?? 0) === 0) return { ok: false };
  return { ok: true, email: normalized };
}

export { clientIpFromRequest };

export async function hashNotifyEmail(email: string): Promise<string> {
  return hashRecoverEmail(email);
}

export async function hashNotifyIp(ip: string): Promise<string> {
  return hashRecoverIp(ip);
}

export async function isNotifyEmailChangeRateLimited(
  db: NotifyEmailDb,
  companySlug: string,
  ipHash: string,
): Promise<boolean> {
  const windowStart = `-${RATE_LIMIT_WINDOW_HOURS} hours`;
  const [companyCount, ipCount] = await Promise.all([
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM notify_email_change_attempts
         WHERE company_slug = ?
           AND created_at >= datetime('now', ?)`,
      )
      .bind(companySlug, windowStart)
      .first<{ n: number }>(),
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM notify_email_change_attempts
         WHERE ip_hash = ?
           AND created_at >= datetime('now', ?)`,
      )
      .bind(ipHash, windowStart)
      .first<{ n: number }>(),
  ]);

  return (
    Number(companyCount?.n ?? 0) >= RATE_LIMIT_PER_COMPANY ||
    Number(ipCount?.n ?? 0) >= RATE_LIMIT_PER_IP
  );
}

export async function recordNotifyEmailChangeAttempt(
  db: NotifyEmailDb,
  input: {
    companySlug: string;
    ipHash: string;
    previousEmail: string | null;
    newEmail: string;
    changed: boolean;
  },
): Promise<void> {
  const [previousHash, newHash] = await Promise.all([
    input.previousEmail
      ? hashNotifyEmail(input.previousEmail)
      : Promise.resolve(null),
    hashNotifyEmail(input.newEmail),
  ]);

  await db
    .prepare(
      `INSERT INTO notify_email_change_attempts (
         company_slug, ip_hash, previous_email_hash, new_email_hash, changed
       ) VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(
      input.companySlug,
      input.ipHash,
      previousHash,
      newHash,
      input.changed ? 1 : 0,
    )
    .run();
}
