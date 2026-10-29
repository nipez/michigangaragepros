/**
 * Writes public/sitemap.xml + public/robots.txt for Cloudflare static assets.
 * OpenNext can 404 App Router metadata routes on workers.dev; public files are reliable.
 *
 * City and city×service URLs are included only when indexable (shared threshold in
 * src/lib/indexability.ts) so sitemap and robots meta cannot drift.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function loadTs(relPath) {
  // Prefer tsx register when available during npm scripts.
  try {
    const mod = await import(pathToFileURL(join(root, relPath)).href);
    return mod;
  } catch {
    // Fallback: dynamic import via tsx CLI is expected; rethrow with hint.
    throw new Error(`Unable to import ${relPath}. Run via: npx tsx scripts/generate-seo-files.mjs`);
  }
}

const SITE_URL = "https://michigangaragepros.com";

async function main() {
  const { CITIES } = await loadTs("src/data/cities.ts");
  const { COMPANIES } = await loadTs("src/data/companies.ts");
  const { REGIONS } = await loadTs("src/data/regions.ts");
  const { SERVICES } = await loadTs("src/data/services.ts");
  const { getAllBlogPosts } = await loadTs("src/data/blog.ts");
  const { COST_GUIDE_SLUGS } = await loadTs("src/data/costGuides.ts");
  const {
    isCityIndexable,
    isCityServiceIndexable,
    getIndexabilityStats,
    INDEX_PRO_THRESHOLD,
  } = await loadTs("src/lib/indexability.ts");

  const urls = [];
  const push = (path, priority = "0.7", changefreq = "weekly", lastmod = null) => {
    urls.push({
      loc: path ? `${SITE_URL}/${path}/` : `${SITE_URL}/`,
      priority,
      changefreq,
      lastmod,
    });
  };

  push("", "1.0", "daily");
  push("pros", "0.9", "daily");
  push("cities", "0.9");
  push("companies", "0.8");
  push("blog", "0.8");
  push("for-companies", "0.7");
  push("get-a-quote", "0.6");
  for (const s of SERVICES) push(s.slug, "0.8");
  for (const slug of COST_GUIDE_SLUGS) push(`cost/${slug}`, "0.75");
  for (const r of REGIONS) push(`regions/${r.slug}`, "0.85");

  let citiesInSitemap = 0;
  let citiesSkipped = 0;
  for (const c of CITIES) {
    if (isCityIndexable(c.slug)) {
      push(`cities/${c.slug}`, "0.8");
      citiesInSitemap++;
    } else {
      citiesSkipped++;
    }
  }

  // Priority city × service landers only (not 122 × N), and only when indexable.
  const { PRIORITY_CITY_SLUGS } = await loadTs("src/data/growth.ts");
  let cityServiceInSitemap = 0;
  let cityServiceSkipped = 0;
  for (const citySlug of PRIORITY_CITY_SLUGS) {
    for (const s of SERVICES) {
      if (isCityServiceIndexable(citySlug, s)) {
        push(`cities/${citySlug}/${s.slug}`, "0.75");
        cityServiceInSitemap++;
      } else {
        cityServiceSkipped++;
      }
    }
  }

  for (const c of COMPANIES) push(`companies/${c.slug}`, "0.6");
  // Blog posts use stable content dates for lastmod (not build time).
  for (const p of getAllBlogPosts()) {
    push(`blog/${p.slug}`, "0.75", "monthly", p.date);
  }
  push("about", "0.5", "monthly");
  push("contact", "0.5", "monthly");
  push("privacy", "0.3", "yearly");
  push("terms", "0.3", "yearly");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => {
    const lastmodLine = u.lastmod
      ? `\n    <lastmod>${u.lastmod}</lastmod>`
      : "";
    return `  <url>
    <loc>${u.loc}</loc>${lastmodLine}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

  // Keep robots Disallow list aligned with PR #39; PR #40 may add /review/ separately.
  const robots = `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /manage/
Disallow: /admin/

Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;

  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(join(root, "public/sitemap.xml"), xml);
  writeFileSync(join(root, "public/robots.txt"), robots);

  const stats = getIndexabilityStats();
  console.log(
    `Wrote public/sitemap.xml (${urls.length} urls) and public/robots.txt`,
  );
  console.log(
    `Index gating (threshold=${INDEX_PRO_THRESHOLD}): cities sitemap ${citiesInSitemap} in / ${citiesSkipped} excluded; city×service ${cityServiceInSitemap} in / ${cityServiceSkipped} excluded`,
  );
  console.log(
    `Stats: cities indexable ${stats.citiesIndexable}/${stats.citiesTotal}, city×service indexable ${stats.cityServiceIndexable}/${stats.cityServiceTotal}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
