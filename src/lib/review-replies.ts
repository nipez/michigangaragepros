import type { D1Database } from "@cloudflare/workers-types";

/**
 * Claimed-company replies to approved reviews of their own listing.
 * Auth is manage-token only; every read/write filters by company_slug.
 */

export const OWNER_REPLY_STATUSES = ["pending", "visible", "hidden"] as const;

export type OwnerReplyStatus = (typeof OWNER_REPLY_STATUSES)[number];

export const MAX_OWNER_REPLY = 800;
export const MIN_OWNER_REPLY = 2;

export type ManageReview = {
  id: number;
  authorName: string;
  rating: number;
  body: string;
  createdAt: string;
  ownerReply: string | null;
  ownerReplyStatus: OwnerReplyStatus | null;
  ownerReplyAt: string | null;
  ownerReplyModeratedAt: string | null;
};

export type PublicOwnerReplyPayload = {
  body: string;
  repliedAt: string;
};

type ReviewRow = {
  id: number;
  company_slug: string;
  author_name: string;
  rating: number;
  body: string;
  status: string;
  created_at: string;
  owner_reply: string | null;
  owner_reply_status: string | null;
  owner_reply_at: string | null;
  owner_reply_moderated_at: string | null;
};

export function isOwnerReplyStatus(value: string): value is OwnerReplyStatus {
  return (OWNER_REPLY_STATUSES as readonly string[]).includes(value);
}

/**
 * Strip tags / angle brackets so stored replies stay plain text.
 * React already escapes on render; this is defense in depth for exports/notify.
 */
export function sanitizeOwnerReply(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/\u0000/g, "")
    .trim();
}

export function validateOwnerReply(raw: string): string | null {
  const body = sanitizeOwnerReply(raw);
  if (body.length < MIN_OWNER_REPLY) {
    return `Reply must be at least ${MIN_OWNER_REPLY} characters`;
  }
  if (body.length > MAX_OWNER_REPLY) {
    return `Reply must be ${MAX_OWNER_REPLY} characters or fewer`;
  }
  return null;
}

/** Pure scoping helper — company A must never see company B's reviews. */
export function scopeReviewsToCompany<T extends { companySlug: string }>(
  rows: T[],
  companySlug: string,
): T[] {
  const slug = companySlug.trim();
  if (!slug) return [];
  return rows.filter((row) => row.companySlug === slug);
}

export function reviewBelongsToCompany(
  review: { companySlug: string; status?: string } | null | undefined,
  companySlug: string,
): boolean {
  if (!review) return false;
  const slug = companySlug.trim();
  if (!slug) return false;
  return review.companySlug === slug;
}

/**
 * Companies may only reply to approved (visible) reviews of their listing.
 */
export function canReplyToReview(
  review: { companySlug: string; status: string } | null | undefined,
  companySlug: string,
): boolean {
  if (!reviewBelongsToCompany(review, companySlug)) return false;
  return review!.status === "visible";
}

/**
 * Writing or editing a reply always returns it to pending moderation.
 * Editing an already-visible reply must not leave it public until re-approved.
 * Previous status is ignored on purpose — callers may pass it for clarity.
 */
export function nextReplyStatusOnWrite(
  previous?: OwnerReplyStatus | null,
): OwnerReplyStatus {
  void previous;
  return "pending";
}

export function parseOwnerReplyUpsert(body: unknown):
  | { reviewId: number; body: string }
  | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid JSON" };
  }
  const raw = body as {
    reviewId?: unknown;
    id?: unknown;
    body?: unknown;
    reply?: unknown;
  };
  const reviewId = Number(raw.reviewId ?? raw.id);
  const replyRaw =
    typeof raw.body === "string"
      ? raw.body
      : typeof raw.reply === "string"
        ? raw.reply
        : "";
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    return { error: "reviewId is required" };
  }
  const cleaned = sanitizeOwnerReply(replyRaw);
  const error = validateOwnerReply(cleaned);
  if (error) return { error };
  return { reviewId, body: cleaned };
}

