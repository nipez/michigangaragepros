"use client";

import type { Company } from "@/data/companies";
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
 * Listing grid that batch-loads live D1 review summaries and only shows
 * stars when a company has real visible reviews.
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
  const summaries = useCompanyReviewSummaries(companies.map((c) => c.slug));
  const hasPaidFeatured = companies.some((c) => c.featured);

  return (
    <div className={className}>
      {showBeFeatured && !hasPaidFeatured ? (
        <BeFeaturedCard cityName={cityName} />
      ) : null}
      {companies.map((c) => (
        <CompanyCard
          key={c.slug}
          company={c}
          compact={compact}
          reviewSummary={summaries[c.slug] ?? null}
          onQuoteClick={onQuoteClick ? () => onQuoteClick(c) : undefined}
          quoteHref={
            typeof quoteHref === "function" ? quoteHref(c) : quoteHref
          }
        />
      ))}
    </div>
  );
}
