/**
 * Assertions for claim funnel aggregation helpers (privacy-light counters).
 * Run: npx tsx scripts/test-claim-funnel.mjs
 */
import assert from "node:assert/strict";
import {
  emptyClaimFunnelTotals,
  isClaimFunnelEvent,
  rate,
  summarizeClaimFunnelRows,
  withClaimFunnelRates,
} from "../src/lib/claim-funnel.ts";

assert.equal(isClaimFunnelEvent("view"), true);
assert.equal(isClaimFunnelEvent("search"), true);
assert.equal(isClaimFunnelEvent("start"), true);
assert.equal(isClaimFunnelEvent("submit"), true);
assert.equal(isClaimFunnelEvent("click"), false);

assert.equal(rate(1, 0), null);
assert.equal(rate(1, 4), 0.25);
assert.equal(rate(0, 10), 0);

const empty = emptyClaimFunnelTotals();
assert.deepEqual(empty, { views: 0, searches: 0, starts: 0, submits: 0 });
empty.views = 9;
assert.equal(emptyClaimFunnelTotals().views, 0);

const rates = withClaimFunnelRates({
  views: 100,
  searches: 40,
  starts: 20,
  submits: 5,
});
assert.equal(rates.viewToSearchRate, 0.4);
assert.equal(rates.viewToStartRate, 0.2);
assert.equal(rates.searchToStartRate, 0.5);
assert.equal(rates.startToSubmitRate, 0.25);
assert.equal(rates.viewToSubmitRate, 0.05);

const totals = summarizeClaimFunnelRows([
  { views: 50, searches: 20, starts: 10, submits: 2 },
  { views: 10, searches: 4, starts: 2, submits: 1 },
]);
assert.equal(totals.views, 60);
assert.equal(totals.searches, 24);
assert.equal(totals.starts, 12);
assert.equal(totals.submits, 3);

console.log("test-claim-funnel: ok");
