"use client";

import type { Company } from "@/data/companies";
import { useCompanyMedia } from "@/hooks/useCompanyMedia";
import { useCompanyReviewSummaries } from "@/hooks/useCompanyReviewSummaries";
import { BeFeaturedCard, CompanyCard } from "./CompanyCard";

type CompanyCardGridProps = {
  companies: Company[];
  cityName?: string;
  quoteHref?: string | ((company: Company) => string);
  className?: string;
  compact?: boolean;
  showBeFeatured?: boolean;
  onQuoteClick?: (company: Company) => void;
};

/**
 * Listing grid that batch-loads live D1 review summaries and company logos.
 * Stars / logos only appear when present; otherwise the card is unchanged.
 */
export function CompanyCardGrid({
  companies,
  cityName,
  quoteHref,
  className = "grid grid-cols-1 gap-4 md:grid-cols-2",
  compact = false,
  showBeFeatured = false,
  onQuoteClick,
}: CompanyCardGridProps) {
  const slugs = companies.map((c) => c.slug);
  const summaries = useCompanyReviewSummaries(slugs);
  const media = useCompanyMedia(slugs);
  const hasPaidFeatured = companies.some((c) => c.featured);

  return (
    <div className={className}>
      {showBeFeatured && !hasPaidFeatured ? (
        <BeFeaturedCard cityName={cityName} />
      ) : null}
      {companies.map((c) => {
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
            compact={compact}
            reviewSummary={summaries[c.slug] ?? null}
            onQuoteClick={onQuoteClick ? () => onQuoteClick(c) : undefined}
            quoteHref={
              typeof quoteHref === "function" ? quoteHref(c) : quoteHref
            }
          />
        );
      })}
    </div>
  );
}
