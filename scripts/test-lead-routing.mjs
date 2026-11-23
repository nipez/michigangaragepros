/**
 * Lightweight assertions for general-lead area matching helpers:
 * Featured-first ranking (healthy sub + plan coverage), cap of 3,
 * exclusion of no-email / excludeSlug / unclaimed-equivalent blanks,
 * soft service preference, metro expansion targets, and idempotent
 * per-lead-per-company filtering.
 *
 * Run: npx tsx scripts/test-lead-routing.mjs
 */
import assert from "node:assert/strict";
import {
  AREA_ROUTE_CAP,
  expandLeadCityMatchTargets,
  featuredPlanCoversLeadCity,
  filterNewRecipients,
  isFeaturedLeadPriority,
  leadServiceMatchesCompany,
  rankAreaRouteCandidates,
} from "../src/lib/lead-routing.ts";

const detroit = {
  slug: "detroit",
  name: "Detroit",
  state: "MI",
  region: "Southeast",
  nearby: ["Dearborn", "Warren", "Livonia", "Southfield", "Royal Oak"],
};

// --- Constants ---
assert.equal(AREA_ROUTE_CAP, 3);

// --- Service soft-match ---
assert.equal(
  leadServiceMatchesCompany("Broken Spring", ["Broken Spring Replacement"]),
  true,
);
assert.equal(
  leadServiceMatchesCompany("Garage Door Opener", ["Opener Repair & Install"]),
  true,
);
assert.equal(
  leadServiceMatchesCompany("New Door Installation", [
    "New Door Installation",
  ]),
  true,
);
assert.equal(
  leadServiceMatchesCompany("Emergency Service", ["Emergency Service"]),
  true,
);
assert.equal(
  leadServiceMatchesCompany("Garage Door Repair", ["Garage Door Repair"]),
  true,
);
assert.equal(leadServiceMatchesCompany("Other", ["Commercial Service"]), true);
assert.equal(leadServiceMatchesCompany("", ["anything"]), true);
assert.equal(
  leadServiceMatchesCompany("Broken Spring", ["Opener Repair & Install"]),
  false,
);
assert.equal(leadServiceMatchesCompany("Broken Spring", []), false);
assert.equal(
  leadServiceMatchesCompany("Maintenance", "Maintenance & Tune-ups"),
  true,
);

// --- Featured plan coverage ---
assert.equal(
  featuredPlanCoversLeadCity({
    plan: "statewide",
    featuredCity: "Detroit",
    companyCitySlug: "detroit",
    leadCitySlug: "traverse-city",
    leadCity: null,
  }),
  true,
);
assert.equal(
  featuredPlanCoversLeadCity({
    plan: "city",
    featuredCity: "Detroit",
    companyCitySlug: "detroit",
    leadCitySlug: "detroit",
    leadCity: detroit,
  }),
  true,
);
assert.equal(
  featuredPlanCoversLeadCity({
    plan: "city",
    featuredCity: "Detroit",
    companyCitySlug: "detroit",
    leadCitySlug: "grand-rapids",
    leadCity: null,
  }),
  false,
);
assert.equal(
  featuredPlanCoversLeadCity({
    plan: "metro",
    featuredCity: "Detroit",
    companyCitySlug: "detroit",
    leadCitySlug: "warren",
    leadCity: {
      slug: "warren",
      name: "Warren",
      state: "MI",
      region: "Southeast",
      nearby: [],
    },
  }),
  true,
  "metro covers same region",
);
assert.equal(
  featuredPlanCoversLeadCity({
    plan: "metro",
    featuredCity: "Detroit",
    companyCitySlug: "detroit",
    leadCitySlug: "grand-rapids",
    leadCity: {
      slug: "grand-rapids",
      name: "Grand Rapids",
      state: "MI",
      region: "West",
      nearby: [],
    },
  }),
  false,
  "metro does not cover other region",
);
assert.equal(
  featuredPlanCoversLeadCity({
    plan: null,
    featuredCity: "Detroit",
    companyCitySlug: "detroit",
    leadCitySlug: "detroit",
    leadCity: detroit,
  }),
  false,
);

