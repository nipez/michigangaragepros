"use client";

import { useEffect, useRef, useState } from "react";
import { trackGrowth } from "@/lib/analytics";
import { recordClaimFunnelEvent } from "@/lib/claim-funnel-client";
import type { CompanyClaimSearchHit } from "@/lib/company-claim-search";

type ProCompanySearchProps = {
  /** Called when a listing is selected (or "not listed" blank claim). */
  onSelect: (hit: CompanyClaimSearchHit | null) => void;
  /** Prefill from URL query params when present. */
  initialQuery?: string;
  initialCity?: string;
};

export function ProCompanySearch({
  onSelect,
  initialQuery = "",
  initialCity = "",
}: ProCompanySearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [results, setResults] = useState<CompanyClaimSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTrackedQuery = useRef("");
  const requestId = useRef(0);

  const q = query.trim();
  const c = city.trim();
  const canSearch = q.length >= 2 || c.length >= 2;

  useEffect(() => {
    if (!canSearch) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    const id = ++requestId.current;

    debounceRef.current = setTimeout(() => {
      void (async () => {
        try {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          if (c) params.set("city", c);
          // loading only after debounce fires
          if (requestId.current === id) setLoading(true);
          const res = await fetch(`/api/companies/search/?${params.toString()}`);
          if (!res.ok) throw new Error("Search failed");
          const data = (await res.json()) as {
            results?: CompanyClaimSearchHit[];
          };
          if (requestId.current !== id) return;
          setResults(data.results ?? []);
          setSearched(true);
          setError(null);

          const trackKey = `${q}|${c}`;
          if (trackKey !== lastTrackedQuery.current) {
            lastTrackedQuery.current = trackKey;
            recordClaimFunnelEvent("search");
            trackGrowth("pro_company_search", {
              hasQuery: Boolean(q),
              hasCity: Boolean(c),
              resultCount: (data.results ?? []).length,
            });
          }
        } catch {
          if (requestId.current !== id) return;
          setError("Unable to search right now. Try again in a moment.");
          setResults([]);
          setSearched(true);
        } finally {
          if (requestId.current === id) setLoading(false);
        }
      })();
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [canSearch, q, c]);

  const selectHit = (hit: CompanyClaimSearchHit) => {
    recordClaimFunnelEvent("start");
    trackGrowth("pro_claim_start", {
      companySlug: hit.slug,
      city: hit.city,
      source: "search",
    });
    onSelect(hit);
  };

  const selectBlank = () => {
    recordClaimFunnelEvent("start");
    trackGrowth("pro_claim_start", { source: "not_listed" });
    onSelect(null);
  };

  const visibleResults = canSearch ? results : [];
  const showEmpty = canSearch && searched && !loading && visibleResults.length === 0;
  const showList = canSearch && visibleResults.length > 0;

  return (
    <div className="rounded-[20px] border border-border bg-white p-[clamp(22px,3vw,32px)] shadow-[0_12px_36px_rgba(16,42,67,0.06)]">
      <div className="mb-1 text-[13px] font-extrabold uppercase tracking-[1px] text-michigan-blue">
        Find your listing
      </div>
      <h2 className="mb-2 text-[clamp(22px,2.6vw,28px)] font-extrabold tracking-[-0.6px] text-navy">
        Search by company name or city
      </h2>
      <p className="mb-5 max-w-[52ch] text-[15px] leading-[1.55] text-muted text-pretty">
        Pick your business to jump straight into the free claim form. Don&apos;t
        see it? You can still submit your details for review.
      </p>

      <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Company name
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Lakeside Garage Door"
            className="field-input !h-12"
            autoComplete="organization"
            aria-label="Search company name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            City{" "}
            <span className="font-semibold text-faint">(optional)</span>
          </span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Grand Rapids"
            className="field-input !h-12"
            autoComplete="address-level2"
            aria-label="Filter by city"
          />
        </label>
      </div>

      {error && canSearch ? (
        <p className="mt-3 mb-0 text-[13.5px] font-semibold text-[#B42318]">
          {error}
        </p>
      ) : null}

      <div className="mt-4" aria-live="polite">
        {canSearch && loading ? (
          <p className="m-0 text-[14px] text-muted">Searching…</p>
        ) : showEmpty ? (
          <div className="rounded-[12px] border border-border bg-bg px-4 py-4">
            <p className="m-0 mb-3 text-[14.5px] leading-[1.55] text-muted">
              No matching listings yet. You can still add your business — we
              review new company claims manually.
            </p>
            <button
              type="button"
              onClick={selectBlank}
              className="rounded-[10px] border-none bg-bright-blue px-5 py-3 text-[14px] font-extrabold text-white hover:bg-michigan-blue"
            >
              Add your business →
            </button>
          </div>
        ) : showList ? (
          <ul className="m-0 grid list-none gap-2 p-0">
            {visibleResults.map((hit) => (
              <li key={hit.slug}>
                <button
                  type="button"
                  onClick={() => selectHit(hit)}
                  className="flex w-full items-center justify-between gap-3 rounded-[12px] border border-border bg-bg px-4 py-3.5 text-left transition-colors hover:border-bright-blue hover:bg-[rgba(47,128,237,0.06)]"
                >
                  <span>
                    <span className="block text-[15px] font-extrabold text-navy">
                      {hit.name}
                    </span>
                    <span className="block text-[13px] text-muted">
                      {hit.city}, MI
                    </span>
                  </span>
                  <span className="shrink-0 text-[13.5px] font-extrabold text-michigan-blue">
                    Claim →
                  </span>
                </button>
              </li>
            ))}
            <li className="pt-1">
              <button
                type="button"
                onClick={selectBlank}
                className="text-[13.5px] font-bold text-michigan-blue underline-offset-2 hover:underline"
              >
                Don&apos;t see your business? Add it →
              </button>
            </li>
          </ul>
        ) : (
          <p className="m-0 text-[13.5px] text-faint">
            Type at least 2 letters to search our Michigan directory.
          </p>
        )}
      </div>
    </div>
  );
}
