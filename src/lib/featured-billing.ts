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

/**
 * Payment-problem statuses shown to the owner on the manage page.
 * past_due = Stripe dunning (Featured stays); unpaid = Featured cleared.
 */
export const FEATURED_PAYMENT_ISSUE_STATUSES = new Set([
  "past_due",
  "unpaid",
]);

/** Healthy paid statuses (not mid-dunning). */
export const FEATURED_HEALTHY_SUB_STATUSES = new Set(["active", "trialing"]);

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

export type SubscriptionTransitionKind =
  | "unchanged"
  | "reactivated"
  | "deactivated"
  | "payment_issue"
  | "synced";

export type OperatorSubscriptionNotify =
  | "reactivated"
  | "deactivated"
  | "payment_issue";

export type SubscriptionTransition = {
  kind: SubscriptionTransitionKind;
  /** What to do with companies.featured for this new status. */
  featuredAction: "activate" | "deactivate" | "leave";
  /**
   * Legacy featuredUpdated signal for callers that only care about
   * Featured flag flips. Null on routine updates and payment-issue grace.
   */
  featuredUpdated: "activated" | "deactivated" | null;
  /** Operator email once per genuine transition (null = none). */
  operatorNotify: OperatorSubscriptionNotify | null;
  priorStatus: string | null;
  nextStatus: string;
};

export function normalizeSubscriptionStatus(
  status: string | null | undefined,
): string | null {
  if (!status) return null;
  const trimmed = status.trim().toLowerCase();
  return trimmed || null;
}

export function isFeaturedSubscriptionActive(
  status: string | null | undefined,
): boolean {
  const normalized = normalizeSubscriptionStatus(status);
  if (!normalized) return false;
  return FEATURED_ACTIVE_SUB_STATUSES.has(normalized);
}

export function shouldClearFeaturedForStatus(
  status: string | null | undefined,
): boolean {
  const normalized = normalizeSubscriptionStatus(status);
  if (!normalized) return false;
  return FEATURED_INACTIVE_SUB_STATUSES.has(normalized);
}

export function isPaymentIssueStatus(
  status: string | null | undefined,
): boolean {
  const normalized = normalizeSubscriptionStatus(status);
  if (!normalized) return false;
  return FEATURED_PAYMENT_ISSUE_STATUSES.has(normalized);
}

export function isHealthySubscriptionStatus(
  status: string | null | undefined,
): boolean {
  const normalized = normalizeSubscriptionStatus(status);
  if (!normalized) return false;
  return FEATURED_HEALTHY_SUB_STATUSES.has(normalized);
}

/**
 * Pure prior→new classification for webhook / sync callers.
 *
 * - Routine active→active (renewal, payment method, metadata): unchanged
 * - canceled/past_due/unpaid → active|trialing: reactivated
 * - null → active|trialing: synced (first write; Checkout owns paid email)
 * - * → past_due (first time): payment_issue (Featured stays during dunning)
 * - * → canceled|unpaid|…: deactivated (Featured cleared)
 * - Duplicate same-status: unchanged (idempotent retries)
 */
