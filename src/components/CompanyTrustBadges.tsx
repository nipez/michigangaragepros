import type { CompanyTrust } from "@/lib/company-trust";
import { trustBadges, trustHasAny } from "@/lib/company-trust";

type Props = {
  trust?: CompanyTrust | null;
  /** Compact chips for listing cards. */
  compact?: boolean;
  className?: string;
};

/**
 * Self-reported trust badges. Always labeled — never implies verification.
 */
export function CompanyTrustBadges({
  trust,
  compact = false,
  className = "",
}: Props) {
  if (!trust || !trustHasAny(trust)) return null;
  const badges = trustBadges(trust);
  if (badges.length === 0) return null;

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {badges.map((b) => (
          <span
            key={b.key}
            className="rounded-md bg-icon-tile px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.4px] text-navy"
            title={b.detail ? `${b.label}: ${b.detail}` : b.label}
          >
            {b.label}
          </span>
        ))}
        <span className="text-[10px] font-semibold text-faint">
          Self-reported
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        {badges.map((b) => (
          <span
            key={b.key}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1 text-[12px] font-bold text-navy"
          >
            <span>{b.label}</span>
            {b.detail ? (
              <span className="font-semibold text-muted">· {b.detail}</span>
            ) : null}
          </span>
        ))}
      </div>
      <p className="mt-1.5 mb-0 text-[12px] text-faint">
        Self-reported by the company — not independently verified by Michigan
        Garage Pros.
      </p>
    </div>
  );
}
