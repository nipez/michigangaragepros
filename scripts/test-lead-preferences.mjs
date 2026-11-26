/**
 * Lightweight assertions for claimed-company lead preferences:
 * pause + resume date, city/service filters, empty = accept all,
 * ranking filter helper, and soft service matching.
 *
 * Run: npx tsx scripts/test-lead-preferences.mjs
 */
import assert from "node:assert/strict";
import {
  companyAcceptsLeadCity,
  companyAcceptsLeadService,
  companyEligibleForLead,
  EMPTY_LEAD_PREFERENCES,
  isLeadPauseActive,
  leadPreferenceStatusLabel,
  LEAD_PREF_SERVICE_OPTIONS,
  normalizeLeadPreferencesInput,
  normalizeResumeAt,
  preferencesFromRow,
  serializeLeadPreferences,
  validateLeadPreferences,
} from "../src/lib/lead-preferences.ts";
import {
  filterCandidatesByLeadPreferences,
  rankAreaRouteCandidates,
} from "../src/lib/lead-routing.ts";

// --- Constants / options ---
assert.ok(LEAD_PREF_SERVICE_OPTIONS.includes("Garage Door Repair"));
assert.ok(!LEAD_PREF_SERVICE_OPTIONS.includes("Other"));

// --- Resume date normalize ---
assert.equal(normalizeResumeAt(null), null);
assert.equal(normalizeResumeAt(""), null);
assert.equal(normalizeResumeAt("2026-12-01"), "2026-12-01");
assert.equal(normalizeResumeAt("2026-12-01T15:00:00Z"), "2026-12-01");
assert.equal(normalizeResumeAt("not-a-date"), null);

// --- Pause active / auto-resume ---
assert.deepEqual(
  isLeadPauseActive({ paused: false, resumeAt: null }),
  { active: false, autoResumed: false },
);
assert.deepEqual(
  isLeadPauseActive({ paused: true, resumeAt: null }),
  { active: true, autoResumed: false },
);
assert.deepEqual(
  isLeadPauseActive(
    { paused: true, resumeAt: "2099-01-01" },
    new Date("2026-11-26T12:00:00Z"),
  ),
  { active: true, autoResumed: false },
);
assert.deepEqual(
  isLeadPauseActive(
    { paused: true, resumeAt: "2026-11-26" },
    new Date("2026-11-26T12:00:00Z"),
  ),
  { active: false, autoResumed: true },
  "resume day inclusive — treat as not paused",
);
assert.deepEqual(
  isLeadPauseActive(
    { paused: true, resumeAt: "2026-11-25" },
    new Date("2026-11-26T12:00:00Z"),
  ),
  { active: false, autoResumed: true },
);

// --- City / service accept (empty = all) ---
assert.equal(
  companyAcceptsLeadCity({ citySlugs: [] }, "detroit"),
  true,
);
assert.equal(
  companyAcceptsLeadCity({ citySlugs: ["detroit"] }, "detroit"),
  true,
);
assert.equal(
  companyAcceptsLeadCity({ citySlugs: ["detroit"] }, "ann-arbor"),
  false,
);
assert.equal(
  companyAcceptsLeadService({ services: [] }, "Broken Spring"),
  true,
);
assert.equal(
  companyAcceptsLeadService(
    { services: ["Broken Spring"] },
    "Broken Spring",
  ),
  true,
);
assert.equal(
  companyAcceptsLeadService(
    { services: ["Garage Door Opener"] },
    "Broken Spring",
  ),
  false,
);
assert.equal(
  companyAcceptsLeadService(
    { services: ["Broken Spring Replacement"] },
    "Broken Spring",
  ),
  true,
  "soft match spring",
);

// --- Eligibility ---
const base = { ...EMPTY_LEAD_PREFERENCES };
assert.equal(
  companyEligibleForLead(base, { citySlug: "detroit", service: "Repair" })
    .eligible,
  true,
);
assert.equal(
  companyEligibleForLead(
    { ...base, paused: true },
    { citySlug: "detroit", service: "Repair" },
  ).reason,
  "paused",
);
assert.equal(
  companyEligibleForLead(
    { ...base, citySlugs: ["ann-arbor"] },
    { citySlug: "detroit", service: "Repair" },
  ).reason,
  "city",
);
assert.equal(
  companyEligibleForLead(
    { ...base, services: ["Garage Door Opener"] },
    { citySlug: "detroit", service: "Broken Spring" },
  ).reason,
  "service",
);
assert.equal(
  companyEligibleForLead(
    {
      ...base,
      paused: true,
      resumeAt: "2020-01-01",
      citySlugs: ["detroit"],
      services: ["Broken Spring"],
    },
    { citySlug: "detroit", service: "Broken Spring" },
    new Date("2026-11-26T12:00:00Z"),
  ).eligible,
  true,
  "auto-resumed pause still allows matching city/service",
);

