/**
 * Legacy / removed URL maps for 301 redirects (GSC cleanup).
 * Keep this data-only so next.config and middleware can share it.
 */

/** Seed companies from migration 0002 wiped by 0003 reseed — no 1:1 replacements. */
export const REMOVED_COMPANY_TO_CITY: ReadonlyArray<{
  slug: string;
  citySlug: string;
}> = [
  { slug: "lakeside-garage-door-service", citySlug: "grand-rapids" },
  { slug: "great-lakes-garage-doors", citySlug: "lansing" },
  { slug: "north-shore-garage-door-co", citySlug: "traverse-city" },
  { slug: "motor-city-garage-door-service", citySlug: "detroit" },
  { slug: "river-city-door-works", citySlug: "grand-rapids" },
  { slug: "west-michigan-overhead-door", citySlug: "grand-rapids" },
];

/**
 * Top-level App Router segments that must never be treated as bare city slugs.
 * Keep in sync with directories under src/app/.
 */
export const RESERVED_TOP_LEVEL_SEGMENTS: ReadonlySet<string> = new Set([
  "about",
  "admin",
  "api",
  "blog",
  "broken-springs",
  "cities",
  "city",
  "companies",
  "company",
  "contact",
  "emergency-service",
  "for-companies",
  "garage-door-installation",
  "garage-door-openers",
  "garage-door-repair",
  "get-a-quote",
  "maintenance",
  "manage",
  "privacy",
  "pros",
  "region",
  "regions",
  "search",
  "terms",
]);
