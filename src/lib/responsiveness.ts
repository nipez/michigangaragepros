/**
 * Company lead responsiveness metrics.
 * Pure scoring helpers + D1 loaders for public badge, manage panel,
 * admin claims, and lead-routing tiebreak.
 *
 * Never shows negative/shaming copy publicly — insufficient sample ⇒ null.
 */

import type { D1Database } from "@cloudflare/workers-types";

/** Rolling window for response metrics (UTC days). */
export const RESPONSIVENESS_WINDOW_DAYS = 90;

/** Minimum acted-on leads in the window before any public signal. */
export const RESPONSIVENESS_MIN_SAMPLE = 5;

/** Hours threshold used for the "acted within 24h" rate. */
export const RESPONSIVENESS_FAST_HOURS = 24;

export type LeadResponseSample = {
  /** When the lead was routed to this company (ISO / SQLite datetime). */
  routedAt: string;
  /** First time the company viewed the lead in the inbox; null if never. */
  firstViewedAt: string | null;
  /** First time the company left status "new"; null if still new. */
  firstActedAt: string | null;
};

export type CompanyResponsivenessMetrics = {
  windowDays: number;
  /** Routed leads in the window (excludes retained). */
  sampleSize: number;
  /** Leads with a recorded first action in the window. */
  actedCount: number;
  /** Median hours from route → first action (acted leads only); null if none. */
  medianHoursToAction: number | null;
  /** Share of routed leads acted on within RESPONSIVENESS_FAST_HOURS (0–1). */
  actedWithin24hRate: number;
  /** True when sampleSize >= RESPONSIVENESS_MIN_SAMPLE and we have a median. */
  qualifiesForPublic: boolean;
};

export type PublicResponsivenessBadge = {
  /** e.g. "Usually responds within 2 hours" */
  label: string;
  /** Rounded-up display hours used in the label. */
  withinHours: number;
  medianHoursToAction: number;
  sampleSize: number;
  actedWithin24hRate: number;
};

export type ResponsivenessAdminSummary = {
  sampleSize: number;
  actedCount: number;
  medianHoursToAction: number | null;
  actedWithin24hRate: number;
  qualifiesForPublic: boolean;
  /** Short admin line, e.g. "median 4h · 80% <24h · n=12" */
  summary: string;
  publicLabel: string | null;
};

/** Parse SQLite datetime / ISO into epoch ms; null if unparseable. */
export function parseDbDateMs(value: string | null | undefined): number | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // SQLite datetime('now') → "YYYY-MM-DD HH:MM:SS" (UTC-ish). Treat as UTC.
  const normalized = /T/.test(trimmed)
    ? trimmed
    : trimmed.includes(" ")
      ? `${trimmed.replace(" ", "T")}Z`
      : `${trimmed}T00:00:00.000Z`;
  const ms = Date.parse(normalized);
  return Number.isFinite(ms) ? ms : null;
}

/** Hours between two timestamps; null if either missing / invalid / inverted. */
export function hoursBetween(
  start: string | null | undefined,
  end: string | null | undefined,
): number | null {
  const a = parseDbDateMs(start);
  const b = parseDbDateMs(end);
  if (a === null || b === null || b < a) return null;
  return (b - a) / (1000 * 60 * 60);
}

/**
 * Median of a numeric list. Even length → average of two middle values.
 * Returns null for empty input.
 */
export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid]!;
  return (sorted[mid - 1]! + sorted[mid]!) / 2;
}

/**
 * Round up to a friendly public display hour bucket.
 * Sub-hour → 1; otherwise ceil, capped at 48 for copy sanity.
 */
export function friendlyResponseHours(medianHours: number): number {
  if (!Number.isFinite(medianHours) || medianHours <= 0) return 1;
  if (medianHours <= 1) return 1;
  const rounded = Math.ceil(medianHours);
  return Math.min(Math.max(rounded, 1), 48);
}

export function formatPublicResponseLabel(withinHours: number): string {
  const h = Math.max(1, Math.floor(withinHours));
  if (h === 1) return "Usually responds within 1 hour";
  return `Usually responds within ${h} hours`;
}

export function emptyResponsivenessMetrics(
  windowDays = RESPONSIVENESS_WINDOW_DAYS,
): CompanyResponsivenessMetrics {
  return {
    windowDays,
    sampleSize: 0,
    actedCount: 0,
    medianHoursToAction: null,
    actedWithin24hRate: 0,
    qualifiesForPublic: false,
  };
}

