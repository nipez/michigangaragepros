/**
 * Lightweight assertions for Featured billing helpers:
 * subscription status → feature/unfeature rules, plan labels, portal URLs,
 * rate-limit constants, and manage-token format guards used by the billing API.
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
  formatSubscriptionStatus,
  isFeaturedSubscriptionActive,
  manageBillingReturnUrl,
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

console.log("test-featured-billing: ok");
