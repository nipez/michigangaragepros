import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { CITIES } from "./src/data/cities";
import { COMPANIES } from "./src/data/companies";
import { PRIORITY_CITY_SLUGS } from "./src/data/growth";
import {
  REGION_LONG_FORM_ALIASES,
  REMOVED_COMPANY_TO_CITY,
  RESERVED_TOP_LEVEL_SEGMENTS,
} from "./src/data/legacyRedirects";
import { REGIONS } from "./src/data/regions";
import { SERVICES } from "./src/data/services";

initOpenNextCloudflareForDev();

/**
 * Legacy URL shapes → current trailing-slash paths (301).
 * Query strings are preserved by Next.js redirects.
 */
async function legacyRedirects() {
  // statusCode 301 (not permanent:true/308) — GSC cleanup expects classic 301s.
  const redirects: {
    source: string;
    destination: string;
    statusCode: 301;
  }[] = [];

  // /city/{slug}/ → /cities/{slug}/ when known; unknown → /cities/
  for (const city of CITIES) {
    redirects.push({
      source: `/city/${city.slug}`,
      destination: `/cities/${city.slug}/`,
      statusCode: 301,
    });
  }
  redirects.push({
    source: "/city/:slug",
    destination: "/cities/",
    statusCode: 301,
  });

  // /company/{slug}/ → /companies/{slug}/ when known
  for (const company of COMPANIES) {
    redirects.push({
      source: `/company/${company.slug}`,
      destination: `/companies/${company.slug}/`,
      statusCode: 301,
    });
  }

  // /region/{slug}/ → /regions/{slug}/ when known
  for (const region of REGIONS) {
    redirects.push({
      source: `/region/${region.slug}`,
      destination: `/regions/${region.slug}/`,
      statusCode: 301,
    });
  }

  // No /regions/ index — send browsers and crawlers to the cities hub.
  redirects.push({
    source: "/regions",
    destination: "/cities/",
    statusCode: 301,
  });

  // Long-form region aliases → canonical short REGIONS.slug
  // (both /regions/{alias}/ and legacy /region/{alias}/).
  for (const { alias, regionSlug } of REGION_LONG_FORM_ALIASES) {
    redirects.push({
      source: `/regions/${alias}`,
      destination: `/regions/${regionSlug}/`,
      statusCode: 301,
    });
    redirects.push({
      source: `/region/${alias}`,
      destination: `/regions/${regionSlug}/`,
      statusCode: 301,
    });
  }

  // Bare /{city-slug}/ → /cities/{slug}/ when known and not a real route
  for (const city of CITIES) {
    if (RESERVED_TOP_LEVEL_SEGMENTS.has(city.slug)) continue;
    redirects.push({
      source: `/${city.slug}`,
      destination: `/cities/${city.slug}/`,
      statusCode: 301,
    });
  }

  // /search/ → /pros/ (current directory search / Find a Pro surface)
  redirects.push({
    source: "/search",
    destination: "/pros/",
    statusCode: 301,
  });

  // Removed seed companies (0002 → 0003) → their city pages
  for (const { slug, citySlug } of REMOVED_COMPANY_TO_CITY) {
    redirects.push({
      source: `/companies/${slug}`,
      destination: `/cities/${citySlug}/`,
      statusCode: 301,
    });
    redirects.push({
      source: `/company/${slug}`,
      destination: `/cities/${citySlug}/`,
      statusCode: 301,
    });
  }

  // Non-priority /cities/{city}/{service}/ → city hub (301).
  // Derived from PRIORITY_CITY_SLUGS so priority city×service stays 200.
  const priority = new Set<string>(PRIORITY_CITY_SLUGS);
  for (const city of CITIES) {
    if (priority.has(city.slug)) continue;
    for (const service of SERVICES) {
      redirects.push({
        source: `/cities/${city.slug}/${service.slug}`,
        destination: `/cities/${city.slug}/`,
        statusCode: 301,
      });
    }
  }

  return redirects;
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Avoid regenerating AGENTS.md / CLAUDE.md on every `next dev`
  agentRules: false,
  redirects: legacyRedirects,
};

export default nextConfig;
