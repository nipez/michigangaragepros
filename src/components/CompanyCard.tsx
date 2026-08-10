import Link from "next/link";
import type { Company } from "@/data/companies";
import { BoltIcon } from "./Icons";

type CompanyCardProps = {
  company: Company;
  onQuoteClick?: () => void;
  quoteHref?: string;
  compact?: boolean;
};

export function CompanyCard({
  company,
  onQuoteClick,
  quoteHref = "/get-a-quote/",
  compact = false,
}: CompanyCardProps) {
  const quote = onQuoteClick ? (
    <button
      type="button"
      onClick={onQuoteClick}
      className={
        company.featured
          ? "btn-primary flex-1 !py-2.5"
          : "flex-1 rounded-[10px] border-[1.5px] border-border bg-bg py-2.5 text-sm font-bold text-navy transition-colors hover:bg-icon-tile"
      }
    >
      Get Quote
    </button>
  ) : (
    <Link
      href={quoteHref}
      className={
        company.featured
          ? "btn-primary flex-1 !py-2.5 text-center"
          : "flex-1 rounded-[10px] border-[1.5px] border-border bg-bg py-2.5 text-center text-sm font-bold text-navy transition-colors hover:bg-icon-tile hover:text-navy"
      }
    >
      Get Quote
    </Link>
  );

  return (
    <div className={`company-card h-full ${company.featured ? "is-featured" : ""}`}>
      {company.featured ? (
        <div className="mb-3.5 flex items-center gap-2">
          <span className="featured-badge">Featured Pro</span>
          <span className="text-[11px] font-semibold text-faint">Sponsored</span>
        </div>
      ) : null}
      <div className="mb-1.5 text-[17px] font-extrabold text-navy">
        {company.name}
      </div>
      <div className="mb-1 text-[13.5px] text-muted">{company.city}</div>
      {company.phone ? (
        <div className="mb-3.5 text-[13px] font-semibold text-navy">
          {company.phone}
        </div>
      ) : (
        <div className="mb-3.5" />
      )}
      {!compact && company.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-[7px]">
          {company.tags.map((t) => (
            <span key={t} className="tag-pill">
              {t}
            </span>
          ))}
        </div>
      )}
      {company.emergency && !compact && (
        <div className="mb-[18px] inline-flex items-center gap-1.5 text-[12.5px] font-bold text-success">
          <BoltIcon />
          Emergency service
        </div>
      )}
      {compact && <div className="mb-4" />}
      <div className="mt-auto flex gap-2.5">
        <Link
          href={`/companies/${company.slug}/`}
          className="btn-outline flex-1 !py-2.5 text-center"
        >
          View Profile
        </Link>
        {quote}
      </div>
    </div>
  );
}

/** CTA slot for unpaid featured placement — shown at the top of listing grids. */
export function BeFeaturedCard({
  cityName,
}: {
  cityName?: string;
}) {
  return (
    <Link
      href="/for-companies/#featured"
      className="company-card be-featured-card group h-full no-underline hover:text-inherit"
    >
      <div className="mb-3.5">
        <span className="featured-badge">Be Featured</span>
      </div>
      <div className="mb-2 text-[17px] font-extrabold text-navy">
        {cityName
          ? `Stand out in ${cityName}`
          : "Get top placement"}
      </div>
      <p className="mb-5 m-0 flex-1 text-[14px] leading-[1.55] text-muted text-pretty">
        Put your company first in local results with a clearly labeled Featured
        Pro card — free profiles stay free.
      </p>
      <span className="btn-primary mt-auto inline-flex w-full items-center justify-center !py-2.5 group-hover:bg-cta-hover">
        Learn about Featured →
      </span>
    </Link>
  );
}

export function CompanyRow({
  company,
  quoteHref = "/get-a-quote/",
}: {
  company: Company;
  quoteHref?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-white p-6 ${
        company.featured
          ? "border-[1.5px] border-bright-blue shadow-[0_10px_30px_rgba(47,128,237,0.10)]"
          : "border border-border"
      }`}
    >
      <div className="min-w-[260px] flex-1">
        {company.featured && (
          <div className="mb-2.5 flex items-center gap-2">
            <span className="featured-badge">Featured Pro</span>
            <span className="text-[11px] font-semibold text-faint">Sponsored</span>
          </div>
        )}
        <div className="mb-1.5 text-lg font-extrabold text-navy">{company.name}</div>
        <div className="mb-2 text-sm text-muted">{company.city}</div>
        <div className="flex flex-wrap gap-[7px]">
          {company.tags.map((t) => (
            <span key={t} className="tag-pill">
              {t}
            </span>
          ))}
          {company.emergency && (
            <span className="rounded-full border border-[#CBE5D6] bg-success-bg px-2.5 py-1 text-xs font-bold text-success">
              Emergency
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-2.5">
        <Link
          href={`/companies/${company.slug}/`}
          className="btn-outline !px-5 !py-[11px]"
        >
          View Profile
        </Link>
        <Link
          href={quoteHref}
          className={
            company.featured
              ? "btn-primary !px-5 !py-[11px]"
              : "rounded-[10px] border-[1.5px] border-border bg-bg px-5 py-[11px] text-sm font-bold text-navy transition-colors hover:bg-icon-tile hover:text-navy"
          }
        >
          Get Quote
        </Link>
      </div>
    </div>
  );
}
