"use client";

import { useEffect, useState } from "react";
import type { Company } from "@/data/companies";
import { fairShuffleCompanies } from "@/lib/companyOrder";
import { useCompanyMedia } from "@/hooks/useCompanyMedia";
import { useCompanyReviewSummaries } from "@/hooks/useCompanyReviewSummaries";
import { BeFeaturedCard, CompanyCard } from "./CompanyCard";

type ShuffledCompanyGridProps = {
  companies: Company[];
  cityName?: string;
  quoteHref?: string | ((company: Company) => string);
  className?: string;
};

/**
 * Renders company cards with a fresh random order on each visit.
 * Paid featured listings stay at the front; everyone else rotates fairly.
 *
 * Server and first client paint use the incoming order (hydration-safe),
 * then we shuffle once after mount so each visit gets a fair rotation.
 */
export function ShuffledCompanyGrid({
  companies,
  cityName,
  quoteHref,
  className = "grid grid-cols-1 gap-4 md:grid-cols-2",
}: ShuffledCompanyGridProps) {
  const [ordered, setOrdered] = useState(companies);
  const slugs = companies.map((c) => c.slug);
  const summaries = useCompanyReviewSummaries(slugs);
  const media = useCompanyMedia(slugs);

  useEffect(() => {
    // Intentional: randomize after hydration so SSR HTML matches the first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fair rotation per visit
    setOrdered(fairShuffleCompanies(companies));
  }, [companies]);

  const hasPaidFeatured = ordered.some((c) => c.featured);

  return (
    <div className={className}>
      {!hasPaidFeatured && <BeFeaturedCard cityName={cityName} />}
      {ordered.map((c) => {
        const m = media[c.slug];
        const company =
          m?.logoUrl || m?.photoUrl
            ? {
                ...c,
                logoUrl: m.logoUrl || undefined,
                photoUrl: m.photoUrl || undefined,
              }
            : c;
        return (
          <CompanyCard
            key={c.slug}
            company={company}
            reviewSummary={summaries[c.slug] ?? null}
            quoteHref={
              typeof quoteHref === "function" ? quoteHref(c) : quoteHref
            }
          />
        );
      })}
    </div>
  );
}
