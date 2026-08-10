"use client";

import { useCompanyClaimStatus } from "@/hooks/useCompanyClaimStatus";

export function CompanyClaimBadge({ companySlug }: { companySlug: string }) {
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
