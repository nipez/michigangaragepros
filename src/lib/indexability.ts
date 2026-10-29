/**
 * Shared index-gating for city and city×service landers.
 * Used by page metadata, page components, and scripts/generate-seo-files.mjs
 * so sitemap inclusion and robots meta cannot drift.
 */
import { CITIES, citySlug, getCityBySlug, type City } from "@/data/cities";
import { getCompaniesForCity, type Company } from "@/data/companies";
import { PRIORITY_CITY_SLUGS } from "@/data/growth";
import {
  SERVICES,
  companyOffersService,
  getServiceBySlug,
  type Service,
} from "@/data/services";

/** Minimum real directory pros required before a lander is indexable. */
export const INDEX_PRO_THRESHOLD = 3;

function resolveService(service: Service | string): Service | undefined {
  return typeof service === "string" ? getServiceBySlug(service) : service;
}

/** Companies the city page actually renders. */
export function getProsForCity(citySlugParam: string): Company[] {
  return getCompaniesForCity(citySlugParam);
}

/** Companies the city×service page actually renders. */
export function getProsForCityService(
  citySlugParam: string,
  service: Service | string,
): Company[] {
  const resolved = resolveService(service);
  if (!resolved) return [];
  return getCompaniesForCity(citySlugParam).filter((c) =>
    companyOffersService(c, resolved),
  );
}

export function countProsForCity(citySlugParam: string): number {
  return getProsForCity(citySlugParam).length;
}

export function countProsForCityService(
  citySlugParam: string,
  service: Service | string,
): number {
  return getProsForCityService(citySlugParam, service).length;
}

export function isCityIndexable(citySlugParam: string): boolean {
  return countProsForCity(citySlugParam) >= INDEX_PRO_THRESHOLD;
}

export function isCityServiceIndexable(
  citySlugParam: string,
  service: Service | string,
): boolean {
  return (
    countProsForCityService(citySlugParam, service) >= INDEX_PRO_THRESHOLD
  );
}

export function getIndexableCities(): City[] {
  return CITIES.filter((c) => isCityIndexable(c.slug));
}

/** Priority city×service pairs that meet the pro threshold. */
export function getIndexableCityServicePairs(): {
  city: City;
  service: Service;
}[] {
  const pairs: { city: City; service: Service }[] = [];
  for (const slug of PRIORITY_CITY_SLUGS) {
    const city = getCityBySlug(slug);
    if (!city) continue;
    for (const service of SERVICES) {
      if (isCityServiceIndexable(slug, service)) {
        pairs.push({ city, service });
      }
    }
  }
  return pairs;
}

/**
 * Nearby indexable cities for the same service (hub-and-spoke).
 * Prefers cities named in `city.nearby`, then same-region indexable cities.
 */
export function getNearbyIndexableCitiesForService(
  city: City,
  service: Service | string,
  limit = 6,
): City[] {
  const seen = new Set<string>([city.slug]);
  const out: City[] = [];

  const tryAdd = (candidate: City | undefined) => {
    if (!candidate || seen.has(candidate.slug)) return;
    if (!isCityServiceIndexable(candidate.slug, service)) return;
    seen.add(candidate.slug);
    out.push(candidate);
  };

  for (const name of city.nearby) {
    if (out.length >= limit) break;
    tryAdd(getCityBySlug(citySlug(name)));
  }

  if (out.length < limit && city.region) {
    const sameRegion = CITIES.filter(
      (c) => c.region === city.region && c.slug !== city.slug,
    ).sort((a, b) => a.name.localeCompare(b.name));
    for (const candidate of sameRegion) {
      if (out.length >= limit) break;
      tryAdd(candidate);
    }
  }

  return out.slice(0, limit);
}

/** Nearby indexable city hubs (any service), for city hub “Nearby” links. */
export function getNearbyIndexableCities(city: City, limit = 6): City[] {
  const seen = new Set<string>([city.slug]);
  const out: City[] = [];

  const tryAdd = (candidate: City | undefined) => {
    if (!candidate || seen.has(candidate.slug)) return;
    if (!isCityIndexable(candidate.slug)) return;
    seen.add(candidate.slug);
    out.push(candidate);
  };

  for (const name of city.nearby) {
    if (out.length >= limit) break;
    tryAdd(getCityBySlug(citySlug(name)));
  }

  if (out.length < limit && city.region) {
    const sameRegion = CITIES.filter(
      (c) => c.region === city.region && c.slug !== city.slug,
    ).sort((a, b) => a.name.localeCompare(b.name));
    for (const candidate of sameRegion) {
      if (out.length >= limit) break;
      tryAdd(candidate);
    }
  }

  return out.slice(0, limit);
}

export function getIndexableServicesForCity(citySlugParam: string): Service[] {
  return SERVICES.filter((s) => isCityServiceIndexable(citySlugParam, s));
}

/** Counts for reporting / SEO scripts. */
export function getIndexabilityStats() {
  const citiesIndexable = CITIES.filter((c) => isCityIndexable(c.slug)).length;
  const citiesNoindex = CITIES.length - citiesIndexable;
  const pairs = getIndexableCityServicePairs();
  const serviceTotal = PRIORITY_CITY_SLUGS.length * SERVICES.length;
  return {
    threshold: INDEX_PRO_THRESHOLD,
    citiesTotal: CITIES.length,
    citiesIndexable,
    citiesNoindex,
    cityServiceTotal: serviceTotal,
    cityServiceIndexable: pairs.length,
    cityServiceNoindex: serviceTotal - pairs.length,
  };
}
