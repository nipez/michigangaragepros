import type { Company } from "@/data/companies";

/** Fisher–Yates shuffle. Featured listings stay pinned first. */
export function fairShuffleCompanies(companies: Company[]): Company[] {
  const featured = companies.filter((c) => c.featured);
  const organic = companies.filter((c) => !c.featured);
  for (let i = organic.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = organic[i]!;
    organic[i] = organic[j]!;
    organic[j] = tmp;
  }
  return [...featured, ...organic];
}
