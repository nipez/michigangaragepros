import { CITIES, citySlug, getCityBySlug, type City } from "@/data/cities";
import {
  getCompaniesForCity,
  type Company,
} from "@/data/companies";
import {
  ZIP3_TO_CITY_SLUG,
  ZIP_TO_CITY_SLUG,
  normalizeZip,
} from "@/data/zipCodes";

export type LocationMatch = {
  query: string;
  zip: string | null;
  city: City | null;
  /** Exact ZIP hit, ZIP3 fallback, city-name match, or none. */
  matchType: "zip" | "zip-prefix" | "city" | "none";
  companies: Company[];
};

function matchCityByName(raw: string): City | undefined {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return undefined;

  const asSlug = citySlug(trimmed);
  const bySlug = getCityBySlug(asSlug);
  if (bySlug) return bySlug;

  const withoutState = trimmed.replace(/,?\s*mi(chigan)?\.?$/i, "").trim();
  const bySlugNoState = getCityBySlug(citySlug(withoutState));
  if (bySlugNoState) return bySlugNoState;

  return CITIES.find(
    (c) =>
      c.name.toLowerCase() === withoutState ||
      c.name.toLowerCase().startsWith(withoutState) ||
      withoutState.startsWith(c.name.toLowerCase()),
  );
}

function serviceMatches(company: Company, service: string): boolean {
  const needle = service.trim().toLowerCase();
  if (!needle || needle === "other") return true;

  const haystack = [...company.tags, ...company.services]
    .join(" ")
    .toLowerCase();

  if (needle.includes("spring")) return haystack.includes("spring");
  if (needle.includes("opener")) return haystack.includes("opener");
  if (needle.includes("install")) return haystack.includes("install");
  if (needle.includes("maintenance")) {
    return haystack.includes("maintenance") || haystack.includes("tune");
  }
  if (needle.includes("emergency")) {
    return company.emergency === true || haystack.includes("emergency");
  }
  if (needle.includes("repair")) return haystack.includes("repair");
  return haystack.includes(needle);
}

function filterByService(companies: Company[], service: string): Company[] {
  if (!service.trim()) return companies;
  const filtered = companies.filter((c) => serviceMatches(c, service));
  return filtered.length > 0 ? filtered : companies;
}

/** Resolve a ZIP or city name to local directory companies. */
export function findLocalPros(query: string, service = ""): LocationMatch {
  const trimmed = query.trim();
  const empty: LocationMatch = {
    query: trimmed,
    zip: null,
    city: null,
    matchType: "none",
    companies: [],
  };
  if (!trimmed) return empty;

  const zip = normalizeZip(trimmed);
  if (zip) {
    const fromExact = ZIP_TO_CITY_SLUG[zip];
    const fromPrefix = ZIP3_TO_CITY_SLUG[zip.slice(0, 3)];
    const slug = fromExact ?? fromPrefix;
    const city = slug ? (getCityBySlug(slug) ?? null) : null;
    return {
      query: trimmed,
      zip,
      city,
      matchType: fromExact ? "zip" : fromPrefix ? "zip-prefix" : "none",
      companies: filterByService(
        city ? getCompaniesForCity(city.slug) : [],
        service,
      ),
    };
  }

  const city = matchCityByName(trimmed) ?? null;
  if (!city) return { ...empty, query: trimmed };

  return {
    query: trimmed,
    zip: null,
    city,
    matchType: "city",
    companies: filterByService(getCompaniesForCity(city.slug), service),
  };
}
