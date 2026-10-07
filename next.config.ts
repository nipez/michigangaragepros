import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { CITIES } from "./src/data/cities";
import { COMPANIES } from "./src/data/companies";
import {
  REMOVED_COMPANY_TO_CITY,
  RESERVED_TOP_LEVEL_SEGMENTS,
} from "./src/data/legacyRedirects";
import { REGIONS } from "./src/data/regions";

initOpenNextCloudflareForDev();

/**
 * Legacy URL shapes → current trailing-slash paths (301).
 * Query strings are preserved by Next.js redirects.
 */
async function legacyRedirects() {
  const redirects: {
    source: string;
    destination: string;
    permanent: boolean;
  }[] = [];

  // /city/{slug}/ → /cities/{slug}/ when known; unknown → /cities/
  for (const city of CITIES) {
    redirects.push({
      source: `/city/${city.slug}`,
      destination: `/cities/${city.slug}/`,
      permanent: true,
    });
  }
  redirects.push({
    source: "/city/:slug",
    destination: "/cities/",
    permanent: true,
  });

  // /company/{slug}/ → /companies/{slug}/ when known
  for (const company of COMPANIES) {
    redirects.push({
      source: `/company/${company.slug}`,
      destination: `/companies/${company.slug}/`,
      permanent: true,
    });
  }

  // /region/{slug}/ → /regions/{slug}/ when known
  for (const region of REGIONS) {
    redirects.push({
      source: `/region/${region.slug}`,
      destination: `/regions/${region.slug}/`,
      permanent: true,
    });
  }

  // Bare /{city-slug}/ → /cities/{slug}/ when known and not a real route
  for (const city of CITIES) {
    if (RESERVED_TOP_LEVEL_SEGMENTS.has(city.slug)) continue;
    redirects.push({
      source: `/${city.slug}`,
      destination: `/cities/${city.slug}/`,
      permanent: true,
    });
  }

  // /search/ → /pros/ (current directory search / Find a Pro surface)
  redirects.push({
    source: "/search",
    destination: "/pros/",
    permanent: true,
  });

  // Removed seed companies (0002 → 0003) → their city pages
  for (const { slug, citySlug } of REMOVED_COMPANY_TO_CITY) {
    redirects.push({
      source: `/companies/${slug}`,
      destination: `/cities/${citySlug}/`,
      permanent: true,
    });
    redirects.push({
      source: `/company/${slug}`,
      destination: `/cities/${citySlug}/`,
      permanent: true,
    });
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
