/**
 * Pure-helper assertions for unanswered lead fallback:
 * unanswered detection, recipient selection under total cap, idempotent
 * filtering, cron constant, and nudge/fallback notify copy.
 *
 * Run: npx tsx scripts/test-lead-fallback.mjs
 */
import assert from "node:assert/strict";
import {
  FALLBACK_ADD_PER_RUN,
  UNANSWERED_LEAD_FALLBACK_CRON,
  UNANSWERED_LEAD_FALLBACK_HOURS,
  isCapCountingReason,
  isRoutingUnanswered,
  isoHoursAgo,
  leadNeedsUnansweredFallback,
  selectFallbackRecipients,
} from "../src/lib/lead-fallback.ts";
import {
  AREA_ROUTE_CAP,
  LEAD_ROUTE_TOTAL_CAP,
  filterNewRecipients,
  rankAreaRouteCandidates,
} from "../src/lib/lead-routing.ts";
import {
  formatCompanyLeadNotify,
  formatCompanyLeadNudge,
} from "../src/lib/notify-lead.ts";

assert.equal(UNANSWERED_LEAD_FALLBACK_HOURS, 24);
assert.equal(UNANSWERED_LEAD_FALLBACK_CRON, "0 * * * *");
assert.equal(LEAD_ROUTE_TOTAL_CAP, 4);
assert.equal(AREA_ROUTE_CAP, 3);
assert.equal(FALLBACK_ADD_PER_RUN, 1);

// --- Unanswered routing ---
assert.equal(
  isRoutingUnanswered({ first_viewed_at: null, first_acted_at: null }),
  true,
);
assert.equal(
  isRoutingUnanswered({ first_viewed_at: "", first_acted_at: "  " }),
  true,
);
assert.equal(
  isRoutingUnanswered({
    first_viewed_at: "2026-03-01T00:00:00Z",
    first_acted_at: null,
  }),
  false,
);
assert.equal(
  isRoutingUnanswered({
    first_viewed_at: null,
    first_acted_at: "2026-03-01T00:00:00Z",
  }),
  false,
);

assert.equal(isCapCountingReason("direct"), true);
assert.equal(isCapCountingReason("area"), true);
assert.equal(isCapCountingReason("fallback"), true);
assert.equal(isCapCountingReason("retained"), false);

// --- Window gate ---
const now = Date.parse("2026-03-10T15:00:00Z");
const stale = "2026-03-09T14:00:00Z"; // 25h earlier
const fresh = "2026-03-10T14:00:00Z"; // 1h earlier

assert.equal(
  leadNeedsUnansweredFallback({
    status: "new",
    nowMs: now,
    windowHours: 24,
    routings: [
      {
        reason: "area",
        created_at: stale,
        first_viewed_at: null,
        first_acted_at: null,
      },
    ],
  }),
  true,
);

assert.equal(
  leadNeedsUnansweredFallback({
    status: "contacted",
    nowMs: now,
    windowHours: 24,
    routings: [
      {
        reason: "area",
        created_at: stale,
        first_viewed_at: null,
        first_acted_at: null,
      },
    ],
  }),
  false,
  "closed/contacted leads are not open",
);

assert.equal(
  leadNeedsUnansweredFallback({
    status: "new",
    nowMs: now,
    windowHours: 24,
    routings: [
      {
        reason: "area",
        created_at: fresh,
        first_viewed_at: null,
        first_acted_at: null,
      },
    ],
  }),
  false,
  "still inside the silence window",
);

assert.equal(
  leadNeedsUnansweredFallback({
    status: "new",
    nowMs: now,
    windowHours: 24,
    routings: [
      {
        reason: "area",
        created_at: stale,
        first_viewed_at: "2026-03-09T18:00:00Z",
        first_acted_at: null,
      },
    ],
  }),
  false,
  "viewed ⇒ engaged",
);

assert.equal(
  leadNeedsUnansweredFallback({
    status: "new",
    nowMs: now,
    windowHours: 24,
    routings: [
      {
        reason: "area",
        created_at: stale,
        first_viewed_at: null,
        first_acted_at: null,
      },
      {
        reason: "area",
        created_at: stale,
        first_viewed_at: null,
        first_acted_at: "2026-03-09T20:00:00Z",
      },
    ],
  }),
  false,
  "any acted peer blocks fallback",
);

assert.equal(
  leadNeedsUnansweredFallback({
    status: "new",
    nowMs: now,
    windowHours: 24,
    routings: [
      {
        reason: "retained",
        created_at: stale,
        first_viewed_at: null,
        first_acted_at: null,
      },
    ],
  }),
  false,
  "retained-only does not trigger",
);

