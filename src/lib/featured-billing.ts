/**
 * Featured subscription sync + Stripe Customer Portal helpers.
 *
 * Customer/subscription ids are written to featured_requests on Checkout
 * (migration 0011) and mirrored onto companies (migration 0024) so the
 * manage page can open a Billing Portal session without joining requests.
 */

import {
  FEATURED_PLANS,
  type FeaturedPlanId,
} from "@/data/growth";
import type { getDb } from "@/lib/db";
import {
  clientIpFromRequest,
  hashRecoverIp,
} from "@/lib/manage-recover";

type BillingDb = Awaited<ReturnType<typeof getDb>>;

export const BILLING_PORTAL_RATE_LIMIT_WINDOW_HOURS = 1;
/** Portal session creates per claimed company per window. */
export const BILLING_PORTAL_RATE_LIMIT_PER_COMPANY = 10;
/** Portal session creates from one IP across companies per window. */
export const BILLING_PORTAL_RATE_LIMIT_PER_IP = 30;

/** Statuses that should keep (or restore) Featured placement. */
export const FEATURED_ACTIVE_SUB_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
]);

/** Statuses that should clear Featured placement. */
export const FEATURED_INACTIVE_SUB_STATUSES = new Set([
  "canceled",
  "unpaid",
  "incomplete_expired",
  "paused",
]);

export type CompanyBillingInfo = {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeSubscriptionStatus: string | null;
  planId: FeaturedPlanId | null;
  planName: string | null;
  planPriceMonthly: number | null;
  /** True when we have a Stripe customer id to open the portal. */
  canManageBilling: boolean;
};

export function isFeaturedSubscriptionActive(
  status: string | null | undefined,
): boolean {
  if (!status) return false;
  return FEATURED_ACTIVE_SUB_STATUSES.has(status.trim().toLowerCase());
}

export function shouldClearFeaturedForStatus(
  status: string | null | undefined,
): boolean {
  if (!status) return false;
  return FEATURED_INACTIVE_SUB_STATUSES.has(status.trim().toLowerCase());
}

export function planLabelFromId(planId: string | null | undefined): {
  id: FeaturedPlanId | null;
  name: string | null;
  priceMonthly: number | null;
} {
  if (!planId) return { id: null, name: null, priceMonthly: null };
  const plan = FEATURED_PLANS.find((p) => p.id === planId);
  if (!plan) {
    return { id: null, name: planId, priceMonthly: null };
  }
  return { id: plan.id, name: plan.name, priceMonthly: plan.priceMonthly };
}

/**
 * Persist Stripe ids + status onto the company row (and request status column).
 * Called from checkout activation and subscription webhooks.
 */
export async function syncCompanyStripeBilling(
  db: BillingDb,
  input: {
    companySlug: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    stripeSubscriptionStatus?: string | null;
    /** When true/false, set companies.featured. Null = leave alone. */
    featured?: boolean | null;
  },
): Promise<void> {
  const slug = input.companySlug.trim();
  if (!slug) return;

  const status = input.stripeSubscriptionStatus?.trim().toLowerCase() || null;
  const customerId = input.stripeCustomerId?.trim() || null;
  const subscriptionId = input.stripeSubscriptionId?.trim() || null;

  if (input.featured === true) {
    await db
      .prepare(
        `UPDATE companies
         SET featured = 1,
             stripe_customer_id = COALESCE(?, stripe_customer_id),
             stripe_subscription_id = COALESCE(?, stripe_subscription_id),
             stripe_subscription_status = COALESCE(?, stripe_subscription_status)
         WHERE slug = ?`,
      )
      .bind(customerId, subscriptionId, status, slug)
      .run();
    return;
  }

  if (input.featured === false) {
    await db
      .prepare(
        `UPDATE companies
         SET featured = 0,
             stripe_customer_id = COALESCE(?, stripe_customer_id),
             stripe_subscription_id = COALESCE(?, stripe_subscription_id),
             stripe_subscription_status = COALESCE(?, stripe_subscription_status)
         WHERE slug = ?`,
      )
      .bind(customerId, subscriptionId, status, slug)
      .run();
    return;
  }

  await db
    .prepare(
      `UPDATE companies
       SET stripe_customer_id = COALESCE(?, stripe_customer_id),
           stripe_subscription_id = COALESCE(?, stripe_subscription_id),
           stripe_subscription_status = COALESCE(?, stripe_subscription_status)
       WHERE slug = ?`,
    )
    .bind(customerId, subscriptionId, status, slug)
    .run();
}

