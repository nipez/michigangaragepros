/**
 * Unit checks for IndexNow helpers + a dry-run smoke of payload shape.
 * Run: npm run test:indexnow
 */
import assert from "node:assert/strict";
import {
  parseSitemap,
  diffSitemap,
  chunk,
  buildPayload,
  INDEXNOW,
} from "./indexnow-submit.mjs";

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://michigangaragepros.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://michigangaragepros.com/blog/example/</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
</urlset>
`;

const parsed = parseSitemap(xml);
assert.equal(parsed.length, 2);
assert.deepEqual(parsed[0], {
  loc: "https://michigangaragepros.com/",
  lastmod: "",
});
assert.deepEqual(parsed[1], {
  loc: "https://michigangaragepros.com/blog/example/",
  lastmod: "2026-11-01",
});

assert.deepEqual(
  diffSitemap(parsed, { urls: {} }),
  [
    "https://michigangaragepros.com/",
    "https://michigangaragepros.com/blog/example/",
  ],
);

assert.deepEqual(
  diffSitemap(parsed, {
    urls: {
      "https://michigangaragepros.com/": "",
      "https://michigangaragepros.com/blog/example/": "2026-11-01",
    },
  }),
  [],
);

assert.deepEqual(
  diffSitemap(parsed, {
    urls: {
      "https://michigangaragepros.com/": "",
      "https://michigangaragepros.com/blog/example/": "2026-10-01",
    },
  }),
  ["https://michigangaragepros.com/blog/example/"],
);

assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);

const payload = buildPayload([
  "https://michigangaragepros.com/blog/example/",
]);
assert.equal(payload.host, INDEXNOW.host);
assert.equal(payload.key, INDEXNOW.key);
assert.equal(payload.keyLocation, INDEXNOW.keyLocation);
assert.equal(payload.key.length, 32);
assert.match(payload.key, /^[a-f0-9]{32}$/);
assert.deepEqual(payload.urlList, [
  "https://michigangaragepros.com/blog/example/",
]);

console.log("indexnow helpers: ok");
console.log("dry-run payload sample:");
console.log(JSON.stringify(payload, null, 2));
