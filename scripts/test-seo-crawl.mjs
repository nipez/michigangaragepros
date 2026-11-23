/**
 * SEO crawl expectations: every sitemap URL and every internal link templates
 * emit must resolve to 200 (with the expected robots tag) or an expected 301.
 *
 * Offline (default): classifies paths from shared data / indexability / redirects.
 * Live (optional): set SEO_CRAWL_BASE_URL=https://michigangaragepros.com to HTTP-check.
 *
 * Run: npm run test:seo-crawl
 */
import assert from "node:assert/strict";
import { CITIES } from "../src/data/cities.ts";
import { COMPANIES } from "../src/data/companies.ts";
import { getAllBlogPosts } from "../src/data/blog.ts";
import { COST_GUIDE_SLUGS } from "../src/data/costGuides.ts";
import { PRIORITY_CITY_SLUGS } from "../src/data/growth.ts";
import {
  REGION_LONG_FORM_ALIASES,
  REMOVED_COMPANY_TO_CITY,
} from "../src/data/legacyRedirects.ts";
import { REGIONS } from "../src/data/regions.ts";
import { SERVICES } from "../src/data/services.ts";
import {
  cityServicePath,
  getIndexableCities,
  getIndexableCityServicePairs,
  getIndexableServicesForCity,
  getNearbyIndexableCities,
  getNearbyIndexableCitiesForService,
  getServicesWithProsForCity,
  isCityIndexable,
  isCityServiceIndexable,
  isPriorityCitySlug,
} from "../src/lib/indexability.ts";

/** @typedef {"index" | "noindex,follow" | "noindex,nofollow" | null} RobotsExpect */

/**
 * @typedef {{
 *   path: string,
 *   status: 200 | 301,
 *   location?: string,
 *   robots: RobotsExpect,
 *   source: string,
 * }} Expectation
 */

/** @type {Map<string, Expectation>} */
const expectations = new Map();

function note(expectation) {
  const prev = expectations.get(expectation.path);
  if (prev) {
    assert.equal(
      prev.status,
      expectation.status,
      `conflict on ${expectation.path}: status ${prev.status} (${prev.source}) vs ${expectation.status} (${expectation.source})`,
    );
    if (expectation.status === 301) {
      assert.equal(
        prev.location,
        expectation.location,
        `conflict on ${expectation.path}: location ${prev.location} vs ${expectation.location}`,
      );
    } else {
      assert.equal(
        prev.robots,
        expectation.robots,
        `conflict on ${expectation.path}: robots ${prev.robots} vs ${expectation.robots}`,
      );
    }
    return;
  }
  expectations.set(expectation.path, expectation);
}

function expect200(path, robots, source) {
  note({ path, status: 200, robots, source });
}

function expect301(path, location, source) {
  note({ path, status: 301, location, robots: null, source });
}

// --- Sitemap URLs (mirrors scripts/generate-seo-files.mjs) ---
const sitemapPaths = new Set();
function pushSitemap(path) {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  sitemapPaths.add(normalized);
  expect200(normalized, "index", `sitemap:${normalized}`);
}

pushSitemap("/");
pushSitemap("/pros/");
pushSitemap("/cities/");
pushSitemap("/companies/");
pushSitemap("/blog/");
pushSitemap("/for-companies/");
pushSitemap("/get-a-quote/");
for (const s of SERVICES) pushSitemap(`/${s.slug}/`);
pushSitemap("/cost/");
for (const slug of COST_GUIDE_SLUGS) pushSitemap(`/cost/${slug}/`);
for (const r of REGIONS) pushSitemap(`/regions/${r.slug}/`);
for (const c of getIndexableCities()) pushSitemap(`/cities/${c.slug}/`);
for (const { city, service } of getIndexableCityServicePairs()) {
  pushSitemap(`/cities/${city.slug}/${service.slug}/`);
}
for (const c of COMPANIES) pushSitemap(`/companies/${c.slug}/`);
for (const p of getAllBlogPosts()) pushSitemap(`/blog/${p.slug}/`);
pushSitemap("/about/");
pushSitemap("/contact/");
pushSitemap("/privacy/");
pushSitemap("/terms/");

