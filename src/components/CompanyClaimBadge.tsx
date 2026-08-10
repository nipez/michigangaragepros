"use client";

import { Suspense } from "react";
import { useCompanyClaimStatus } from "@/hooks/useCompanyClaimStatus";

function CompanyClaimBadgeInner({ companySlug }: { companySlug: string }) {
  const status = useCompanyClaimStatus(companySlug);
  if (status === "claimed") {
    return (
      <span className="rounded-md bg-success-bg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.6px] text-success">
        Claimed
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="rounded-md bg-icon-tile px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.6px] text-michigan-blue">
        Claim in review
      </span>
    );
  }
  return null;
}

export function CompanyClaimBadge({ companySlug }: { companySlug: string }) {
  return (
    <Suspense fallback={null}>
      <CompanyClaimBadgeInner companySlug={companySlug} />
    </Suspense>
  );
}
