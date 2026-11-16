/**
 * Assert every /cities/{city}/{service}/ href templates can emit is routable
 * (priority city + ≥3 pros) and present in generateStaticParams / sitemap set.
 *
 * Run: npm run test:city-service-links
 */
import assert from "node:assert/strict";
import { CITIES } from "../src/data/cities.ts";
import { PRIORITY_CITY_SLUGS } from "../src/data/growth.ts";
import { SERVICES } from "../src/data/services.ts";
import {
  cityServicePath,
  getIndexableCityServicePairs,
  getIndexableServicesForCity,
  getNearbyIndexableCitiesForService,
  getServicesWithProsForCity,
  isCityServiceRoutable,
  isPriorityCitySlug,
} from "../src/lib/indexability.ts";

/** Same set as src/app/cities/[slug]/[service]/page.tsx generateStaticParams. */
const staticParams = new Set();
for (const slug of PRIORITY_CITY_SLUGS) {
  for (const service of SERVICES) {
    staticParams.add(`/cities/${slug}/${service.slug}/`);
  }
}

/** Sitemap / indexable set: priority + pro threshold. */
const routableSet = new Set(
  getIndexableCityServicePairs().map(
    ({ city, service }) => `/cities/${city.slug}/${service.slug}/`,
  ),
);

const emittedCityServiceHrefs = new Set();

function noteCityServiceHref(href, source) {
  if (!href.startsWith("/cities/") || !href.split("/").filter(Boolean)[2]) {
    return; // statewide /{service}/ — not a city×service lander
  }
  emittedCityServiceHrefs.add(href);
  assert.ok(
    staticParams.has(href),
    `${source}: ${href} is not in generateStaticParams`,
  );
  assert.ok(
    routableSet.has(href),
    `${source}: ${href} is not in the routable/sitemap set`,
  );
}

// CityPage service chips
for (const city of CITIES) {
  for (const service of getServicesWithProsForCity(city.slug)) {
    const href = cityServicePath(city.slug, service);
    noteCityServiceHref(href, `CityPage chips (${city.slug})`);
  }
}

// CityServicePage: other services + nearby markets (priority pages only)
for (const slug of PRIORITY_CITY_SLUGS) {
  const city = CITIES.find((c) => c.slug === slug);
  if (!city) continue;
  for (const service of SERVICES) {
    for (const other of getIndexableServicesForCity(city.slug)) {
      if (other.slug === service.slug) continue;
      noteCityServiceHref(
        cityServicePath(city.slug, other),
        `CityServicePage other (${city.slug})`,
      );
    }
    for (const nearby of getNearbyIndexableCitiesForService(city, service, 6)) {
      noteCityServiceHref(
        cityServicePath(nearby.slug, service),
        `CityServicePage nearby (${city.slug} → ${nearby.slug})`,
      );
    }
  }
}

// Cost guides + blog-style indexable pairs
for (const { city, service } of getIndexableCityServicePairs()) {
  noteCityServiceHref(
    cityServicePath(city.slug, service),
    `indexable pair (${city.slug}/${service.slug})`,
  );
}

// Non-priority cities with enough pros must NOT emit city×service landers
let nonPriorityWouldHaveLinked = 0;
for (const city of CITIES) {
  if (isPriorityCitySlug(city.slug)) continue;
  for (const service of getServicesWithProsForCity(city.slug)) {
    nonPriorityWouldHaveLinked++;
    const href = cityServicePath(city.slug, service);
    assert.equal(
      href,
      `/${service.slug}/`,
      `non-priority ${city.slug}/${service.slug} must link statewide, got ${href}`,
    );
    assert.equal(isCityServiceRoutable(city.slug, service), false);
  }
}

assert.ok(
  emittedCityServiceHrefs.size > 0,
  "expected at least one routable city×service link from templates",
);
assert.ok(
  nonPriorityWouldHaveLinked >= 100,
  `expected many non-priority chip fallbacks, got ${nonPriorityWouldHaveLinked}`,
);

// Every emitted link ⊆ routable ⊆ static params
for (const href of emittedCityServiceHrefs) {
  assert.ok(routableSet.has(href));
  assert.ok(staticParams.has(href));
}

console.log(
  `ok: ${emittedCityServiceHrefs.size} template city×service hrefs ⊆ routable (${routableSet.size}) ⊆ staticParams (${staticParams.size}); ${nonPriorityWouldHaveLinked} non-priority chips → statewide`,
);
