"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCompanyClaimStatus } from "@/hooks/useCompanyClaimStatus";

type CompanyClaimCardProps = {
  companyName: string;
  companyCity: string;
  companySlug: string;
};

type DemandPayload = {
  copy?: { body?: string; hasSignal?: boolean };
};

const DEFAULT_UNCLAIMED_BODY =
  "Update your info, services, and photos so homeowners see an accurate listing — free to claim.";

/**
 * Owner claim CTA on company profiles.
 * Demand numbers load after claim status resolves to unclaimed — soft copy
 * when counts are too low; never shows fabricated or zero counts.
 * data-nosnippet keeps aggregate demand out of SEO snippets.
 */
export function CompanyClaimCard({
  companyName,
  companyCity,
  companySlug,
}: CompanyClaimCardProps) {
  const status = useCompanyClaimStatus(companySlug);
  const [demandBody, setDemandBody] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "unclaimed") return;

    const slug = companySlug.trim();
    if (!slug) return;

    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      try {
        const res = await fetch(
          `/api/stats/demand/?slug=${encodeURIComponent(slug)}`,
          { signal: controller.signal },
        );
        if (!res.ok) return;
        const data = (await res.json()) as DemandPayload;
        if (cancelled) return;
        const body = data.copy?.body?.trim();
        if (body) setDemandBody(body);
      } catch {
        /* fail soft — keep default claim copy */
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [status, companySlug]);

  // Fixed min-height across loading → settled states to avoid sidebar CLS.
  if (status === "loading") {
    return (
      <div
        className="rounded-2xl border border-border bg-bg p-[26px]"
        style={{ minHeight: 188 }}
        aria-busy="true"
      >
        <h3 className="mb-1.5 text-lg font-extrabold text-navy">
          Checking ownership…
        </h3>
        <p className="m-0 text-[13.5px] leading-[1.55] text-muted text-pretty">
          Looking up whether this listing is available to claim.
        </p>
      </div>
    );
  }

  if (status === "claimed") {
    return (
      <div
        className="rounded-2xl border border-border bg-bg p-[26px]"
        style={{ minHeight: 188 }}
      >
        <div className="mb-3">
          <span className="rounded-md bg-success-bg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.6px] text-success">
            Verified owner
          </span>
        </div>
        <h3 className="mb-1.5 text-lg font-extrabold text-navy">
          This page is claimed
        </h3>
        <p className="m-0 text-[13.5px] leading-[1.55] text-muted text-pretty">
          The business owner manages this listing. If you represent{" "}
          {companyName} and need access, contact Michigan Garage Pros.
        </p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div
        className="rounded-2xl border-[1.5px] border-bright-blue bg-[rgba(47,128,237,0.06)] p-[26px]"
        style={{ minHeight: 188 }}
      >
        <div className="mb-3">
          <span className="featured-badge">Claim in review</span>
        </div>
        <h3 className="mb-1.5 text-lg font-extrabold text-navy">
          Verification underway
        </h3>
        <p className="m-0 text-[13.5px] leading-[1.55] text-muted text-pretty">
          We already have a claim request for this page and are verifying
          ownership. Duplicate claims are paused until review finishes.
        </p>
      </div>
    );
  }

  const body = demandBody ?? DEFAULT_UNCLAIMED_BODY;

  return (
    <div
      className="rounded-2xl border-[1.5px] border-bright-blue bg-[rgba(47,128,237,0.06)] p-[26px] shadow-[0_10px_28px_rgba(47,128,237,0.08)]"
      style={{ minHeight: 188 }}
    >
      <div className="mb-3">
        <span className="featured-badge">Own this page?</span>
      </div>
      <h3 className="mb-1.5 text-lg font-extrabold text-navy">
        Claim this listing
      </h3>
      <p
        className="mb-[18px] text-[13.5px] leading-[1.55] text-muted text-pretty"
        data-nosnippet
      >
        {body}
      </p>
      <Link
        href={`/for-companies/?company=${encodeURIComponent(companyName)}&city=${encodeURIComponent(companyCity.replace(/,?\s*MI$/, ""))}&slug=${encodeURIComponent(companySlug)}#claim`}
        className="block rounded-[11px] border-[1.5px] border-bright-blue bg-white py-3.5 text-center text-[15px] font-extrabold text-michigan-blue transition-colors hover:bg-bright-blue hover:text-white"
      >
        Claim this listing →
      </Link>
    </div>
  );
}