assert.equal(
  leadNeedsUnansweredFallback({
    status: "new",
    nowMs: now,
    windowHours: 24,
    routings: [
      {
        reason: "direct",
        created_at: stale,
        first_viewed_at: null,
        first_acted_at: null,
      },
      {
        reason: "fallback",
        created_at: stale,
        first_viewed_at: null,
        first_acted_at: null,
      },
    ],
  }),
  true,
  "direct + unanswered fallback still eligible for another hop",
);

// --- Selection under total cap (idempotent skip of already-routed) ---
const ranked = [
  { companySlug: "alpha-doors" },
  { companySlug: "beta-garage" },
  { companySlug: "gamma-llc" },
  { companySlug: "delta-pro" },
  { companySlug: "epsilon-co" },
];

assert.deepEqual(
  selectFallbackRecipients(ranked, new Set(["alpha-doors", "beta-garage"]), {
    currentCount: 2,
    totalCap: 4,
    addCap: 1,
  }).map((r) => r.companySlug),
  ["gamma-llc"],
  "next best after two already routed",
);

assert.deepEqual(
  selectFallbackRecipients(ranked, new Set(["alpha-doors", "beta-garage", "gamma-llc"]), {
    currentCount: 3,
    totalCap: 4,
    addCap: 1,
  }).map((r) => r.companySlug),
  ["delta-pro"],
);

assert.deepEqual(
  selectFallbackRecipients(
    ranked,
    new Set(["alpha-doors", "beta-garage", "gamma-llc", "delta-pro"]),
    { currentCount: 4, totalCap: 4, addCap: 1 },
  ),
  [],
  "at total cap → nothing",
);

// Idempotent re-run: same already-routed set never re-selects them.
const already = new Set(["gamma-llc"]);
const first = selectFallbackRecipients(ranked, already, {
  currentCount: 1,
  totalCap: 4,
  addCap: 1,
});
assert.deepEqual(
  first.map((r) => r.companySlug),
  ["alpha-doors"],
);
const afterInsert = new Set([...already, ...first.map((r) => r.companySlug)]);
const second = selectFallbackRecipients(ranked, afterInsert, {
  currentCount: afterInsert.size,
  totalCap: 4,
  addCap: 1,
});
assert.deepEqual(
  second.map((r) => r.companySlug),
  ["beta-garage"],
);
assert.equal(
  filterNewRecipients(first, afterInsert).length,
  0,
  "re-filtering prior selection against updated set is empty",
);

// excludeSlugs set in ranking (multi-exclude for fallback)
function cand(partial) {
  return {
    companyId: partial.companyId ?? 1,
    companySlug: partial.companySlug,
    companyName: partial.companyName ?? partial.companySlug,
    email: partial.email ?? `${partial.companySlug}@example.com`,
    featured: false,
    citySlug: "detroit",
    homeCityMatch: true,
    serviceMatch: true,
    stripeSubscriptionStatus: null,
    featuredPlan: null,
    featuredCity: null,
  };
}

const pool = [
  cand({ companySlug: "already-a", companyName: "Already A" }),
  cand({ companySlug: "already-b", companyName: "Already B" }),
  cand({ companySlug: "next-one", companyName: "Next One" }),
  cand({ companySlug: "next-two", companyName: "Next Two" }),
];
const rankedPool = rankAreaRouteCandidates(pool, {
  leadCitySlug: "detroit",
  cap: 4,
  excludeSlugs: new Set(["already-a", "already-b"]),
});
assert.deepEqual(
  rankedPool.map((r) => r.companySlug),
  ["next-one", "next-two"],
);

// --- isoHoursAgo ---
assert.equal(isoHoursAgo(24, new Date("2026-03-10T15:00:00.000Z")), "2026-03-09T15:00:00Z");

// --- Notify copy ---
const fallbackMail = formatCompanyLeadNotify({
  id: 99,
  companyName: "Next Pro",
  service: "Broken Spring",
  issue: "Door stuck",
  zip: "48201",
  name: "Pat",
  phone: "555-0100",
  timing: "Today / Emergency",
  reason: "fallback",
});
assert.match(fallbackMail.subject, /fallback/i);
assert.match(fallbackMail.text, /still waiting/i);
assert.match(fallbackMail.text, /urgent/i);

const nudge = formatCompanyLeadNudge({
  id: 99,
  companyName: "Slow Pro",
  service: "Broken Spring",
  issue: "Door stuck",
  zip: "48201",
  name: "Pat",
  phone: "555-0100",
  timing: "Flexible",
});
assert.match(nudge.subject, /Reminder/i);
assert.match(nudge.text, /still waiting/i);
assert.match(nudge.text, /another local pro/i);
assert.equal(nudge.kind, "company-lead-nudge");

console.log("test-lead-fallback: ok");
