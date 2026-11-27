import { COMPANIES, type Company } from "@/data/companies";

export type CompanyClaimSearchHit = {
  slug: string;
  name: string;
  city: string;
  citySlug: string;
};

const MAX_RESULTS = 12;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cityLabel(company: Company): string {
  return company.city.replace(/,?\s*MI$/i, "").trim();
}

function toHit(company: Company): CompanyClaimSearchHit {
  return {
    slug: company.slug,
    name: company.name,
    city: cityLabel(company),
    citySlug: company.citySlug,
  };
}

/**
 * Rank companies for the for-companies claim finder (name + optional city).
 * Pure helper — safe for API + unit tests. Does not expose claimed status;
 * the claim form / status API handle that after selection.
 */
export function searchCompaniesForClaim(
  query: string,
  cityQuery = "",
  limit = MAX_RESULTS,
): CompanyClaimSearchHit[] {
  const q = normalize(query);
  const cityQ = normalize(cityQuery);
  if (!q && !cityQ) return [];

  const scored: Array<{ hit: CompanyClaimSearchHit; score: number }> = [];

  for (const company of COMPANIES) {
    const name = normalize(company.name);
    const city = normalize(cityLabel(company));
    const citySlug = normalize(company.citySlug.replace(/-/g, " "));

    let score = 0;

    if (q) {
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 70;
      else if (name.includes(q)) score += 40;
      else if (q.split(" ").every((part) => part && name.includes(part))) {
        score += 25;
      } else {
        continue;
      }
    }

    if (cityQ) {
      const cityMatch =
        city.includes(cityQ) ||
        citySlug.includes(cityQ) ||
        cityQ.includes(city) ||
        cityQ.includes(citySlug);
      if (!cityMatch) continue;
      score += 15;
      if (city === cityQ || citySlug === cityQ) score += 10;
    }

    scored.push({ hit: toHit(company), score });
  }

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      a.hit.name.localeCompare(b.hit.name) ||
      a.hit.city.localeCompare(b.hit.city),
  );

  return scored.slice(0, Math.max(1, Math.min(limit, 25))).map((s) => s.hit);
}