export function parseOwnerReplyDelete(body: unknown):
  | { reviewId: number }
  | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid JSON" };
  }
  const raw = body as { reviewId?: unknown; id?: unknown };
  const reviewId = Number(raw.reviewId ?? raw.id);
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    return { error: "reviewId is required" };
  }
  return { reviewId };
}

export function parseOwnerReplyModeration(body: unknown):
  | { id: number; replyStatus: OwnerReplyStatus }
  | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid JSON" };
  }
  const raw = body as {
    id?: unknown;
    replyStatus?: unknown;
    owner_reply_status?: unknown;
  };
  const id = Number(raw.id);
  const statusRaw =
    typeof raw.replyStatus === "string"
      ? raw.replyStatus.trim().toLowerCase()
      : typeof raw.owner_reply_status === "string"
        ? raw.owner_reply_status.trim().toLowerCase()
        : "";
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "id is required" };
  }
  if (!isOwnerReplyStatus(statusRaw)) {
    return {
      error: `replyStatus must be one of: ${OWNER_REPLY_STATUSES.join(", ")}`,
    };
  }
  return { id, replyStatus: statusRaw };
}

function normalizeReplyStatus(
  raw: string | null | undefined,
): OwnerReplyStatus | null {
  if (!raw?.trim()) return null;
  const v = raw.trim().toLowerCase();
  return isOwnerReplyStatus(v) ? v : null;
}

function mapManageRow(row: ReviewRow): ManageReview {
  return {
    id: row.id,
    authorName: row.author_name,
    rating: row.rating,
    body: row.body,
    createdAt: row.created_at,
    ownerReply: row.owner_reply,
    ownerReplyStatus: normalizeReplyStatus(row.owner_reply_status),
    ownerReplyAt: row.owner_reply_at,
    ownerReplyModeratedAt: row.owner_reply_moderated_at,
  };
}

/**
 * Approved reviews for this company (manage inbox). Includes reply draft state.
 */
export async function listCompanyApprovedReviews(
  db: D1Database,
  companySlug: string,
  options?: { limit?: number },
): Promise<ManageReview[]> {
  const slug = companySlug.trim();
  if (!slug) return [];
  const limit = Math.min(Math.max(options?.limit ?? 100, 1), 200);

  const { results } = await db
    .prepare(
      `SELECT id, company_slug, author_name, rating, body, status, created_at,
              owner_reply, owner_reply_status, owner_reply_at,
              owner_reply_moderated_at
       FROM company_reviews
       WHERE company_slug = ? AND status = 'visible'
       ORDER BY datetime(created_at) DESC
       LIMIT ?`,
    )
    .bind(slug, limit)
    .all<ReviewRow>();

  return (results ?? []).map(mapManageRow);
}

/**
 * Upsert a reply on an approved review owned by companySlug.
 * Always sets owner_reply_status to pending (including edits of visible replies).
 */
export async function upsertOwnerReply(
  db: D1Database,
  companySlug: string,
  reviewId: number,
  body: string,
): Promise<ManageReview | null> {
  const slug = companySlug.trim();
  if (!slug || !Number.isInteger(reviewId) || reviewId <= 0) return null;

  const cleaned = sanitizeOwnerReply(body);
  if (validateOwnerReply(cleaned)) return null;

  const existing = await db
    .prepare(
      `SELECT id, company_slug, status, owner_reply_status
       FROM company_reviews WHERE id = ? LIMIT 1`,
    )
    .bind(reviewId)
    .first<{
      id: number;
      company_slug: string;
      status: string;
      owner_reply_status: string | null;
    }>();

  if (
    !canReplyToReview(
      existing
        ? { companySlug: existing.company_slug, status: existing.status }
        : null,
      slug,
    )
  ) {
    return null;
  }

  const nextStatus = nextReplyStatusOnWrite(
    normalizeReplyStatus(existing?.owner_reply_status),
  );

  const result = await db
    .prepare(
      `UPDATE company_reviews
       SET owner_reply = ?,
           owner_reply_status = ?,
           owner_reply_at = datetime('now'),
           owner_reply_moderated_at = NULL
       WHERE id = ? AND company_slug = ? AND status = 'visible'`,
    )
    .bind(cleaned, nextStatus, reviewId, slug)
    .run();

  if (!result.meta.changes) return null;

  const row = await db
    .prepare(
      `SELECT id, company_slug, author_name, rating, body, status, created_at,
              owner_reply, owner_reply_status, owner_reply_at,
              owner_reply_moderated_at
       FROM company_reviews
       WHERE id = ? AND company_slug = ?
       LIMIT 1`,
    )
    .bind(reviewId, slug)
    .first<ReviewRow>();

  return row ? mapManageRow(row) : null;
}

