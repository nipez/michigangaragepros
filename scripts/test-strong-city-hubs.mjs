/**
 * Asserts strong city-hub SEO packages for priority GSC markets.
 * Run: npm run test:strong-city-hubs
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Load via tsx by re-invoking through dynamic import of compiled paths.
const { CITY_SEO } = await import("../src/data/growth.ts");
const { getCityBySlug } = await import("../src/data/cities.ts");
const { isCityIndexable, countProsForCity } = await import(
  "../src/lib/indexability.ts"
);
const { buildCityFaqs } = await import("../src/lib/localPageContent.ts");
const { plainTextFromLinkedMarkdown } = await import("../src/lib/seo.ts");

const STRONG_HUBS = [
  "grand-rapids",
  "sterling-heights",
  "warren",
  "novi",
  "troy",
];

for (const slug of STRONG_HUBS) {
  assert.equal(
    isCityIndexable(slug),
    true,
    `${slug} must stay indexable (≥3 pros)`,
  );
  assert.ok(
    countProsForCity(slug) >= 3,
    `${slug} should have ≥3 directory pros`,
  );

  const seo = CITY_SEO[slug];
  assert.ok(seo, `${slug} missing CITY_SEO entry`);
  assert.ok(seo.title?.length > 20, `${slug} needs a CTR title`);
  assert.ok(seo.description?.length > 80, `${slug} needs a meta description`);
  assert.ok(seo.h1?.length > 10, `${slug} needs an H1`);
  assert.ok(seo.intro?.length > 200, `${slug} intro should be substantial`);
  assert.ok(
    Array.isArray(seo.localSections) && seo.localSections.length >= 3,
    `${slug} needs ≥3 localSections (neighborhoods, climate, costs)`,
  );
  for (const section of seo.localSections) {
    assert.ok(section.heading, `${slug} section missing heading`);
    assert.ok(
      section.paragraphs?.length >= 1,
      `${slug} section "${section.heading}" needs paragraphs`,
    );
  }
  assert.ok(
    seo.faqs?.length >= 5 && seo.faqs.length <= 8,
    `${slug} needs 5–8 FAQs (got ${seo.faqs?.length ?? 0})`,
  );

  const city = getCityBySlug(slug);
  assert.ok(city, `${slug} missing from CITIES`);
  const faqs = buildCityFaqs(city, countProsForCity(slug));
  assert.ok(
    faqs.length >= 5 && faqs.length <= 8,
    `buildCityFaqs(${slug}) should return 5–8 (got ${faqs.length})`,
  );
}

assert.equal(
  plainTextFromLinkedMarkdown("See [Warren](/cities/warren/) pros."),
  "See Warren pros.",
);

// Ensure commercial guide still deep-links the strong hubs.
const { getBlogPost } = await import("../src/data/blog.ts");
const commercial = getBlogPost("commercial-garage-door-repair-michigan");
assert.ok(commercial, "commercial blog post missing");
const body = commercial.sections
  .flatMap((s) => s.paragraphs)
  .join("\n");
for (const slug of STRONG_HUBS) {
  assert.match(
    body,
    new RegExp(`/cities/${slug}/`),
    `commercial post should link /cities/${slug}/`,
  );
}

console.log(
  `ok — strong hubs: ${STRONG_HUBS.join(", ")} (${STRONG_HUBS.length} cities)`,
);

// Silence unused require in environments that tree-shake differently.
void require;
