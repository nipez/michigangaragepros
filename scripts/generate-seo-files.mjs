/**
 * Writes public/sitemap.xml + public/robots.txt for Cloudflare static assets.
 * OpenNext can 404 App Router metadata routes on workers.dev; public files are reliable.
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

  const urls = [];
  const push = (path, priority = "0.7", changefreq = "weekly") => {
    urls.push({
      loc: path ? `${SITE_URL}/${path}/` : `${SITE_URL}/`,
      priority,
      changefreq,
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
  for (const r of REGIONS) push(`regions/${r.slug}`, "0.85");
  for (const c of CITIES) push(`cities/${c.slug}`, "0.8");
  for (const c of COMPANIES) push(`companies/${c.slug}`, "0.6");
  for (const p of getAllBlogPosts()) push(`blog/${p.slug}`, "0.75", "monthly");

  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  const robots = `User-Agent: *
Allow: /
Disallow: /api/

Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;

  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(join(root, "public/sitemap.xml"), xml);
  writeFileSync(join(root, "public/robots.txt"), robots);
  console.log(`Wrote public/sitemap.xml (${urls.length} urls) and public/robots.txt`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
