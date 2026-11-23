/**
 * Lightweight assertions for lead responsiveness metric math and
 * routing tiebreak helpers. Does not hit D1.
 *
 * Run: npx tsx scripts/test-responsiveness.mjs
 */
import assert from "node:assert/strict";
import {
  RESPONSIVENESS_MIN_SAMPLE,
  RESPONSIVENESS_WINDOW_DAYS,
  compareResponsivenessTiebreak,
  computeResponsivenessMetrics,
  emptyResponsivenessMetrics,
  formatPublicResponseLabel,
  formatResponsivenessAdminSummary,
  friendlyResponseHours,
  hoursBetween,
  manageResponsivenessNudge,
  median,
  parseDbDateMs,
  publicResponsivenessBadge,
  responsivenessTiebreakScore,
} from "../src/lib/responsiveness.ts";

// --- Constants ---
assert.equal(RESPONSIVENESS_WINDOW_DAYS, 90);
assert.equal(RESPONSIVENESS_MIN_SAMPLE, 5);

// --- Date / hours helpers ---
assert.ok(parseDbDateMs("2026-01-01 12:00:00") !== null);
assert.ok(parseDbDateMs("2026-01-01T12:00:00Z") !== null);
assert.equal(parseDbDateMs(""), null);
assert.equal(parseDbDateMs(null), null);

assert.equal(hoursBetween("2026-01-01 10:00:00", "2026-01-01 12:00:00"), 2);
assert.equal(hoursBetween("2026-01-01 10:00:00", "2026-01-02 10:00:00"), 24);
assert.equal(hoursBetween("2026-01-01 12:00:00", "2026-01-01 10:00:00"), null);
assert.equal(hoursBetween("2026-01-01 10:00:00", null), null);

// --- Median ---
assert.equal(median([]), null);
assert.equal(median([3]), 3);
assert.equal(median([1, 3]), 2);
assert.equal(median([1, 2, 3]), 2);
assert.equal(median([4, 1, 3, 2]), 2.5);

// --- Friendly hours / label ---
assert.equal(friendlyResponseHours(0.4), 1);
assert.equal(friendlyResponseHours(1), 1);
assert.equal(friendlyResponseHours(1.1), 2);
assert.equal(friendlyResponseHours(7.2), 8);
assert.equal(formatPublicResponseLabel(1), "Usually responds within 1 hour");
assert.equal(formatPublicResponseLabel(4), "Usually responds within 4 hours");

// --- Empty metrics ---
const empty = emptyResponsivenessMetrics();
assert.equal(empty.sampleSize, 0);
assert.equal(empty.qualifiesForPublic, false);
assert.equal(publicResponsivenessBadge(empty), null);

// --- Metric computation ---
function sample(routedAt, firstActedAt) {
  return {
    routedAt,
    firstViewedAt: firstActedAt,
    firstActedAt,
  };
}

const underSample = computeResponsivenessMetrics([
  sample("2026-01-01 10:00:00", "2026-01-01 11:00:00"),
  sample("2026-01-02 10:00:00", "2026-01-02 12:00:00"),
  sample("2026-01-03 10:00:00", null),
]);
assert.equal(underSample.sampleSize, 3);
assert.equal(underSample.actedCount, 2);
assert.equal(underSample.medianHoursToAction, 1.5);
assert.equal(underSample.qualifiesForPublic, false);
assert.equal(publicResponsivenessBadge(underSample), null);

const acted = [
  sample("2026-01-01 10:00:00", "2026-01-01 11:00:00"), // 1h
  sample("2026-01-02 10:00:00", "2026-01-02 12:00:00"), // 2h
  sample("2026-01-03 10:00:00", "2026-01-03 14:00:00"), // 4h
  sample("2026-01-04 10:00:00", "2026-01-04 11:30:00"), // 1.5h
  sample("2026-01-05 10:00:00", "2026-01-06 12:00:00"), // 26h — outside 24h
];
const full = computeResponsivenessMetrics(acted);
assert.equal(full.sampleSize, 5);
assert.equal(full.actedCount, 5);
assert.equal(full.medianHoursToAction, 2);
assert.equal(full.actedWithin24hRate, 0.8);
assert.equal(full.qualifiesForPublic, true);
const badge = publicResponsivenessBadge(full);
assert.ok(badge);
assert.equal(badge.label, "Usually responds within 2 hours");
assert.equal(badge.withinHours, 2);

// Unacted leads count against the 24h rate denominator.
const mixed = computeResponsivenessMetrics([
  ...acted,
  sample("2026-01-06 10:00:00", null),
]);
assert.equal(mixed.sampleSize, 6);
assert.equal(mixed.actedCount, 5);
assert.ok(Math.abs(mixed.actedWithin24hRate - 4 / 6) < 1e-9);
assert.equal(mixed.qualifiesForPublic, true); // actedCount still >= 5

// Still-new-only never qualifies.
const allNew = computeResponsivenessMetrics([
  sample("2026-01-01 10:00:00", null),
  sample("2026-01-02 10:00:00", null),
  sample("2026-01-03 10:00:00", null),
  sample("2026-01-04 10:00:00", null),
  sample("2026-01-05 10:00:00", null),
]);
assert.equal(allNew.actedCount, 0);
assert.equal(allNew.qualifiesForPublic, false);
assert.equal(publicResponsivenessBadge(allNew), null);

// --- Admin / manage copy ---
const admin = formatResponsivenessAdminSummary(full);
assert.match(admin.summary, /median 2h/);
assert.match(admin.summary, /80% <24h/);
assert.match(admin.summary, /n=5/);
assert.equal(admin.publicLabel, "Usually responds within 2 hours");

const nudgeLow = manageResponsivenessNudge(underSample);
assert.match(nudgeLow, /Act on/);
assert.match(nudgeLow, /badge/);
const nudgeGood = manageResponsivenessNudge(full);
assert.match(nudgeGood, /Usually responds within 2 hours/);

// --- Tiebreak scores ---
assert.equal(responsivenessTiebreakScore(null), 0);
assert.equal(responsivenessTiebreakScore(underSample), 0);
assert.ok(responsivenessTiebreakScore(full) > 0);

const slowButQualified = computeResponsivenessMetrics([
  sample("2026-01-01 10:00:00", "2026-01-02 10:00:00"), // 24h
  sample("2026-01-02 10:00:00", "2026-01-03 10:00:00"),
  sample("2026-01-03 10:00:00", "2026-01-04 10:00:00"),
  sample("2026-01-04 10:00:00", "2026-01-05 10:00:00"),
  sample("2026-01-05 10:00:00", "2026-01-07 10:00:00"), // 48h
]);
assert.equal(slowButQualified.qualifiesForPublic, true);
assert.ok(
  responsivenessTiebreakScore(full) > responsivenessTiebreakScore(slowButQualified),
  "faster / higher 24h rate should outrank slower peer",
);
assert.ok(compareResponsivenessTiebreak(full, slowButQualified) < 0);
assert.ok(compareResponsivenessTiebreak(full, underSample) < 0);
assert.equal(compareResponsivenessTiebreak(underSample, empty), 0);

console.log("test-responsiveness: ok");