/**
 * Compute responsiveness from raw lead samples (already window-filtered).
 */
export function computeResponsivenessMetrics(
  samples: LeadResponseSample[],
  options?: { minSample?: number; fastHours?: number; windowDays?: number },
): CompanyResponsivenessMetrics {
  const minSample = options?.minSample ?? RESPONSIVENESS_MIN_SAMPLE;
  const fastHours = options?.fastHours ?? RESPONSIVENESS_FAST_HOURS;
  const windowDays = options?.windowDays ?? RESPONSIVENESS_WINDOW_DAYS;

  const sampleSize = samples.length;
  if (sampleSize === 0) {
    return emptyResponsivenessMetrics(windowDays);
  }

  const actionHours: number[] = [];
  let actedWithinFast = 0;
  let actedCount = 0;

  for (const s of samples) {
    const hours = hoursBetween(s.routedAt, s.firstActedAt);
    if (hours === null) continue;
    actedCount += 1;
    actionHours.push(hours);
    if (hours <= fastHours) actedWithinFast += 1;
  }

  const medianHoursToAction = median(actionHours);
  const actedWithin24hRate = actedWithinFast / sampleSize;
  const qualifiesForPublic =
    sampleSize >= minSample &&
    actedCount >= minSample &&
    medianHoursToAction !== null;

  return {
    windowDays,
    sampleSize,
    actedCount,
    medianHoursToAction,
    actedWithin24hRate,
    qualifiesForPublic,
  };
}

/** Public badge payload, or null when the company should show nothing. */
export function publicResponsivenessBadge(
  metrics: CompanyResponsivenessMetrics,
): PublicResponsivenessBadge | null {
  if (!metrics.qualifiesForPublic || metrics.medianHoursToAction === null) {
    return null;
  }
  const withinHours = friendlyResponseHours(metrics.medianHoursToAction);
  return {
    label: formatPublicResponseLabel(withinHours),
    withinHours,
    medianHoursToAction: metrics.medianHoursToAction,
    sampleSize: metrics.sampleSize,
    actedWithin24hRate: metrics.actedWithin24hRate,
  };
}

export function formatResponsivenessAdminSummary(
  metrics: CompanyResponsivenessMetrics,
): ResponsivenessAdminSummary {
  const badge = publicResponsivenessBadge(metrics);
  const medianLabel =
    metrics.medianHoursToAction === null
      ? "—"
      : `${Math.round(metrics.medianHoursToAction * 10) / 10}h`;
  const ratePct = Math.round(metrics.actedWithin24hRate * 100);
  const summary =
    metrics.sampleSize === 0
      ? "No recent leads"
      : `median ${medianLabel} · ${ratePct}% <24h · n=${metrics.sampleSize}`;

  return {
    sampleSize: metrics.sampleSize,
    actedCount: metrics.actedCount,
    medianHoursToAction: metrics.medianHoursToAction,
    actedWithin24hRate: metrics.actedWithin24hRate,
    qualifiesForPublic: metrics.qualifiesForPublic,
    summary,
    publicLabel: badge?.label ?? null,
  };
}

/**
 * Manage-page nudge copy. Always safe to show to the company itself
 * (even with low sample) — never used on public pages.
 */
export function manageResponsivenessNudge(
  metrics: CompanyResponsivenessMetrics,
): string {
  if (metrics.sampleSize === 0) {
    return "When leads arrive, open your inbox and mark them contacted — fast replies win more jobs and unlock a public response badge.";
  }
  if (!metrics.qualifiesForPublic) {
    const need = Math.max(
      0,
      RESPONSIVENESS_MIN_SAMPLE - metrics.actedCount,
    );
    return need > 0
      ? `Act on ${need} more lead${need === 1 ? "" : "s"} within ${RESPONSIVENESS_WINDOW_DAYS} days to unlock a public “Usually responds within…” badge.`
      : `Keep marking leads contacted — homeowners will see your response time once you have enough recent activity.`;
  }
  const badge = publicResponsivenessBadge(metrics);
  const ratePct = Math.round(metrics.actedWithin24hRate * 100);
  if (metrics.actedWithin24hRate < 0.7) {
    return `Homeowners see “${badge?.label ?? "your response time"}”. Aim for more replies inside 24 hours (currently ${ratePct}%) to get more area leads.`;
  }
  return `Homeowners see “${badge?.label ?? "your response time"}”. ${ratePct}% of recent leads were acted on within 24 hours — keep it up to stay near the top of area routing.`;
}

