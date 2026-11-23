import {
  RESPONSIVENESS_FAST_HOURS,
  RESPONSIVENESS_MIN_SAMPLE,
  RESPONSIVENESS_WINDOW_DAYS,
  manageResponsivenessNudge,
  publicResponsivenessBadge,
  type CompanyResponsivenessMetrics,
} from "@/lib/responsiveness";

type Props = {
  metrics: CompanyResponsivenessMetrics;
  /** Compact chrome for admin embeds. */
  variant?: "manage" | "admin";
};

function formatHours(hours: number | null): string {
  if (hours === null) return "—";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded}h`;
}

/**
 * Company-facing (or admin) responsiveness stats with a nudge to reply faster.
 * Folds naturally under listing performance on the manage page.
 */
export function ResponsivenessPanel({
  metrics,
  variant = "manage",
}: Props) {
  const badge = publicResponsivenessBadge(metrics);
  const ratePct = Math.round(metrics.actedWithin24hRate * 100);
  const nudge = manageResponsivenessNudge(metrics);

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
          Responsiveness
        </div>
        <div className="text-[12px] text-muted">
          Last {RESPONSIVENESS_WINDOW_DAYS} days · min {RESPONSIVENESS_MIN_SAMPLE}{" "}
          acted leads for public badge
        </div>
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        <div className="rounded-[10px] border border-border bg-white px-3 py-2.5">
          <div className="text-[12px] font-semibold text-muted">
            Median time to act
          </div>
          <div className="mt-0.5 text-[20px] font-extrabold tabular-nums tracking-[-0.4px] text-navy">
            {formatHours(metrics.medianHoursToAction)}
          </div>
        </div>
        <div className="rounded-[10px] border border-border bg-white px-3 py-2.5">
          <div className="text-[12px] font-semibold text-muted">
            Acted within {RESPONSIVENESS_FAST_HOURS}h
          </div>
          <div className="mt-0.5 text-[20px] font-extrabold tabular-nums tracking-[-0.4px] text-navy">
            {metrics.sampleSize === 0 ? "—" : `${ratePct}%`}
          </div>
        </div>
        <div className="rounded-[10px] border border-border bg-white px-3 py-2.5">
          <div className="text-[12px] font-semibold text-muted">
            Recent leads
          </div>
          <div className="mt-0.5 text-[20px] font-extrabold tabular-nums tracking-[-0.4px] text-navy">
            {metrics.actedCount}
            <span className="text-[13px] font-bold text-muted">
              /{metrics.sampleSize}
            </span>
          </div>
        </div>
      </div>

      {badge ? (
        <p className="mt-3 mb-0 text-[13px] leading-[1.5] text-success">
          Public badge: <span className="font-semibold">{badge.label}</span>
        </p>
      ) : null}

      <p className="mt-3 mb-0 text-[13px] leading-[1.5] text-muted">{nudge}</p>
    </div>
  );
}