export async function updateFeaturedRequestSubscriptionStatus(
  db: BillingDb,
  input: {
    stripeSubscriptionId: string;
    status: string;
    stripeCustomerId?: string | null;
  },
): Promise<{ companySlug: string | null; requestId: number | null }> {
  const subId = input.stripeSubscriptionId.trim();
  if (!subId) return { companySlug: null, requestId: null };

  const status = input.status.trim().toLowerCase();
  const customerId = input.stripeCustomerId?.trim() || null;

  const row = await db
    .prepare(
      `SELECT id, company_slug FROM featured_requests
       WHERE stripe_subscription_id = ?
       ORDER BY datetime(COALESCE(paid_at, created_at)) DESC
       LIMIT 1`,
    )
    .bind(subId)
    .first<{ id: number; company_slug: string | null }>();

  if (row) {
    await db
      .prepare(
        `UPDATE featured_requests
         SET stripe_subscription_status = ?,
             stripe_customer_id = COALESCE(?, stripe_customer_id),
             stripe_subscription_id = COALESCE(?, stripe_subscription_id)
         WHERE id = ?`,
      )
      .bind(status, customerId, subId, row.id)
      .run();
    return {
      companySlug: (row.company_slug ?? "").trim() || null,
      requestId: row.id,
    };
  }

  // Fallback: match by company that already has this subscription id.
  const company = await db
    .prepare(
      `SELECT slug FROM companies WHERE stripe_subscription_id = ? LIMIT 1`,
    )
    .bind(subId)
    .first<{ slug: string }>();

  return {
    companySlug: company?.slug ?? null,
    requestId: null,
  };
}

/**
 * Apply a Stripe subscription status change: update ids/status and
 * feature / un-feature the linked company idempotently.
 */
export async function applySubscriptionStatusChange(
  db: BillingDb,
  input: {
    stripeSubscriptionId: string;
    status: string;
    stripeCustomerId?: string | null;
    companySlugHint?: string | null;
  },
): Promise<{
  companySlug: string | null;
  featuredUpdated: "activated" | "deactivated" | null;
  status: string;
}> {
  const status = input.status.trim().toLowerCase();
  const fromRequest = await updateFeaturedRequestSubscriptionStatus(db, {
    stripeSubscriptionId: input.stripeSubscriptionId,
    status,
    stripeCustomerId: input.stripeCustomerId,
  });

  const companySlug =
    (input.companySlugHint ?? "").trim() || fromRequest.companySlug;

  if (!companySlug) {
    return { companySlug: null, featuredUpdated: null, status };
  }

  let featuredUpdated: "activated" | "deactivated" | null = null;
  if (isFeaturedSubscriptionActive(status)) {
    await syncCompanyStripeBilling(db, {
      companySlug,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripeSubscriptionStatus: status,
      featured: true,
    });
    // Keep pipeline row as won when Stripe says the sub is active again.
    if (fromRequest.requestId) {
      await db
        .prepare(
          `UPDATE featured_requests
           SET status = CASE
             WHEN status IN ('paid', 'won', 'checkout_pending', 'closed') THEN 'won'
             ELSE status
           END
           WHERE id = ?`,
        )
        .bind(fromRequest.requestId)
        .run();
    }
    featuredUpdated = "activated";
  } else if (shouldClearFeaturedForStatus(status)) {
    // Only clear Featured when no other won request remains for this slug
    // (mirrors admin PATCH behavior for manual overrides).
    const otherWon = fromRequest.requestId
      ? await db
          .prepare(
            `SELECT id FROM featured_requests
             WHERE company_slug = ? AND status = 'won' AND id != ?
             LIMIT 1`,
          )
          .bind(companySlug, fromRequest.requestId)
          .first<{ id: number }>()
      : await db
          .prepare(
            `SELECT id FROM featured_requests
             WHERE company_slug = ? AND status = 'won'
             LIMIT 1`,
          )
          .bind(companySlug)
          .first<{ id: number }>();

    if (fromRequest.requestId && status === "canceled") {
      await db
        .prepare(
          `UPDATE featured_requests
           SET status = CASE WHEN status = 'won' THEN 'closed' ELSE status END
           WHERE id = ?`,
        )
        .bind(fromRequest.requestId)
        .run();
    }

    if (!otherWon) {
      await syncCompanyStripeBilling(db, {
        companySlug,
        stripeCustomerId: input.stripeCustomerId,
        stripeSubscriptionId: input.stripeSubscriptionId,
        stripeSubscriptionStatus: status,
        featured: false,
      });
      featuredUpdated = "deactivated";
    } else {
      await syncCompanyStripeBilling(db, {
        companySlug,
        stripeCustomerId: input.stripeCustomerId,
        stripeSubscriptionId: input.stripeSubscriptionId,
        stripeSubscriptionStatus: status,
        featured: null,
      });
    }
  } else {
    await syncCompanyStripeBilling(db, {
      companySlug,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripeSubscriptionStatus: status,
      featured: null,
    });
  }

  return { companySlug, featuredUpdated, status };
}

