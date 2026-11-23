"use client";

import { useCompanyResponsiveness } from "@/hooks/useCompanyResponsiveness";

type Props = {
  companySlug: string;
  className?: string;
};

/**
 * Tasteful public response-time badge. Renders nothing while loading,
 * for unclaimed companies, or when sample size is below threshold.
 * Never shows negative/shaming copy.
 */
export function CompanyResponseBadge({
  companySlug,
  className = "",
}: Props) {
  const { badge } = useCompanyResponsiveness(companySlug);
  if (!badge) return null;

  return (
    <span
      className={`inline-flex items-center rounded-md border border-[#B6D4FE] bg-[#EEF5FF] px-2.5 py-1 text-[12px] font-bold text-michigan-blue ${className}`}
      title="Based on how quickly this claimed pro acts on recent quote requests"
    >
      {badge.label}
    </span>
  );
}
