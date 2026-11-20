/**
 * Assertions for quote funnel aggregation helpers (privacy-light counters).
 * Run: npx tsx scripts/test-quote-funnel.mjs
 */
import assert from "node:assert/strict";
import {
  emptyQuoteFunnelTotals,
  isQuoteFunnelEvent,
  rate,
  summarizeQuoteFunnelRows,
  withFunnelRates,
} from "../src/lib/quote-funnel.ts";

assert.equal(isQuoteFunnelEvent("view"), true);
assert.equal(isQuoteFunnelEvent("start"), true);
assert.equal(isQuoteFunnelEvent("submit"), true);
assert.equal(isQuoteFunnelEvent("click"), false);

assert.equal(rate(1, 0), null);
assert.equal(rate(1, 4), 0.25);
assert.equal(rate(0, 10), 0);

const empty = emptyQuoteFunnelTotals();
assert.deepEqual(empty, { views: 0, starts: 0, submits: 0 });
empty.views = 9;
assert.equal(emptyQuoteFunnelTotals().views, 0);

const row = withFunnelRates("city", { views: 100, starts: 40, submits: 10 });
assert.equal(row.sourcePage, "city");
assert.equal(row.viewToStartRate, 0.4);
assert.equal(row.viewToSubmitRate, 0.1);
assert.equal(row.startToSubmitRate, 0.25);

const { totals, bySource } = summarizeQuoteFunnelRows([
  { source_page: "city", views: 50, starts: 20, submits: 5 },
  { source_page: "city", views: 10, starts: 4, submits: 1 },
  { source_page: "company", views: 30, starts: 12, submits: 3 },
  { source_page: "weird", views: 2, starts: 0, submits: 0 },
]);

assert.equal(totals.views, 92);
assert.equal(totals.starts, 36);
assert.equal(totals.submits, 9);

const city = bySource.find((r) => r.sourcePage === "city");
const company = bySource.find((r) => r.sourcePage === "company");
const other = bySource.find((r) => r.sourcePage === "other");
assert.ok(city);
assert.equal(city.views, 60);
assert.equal(city.starts, 24);
assert.equal(city.submits, 6);
assert.ok(company);
assert.equal(company.views, 30);
assert.ok(other);
assert.equal(other.views, 2);
assert.equal(bySource[0].sourcePage, "city"); // highest views first

console.log("test-quote-funnel: ok");
