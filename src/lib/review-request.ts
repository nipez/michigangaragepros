import { SITE_URL } from "@/data/site";
import type { getDb } from "@/lib/db";
import { generateManageToken } from "@/lib/listing-manage";

type ListingDb = Awaited<ReturnType<typeof getDb>>;

/** Same entropy as manage tokens (32 bytes → 64 hex). */
export function generateReviewToken(): string {
  return generateManageToken();
}

export function reviewRequestUrl(token: string): string {
  return `${SITE_URL}/review/${token}/`;
}

export function isValidReviewTokenFormat(token: string): boolean {
  return /^[a-f0-9]{64}$/i.test(token.trim());
}

export async function getCompanyByReviewToken(
  db: ListingDb,
  token: string,
): Promise<{ id: number; slug: string; name: string } | null> {
  if (!isValidReviewTokenFormat(token)) return null;
  const row = await db
    .prepare(
      `SELECT id, slug, name, claimed, review_token
       FROM companies WHERE review_token = ? LIMIT 1`,
    )
    .bind(token.trim())
    .first<{
      id: number;
      slug: string;
      name: string;
      claimed: number;
      review_token: string | null;
    }>();

  if (!row || !row.claimed) return null;
  return { id: row.id, slug: row.slug, name: row.name };
}

/** Ensure a claimed company has a review-request token; returns it. */
export async function ensureReviewToken(
  db: ListingDb,
  slug: string,
): Promise<string | null> {
  const existing = await db
    .prepare(
      `SELECT review_token, claimed FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<{ review_token: string | null; claimed: number }>();

  if (!existing || !existing.claimed) return null;
  if (existing.review_token) return existing.review_token;

  const token = generateReviewToken();
  await db
    .prepare(
      `UPDATE companies
       SET review_token = ?, review_token_created_at = datetime('now')
       WHERE slug = ?`,
    )
    .bind(token, slug)
    .run();
  return token;
}

export async function regenerateReviewToken(
  db: ListingDb,
  slug: string,
): Promise<string | null> {
  const existing = await db
    .prepare(`SELECT id, claimed FROM companies WHERE slug = ? LIMIT 1`)
    .bind(slug)
    .first<{ id: number; claimed: number }>();
  if (!existing || !existing.claimed) return null;

  const token = generateReviewToken();
  await db
    .prepare(
      `UPDATE companies
       SET review_token = ?, review_token_created_at = datetime('now')
       WHERE slug = ?`,
    )
    .bind(token, slug)
    .run();
  return token;
}

export async function revokeReviewToken(
  db: ListingDb,
  slug: string,
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE companies
       SET review_token = NULL, review_token_created_at = NULL
       WHERE slug = ?`,
    )
    .bind(slug)
    .run();
  return (result.meta.changes ?? 0) > 0;
}
