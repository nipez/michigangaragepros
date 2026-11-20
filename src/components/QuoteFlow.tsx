"use client";

import { useEffect } from "react";
import { LeadForm } from "./LeadForm";
import { QuoteHeader } from "./Header";
import { recordQuoteFunnelEvent } from "@/lib/quote-funnel-client";
import type { QuoteSourcePage } from "@/lib/quote-links";

export function QuoteFlow({
  initialService = "",
  initialZip = "",
  initialCompanySlug = "",
  initialCompanyName = "",
  initialCityName = "",
  initialTiming = "",
  sourcePage = "other",
}: {
  initialService?: string;
  initialZip?: string;
  initialCompanySlug?: string;
  initialCompanyName?: string;
  initialCityName?: string;
  initialTiming?: string;
  sourcePage?: QuoteSourcePage;
}) {
  // Homepage hero behavior: when a service is chosen, skip to step 2
  const step = initialService ? 2 : 1;

  useEffect(() => {
    recordQuoteFunnelEvent("view", sourcePage);
  }, [sourcePage]);

  return (
    <>
      <QuoteHeader />
      <div className="mx-auto max-w-[620px] px-6 py-14 pb-[88px]">
        {initialCompanyName ? (
          <div className="mb-4 rounded-[12px] border border-border bg-white px-4 py-3 text-sm text-muted">
            Requesting a quote for{" "}
            <strong className="text-navy">{initialCompanyName}</strong>
            {initialCityName ? (
              <>
                {" "}
                in <strong className="text-navy">{initialCityName}</strong>
              </>
            ) : null}
          </div>
        ) : initialCityName ? (
          <div className="mb-4 rounded-[12px] border border-border bg-white px-4 py-3 text-sm text-muted">
            Matching pros near{" "}
            <strong className="text-navy">{initialCityName}</strong>
          </div>
        ) : null}
        <div className="rounded-[18px] border border-border bg-white p-[clamp(28px,4vw,40px)] shadow-[0_16px_44px_rgba(16,42,67,0.07)]">
          <LeadForm
            variant="page"
            initialStep={step}
            companyName={initialCompanyName}
            sourcePage={sourcePage}
            initialLead={{
              service: initialService,
              zip: initialZip,
              timing: initialTiming,
              companySlug: initialCompanySlug || undefined,
              sourcePage,
            }}
          />
        </div>
        <div className="mt-5 flex justify-center gap-[18px] text-[13px] font-semibold text-muted">
          <span>
            <span className="font-extrabold text-success">✓</span> Free for
            homeowners
          </span>
          <span>
            <span className="font-extrabold text-success">✓</span> No obligation
          </span>
          <span>
            <span className="font-extrabold text-success">✓</span> Local companies
          </span>
        </div>
      </div>
    </>
  );
}
