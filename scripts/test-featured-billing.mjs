/**
 * Lightweight assertions for Featured billing helpers:
 * subscription status → feature/unfeature rules, plan labels, portal URLs,
 * rate-limit constants, transition classification (reactivation vs routine
 * update vs past_due vs canceled), and manage-token format guards.
 *
 * Run: npx tsx scripts/test-featured-billing.mjs
 */
import assert from "node:assert/strict";
import { isValidManageTokenFormat } from "../src/lib/listing-manage.ts";
import {
  BILLING_PORTAL_RATE_LIMIT_PER_COMPANY,
  BILLING_PORTAL_RATE_LIMIT_PER_IP,
  BILLING_PORTAL_RATE_LIMIT_WINDOW_HOURS,
  FEATURED_ACTIVE_SUB_STATUSES,
  FEATURED_INACTIVE_SUB_STATUSES,
  FEATURED_PAYMENT_ISSUE_STATUSES,
  classifySubscriptionTransition,
  formatSubscriptionStatus,
  isFeaturedSubscriptionActive,
  isHealthySubscriptionStatus,
  isPaymentIssueStatus,
  manageBillingReturnUrl,
  normalizeSubscriptionStatus,
  planLabelFromId,
  shouldClearFeaturedForStatus,
} from "../src/lib/featured-billing.ts";

// --- Rate limits ---
assert.equal(BILLING_PORTAL_RATE_LIMIT_WINDOW_HOURS, 1);
assert.equal(BILLING_PORTAL_RATE_LIMIT_PER_COMPANY, 10);
assert.equal(BILLING_PORTAL_RATE_LIMIT_PER_IP, 30);

// --- Active / inactive status sets ---
assert.ok(FEATURED_ACTIVE_SUB_STATUSES.has("active"));
assert.ok(FEATURED_ACTIVE_SUB_STATUSES.has("trialing"));
assert.ok(FEATURED_ACTIVE_SUB_STATUSES.has("past_due"));
assert.ok(FEATURED_INACTIVE_SUB_STATUSES.has("canceled"));
assert.ok(FEATURED_INACTIVE_SUB_STATUSES.has("unpaid"));
assert.ok(FEATURED_INACTIVE_SUB_STATUSES.has("incomplete_expired"));
assert.ok(FEATURED_PAYMENT_ISSUE_STATUSES.has("past_due"));
assert.ok(FEATURED_PAYMENT_ISSUE_STATUSES.has("unpaid"));

assert.equal(isFeaturedSubscriptionActive("active"), true);
assert.equal(isFeaturedSubscriptionActive("ACTIVE"), true);
assert.equal(isFeaturedSubscriptionActive("past_due"), true);
assert.equal(isFeaturedSubscriptionActive("canceled"), false);
assert.equal(isFeaturedSubscriptionActive(null), false);
assert.equal(isFeaturedSubscriptionActive(""), false);

assert.equal(shouldClearFeaturedForStatus("canceled"), true);
assert.equal(shouldClearFeaturedForStatus("unpaid"), true);
assert.equal(shouldClearFeaturedForStatus("active"), false);
assert.equal(shouldClearFeaturedForStatus("past_due"), false);

assert.equal(isPaymentIssueStatus("past_due"), true);
assert.equal(isPaymentIssueStatus("unpaid"), true);
assert.equal(isPaymentIssueStatus("active"), false);
assert.equal(isHealthySubscriptionStatus("active"), true);
assert.equal(isHealthySubscriptionStatus("past_due"), false);
assert.equal(normalizeSubscriptionStatus(" Past_Due "), "past_due");

// --- Plan labels ---
assert.deepEqual(planLabelFromId("city"), {
  id: "city",
  name: "City Featured",
  priceMonthly: 149,
});
assert.deepEqual(planLabelFromId("metro"), {
  id: "metro",
  name: "Metro Featured",
  priceMonthly: 299,
});
assert.deepEqual(planLabelFromId("statewide"), {
  id: "statewide",
  name: "Statewide Featured",
  priceMonthly: 499,
});
assert.deepEqual(planLabelFromId(null), {
  id: null,
  name: null,
  priceMonthly: null,
});
assert.equal(planLabelFromId("unknown-plan").id, null);
assert.equal(planLabelFromId("unknown-plan").name, "unknown-plan");

// --- Display helpers ---
assert.equal(formatSubscriptionStatus(null), "unknown");
assert.equal(formatSubscriptionStatus("past_due"), "past due");
assert.equal(formatSubscriptionStatus("active"), "active");

assert.equal(
  manageBillingReturnUrl("https://michigangaragepros.com", "a".repeat(64)),
  `https://michigangaragepros.com/manage/${"a".repeat(64)}/`,
);
assert.equal(
  manageBillingReturnUrl("https://example.com/", "b".repeat(64)),
  `https://example.com/manage/${"b".repeat(64)}/`,
);

// --- Auth failure path (token format mirrors manage APIs) ---
assert.equal(isValidManageTokenFormat("not-a-token"), false);
assert.equal(isValidManageTokenFormat("a".repeat(64)), true);
assert.equal(isValidManageTokenFormat("g".repeat(64)), false);