/**
 * Tiebreak score for lead routing: higher is better.
 * Companies below the public sample threshold get 0 so they lose to
 * measured responsive peers but stay equal among themselves (name breaks ties).
 * Prefer higher 24h rate; on equal rate prefer lower median hours.
 */
export function responsivenessTiebreakScore(
  metrics: CompanyResponsivenessMetrics | null | undefined,
): number {
  if (!metrics || !metrics.qualifiesForPublic) return 0;
  const rate = Math.min(1, Math.max(0, metrics.actedWithin24hRate));
  const medianHours = metrics.medianHoursToAction ?? 48;
  // Pack rate in the high bits; invert median into a small fractional boost.
  const medianBoost = 1 / (1 + Math.max(0, medianHours));
  return rate * 1000 + medianBoost;
}

/**
 * Compare two candidates for routing tiebreak.
 * Negative ⇒ a ranks before b (a is more responsive).
 */
export function compareResponsivenessTiebreak(
  a: CompanyResponsivenessMetrics | null | undefined,
  b: CompanyResponsivenessMetrics | null | undefined,
): number {
  return responsivenessTiebreakScore(b) - responsivenessTiebreakScore(a);
}

type RoutingResponseRow = {
  company_slug: string;
  routed_at: string;
  first_viewed_at: string | null;
  first_acted_at: string | null;
};

function windowStartIso(now: Date, windowDays: number): string {
  const start = new Date(now.getTime());
  start.setUTCDate(start.getUTCDate() - windowDays);
  return start.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Load response samples for many company slugs in one query.
 * Excludes retained historical rows and rows older than the window.
 */
export async function loadResponsivenessSamplesBySlugs(
  db: D1Database,
  companySlugs: string[],
  options?: { windowDays?: number; now?: Date },
): Promise<Record<string, LeadResponseSample[]>> {
  const slugs = [
    ...new Set(companySlugs.map((s) => s.trim()).filter(Boolean)),
  ];
  const out: Record<string, LeadResponseSample[]> = {};
  for (const slug of slugs) out[slug] = [];
  if (slugs.length === 0) return out;

  const windowDays = options?.windowDays ?? RESPONSIVENESS_WINDOW_DAYS;
  const now = options?.now ?? new Date();
  const since = windowStartIso(now, windowDays);

  const placeholders = slugs.map(() => "?").join(", ");
  const { results } = await db
    .prepare(
      `SELECT company_slug,
              created_at AS routed_at,
              first_viewed_at,
              first_acted_at
       FROM lead_routings
       WHERE company_slug IN (${placeholders})
         AND COALESCE(reason, '') != 'retained'
         AND datetime(created_at) >= datetime(?)`,
    )
    .bind(...slugs, since)
    .all<RoutingResponseRow>();

  for (const row of results ?? []) {
    const slug = (row.company_slug ?? "").trim();
    if (!slug || !out[slug]) continue;
    out[slug].push({
      routedAt: row.routed_at,
      firstViewedAt: row.first_viewed_at,
      firstActedAt: row.first_acted_at,
    });
  }
  return out;
}

export async function getCompanyResponsiveness(
  db: D1Database,
  companySlug: string,
  options?: { windowDays?: number; now?: Date },
): Promise<CompanyResponsivenessMetrics> {
  const slug = companySlug.trim();
  if (!slug) return emptyResponsivenessMetrics(options?.windowDays);
  const bySlug = await loadResponsivenessSamplesBySlugs(db, [slug], options);
  return computeResponsivenessMetrics(bySlug[slug] ?? [], {
    windowDays: options?.windowDays,
  });
}

export async function loadResponsivenessBySlugs(
  db: D1Database,
  companySlugs: string[],
  options?: { windowDays?: number; now?: Date },
): Promise<Record<string, CompanyResponsivenessMetrics>> {
  const samples = await loadResponsivenessSamplesBySlugs(
    db,
    companySlugs,
    options,
  );
  const out: Record<string, CompanyResponsivenessMetrics> = {};
  for (const [slug, list] of Object.entries(samples)) {
    out[slug] = computeResponsivenessMetrics(list, {
      windowDays: options?.windowDays,
    });
  }
  return out;
}