assert.ok(
  sitemapPaths.size >= 400,
  `expected ~439 sitemap URLs, got ${sitemapPaths.size}`,
);

// --- Region hub + long-form aliases (this PR) ---
expect301("/regions/", "/cities/", "regions-index");
for (const { alias, regionSlug } of REGION_LONG_FORM_ALIASES) {
  assert.ok(
    REGIONS.some((r) => r.slug === regionSlug),
    `alias ${alias} points at unknown region ${regionSlug}`,
  );
  expect301(
    `/regions/${alias}/`,
    `/regions/${regionSlug}/`,
    `region-alias:/regions/${alias}/`,
  );
  expect301(
    `/region/${alias}/`,
    `/regions/${regionSlug}/`,
    `region-alias:/region/${alias}/`,
  );
}

// Canonical short /region/{slug}/ → /regions/{slug}/
for (const region of REGIONS) {
  expect301(
    `/region/${region.slug}/`,
    `/regions/${region.slug}/`,
    `legacy-region:${region.slug}`,
  );
}

// --- Thin city hubs (intentional noindex, not in sitemap) ---
for (const city of CITIES) {
  if (isCityIndexable(city.slug)) continue;
  expect200(`/cities/${city.slug}/`, "noindex,follow", `thin-city:${city.slug}`);
}

// --- Priority city×service thin landers (200 noindex; non-priority → 301) ---
const priority = new Set(PRIORITY_CITY_SLUGS);
for (const city of CITIES) {
  for (const service of SERVICES) {
    const path = `/cities/${city.slug}/${service.slug}/`;
    if (!priority.has(city.slug)) {
      expect301(path, `/cities/${city.slug}/`, `non-priority-cs:${path}`);
      continue;
    }
    if (isCityServiceIndexable(city.slug, service)) {
      // Already covered via sitemap as index.
      expect200(path, "index", `priority-cs-index:${path}`);
    } else {
      expect200(path, "noindex,follow", `priority-cs-thin:${path}`);
    }
  }
}

// --- Internal links templates emit ---
/** @type {Set<string>} */
const internalLinks = new Set([
  "/",
  "/pros/",
  "/cities/",
  "/companies/",
  "/blog/",
  "/cost/",
  "/for-companies/",
  "/get-a-quote/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/",
  ...SERVICES.map((s) => `/${s.slug}/`),
  ...COST_GUIDE_SLUGS.map((s) => `/cost/${s}/`),
  ...REGIONS.map((r) => `/regions/${r.slug}/`),
  ...getAllBlogPosts().map((p) => `/blog/${p.slug}/`),
]);

for (const city of CITIES) {
  // City hubs are linked from company profiles even when thin.
  internalLinks.add(`/cities/${city.slug}/`);
  for (const service of getServicesWithProsForCity(city.slug)) {
    internalLinks.add(cityServicePath(city.slug, service));
  }
  for (const nearby of getNearbyIndexableCities(city, 6)) {
    internalLinks.add(`/cities/${nearby.slug}/`);
  }
}

for (const slug of PRIORITY_CITY_SLUGS) {
  const city = CITIES.find((c) => c.slug === slug);
  if (!city) continue;
  for (const service of SERVICES) {
    for (const other of getIndexableServicesForCity(city.slug)) {
      if (other.slug === service.slug) continue;
      internalLinks.add(cityServicePath(city.slug, other));
    }
    for (const nearby of getNearbyIndexableCitiesForService(city, service, 6)) {
      internalLinks.add(cityServicePath(nearby.slug, service));
    }
  }
}

for (const company of COMPANIES) {
  internalLinks.add(`/companies/${company.slug}/`);
  internalLinks.add(`/cities/${company.citySlug}/`);
}

for (const href of internalLinks) {
  const normalized = href.endsWith("/") || href.includes("?") ? href : `${href}/`;
  const pathOnly = normalized.split("?")[0];
  assert.ok(
    expectations.has(pathOnly),
    `internal link ${pathOnly} has no status/robots expectation`,
  );
}