// --- Transition classification ---

// Routine renewal / metadata / payment-method update: active → active
{
  const t = classifySubscriptionTransition("active", "active");
  assert.equal(t.kind, "unchanged");
  assert.equal(t.featuredAction, "activate");
  assert.equal(t.featuredUpdated, null);
  assert.equal(t.operatorNotify, null);
}

// Duplicate past_due retry (Stripe webhook retry / same status)
{
  const t = classifySubscriptionTransition("past_due", "past_due");
  assert.equal(t.kind, "unchanged");
  assert.equal(t.featuredAction, "activate");
  assert.equal(t.operatorNotify, null);
  assert.equal(t.featuredUpdated, null);
}

// Duplicate canceled retry
{
  const t = classifySubscriptionTransition("canceled", "canceled");
  assert.equal(t.kind, "unchanged");
  assert.equal(t.featuredAction, "deactivate");
  assert.equal(t.operatorNotify, null);
}

// True reactivation: canceled → active
{
  const t = classifySubscriptionTransition("canceled", "active");
  assert.equal(t.kind, "reactivated");
  assert.equal(t.featuredAction, "activate");
  assert.equal(t.featuredUpdated, "activated");
  assert.equal(t.operatorNotify, "reactivated");
}

// Recovery from dunning: past_due → active
{
  const t = classifySubscriptionTransition("past_due", "active");
  assert.equal(t.kind, "reactivated");
  assert.equal(t.featuredAction, "activate");
  assert.equal(t.featuredUpdated, "activated");
  assert.equal(t.operatorNotify, "reactivated");
}

// Recovery from unpaid: unpaid → active
{
  const t = classifySubscriptionTransition("unpaid", "active");
  assert.equal(t.kind, "reactivated");
  assert.equal(t.featuredUpdated, "activated");
  assert.equal(t.operatorNotify, "reactivated");
}

// First known status via webhook with no prior row (Checkout owns paid email)
{
  const t = classifySubscriptionTransition(null, "active");
  assert.equal(t.kind, "synced");
  assert.equal(t.featuredAction, "activate");
  assert.equal(t.featuredUpdated, null);
  assert.equal(t.operatorNotify, null);
}

// trialing → active is healthy→healthy: sync only, no reactivation email
{
  const t = classifySubscriptionTransition("trialing", "active");
  assert.equal(t.kind, "synced");
  assert.equal(t.featuredAction, "activate");
  assert.equal(t.featuredUpdated, null);
  assert.equal(t.operatorNotify, null);
}

// Payment failure enters dunning: active → past_due (Featured stays)
{
  const t = classifySubscriptionTransition("active", "past_due");
  assert.equal(t.kind, "payment_issue");
  assert.equal(t.featuredAction, "activate");
  assert.equal(t.featuredUpdated, null);
  assert.equal(t.operatorNotify, "payment_issue");
}

// Dunning exhausted: past_due → unpaid (Featured clears)
{
  const t = classifySubscriptionTransition("past_due", "unpaid");
  assert.equal(t.kind, "deactivated");
  assert.equal(t.featuredAction, "deactivate");
  assert.equal(t.featuredUpdated, "deactivated");
  assert.equal(t.operatorNotify, "deactivated");
}

// Cancel while active
{
  const t = classifySubscriptionTransition("active", "canceled");
  assert.equal(t.kind, "deactivated");
  assert.equal(t.featuredAction, "deactivate");
  assert.equal(t.featuredUpdated, "deactivated");
  assert.equal(t.operatorNotify, "deactivated");
}

// Cancel while past_due
{
  const t = classifySubscriptionTransition("past_due", "canceled");
  assert.equal(t.kind, "deactivated");
  assert.equal(t.featuredAction, "deactivate");
  assert.equal(t.operatorNotify, "deactivated");
}

// Direct active → unpaid
{
  const t = classifySubscriptionTransition("active", "unpaid");
  assert.equal(t.kind, "deactivated");
  assert.equal(t.featuredAction, "deactivate");
  assert.equal(t.operatorNotify, "deactivated");
}

// Case / whitespace normalization on transitions
{
  const t = classifySubscriptionTransition(" ACTIVE ", " Past_Due ");
  assert.equal(t.kind, "payment_issue");
  assert.equal(t.priorStatus, "active");
  assert.equal(t.nextStatus, "past_due");
}

// Out-of-order simulation (caller responsibility): applying an older
// active after a newer canceled must not look like a reactivation when
// prior is already canceled — classify with prior=canceled, next=active
// IS a reactivation if applied; stale guard must skip before classify.
// Here we only assert the classify result for the intended order.
{
  const newer = classifySubscriptionTransition("active", "canceled");
  assert.equal(newer.kind, "deactivated");
  // If stale active were wrongly applied after canceled:
  const wronglyApplied = classifySubscriptionTransition("canceled", "active");
  assert.equal(wronglyApplied.kind, "reactivated");
  // → applySubscriptionStatusChange must skip when eventAt < priorEventAt
}

console.log("test-featured-billing: ok");