/**
 * Load billing info for the manage page. Prefer company columns; fall back to
 * the latest paid/won featured_request for this slug (pre-0024 checkouts).
 */
export async function getCompanyBillingInfo(
  db: BillingDb,
  companySlug: string,
): Promise<CompanyBillingInfo> {
  const empty: CompanyBillingInfo = {
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeSubscriptionStatus: null,
    planId: null,
    planName: null,
    planPriceMonthly: null,
    canManageBilling: false,
  };

  const slug = companySlug.trim();
  if (!slug) return empty;

  const company = await db
    .prepare(
      `SELECT stripe_customer_id, stripe_subscription_id, stripe_subscription_status
       FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<{
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
      stripe_subscription_status: string | null;
    }>();

  const request = await db
    .prepare(
      `SELECT plan, stripe_customer_id, stripe_subscription_id, stripe_subscription_status
       FROM featured_requests
       WHERE company_slug = ?
         AND stripe_customer_id IS NOT NULL
         AND status IN ('won', 'paid', 'closed')
       ORDER BY datetime(COALESCE(paid_at, created_at)) DESC
       LIMIT 1`,
    )
    .bind(slug)
    .first<{
      plan: string;
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
      stripe_subscription_status: string | null;
    }>();

  const customerId =
    company?.stripe_customer_id?.trim() ||
    request?.stripe_customer_id?.trim() ||
    null;
  const subscriptionId =
    company?.stripe_subscription_id?.trim() ||
    request?.stripe_subscription_id?.trim() ||
    null;
  const status =
    company?.stripe_subscription_status?.trim() ||
    request?.stripe_subscription_status?.trim() ||
    null;

  const planMeta = planLabelFromId(request?.plan);

  return {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    stripeSubscriptionStatus: status,
    planId: planMeta.id,
    planName: planMeta.name,
    planPriceMonthly: planMeta.priceMonthly,
    canManageBilling: Boolean(customerId),
  };
}

export { clientIpFromRequest };

export async function hashBillingPortalIp(ip: string): Promise<string> {
  return hashRecoverIp(ip);
}

export async function isBillingPortalRateLimited(
  db: BillingDb,
  companySlug: string,
  ipHash: string,
): Promise<boolean> {
  const windowStart = `-${BILLING_PORTAL_RATE_LIMIT_WINDOW_HOURS} hours`;
  const [companyCount, ipCount] = await Promise.all([
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM billing_portal_attempts
         WHERE company_slug = ?
           AND datetime(created_at) >= datetime('now', ?)
           AND created = 1`,
      )
      .bind(companySlug, windowStart)
      .first<{ n: number }>(),
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM billing_portal_attempts
         WHERE ip_hash = ?
           AND datetime(created_at) >= datetime('now', ?)`,
      )
      .bind(ipHash, windowStart)
      .first<{ n: number }>(),
  ]);

  return (
    (companyCount?.n ?? 0) >= BILLING_PORTAL_RATE_LIMIT_PER_COMPANY ||
    (ipCount?.n ?? 0) >= BILLING_PORTAL_RATE_LIMIT_PER_IP
  );
}

export async function recordBillingPortalAttempt(
  db: BillingDb,
  input: { companySlug: string; ipHash: string; created: boolean },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO billing_portal_attempts (company_slug, ip_hash, created)
       VALUES (?, ?, ?)`,
    )
    .bind(input.companySlug, input.ipHash, input.created ? 1 : 0)
    .run();
}

export function manageBillingReturnUrl(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/$/, "")}/manage/${token}/`;
}

export function formatSubscriptionStatus(status: string | null): string {
  if (!status) return "unknown";
  return status.replaceAll("_", " ");
}
