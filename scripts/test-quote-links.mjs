/**
 * Assertions for contextual /get-a-quote/ href builders + service aliases.
 * Run: npx tsx scripts/test-quote-links.mjs
 */
import assert from "node:assert/strict";
import {
  buildQuoteHref,
  normalizeQuoteService,
  normalizeQuoteSourcePage,
  isQuoteSourcePage,
} from "../src/lib/quote-links.ts";
import { representativeZipForCitySlug } from "../src/data/zipCodes.ts";

assert.equal(normalizeQuoteService("Broken Springs"), "Broken Spring");
assert.equal(normalizeQuoteService("Garage Door Openers"), "Garage Door Opener");
assert.equal(normalizeQuoteService("Garage Door Repair"), "Garage Door Repair");
assert.equal(normalizeQuoteService(""), "");
assert.equal(isQuoteSourcePage("city"), true);
assert.equal(isQuoteSourcePage("nope"), false);
assert.equal(normalizeQuoteSourcePage("CITY_SERVICE"), "city_service");
assert.equal(normalizeQuoteSourcePage("city_service"), "city_service");
assert.equal(normalizeQuoteSourcePage("not-a-source"), "other");
assert.equal(normalizeQuoteSourcePage(""), "other");

assert.equal(representativeZipForCitySlug("detroit"), "48201");
assert.equal(representativeZipForCitySlug("unknown-city"), undefined);

const cityHref = buildQuoteHref({
  city: "detroit",
  cityName: "Detroit",
  source: "city",
});
assert.match(cityHref, /^\/get-a-quote\/\?/);
assert.match(cityHref, /city=detroit/);
assert.match(cityHref, /zip=48201/);
assert.match(cityHref, /src=city/);
assert.match(cityHref, /cityName=Detroit/);

const serviceHref = buildQuoteHref({
  city: "ann-arbor",
  service: "Broken Springs",
  source: "city_service",
});
assert.match(serviceHref, /service=Broken\+Spring/);
assert.match(serviceHref, /src=city_service/);
assert.match(serviceHref, /city=ann-arbor/);

const companyHref = buildQuoteHref({
  company: "acme-doors",
  city: "grand-rapids",
  source: "company",
});
assert.match(companyHref, /company=acme-doors/);
assert.match(companyHref, /src=company/);

const costHref = buildQuoteHref({
  service: "Garage Door Openers",
  source: "cost",
});
assert.match(costHref, /service=Garage\+Door\+Opener/);
assert.match(costHref, /src=cost/);
assert.doesNotMatch(costHref, /city=/);

const zipWins = buildQuoteHref({
  city: "detroit",
  zip: "49503",
  source: "city",
});
assert.match(zipWins, /zip=49503/);
assert.doesNotMatch(zipWins, /zip=48201/);

assert.equal(buildQuoteHref(), "/get-a-quote/");

console.log("test-quote-links: ok");