/** Clear the reply on an owned approved review. */
export async function deleteOwnerReply(
  db: D1Database,
  companySlug: string,
  reviewId: number,
): Promise<ManageReview | null> {
  const slug = companySlug.trim();
  if (!slug || !Number.isInteger(reviewId) || reviewId <= 0) return null;

  const existing = await db
    .prepare(
      `SELECT id, company_slug, status
       FROM company_reviews WHERE id = ? LIMIT 1`,
    )
    .bind(reviewId)
    .first<{ id: number; company_slug: string; status: string }>();

  if (
    !canReplyToReview(
      existing
        ? { companySlug: existing.company_slug, status: existing.status }
        : null,
      slug,
    )
  ) {
    return null;
  }

  const result = await db
    .prepare(
      `UPDATE company_reviews
       SET owner_reply = NULL,
           owner_reply_status = NULL,
           owner_reply_at = NULL,
           owner_reply_moderated_at = NULL
       WHERE id = ? AND company_slug = ? AND status = 'visible'`,
    )
    .bind(reviewId, slug)
    .run();

  if (!result.meta.changes) return null;

  const row = await db
    .prepare(
      `SELECT id, company_slug, author_name, rating, body, status, created_at,
              owner_reply, owner_reply_status, owner_reply_at,
              owner_reply_moderated_at
       FROM company_reviews
       WHERE id = ? AND company_slug = ?
       LIMIT 1`,
    )
    .bind(reviewId, slug)
    .first<ReviewRow>();

  return row ? mapManageRow(row) : null;
}

/**
 * Admin moderation of an owner reply. Does not change the parent review status.
 */
export async function setOwnerReplyStatus(
  db: D1Database,
  reviewId: number,
  replyStatus: OwnerReplyStatus,
): Promise<boolean> {
  if (!Number.isInteger(reviewId) || reviewId <= 0) return false;
  if (!isOwnerReplyStatus(replyStatus)) return false;

  const existing = await db
    .prepare(
      `SELECT id, owner_reply FROM company_reviews WHERE id = ? LIMIT 1`,
    )
    .bind(reviewId)
    .first<{ id: number; owner_reply: string | null }>();

  if (!existing?.owner_reply?.trim()) return false;

  const setModerated =
    replyStatus === "visible" || replyStatus === "hidden";

  await db
    .prepare(
      setModerated
        ? `UPDATE company_reviews
           SET owner_reply_status = ?,
               owner_reply_moderated_at = datetime('now')
           WHERE id = ?`
        : `UPDATE company_reviews
           SET owner_reply_status = ?,
               owner_reply_moderated_at = NULL
           WHERE id = ?`,
    )
    .bind(replyStatus, reviewId)
    .run();

  return true;
}

/** Public-facing reply when approved; otherwise null. */
export function publicOwnerReplyFromRow(row: {
  owner_reply: string | null;
  owner_reply_status: string | null;
  owner_reply_at: string | null;
}): PublicOwnerReplyPayload | null {
  if (
    normalizeReplyStatus(row.owner_reply_status) !== "visible" ||
    !row.owner_reply?.trim()
  ) {
    return null;
  }
  return {
    body: row.owner_reply,
    repliedAt: row.owner_reply_at ?? "",
  };
}