// --- Featured lead priority (healthy sub only — not past_due/canceled) ---
assert.equal(
  isFeaturedLeadPriority(
    {
      stripeSubscriptionStatus: "active",
      featuredPlan: "city",
      featuredCity: "Detroit",
      citySlug: "detroit",
    },
    "detroit",
    detroit,
  ),
  true,
);
assert.equal(
  isFeaturedLeadPriority(
    {
      stripeSubscriptionStatus: "trialing",
      featuredPlan: "statewide",
      featuredCity: "Detroit",
      citySlug: "detroit",
    },
    "holland",
    null,
  ),
  true,
);
assert.equal(
  isFeaturedLeadPriority(
    {
      stripeSubscriptionStatus: "past_due",
      featuredPlan: "statewide",
      featuredCity: "Detroit",
      citySlug: "detroit",
    },
    "detroit",
    detroit,
  ),
  false,
  "past_due must not get Featured-first lead priority",
);
assert.equal(
  isFeaturedLeadPriority(
    {
      stripeSubscriptionStatus: "canceled",
      featuredPlan: "statewide",
      featuredCity: "Detroit",
      citySlug: "detroit",
    },
    "detroit",
    detroit,
  ),
  false,
);
assert.equal(
  isFeaturedLeadPriority(
    {
      stripeSubscriptionStatus: null,
      featuredPlan: "city",
      featuredCity: "Detroit",
      citySlug: "detroit",
    },
    "detroit",
    detroit,
  ),
  false,
);

// --- Ranking: Featured first, then home city, then service, then name; cap 3 ---
function cand(partial) {
  return {
    companyId: partial.companyId ?? 1,
    companySlug: partial.companySlug,
    companyName: partial.companyName ?? partial.companySlug,
    email: partial.email ?? `${partial.companySlug}@example.com`,
    featured: partial.featured ?? false,
    citySlug: partial.citySlug ?? "detroit",
    homeCityMatch: partial.homeCityMatch ?? false,
    serviceMatch: partial.serviceMatch ?? true,
    stripeSubscriptionStatus: partial.stripeSubscriptionStatus ?? null,
    featuredPlan: partial.featuredPlan ?? null,
    featuredCity: partial.featuredCity ?? null,
    responsiveness: partial.responsiveness ?? null,
  };
}

/** Qualifying responsiveness metrics for tiebreak tests. */
function resp(rate, medianHours) {
  return {
    windowDays: 90,
    sampleSize: 10,
    actedCount: 10,
    medianHoursToAction: medianHours,
    actedWithin24hRate: rate,
    qualifiesForPublic: true,
  };
}

const pool = [
  cand({
    companySlug: "zeta-organic",
    companyName: "Zeta Doors",
    homeCityMatch: true,
    serviceMatch: true,
  }),
  cand({
    companySlug: "alpha-organic",
    companyName: "Alpha Doors",
    homeCityMatch: true,
    serviceMatch: true,
  }),
  cand({
    companySlug: "featured-active",
    companyName: "Featured Active",
    homeCityMatch: false,
    serviceMatch: true,
    stripeSubscriptionStatus: "active",
    featuredPlan: "metro",
    featuredCity: "Detroit",
    featured: true,
  }),
  cand({
    companySlug: "featured-past-due",
    companyName: "Featured Past Due",
    homeCityMatch: true,
    serviceMatch: true,
    stripeSubscriptionStatus: "past_due",
    featuredPlan: "statewide",
    featuredCity: "Detroit",
    featured: true,
  }),
  cand({
    companySlug: "beta-organic",
    companyName: "Beta Doors",
    homeCityMatch: true,
    serviceMatch: true,
  }),
  cand({
    companySlug: "no-email",
    companyName: "No Email Co",
    email: "  ",
    homeCityMatch: true,
  }),
  cand({
    companySlug: "unclaimed-target",
    companyName: "Unclaimed Target",
    homeCityMatch: true,
  }),
];

const ranked = rankAreaRouteCandidates(pool, {
  leadCitySlug: "detroit",
  leadCity: detroit,
  cap: 3,
  excludeSlug: "unclaimed-target",
});

assert.equal(ranked.length, 3, "cap of 3");
assert.equal(
  ranked[0].companySlug,
  "featured-active",
  "healthy Featured with covering plan ranks first",
);
assert.deepEqual(
  ranked.map((r) => r.companySlug),
  ["featured-active", "alpha-organic", "beta-organic"],
  "after Featured: home-city organics by name ASC; past_due Featured is not prioritized",
);
assert.ok(
  !ranked.some((r) => r.companySlug === "unclaimed-target"),
  "excludeSlug removed",
);
assert.ok(
  !ranked.some((r) => r.companySlug === "no-email"),
  "blank email excluded",
);
assert.ok(
  !ranked.some((r) => r.companySlug === "featured-past-due"),
  "past_due Featured loses to organics when cap fills with higher ranks",
);