// --- Removed companies still redirect ---
for (const { slug, citySlug } of REMOVED_COMPANY_TO_CITY) {
  expect301(
    `/companies/${slug}/`,
    `/cities/${citySlug}/`,
    `removed-company:${slug}`,
  );
  expect301(
    `/company/${slug}/`,
    `/cities/${citySlug}/`,
    `removed-company-legacy:${slug}`,
  );
}

// Sanity: no sitemap URL is marked 301 or noindex
for (const path of sitemapPaths) {
  const exp = expectations.get(path);
  assert.ok(exp, `missing expectation for sitemap ${path}`);
  assert.equal(exp.status, 200, `sitemap ${path} must be 200`);
  assert.equal(exp.robots, "index", `sitemap ${path} must be indexable`);
}

// --- Optional live HTTP verification ---
const base = (process.env.SEO_CRAWL_BASE_URL || "").replace(/\/$/, "");
if (base) {
  const CONCURRENCY = 12;
  const entries = [...expectations.values()].filter(
    // Skip removed-company paths that only matter offline if we want speed —
    // still check region aliases + sitemap + a sample of CS redirects.
    (e) =>
      e.source.startsWith("sitemap:") ||
      e.source.startsWith("regions-") ||
      e.source.startsWith("region-alias:") ||
      e.source.startsWith("non-priority-cs:") ||
      e.source.startsWith("priority-cs-") ||
      e.source.startsWith("thin-city:"),
  );

  async function checkOne(exp) {
    const url = `${base}${exp.path}`;
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "MGP-seo-crawl-test/1.0" },
    });
    if (exp.status === 301) {
      assert.equal(
        res.status,
        301,
        `${exp.path}: expected 301, got ${res.status}`,
      );
      const loc = res.headers.get("location") || "";
      const normalized = loc.startsWith("http")
        ? new URL(loc).pathname
        : loc;
      assert.equal(
        normalized.endsWith("/") ? normalized : `${normalized}/`,
        exp.location,
        `${exp.path}: expected Location ${exp.location}, got ${loc}`,
      );
      return;
    }
    assert.equal(
      res.status,
      200,
      `${exp.path}: expected 200, got ${res.status}`,
    );
    const html = await res.text();
    const robots = [];
    for (const re of [
      /<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/gi,
      /<meta\s+content=["']([^"']+)["']\s+name=["']robots["'][^>]*>/gi,
    ]) {
      let m;
      while ((m = re.exec(html))) robots.push(m[1].toLowerCase().replace(/\s+/g, ""));
    }
    const joined = robots.join("|");
    const noindex = /noindex/.test(joined);
    if (exp.robots === "index") {
      assert.equal(
        noindex,
        false,
        `${exp.path}: expected indexable, got robots=${joined || "(none)"}`,
      );
    } else if (exp.robots === "noindex,follow") {
      assert.ok(
        noindex,
        `${exp.path}: expected noindex, got robots=${joined || "(none)"}`,
      );
    }
  }

  let i = 0;
  async function worker() {
    while (i < entries.length) {
      const idx = i++;
      await checkOne(entries[idx]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, entries.length) }, () =>
      worker(),
    ),
  );
  console.log(
    `ok (live ${base}): checked ${entries.length} URLs against expectations`,
  );
}

const counts = { 200: 0, 301: 0, index: 0, noindex: 0 };
for (const e of expectations.values()) {
  counts[e.status]++;
  if (e.robots === "index") counts.index++;
  if (e.robots && e.robots.startsWith("noindex")) counts.noindex++;
}

console.log(
  `ok: ${expectations.size} expectations (${counts[200]}×200, ${counts[301]}×301; robots index=${counts.index} noindex=${counts.noindex}); sitemap=${sitemapPaths.size}; internalLinks=${internalLinks.size}; regionAliases=${REGION_LONG_FORM_ALIASES.length}`,
);
