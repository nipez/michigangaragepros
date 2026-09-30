import type { D1Database } from "@cloudflare/workers-types";

export type ActivateFeaturedResult = {
  status: "won" | "paid";
  featuredUpdated: boolean;
  companySlug: string | null;
};

/**
 * Mark a featured_request as paid/won after successful Stripe Checkout.
 * Sets companies.featured = 1 when company_slug resolves to a listing.
 * Idempotent if the row is already won/paid with the same session.
 */
export async function activateFeaturedFromCheckout(
  db: D1Database,
  input: {
    requestId: number;
    stripeSessionId: string;
    stripeSubscriptionId?: string | null;
    stripeCustomerId?: string | null;
  },
): Promise<ActivateFeaturedResult | null> {
  const row = await db
    .prepare(
      `SELECT id, company_slug, status, stripe_session_id, paid_at
       FROM featured_requests WHERE id = ? LIMIT 1`,
    )
    .bind(input.requestId)
    .first<{
      id: number;
      company_slug: string | null;
      status: string;
      stripe_session_id: string | null;
      paid_at: string | null;
    }>();

  if (!row) return null;

  // Already processed for this session — treat as success (idempotent).
  if (
    row.paid_at &&
    row.stripe_session_id === input.stripeSessionId &&
    (row.status === "won" || row.status === "paid")
  ) {
    return {
      status: row.status === "won" ? "won" : "paid",
      featuredUpdated: false,
      companySlug: (row.company_slug ?? "").trim() || null,
    };
  }

  const slug = (row.company_slug ?? "").trim();
  let companyExists = false;
  if (slug) {
    const company = await db
      .prepare(`SELECT slug FROM companies WHERE slug = ? LIMIT 1`)
      .bind(slug)
      .first<{ slug: string }>();
    companyExists = Boolean(company?.slug);
  }

  const nextStatus: "won" | "paid" = slug && companyExists ? "won" : "paid";
  const statements = [
    db
      .prepare(
        `UPDATE featured_requests
         SET status = ?,
             stripe_session_id = ?,
             stripe_subscription_id = COALESCE(?, stripe_subscription_id),
             stripe_customer_id = COALESCE(?, stripe_customer_id),
             paid_at = COALESCE(paid_at, datetime('now'))
         WHERE id = ?`,
      )
      .bind(
        nextStatus,
        input.stripeSessionId,
        input.stripeSubscriptionId ?? null,
        input.stripeCustomerId ?? null,
        input.requestId,
      ),
  ];

  let featuredUpdated = false;
  if (nextStatus === "won" && slug) {
    statements.push(
      db
        .prepare(`UPDATE companies SET featured = 1 WHERE slug = ?`)
        .bind(slug),
    );
    featuredUpdated = true;
  }

  await db.batch(statements);

  return {
    status: nextStatus,
    featuredUpdated,
    companySlug: slug || null,
  };
}

/**
 * Look up featured_request id by Stripe Checkout session id (success-page path).
 */
export async function findFeaturedRequestBySession(
  db: D1Database,
  sessionId: string,
): Promise<{ id: number; status: string; company_slug: string | null } | null> {
  return db
    .prepare(
      `SELECT id, status, company_slug FROM featured_requests
       WHERE stripe_session_id = ? LIMIT 1`,
    )
    .bind(sessionId)
    .first<{ id: number; status: string; company_slug: string | null }>();
}