// Soft service preference: when some match service, ignore non-matches.
const servicePool = [
  cand({
    companySlug: "repair-pro",
    companyName: "Repair Pro",
    homeCityMatch: true,
    serviceMatch: true,
  }),
  cand({
    companySlug: "install-only",
    companyName: "Install Only",
    homeCityMatch: true,
    serviceMatch: false,
  }),
  cand({
    companySlug: "featured-wrong-service",
    companyName: "Featured Wrong Service",
    homeCityMatch: true,
    serviceMatch: false,
    stripeSubscriptionStatus: "active",
    featuredPlan: "statewide",
    featuredCity: "Detroit",
  }),
];
const serviceRanked = rankAreaRouteCandidates(servicePool, {
  leadCitySlug: "detroit",
  leadCity: detroit,
  cap: 3,
});
assert.deepEqual(
  serviceRanked.map((r) => r.companySlug),
  ["repair-pro"],
  "soft service filter drops non-matching when any match exists",
);

// When nobody matches service, keep all (soft fallback).
const noServiceHits = rankAreaRouteCandidates(
  [
    cand({
      companySlug: "a-co",
      companyName: "A Co",
      homeCityMatch: true,
      serviceMatch: false,
    }),
    cand({
      companySlug: "b-co",
      companyName: "B Co",
      homeCityMatch: true,
      serviceMatch: false,
    }),
  ],
  { leadCitySlug: "detroit", leadCity: detroit, cap: 3 },
);
assert.equal(noServiceHits.length, 2);

// Dedup by email — fair, deterministic.
const dupEmail = rankAreaRouteCandidates(
  [
    cand({
      companySlug: "first",
      companyName: "First",
      email: "shared@example.com",
      homeCityMatch: true,
    }),
    cand({
      companySlug: "second",
      companyName: "Second",
      email: "SHARED@example.com",
      homeCityMatch: true,
    }),
  ],
  { leadCitySlug: "detroit", leadCity: detroit, cap: 3 },
);
assert.equal(dupEmail.length, 1);
assert.equal(dupEmail[0].companySlug, "first");

// --- Metro / nearby expansion ---
const expanded = expandLeadCityMatchTargets(detroit);
assert.ok(expanded.slugs.includes("detroit"));
assert.ok(expanded.slugs.includes("warren"));
assert.ok(expanded.names.includes("Dearborn"));
assert.ok(
  expanded.slugs.includes("troy"),
  "same-region Southeast cities included",
);

// --- Idempotency filter ---
const recipients = [
  { companySlug: "alpha-doors" },
  { companySlug: "beta-garage" },
  { companySlug: "gamma-llc" },
];
assert.deepEqual(
  filterNewRecipients(recipients, new Set(["beta-garage"])).map(
    (r) => r.companySlug,
  ),
  ["alpha-doors", "gamma-llc"],
);
assert.deepEqual(
  filterNewRecipients(recipients, new Set(["alpha-doors", "beta-garage", "gamma-llc"])),
  [],
  "retry with all already routed → nothing new",
);
assert.deepEqual(
  filterNewRecipients(recipients, new Set()).map((r) => r.companySlug),
  ["alpha-doors", "beta-garage", "gamma-llc"],
);

// --- Responsiveness tiebreak (after Featured / home / service; never demotes Featured) ---
const respPool = [
  cand({
    companySlug: "slow-organic",
    companyName: "Slow Organic",
    homeCityMatch: true,
    serviceMatch: true,
    responsiveness: resp(0.4, 20),
  }),
  cand({
    companySlug: "fast-organic",
    companyName: "Fast Organic",
    homeCityMatch: true,
    serviceMatch: true,
    responsiveness: resp(0.9, 2),
  }),
  cand({
    companySlug: "featured-slow",
    companyName: "Featured Slow",
    homeCityMatch: false,
    serviceMatch: true,
    stripeSubscriptionStatus: "active",
    featuredPlan: "statewide",
    featuredCity: "Detroit",
    featured: true,
    responsiveness: resp(0.2, 30),
  }),
  cand({
    companySlug: "no-signal",
    companyName: "No Signal",
    homeCityMatch: true,
    serviceMatch: true,
    responsiveness: null,
  }),
];
const respRanked = rankAreaRouteCandidates(respPool, {
  leadCitySlug: "detroit",
  leadCity: detroit,
  cap: 4,
});
assert.equal(
  respRanked[0].companySlug,
  "featured-slow",
  "Featured still ranks above more-responsive organics",
);
assert.deepEqual(
  respRanked.slice(1).map((r) => r.companySlug),
  ["fast-organic", "slow-organic", "no-signal"],
  "among organics: higher responsiveness before lower; no-signal last",
);

console.log("test-lead-routing: ok");
