/**
 * Lightweight assertions for listing profile completeness scoring.
 * Covers weights, empty/full scores, missing order, manage-state helper,
 * and admin summary formatting. Does not hit D1.
 *
 * Run: npx tsx scripts/test-listing-completeness.mjs
 */
import assert from "node:assert/strict";
import { emptyCompanyTrust } from "../src/lib/company-trust.ts";
import {
  COMPLETENESS_ITEM_DEFS,
  MIN_ABOUT_LENGTH,
  completenessInputFromManageState,
  computeListingCompleteness,
  emptyCompletenessInput,
  formatCompletenessAdminSummary,
  topMissingCompletenessItems,
} from "../src/lib/listing-completeness.ts";

// --- Weights ---
const weightSum = COMPLETENESS_ITEM_DEFS.reduce((s, d) => s + d.weight, 0);
assert.equal(weightSum, 100);
assert.ok(MIN_ABOUT_LENGTH >= 20);

const ids = COMPLETENESS_ITEM_DEFS.map((d) => d.id);
assert.equal(new Set(ids).size, ids.length);

// --- Empty → 0 ---
const empty = computeListingCompleteness(emptyCompletenessInput());
assert.equal(empty.score, 0);
assert.equal(empty.complete, false);
assert.equal(empty.missing.length, COMPLETENESS_ITEM_DEFS.length);
assert.equal(empty.missing[0].id, "about"); // highest weight first
assert.equal(empty.missingWeight, 100);

// --- Full → 100 ---
const fullInput = {
  about: "x".repeat(MIN_ABOUT_LENGTH),
  phone: "(616) 555-0100",
  website: "https://example.com",
  services: ["Garage Door Repair"],
  serviceAreas: ["Grand Rapids"],
  hours: "Mon–Sat, 7am–8pm",
  hasLogo: true,
  hasPhoto: true,
  hasTrust: true,
  approvedReviewCount: 2,
  reviewLinkVisits: 5,
  notifyEmail: "owner@example.com",
};
const full = computeListingCompleteness(fullInput);
assert.equal(full.score, 100);
assert.equal(full.complete, true);
assert.equal(full.missing.length, 0);
assert.equal(formatCompletenessAdminSummary(full), "100% · complete");

// --- Short about does not count ---
const shortAbout = computeListingCompleteness({
  ...fullInput,
  about: "Too short",
});
assert.equal(shortAbout.complete, false);
assert.ok(shortAbout.missing.some((m) => m.id === "about"));
assert.equal(shortAbout.score, 100 - 15);

// --- Partial: phone + logo only ---
const partial = computeListingCompleteness({
  ...emptyCompletenessInput(),
  phone: "616-555-0100",
  hasLogo: true,
});
assert.equal(partial.score, 12 + 10);
assert.equal(partial.missing.length, COMPLETENESS_ITEM_DEFS.length - 2);
const top3 = topMissingCompletenessItems(partial, 3);
assert.equal(top3.length, 3);
assert.equal(top3[0].id, "about");
assert.ok(top3.every((m) => !m.filled));

// --- Review + review link are separate ---
const withReviewOnly = computeListingCompleteness({
  ...emptyCompletenessInput(),
  approvedReviewCount: 1,
});
assert.ok(withReviewOnly.items.find((i) => i.id === "review")?.filled);
assert.ok(
  !withReviewOnly.items.find((i) => i.id === "reviewLinkUsed")?.filled,
);

const withLinkOnly = computeListingCompleteness({
  ...emptyCompletenessInput(),
  reviewLinkVisits: 1,
});
assert.ok(withLinkOnly.items.find((i) => i.id === "reviewLinkUsed")?.filled);
assert.ok(!withLinkOnly.items.find((i) => i.id === "review")?.filled);

// --- Manage-state helper ---
const fromManage = completenessInputFromManageState({
  fields: {
    about: "A".repeat(MIN_ABOUT_LENGTH),
    phone: "1",
    website: "",
    hours: "9-5",
    services: ["Repair"],
    serviceArea: ["Detroit"],
  },
  hasLogo: true,
  hasPhoto: false,
  trust: { ...emptyCompanyTrust(), insured: true },
  approvedReviewCount: 0,
  reviewLinkVisits: 0,
  notifyEmail: "  a@b.com ",
});
assert.equal(fromManage.hasTrust, true);
assert.equal(fromManage.hasLogo, true);
assert.equal(fromManage.hasPhoto, false);
const manageScore = computeListingCompleteness(fromManage);
assert.ok(manageScore.score >= 15 + 12 + 10 + 10 + 10 + 5);
assert.ok(manageScore.missing.some((m) => m.id === "photo"));
assert.ok(manageScore.missing.some((m) => m.id === "website"));

// --- Admin summary ---
assert.match(
  formatCompletenessAdminSummary(partial, 2),
  /^\d+% · missing /,
);
assert.ok(formatCompletenessAdminSummary(partial, 2).includes("about"));

// --- Section anchors exist for every item ---
for (const def of COMPLETENESS_ITEM_DEFS) {
  assert.ok(def.sectionId.length > 0);
  assert.ok(def.action.length > 0);
  assert.ok(def.weight > 0);
}

console.log("test-listing-completeness: ok");