export function classifySubscriptionTransition(
  priorRaw: string | null | undefined,
  nextRaw: string | null | undefined,
): SubscriptionTransition {
  const priorStatus = normalizeSubscriptionStatus(priorRaw);
  const nextStatus = normalizeSubscriptionStatus(nextRaw) || "canceled";

  const featuredAction: SubscriptionTransition["featuredAction"] =
    isFeaturedSubscriptionActive(nextStatus)
      ? "activate"
      : shouldClearFeaturedForStatus(nextStatus)
        ? "deactivate"
        : "leave";

  if (priorStatus === nextStatus) {
    return {
      kind: "unchanged",
      featuredAction,
      featuredUpdated: null,
      operatorNotify: null,
      priorStatus,
      nextStatus,
    };
  }

  // Genuine recovery to a healthy paid state (not past_due).
  // null prior = first status write (Checkout sends the paid notice) — not a
  // "reactivated" operator email.
  if (
    isHealthySubscriptionStatus(nextStatus) &&
    !isHealthySubscriptionStatus(priorStatus)
  ) {
    const isReactivation = priorStatus != null;
    return {
      kind: isReactivation ? "reactivated" : "synced",
      featuredAction: "activate",
      featuredUpdated: isReactivation ? "activated" : null,
      operatorNotify: isReactivation ? "reactivated" : null,
      priorStatus,
      nextStatus,
    };
  }

  // Entering Stripe dunning — Featured stays; notify once.
  if (nextStatus === "past_due" && priorStatus !== "past_due") {
    return {
      kind: "payment_issue",
      featuredAction: "activate",
      featuredUpdated: null,
      operatorNotify: "payment_issue",
      priorStatus,
      nextStatus,
    };
  }

  // Cancel / unpaid / paused / incomplete_expired — clear Featured.
  if (shouldClearFeaturedForStatus(nextStatus)) {
    return {
      kind: "deactivated",
      featuredAction: "deactivate",
      featuredUpdated: "deactivated",
      operatorNotify: "deactivated",
      priorStatus,
      nextStatus,
    };
  }

  // Other status moves (e.g. trialing→active, incomplete→active already
  // handled above as reactivated when prior wasn't healthy).
  return {
    kind: "synced",
    featuredAction,
    featuredUpdated: null,
    operatorNotify: null,
    priorStatus,
    nextStatus,
  };
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
    /** Stripe event.created (unix seconds). Null = leave column alone. */
    stripeSubscriptionEventAt?: number | null;
    /** When true/false, set companies.featured. Null = leave alone. */
    featured?: boolean | null;
  },
): Promise<void> {
  const slug = input.companySlug.trim();
  if (!slug) return;

  const status = normalizeSubscriptionStatus(input.stripeSubscriptionStatus);
  const customerId = input.stripeCustomerId?.trim() || null;
  const subscriptionId = input.stripeSubscriptionId?.trim() || null;
  const eventAt =
    typeof input.stripeSubscriptionEventAt === "number" &&
    Number.isFinite(input.stripeSubscriptionEventAt)
      ? Math.trunc(input.stripeSubscriptionEventAt)
      : null;

  const bindWithEventAt = [customerId, subscriptionId, status, eventAt, slug] as const;
  const bindWithoutEventAt = [customerId, subscriptionId, status, slug] as const;

  try {
    if (input.featured === true) {
      await db
        .prepare(
          `UPDATE companies
           SET featured = 1,
               stripe_customer_id = COALESCE(?, stripe_customer_id),
               stripe_subscription_id = COALESCE(?, stripe_subscription_id),
               stripe_subscription_status = COALESCE(?, stripe_subscription_status),
               stripe_subscription_event_at = COALESCE(?, stripe_subscription_event_at)
           WHERE slug = ?`,
        )
        .bind(...bindWithEventAt)
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
               stripe_subscription_status = COALESCE(?, stripe_subscription_status),
               stripe_subscription_event_at = COALESCE(?, stripe_subscription_event_at)
           WHERE slug = ?`,
        )
        .bind(...bindWithEventAt)
        .run();
      return;
    }

    await db
      .prepare(
        `UPDATE companies
         SET stripe_customer_id = COALESCE(?, stripe_customer_id),
             stripe_subscription_id = COALESCE(?, stripe_subscription_id),
             stripe_subscription_status = COALESCE(?, stripe_subscription_status),
             stripe_subscription_event_at = COALESCE(?, stripe_subscription_event_at)
         WHERE slug = ?`,
      )
      .bind(...bindWithEventAt)
      .run();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Pre-0025 DBs may lack stripe_subscription_event_at — write without it.
    if (
      !/stripe_subscription_event_at|no such column/i.test(msg)
    ) {
      throw err;
    }
    console.warn(
      "syncCompanyStripeBilling: event_at column missing; falling back",
      err,
    );
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
        .bind(...bindWithoutEventAt)
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
        .bind(...bindWithoutEventAt)
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
      .bind(...bindWithoutEventAt)
      .run();
  }
}

type SubscriptionLookup = {
  companySlug: string | null;
  requestId: number | null;
  priorStatus: string | null;
  priorEventAt: number | null;
};

/**
 * Read current subscription linkage + status without mutating.
 * Prefers featured_requests row; falls back to companies.
 */
export async function lookupSubscriptionBillingState(
  db: BillingDb,
  stripeSubscriptionId: string,
): Promise<SubscriptionLookup> {
  const subId = stripeSubscriptionId.trim();
  if (!subId) {
    return {
      companySlug: null,
      requestId: null,
      priorStatus: null,
      priorEventAt: null,
    };
  }

  try {
    const row = await db
      .prepare(
        `SELECT id, company_slug, stripe_subscription_status, stripe_subscription_event_at
         FROM featured_requests
         WHERE stripe_subscription_id = ?
         ORDER BY datetime(COALESCE(paid_at, created_at)) DESC
         LIMIT 1`,
      )
      .bind(subId)
      .first<{
        id: number;
        company_slug: string | null;
        stripe_subscription_status: string | null;
        stripe_subscription_event_at: number | null;
      }>();

    if (row) {
      return {
        companySlug: (row.company_slug ?? "").trim() || null,
        requestId: row.id,
        priorStatus: normalizeSubscriptionStatus(row.stripe_subscription_status),
        priorEventAt:
          typeof row.stripe_subscription_event_at === "number"
            ? row.stripe_subscription_event_at
            : null,
      };
    }
  } catch (err) {
    // Pre-0025 DBs may lack stripe_subscription_event_at — retry without it.
    console.warn(
      "lookupSubscriptionBillingState: event_at column missing; falling back",
      err,
    );
    const row = await db
      .prepare(
        `SELECT id, company_slug, stripe_subscription_status
         FROM featured_requests
         WHERE stripe_subscription_id = ?
         ORDER BY datetime(COALESCE(paid_at, created_at)) DESC
         LIMIT 1`,
      )
      .bind(subId)
      .first<{
        id: number;
        company_slug: string | null;
        stripe_subscription_status: string | null;
      }>();

    if (row) {
      return {
        companySlug: (row.company_slug ?? "").trim() || null,
        requestId: row.id,
        priorStatus: normalizeSubscriptionStatus(row.stripe_subscription_status),
        priorEventAt: null,
      };
    }
  }

  try {
    const company = await db
      .prepare(
        `SELECT slug, stripe_subscription_status, stripe_subscription_event_at
         FROM companies WHERE stripe_subscription_id = ? LIMIT 1`,
      )
      .bind(subId)
      .first<{
        slug: string;
        stripe_subscription_status: string | null;
        stripe_subscription_event_at: number | null;
      }>();

    return {
      companySlug: company?.slug ?? null,
      requestId: null,
      priorStatus: normalizeSubscriptionStatus(
        company?.stripe_subscription_status,
      ),
      priorEventAt:
        typeof company?.stripe_subscription_event_at === "number"
          ? company.stripe_subscription_event_at
          : null,
    };
  } catch {
    const company = await db
      .prepare(
        `SELECT slug, stripe_subscription_status
         FROM companies WHERE stripe_subscription_id = ? LIMIT 1`,
      )
      .bind(subId)
      .first<{
        slug: string;
        stripe_subscription_status: string | null;
      }>();

    return {
      companySlug: company?.slug ?? null,
      requestId: null,
      priorStatus: normalizeSubscriptionStatus(
        company?.stripe_subscription_status,
      ),
      priorEventAt: null,
    };
  }
}

export async function updateFeaturedRequestSubscriptionStatus(
  db: BillingDb,
  input: {
    stripeSubscriptionId: string;
    status: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionEventAt?: number | null;
  },
): Promise<{ companySlug: string | null; requestId: number | null }> {
  const subId = input.stripeSubscriptionId.trim();
  if (!subId) return { companySlug: null, requestId: null };

  const status = normalizeSubscriptionStatus(input.status) || "canceled";
  const customerId = input.stripeCustomerId?.trim() || null;
  const eventAt =
    typeof input.stripeSubscriptionEventAt === "number" &&
    Number.isFinite(input.stripeSubscriptionEventAt)
      ? Math.trunc(input.stripeSubscriptionEventAt)
      : null;

  const lookup = await lookupSubscriptionBillingState(db, subId);

  if (lookup.requestId) {
    try {
      await db
        .prepare(
          `UPDATE featured_requests
           SET stripe_subscription_status = ?,
               stripe_customer_id = COALESCE(?, stripe_customer_id),
               stripe_subscription_id = COALESCE(?, stripe_subscription_id),
               stripe_subscription_event_at = COALESCE(?, stripe_subscription_event_at)
           WHERE id = ?`,
        )
        .bind(status, customerId, subId, eventAt, lookup.requestId)
        .run();
    } catch (err) {
      console.warn(
        "updateFeaturedRequestSubscriptionStatus: event_at write failed; retrying",
        err,
      );
      await db
        .prepare(
          `UPDATE featured_requests
           SET stripe_subscription_status = ?,
               stripe_customer_id = COALESCE(?, stripe_customer_id),
               stripe_subscription_id = COALESCE(?, stripe_subscription_id)
           WHERE id = ?`,
        )
        .bind(status, customerId, subId, lookup.requestId)
        .run();
    }
    return {
      companySlug: lookup.companySlug,
      requestId: lookup.requestId,
    };
  }

  return {
    companySlug: lookup.companySlug,
    requestId: null,
  };
}

export type ApplySubscriptionStatusResult = {
  companySlug: string | null;
  featuredUpdated: "activated" | "deactivated" | null;
  operatorNotify: OperatorSubscriptionNotify | null;
  status: string;
  priorStatus: string | null;
  transition: SubscriptionTransitionKind;
  /** True when a newer Stripe event was already applied. */
  skippedStale: boolean;
};

/**
 * Apply a Stripe subscription status change: update ids/status and
 * feature / un-feature the linked company idempotently.
 *
 * Returns featuredUpdated / operatorNotify only for genuine prior→new
 * transitions (not routine renewals or duplicate retries).
 */
export async function applySubscriptionStatusChange(
  db: BillingDb,
  input: {
    stripeSubscriptionId: string;
    status: string;
    stripeCustomerId?: string | null;
    companySlugHint?: string | null;
    /** Stripe event.created (unix seconds) for out-of-order protection. */
    eventAt?: number | null;
  },
): Promise<ApplySubscriptionStatusResult> {
  const status = normalizeSubscriptionStatus(input.status) || "canceled";
  const eventAt =
    typeof input.eventAt === "number" && Number.isFinite(input.eventAt)
      ? Math.trunc(input.eventAt)
      : null;

  const prior = await lookupSubscriptionBillingState(
    db,
    input.stripeSubscriptionId,
  );

  // Ignore stale / out-of-order events when we already applied a newer one.
  if (
    eventAt != null &&
    prior.priorEventAt != null &&
    eventAt < prior.priorEventAt
  ) {
    const companySlug =
      (input.companySlugHint ?? "").trim() || prior.companySlug;
    return {
      companySlug,
      featuredUpdated: null,
      operatorNotify: null,
      status: prior.priorStatus || status,
      priorStatus: prior.priorStatus,
      transition: "unchanged",
      skippedStale: true,
    };
  }

  const transition = classifySubscriptionTransition(prior.priorStatus, status);

  const fromRequest = await updateFeaturedRequestSubscriptionStatus(db, {
    stripeSubscriptionId: input.stripeSubscriptionId,
    status,
    stripeCustomerId: input.stripeCustomerId,
    stripeSubscriptionEventAt: eventAt,
  });

  const companySlug =
    (input.companySlugHint ?? "").trim() || fromRequest.companySlug;

  if (!companySlug) {
    return {
      companySlug: null,
      featuredUpdated: null,
      operatorNotify: null,
      status,
      priorStatus: prior.priorStatus,
      transition: transition.kind,
      skippedStale: false,
    };
  }

  let featuredUpdated: "activated" | "deactivated" | null = null;
  let operatorNotify: OperatorSubscriptionNotify | null =
    transition.operatorNotify;

  if (transition.featuredAction === "activate") {
    await syncCompanyStripeBilling(db, {
      companySlug,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripeSubscriptionStatus: status,
      stripeSubscriptionEventAt: eventAt,
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
    featuredUpdated = transition.featuredUpdated;
  } else if (transition.featuredAction === "deactivate") {
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

    if (
      fromRequest.requestId &&
      (status === "canceled" || status === "unpaid")
    ) {
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
        stripeSubscriptionEventAt: eventAt,
        featured: false,
      });
      featuredUpdated = transition.featuredUpdated;
    } else {
      await syncCompanyStripeBilling(db, {
        companySlug,
        stripeCustomerId: input.stripeCustomerId,
        stripeSubscriptionId: input.stripeSubscriptionId,
        stripeSubscriptionStatus: status,
        stripeSubscriptionEventAt: eventAt,
        featured: null,
      });
      // Another won request keeps Featured — do not claim we deactivated.
      featuredUpdated = null;
      if (operatorNotify === "deactivated") {
        operatorNotify = null;
      }
    }
  } else {
    await syncCompanyStripeBilling(db, {
      companySlug,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripeSubscriptionStatus: status,
      stripeSubscriptionEventAt: eventAt,
      featured: null,
    });
    featuredUpdated = transition.featuredUpdated;
  }

  // Duplicate same-status retries: never notify again.
  if (transition.kind === "unchanged") {
    featuredUpdated = null;
    operatorNotify = null;
  }

  return {
    companySlug,
    featuredUpdated,
    operatorNotify,
    status,
    priorStatus: prior.priorStatus,
    transition: transition.kind,
    skippedStale: false,
  };
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
