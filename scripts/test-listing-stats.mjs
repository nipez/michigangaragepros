/**
 * Lightweight assertions for listing-stats pure helpers.
 * Run: npx tsx scripts/test-listing-stats.mjs
 */
import assert from "node:assert/strict";
import {
  addUtcDays,
  emptyListingTotals,
  isLikelyBot,
  percentChange,
  utcDay,
} from "../src/lib/listing-stats.ts";

assert.equal(utcDay(new Date("2026-10-30T15:22:00.000Z")), "2026-10-30");
assert.equal(addUtcDays("2026-10-30", -29), "2026-10-01");
assert.equal(addUtcDays("2026-03-01", -1), "2026-02-28");
assert.equal(addUtcDays("2026-01-01", 0), "2026-01-01");

assert.equal(isLikelyBot("Mozilla/5.0 (compatible; Googlebot/2.1)"), true);
assert.equal(isLikelyBot("curl/8.0"), true);
assert.equal(isLikelyBot(""), true);
assert.equal(isLikelyBot("short"), true);
assert.equal(
  isLikelyBot(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  ),
  false,
);

assert.equal(percentChange(12, 10), 20);
assert.equal(percentChange(8, 10), -20);
assert.equal(percentChange(0, 0), 0);
assert.equal(percentChange(5, 0), null);

const totals = emptyListingTotals();
assert.deepEqual(totals, {
  profile_views: 0,
  contact_clicks: 0,
  leads_routed: 0,
  review_link_visits: 0,
  review_submissions: 0,
});
totals.profile_views = 3;
assert.equal(emptyListingTotals().profile_views, 0);

console.log("listing-stats helpers: ok");
