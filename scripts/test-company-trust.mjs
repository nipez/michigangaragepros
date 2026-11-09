/**
 * Lightweight assertions for company trust credential helpers.
 * Covers normalize/validate, badge formatting, empty/equal helpers,
 * and manage-token format guards used by the trust API.
 *
 * Run: npx tsx scripts/test-company-trust.mjs
 */
import assert from "node:assert/strict";
import {
  TRUST_LIMITS,
  companyTrustFromRow,
  emptyCompanyTrust,
  formatTrustSummary,
  normalizeTrustInput,
  trustBadges,
  trustEqual,
  trustHasAny,
} from "../src/lib/company-trust.ts";
import { isValidManageTokenFormat } from "../src/lib/listing-manage.ts";

// --- Empty / row mapping ---
assert.deepEqual(emptyCompanyTrust(), {
  licensed: false,
  licenseNumber: null,
  insured: false,
  bonded: false,
  familyOwned: false,
  yearsInBusiness: null,
  updatedAt: null,
});
assert.equal(trustHasAny(emptyCompanyTrust()), false);

const fromRow = companyTrustFromRow({
  trust_licensed: 1,
  trust_license_number: " MI-12345 ",
  trust_insured: 1,
  trust_bonded: 0,
  trust_family_owned: 1,
  trust_years_in_business: 12,
  trust_updated_at: "2026-11-09 12:00:00",
});
assert.equal(fromRow.licensed, true);
assert.equal(fromRow.licenseNumber, "MI-12345");
assert.equal(fromRow.insured, true);
assert.equal(fromRow.bonded, false);
assert.equal(fromRow.familyOwned, true);
assert.equal(fromRow.yearsInBusiness, 12);
assert.equal(trustHasAny(fromRow), true);

// --- Normalize / validate ---
const ok = normalizeTrustInput({
  licensed: true,
  licenseNumber: "ABC-99",
  insured: "yes",
  bonded: 0,
  familyOwned: false,
  yearsInBusiness: "8",
});
assert.equal(ok.ok, true);
if (ok.ok) {
  assert.equal(ok.trust.licensed, true);
  assert.equal(ok.trust.licenseNumber, "ABC-99");
  assert.equal(ok.trust.insured, true);
  assert.equal(ok.trust.bonded, false);
  assert.equal(ok.trust.yearsInBusiness, 8);
}

// Unchecking licensed clears license number
const cleared = normalizeTrustInput(
  { licensed: false },
  {
    ...emptyCompanyTrust(),
    licensed: true,
    licenseNumber: "KEEP",
  },
);
assert.equal(cleared.ok, true);
if (cleared.ok) {
  assert.equal(cleared.trust.licensed, false);
  assert.equal(cleared.trust.licenseNumber, null);
}

// Invalid license characters
const badLicense = normalizeTrustInput({
  licensed: true,
  licenseNumber: "bad$chars!",
});
assert.equal(badLicense.ok, false);

// License too long
const longLicense = normalizeTrustInput({
  licensed: true,
  licenseNumber: "x".repeat(TRUST_LIMITS.licenseNumberMaxLen + 1),
});
assert.equal(longLicense.ok, false);

// Years bounds
const yearsHigh = normalizeTrustInput({ yearsInBusiness: 151 });
assert.equal(yearsHigh.ok, false);
const yearsNeg = normalizeTrustInput({ yearsInBusiness: -1 });
assert.equal(yearsNeg.ok, false);
const yearsBlank = normalizeTrustInput({ yearsInBusiness: "" });
assert.equal(yearsBlank.ok, true);
if (yearsBlank.ok) assert.equal(yearsBlank.trust.yearsInBusiness, null);
const yearsNaN = normalizeTrustInput({ yearsInBusiness: "12.5" });
assert.equal(yearsNaN.ok, false);

// Merge preserves unspecified fields
const merged = normalizeTrustInput(
  { insured: true },
  {
    ...emptyCompanyTrust(),
    licensed: true,
    licenseNumber: "X1",
    yearsInBusiness: 5,
  },
);
assert.equal(merged.ok, true);
if (merged.ok) {
  assert.equal(merged.trust.licensed, true);
  assert.equal(merged.trust.licenseNumber, "X1");
  assert.equal(merged.trust.insured, true);
  assert.equal(merged.trust.yearsInBusiness, 5);
}

// --- Badges / summary ---
const badges = trustBadges({
  licensed: true,
  licenseNumber: "L-1",
  insured: true,
  bonded: true,
  familyOwned: false,
  yearsInBusiness: 1,
  updatedAt: null,
});
assert.deepEqual(
  badges.map((b) => b.label),
  ["Licensed", "Insured", "Bonded", "1 year in business"],
);
assert.equal(badges[0].detail, "L-1");

assert.equal(
  formatTrustSummary({
    licensed: true,
    licenseNumber: "L-1",
    insured: true,
    bonded: false,
    familyOwned: true,
    yearsInBusiness: 12,
    updatedAt: null,
  }),
  "Licensed (L-1) · Insured · Family-owned · 12 yrs",
);
assert.equal(formatTrustSummary(emptyCompanyTrust()), null);

assert.equal(
  trustEqual(emptyCompanyTrust(), emptyCompanyTrust()),
  true,
);
assert.equal(
  trustEqual(emptyCompanyTrust(), {
    ...emptyCompanyTrust(),
    insured: true,
  }),
  false,
);

// --- Auth failure path (token format mirrors manage APIs) ---
assert.equal(isValidManageTokenFormat("not-a-token"), false);
assert.equal(isValidManageTokenFormat("a".repeat(64)), true);
assert.equal(isValidManageTokenFormat("g".repeat(64)), false);

console.log("test-company-trust: ok");