// --- Normalize / serialize / row parse ---
const normalized = normalizeLeadPreferencesInput({
  paused: true,
  resumeAt: "2026-12-15",
  citySlugs: ["detroit", "detroit", "not-a-real-city", "ann-arbor"],
  services: ["Garage Door Repair", "Broken Spring"],
});
assert.equal(normalized.paused, true);
assert.equal(normalized.resumeAt, "2026-12-15");
assert.deepEqual(normalized.citySlugs, ["detroit", "ann-arbor"]);
assert.ok(normalized.services.includes("Garage Door Repair"));

const serialized = serializeLeadPreferences(normalized);
assert.equal(serialized.leads_paused, 1);
assert.equal(serialized.leads_resume_at, "2026-12-15");
assert.ok(serialized.lead_pref_cities?.includes("detroit"));

const fromRow = preferencesFromRow({
  leads_paused: 1,
  leads_resume_at: "2026-12-15",
  lead_pref_cities: '["detroit"]',
  lead_pref_services: '["Broken Spring"]',
});
assert.equal(fromRow.paused, true);
assert.deepEqual(fromRow.citySlugs, ["detroit"]);

const emptyRow = preferencesFromRow({
  leads_paused: 0,
  leads_resume_at: null,
  lead_pref_cities: null,
  lead_pref_services: null,
});
assert.deepEqual(emptyRow, EMPTY_LEAD_PREFERENCES);

assert.equal(validateLeadPreferences(EMPTY_LEAD_PREFERENCES), null);
assert.ok(
  validateLeadPreferences({
    ...EMPTY_LEAD_PREFERENCES,
    paused: true,
    resumeAt: "2020-01-01",
  }),
);

assert.ok(
  leadPreferenceStatusLabel({
    ...EMPTY_LEAD_PREFERENCES,
    paused: true,
    resumeAt: "2099-06-01",
  }).includes("Paused"),
);
assert.equal(
  leadPreferenceStatusLabel(EMPTY_LEAD_PREFERENCES),
  "Receiving all matching leads",
);

// --- Routing filter helper + ranking still Featured-first ---
const candidates = [
  {
    companyId: 1,
    companySlug: "paused-pro",
    companyName: "Paused Pro",
    email: "a@example.com",
    featured: true,
    citySlug: "detroit",
    homeCityMatch: true,
    serviceMatch: true,
    stripeSubscriptionStatus: "active",
    featuredPlan: "city",
    featuredCity: "Detroit",
  },
  {
    companyId: 2,
    companySlug: "open-pro",
    companyName: "Open Pro",
    email: "b@example.com",
    featured: false,
    citySlug: "detroit",
    homeCityMatch: true,
    serviceMatch: true,
    stripeSubscriptionStatus: null,
    featuredPlan: null,
    featuredCity: null,
  },
  {
    companyId: 3,
    companySlug: "wrong-city",
    companyName: "Wrong City",
    email: "c@example.com",
    featured: false,
    citySlug: "detroit",
    homeCityMatch: true,
    serviceMatch: true,
    stripeSubscriptionStatus: null,
    featuredPlan: null,
    featuredCity: null,
  },
];

const prefsBySlug = {
  "paused-pro": { ...EMPTY_LEAD_PREFERENCES, paused: true },
  "open-pro": EMPTY_LEAD_PREFERENCES,
  "wrong-city": {
    ...EMPTY_LEAD_PREFERENCES,
    citySlugs: ["ann-arbor"],
  },
};

const filtered = filterCandidatesByLeadPreferences(
  candidates,
  prefsBySlug,
  { citySlug: "detroit", service: "Garage Door Repair" },
);
assert.deepEqual(
  filtered.map((c) => c.companySlug),
  ["open-pro"],
);

const ranked = rankAreaRouteCandidates(filtered, {
  leadCitySlug: "detroit",
  cap: 3,
});
assert.equal(ranked.length, 1);
assert.equal(ranked[0].companySlug, "open-pro");

console.log("test-lead-preferences: all assertions passed");
