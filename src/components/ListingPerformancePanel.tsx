"use client";

import Link from "next/link";
import {
  LISTING_STAT_LABELS,
  LISTING_STAT_METRICS,
  percentChange,
  type ListingPerformance,
  type ListingStatMetric,
} from "@/lib/listing-stats";
import { FeaturedInterestForm } from "./FeaturedInterestForm";

type Props = {
  performance: ListingPerformance;
  featured: boolean;
  companyName: string;
  companySlug: string;
  companyCity?: string;
  /** Compact admin / manage chrome differences */
  variant?: "manage" | "admin";
  showUpsell?: boolean;
};

function MetricSparkline({
  values,
  label,
}: {
  values: number[];
  label: string;
}) {
  const width = 96;
  const height = 28;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - (v / max) * (height - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0 text-michigan-blue"
      aria-hidden="true"
      role="img"
    >
      <title>{label} 30-day trend</title>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
        opacity={0.85}
      />
    </svg>
  );
}

function Delta({ current, previous }: { current: number; previous: number }) {
  const pct = percentChange(current, previous);
  if (previous === 0 && current === 0) {
    return <span className="text-faint">vs prior 30d: —</span>;
  }
  if (previous === 0 && current > 0) {
    return (
      <span className="font-semibold text-success">
        vs prior 30d: new (+{current})
      </span>
    );
  }
  const up = (pct ?? 0) > 0;
  const flat = pct === 0;
  return (
    <span
      className={
        flat
          ? "text-faint"
          : up
            ? "font-semibold text-success"
            : "font-semibold text-[#B42318]"
      }
    >
      vs prior 30d: {up ? "+" : ""}
      {pct}% ({previous})
    </span>
  );
}

export function ListingPerformancePanel({
  performance,
  featured,
  companyName,
  companySlug,
  companyCity = "",
  variant = "manage",
  showUpsell = true,
}: Props) {
  const featuredHref = `/for-companies/?company=${encodeURIComponent(companyName)}&city=${encodeURIComponent(companyCity)}&slug=${encodeURIComponent(companySlug)}#featured`;

  return (
    <div
      className={
        variant === "admin"
          ? "rounded-[12px] border border-border bg-bg px-3.5 py-3.5"
          : "rounded-[12px] border border-border bg-bg px-4 py-4"
      }
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-navy">
          Listing performance
        </div>
        <div className="text-[12px] text-muted">
          Last 30 days · {performance.currentStart} → {performance.currentEnd}
        </div>
      </div>
      <p className="mt-1.5 mb-3 text-[13px] leading-[1.5] text-muted">
        First-party counts only — no cookies or personal data. Contact clicks
        cover phone, website, and map/source links on your public profile.
      </p>

      <div className="grid gap-2.5">
        {LISTING_STAT_METRICS.map((metric: ListingStatMetric) => {
          const current = performance.current[metric];
          const previous = performance.previous[metric];
          const series = performance.daily.map((d) => d[metric]);
          return (
            <div
              key={metric}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-border bg-white px-3 py-2.5"
            >
              <div className="min-w-[140px]">
                <div className="text-[13px] font-bold text-navy">
                  {LISTING_STAT_LABELS[metric]}
                </div>
                <div className="mt-0.5 text-[12.5px]">
                  <Delta current={current} previous={previous} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MetricSparkline
                  values={series}
                  label={LISTING_STAT_LABELS[metric]}
                />
                <div className="w-10 text-right text-[20px] font-extrabold tabular-nums tracking-[-0.4px] text-navy">
                  {current}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showUpsell && !featured ? (
        <div className="mt-4 rounded-[12px] border border-[#B6D4FE] bg-[#EEF5FF] px-3.5 py-3.5">
          <div className="text-[14px] font-extrabold text-navy">
            Turn these visits into more jobs
          </div>
          <p className="mt-1 mb-3 text-[13px] leading-[1.5] text-muted">
            You had{" "}
            <span className="font-semibold text-navy">
              {performance.current.profile_views}
            </span>{" "}
            profile views and{" "}
            <span className="font-semibold text-navy">
              {performance.current.contact_clicks}
            </span>{" "}
            contact clicks in the last 30 days. Featured Pros sit at the top of
            city results with a Sponsored badge — checkout uses the same Stripe
            plans as{" "}
            <Link
              href={featuredHref}
              className="font-semibold text-michigan-blue hover:underline"
            >
              For companies
            </Link>
            .
          </p>
          {variant === "manage" ? (
            <FeaturedInterestForm
              compact
              initialCompanyName={companyName}
              initialCity={companyCity}
              initialCompanySlug={companySlug}
            />
          ) : (
            <Link
              href={featuredHref}
              className="inline-flex text-[13px] font-extrabold text-michigan-blue hover:underline"
            >
              Open Featured checkout →
            </Link>
          )}
        </div>
      ) : null}

      {featured ? (
        <p className="mt-3 mb-0 text-[12.5px] font-semibold text-success">
          Featured Pro is active on this listing.
        </p>
      ) : null}
    </div>
  );
}
