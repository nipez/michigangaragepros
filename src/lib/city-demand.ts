import type { D1Database } from "@cloudflare/workers-types";
import { getCityBySlug } from "@/data/cities";
import {
  LISTING_DEMAND_WINDOW_DAYS,
  MIN_QUOTES_TO_SHOW,
  MIN_VIEWS_TO_SHOW,
} from "@/lib/listing-demand";
import { addUtcDays, utcDay } from "@/lib/listing-stats";

/** Minimum aggregate views before a city appears on the for-companies page. */
export const MIN_CITY_VIEWS_TO_SHOW = MIN_VIEWS_TO_SHOW;

/** Minimum aggregate quotes before a city appears by quote count. */
export const MIN_CITY_QUOTES_TO_SHOW = MIN_QUOTES_TO_SHOW;

export type CityDemandRow = {
  citySlug: string;
  cityName: string;
  profileViews: number;
  quoteRequests: number;
  listingCount: number;
};

export type CityDemandReport = {
  windowDays: number;
  windowStart: string;
  windowEnd: string;
  cities: CityDemandRow[];
};

/**
 * Aggregate 30-day listing demand by city (no homeowner PII).
 * Joins listing_stats_daily + leads → companies.city_slug.
 */
export async function getTopCityDemand(
  db: D1Database,
  options: {
    limit?: number;
    today?: string;
    minViews?: number;
    minQuotes?: number;
  } = {},
): Promise<CityDemandReport> {
  const limit = Math.max(1, Math.min(options.limit ?? 8, 20));
  const today = options.today ?? utcDay();
  const minViews = options.minViews ?? MIN_CITY_VIEWS_TO_SHOW;
  const minQuotes = options.minQuotes ?? MIN_CITY_QUOTES_TO_SHOW;
  const windowEnd = today;
  const windowStart = addUtcDays(windowEnd, -(LISTING_DEMAND_WINDOW_DAYS - 1));

  const viewsPromise = db
    .prepare(
      `SELECT c.city_slug AS city_slug,
              COALESCE(SUM(s.profile_views), 0) AS profile_views,
              COUNT(DISTINCT c.slug) AS listing_count
       FROM listing_stats_daily s
       INNER JOIN companies c ON c.slug = s.company_slug
       WHERE s.day >= ? AND s.day <= ?
       GROUP BY c.city_slug`,
    )
    .bind(windowStart, windowEnd)
    .all<{
      city_slug: string;
      profile_views: number;
      listing_count: number;
    }>();

  const quotesPromise = db
    .prepare(
      `SELECT c.city_slug AS city_slug,
              COUNT(*) AS quote_requests
       FROM leads l
       INNER JOIN companies c ON c.slug = l.company_slug
       WHERE l.company_slug IS NOT NULL
         AND l.company_slug != ''
         AND substr(l.created_at, 1, 10) >= ?
         AND substr(l.created_at, 1, 10) <= ?
       GROUP BY c.city_slug`,
    )
    .bind(windowStart, windowEnd)
    .all<{ city_slug: string; quote_requests: number }>();

  const [viewsResult, quotesResult] = await Promise.all([
    viewsPromise,
    quotesPromise,
  ]);

  const byCity = new Map<
    string,
    { profileViews: number; quoteRequests: number; listingCount: number }
  >();

  for (const row of viewsResult.results ?? []) {
    const slug = (row.city_slug || "").trim();
    if (!slug) continue;
    byCity.set(slug, {
      profileViews: Number(row.profile_views) || 0,
      quoteRequests: 0,
      listingCount: Number(row.listing_count) || 0,
    });
  }

  for (const row of quotesResult.results ?? []) {
    const slug = (row.city_slug || "").trim();
    if (!slug) continue;
    const existing = byCity.get(slug) ?? {
      profileViews: 0,
      quoteRequests: 0,
      listingCount: 0,
    };
    existing.quoteRequests = Number(row.quote_requests) || 0;
    byCity.set(slug, existing);
  }

  const cities: CityDemandRow[] = [];
  for (const [citySlug, stats] of byCity) {
    const showViews = stats.profileViews >= minViews;
    const showQuotes = stats.quoteRequests >= minQuotes;
    if (!showViews && !showQuotes) continue;

    const city = getCityBySlug(citySlug);
    cities.push({
      citySlug,
      cityName: city?.name ?? citySlug.replace(/-/g, " "),
      profileViews: showViews ? stats.profileViews : 0,
      quoteRequests: showQuotes ? stats.quoteRequests : 0,
      listingCount: stats.listingCount,
    });
  }

  cities.sort(
    (a, b) =>
      b.quoteRequests - a.quoteRequests ||
      b.profileViews - a.profileViews ||
      a.cityName.localeCompare(b.cityName),
  );

  return {
    windowDays: LISTING_DEMAND_WINDOW_DAYS,
    windowStart,
    windowEnd,
    cities: cities.slice(0, limit),
  };
}

/** Format a short public demand line for a city row (no zeros, no PII). */
export function formatCityDemandLine(row: CityDemandRow): string {
  const parts: string[] = [];
  if (row.quoteRequests > 0) {
    parts.push(
      `${row.quoteRequests.toLocaleString("en-US")} quote request${row.quoteRequests === 1 ? "" : "s"}`,
    );
  }
  if (row.profileViews > 0) {
    parts.push(
      `${row.profileViews.toLocaleString("en-US")} listing view${row.profileViews === 1 ? "" : "s"}`,
    );
  }
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  return `${parts[0]} · ${parts[1]}`;
}
