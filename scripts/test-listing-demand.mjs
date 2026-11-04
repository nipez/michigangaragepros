/**
 * Assertions for listing-demand copy + retention filters.
 * Run: npx tsx scripts/test-listing-demand.mjs
 */
import assert from "node:assert/strict";
import {
  emptyListingDemand,
  formatClaimDemandCopy,
  LISTING_DEMAND_WINDOW_DAYS,
  MIN_CONTACTS_TO_SHOW,
  MIN_QUOTES_TO_SHOW,
  MIN_VIEWS_TO_SHOW,
  shouldShowContacts,
  shouldShowQuotes,
  shouldShowViews,
} from "../src/lib/listing-demand.ts";
import {
  filterLeadsNeedingRetention,
  RETAINED_LEAD_REASON,
} from "../src/lib/lead-retention.ts";

assert.equal(LISTING_DEMAND_WINDOW_DAYS, 30);
assert.equal(MIN_VIEWS_TO_SHOW, 5);
assert.equal(MIN_QUOTES_TO_SHOW, 1);
assert.equal(MIN_CONTACTS_TO_SHOW, 2);
assert.equal(RETAINED_LEAD_REASON, "retained");

// Thresholds
assert.equal(shouldShowViews(0), false);
assert.equal(shouldShowViews(4), false);
assert.equal(shouldShowViews(5), true);
assert.equal(shouldShowQuotes(0), false);
assert.equal(shouldShowQuotes(1), true);
assert.equal(shouldShowContacts(1), false);
assert.equal(shouldShowContacts(2), true);

// Empty / low demand — soft copy, never "viewed 0 times"
const empty = emptyListingDemand("acme-doors", "2026-11-04");
assert.equal(empty.windowEnd, "2026-11-04");
assert.equal(empty.windowStart, "2026-10-06");
assert.equal(empty.profileViews, 0);
assert.equal(empty.quoteRequests, 0);

const soft = formatClaimDemandCopy(empty);
assert.equal(soft.hasSignal, false);
assert.equal(soft.adminSummary, null);
assert.match(soft.body, /Homeowners are finding this page/i);
assert.doesNotMatch(soft.body, /\b0\b/);
assert.doesNotMatch(soft.body, /viewed 0/i);

// Views only
const viewsOnly = formatClaimDemandCopy({
  ...empty,
  profileViews: 42,
});
assert.equal(viewsOnly.hasSignal, true);
assert.equal(viewsOnly.showViews, true);
assert.equal(viewsOnly.showQuotes, false);
assert.match(viewsOnly.body, /viewed 42 times/i);
assert.equal(viewsOnly.adminSummary, "30d demand: 42 views");

// Quotes only (no awkward "was N homeowners")
const quotesOnly = formatClaimDemandCopy({
  ...empty,
  quoteRequests: 3,
});
assert.equal(quotesOnly.showQuotes, true);
assert.equal(quotesOnly.showViews, false);
assert.match(quotesOnly.body, /3 homeowners requested a quote/i);
assert.doesNotMatch(quotesOnly.body, /was 3 homeowners/i);
assert.equal(quotesOnly.adminSummary, "30d demand: 3 quotes");

// Single quote grammar
const oneQuote = formatClaimDemandCopy({
  ...empty,
  quoteRequests: 1,
});
assert.match(oneQuote.body, /1 homeowner requested a quote/i);

// Contacts below threshold stay hidden
const lowContacts = formatClaimDemandCopy({
  ...empty,
  contactClicks: 1,
});
assert.equal(lowContacts.hasSignal, false);
assert.doesNotMatch(lowContacts.body, /contact click/i);

// Combined signal
const combo = formatClaimDemandCopy({
  ...empty,
  profileViews: 12,
  quoteRequests: 2,
  contactClicks: 5,
});
assert.equal(combo.hasSignal, true);
assert.match(combo.body, /viewed 12 times/i);
assert.match(combo.body, /2 homeowners requested a quote/i);
assert.match(combo.body, /5 contact clicks/i);
assert.equal(
  combo.adminSummary,
  "30d demand: 12 views · 2 quotes · 5 contacts",
);

// Never invent numbers from thin air — negatives clamp
const clamped = formatClaimDemandCopy({
  ...empty,
  profileViews: -9,
  quoteRequests: -1,
});
assert.equal(clamped.hasSignal, false);
assert.doesNotMatch(clamped.body, /-9/);

// Retention filter: skip already-routed; scope to slug
const candidates = [
  { leadId: 1, companySlug: "alpha-doors" },
  { leadId: 2, companySlug: "alpha-doors" },
  { leadId: 3, companySlug: "beta-garage" },
  { leadId: 4, companySlug: "alpha-doors" },
];
const needing = filterLeadsNeedingRetention(candidates, [2], "alpha-doors");
assert.deepEqual(
  needing.map((c) => c.leadId),
  [1, 4],
);
assert.deepEqual(filterLeadsNeedingRetention(candidates, [1, 2, 4], "alpha-doors"), []);
assert.deepEqual(filterLeadsNeedingRetention(candidates, [], ""), []);
assert.deepEqual(
  filterLeadsNeedingRetention(candidates, [], "beta-garage").map((c) => c.leadId),
  [3],
);

console.log("listing-demand helpers: ok");
