"use client";

import { useEffect, useState } from "react";
type CityDemandRow = {
  citySlug: string;
  cityName: string;
  profileViews: number;
  quoteRequests: number;
  listingCount: number;
};

type CityDemandReport = {
  windowDays: number;
  cities: CityDemandRow[];
};

function formatCityDemandLine(row: CityDemandRow): string {
  const parts: string[] = [];
  if (row.quoteRequests > 0) {
    parts.push(
      `${row.quoteRequests.toLocaleString("en-US")} quote request${row.quoteRequests === 1 ? "" : "s"}`,
    );
  }
  if (row.profileViews > 0) {
    parts.push(
      `${row.profileViews.toLocaleString("en-US")} listing view${row.profileViews === 1 ? "" : "s"}`,
    );
  }
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  return `${parts[0]} · ${parts[1]}`;
}

/**
 * Privacy-light city demand strip for the for-companies page.
 * Loads aggregates after mount; hides entirely when no city clears thresholds.
 */
export function CityDemandSignals() {
  const [cities, setCities] = useState<CityDemandRow[] | null>(null);
  const [windowDays, setWindowDays] = useState(30);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      try {
        const res = await fetch("/api/stats/city-demand/", {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as CityDemandReport;
        if (cancelled) return;
        setWindowDays(data.windowDays || 30);
        setCities(data.cities ?? []);
      } catch {
        if (!cancelled) setCities([]);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  if (!cities || cities.length === 0) return null;

  return (
    <section className="container-site pt-16" data-nosnippet>
      <div className="mb-8 max-w-[56ch]">
        <h2 className="mb-3 text-[clamp(24px,3vw,32px)] font-extrabold tracking-[-0.7px] text-navy">
          Homeowners are already looking
        </h2>
        <p className="m-0 text-[15.5px] leading-[1.6] text-muted text-pretty">
          Real activity on Michigan listings in the last {windowDays} days —
          claim yours so quote requests route to your inbox.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cities.map((row) => {
          const line = formatCityDemandLine(row);
          if (!line) return null;
          return (
            <div
              key={row.citySlug}
              className="rounded-[14px] border border-border bg-white px-5 py-4"
            >
              <div className="mb-1 text-[15px] font-extrabold text-navy">
                {row.cityName}
              </div>
              <div className="text-[13.5px] leading-[1.45] text-muted">
                {line}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
