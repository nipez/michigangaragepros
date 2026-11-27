/**
 * Assertions for for-companies claim finder search ranking.
 * Run: npx tsx scripts/test-company-claim-search.mjs
 */
import assert from "node:assert/strict";
import { COMPANIES } from "../src/data/companies.ts";
import { formatCityDemandLine } from "../src/lib/city-demand.ts";
import { searchCompaniesForClaim } from "../src/lib/company-claim-search.ts";

assert.deepEqual(searchCompaniesForClaim(""), []);
assert.deepEqual(searchCompaniesForClaim("", ""), []);

const sample = COMPANIES[0];
assert.ok(sample, "expected seeded companies");

const byName = searchCompaniesForClaim(sample.name.slice(0, 6));
assert.ok(byName.length >= 1, "partial name should match");
assert.ok(
  byName.some((h) => h.slug === sample.slug),
  "expected sample company in results",
);

const cityOnly = sample.city.replace(/,?\s*MI$/i, "").trim();
const byCity = searchCompaniesForClaim("", cityOnly);
assert.ok(byCity.length >= 1, "city-only search should match");
assert.ok(
  byCity.every((h) => h.citySlug === sample.citySlug),
  "city-only results should share citySlug",
);

const exact = searchCompaniesForClaim(sample.name, cityOnly);
assert.equal(exact[0]?.slug, sample.slug);

const nonsense = searchCompaniesForClaim("zzzz-not-a-real-garage-co-999");
assert.equal(nonsense.length, 0);

assert.equal(
  formatCityDemandLine({
    citySlug: "detroit",
    cityName: "Detroit",
    profileViews: 0,
    quoteRequests: 0,
    listingCount: 1,
  }),
  "",
);
assert.match(
  formatCityDemandLine({
    citySlug: "detroit",
    cityName: "Detroit",
    profileViews: 12,
    quoteRequests: 3,
    listingCount: 4,
  }),
  /3 quote requests/,
);

console.log("test-company-claim-search: ok");
