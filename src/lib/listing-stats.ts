import type { D1Database } from "@cloudflare/workers-types";

/** Daily counter columns stored on listing_stats_daily. */
export type ListingStatMetric =
  | "profile_views"
  | "contact_clicks"
  | "leads_routed"
  | "review_link_visits"
  | "review_submissions";

export const LISTING_STAT_METRICS: readonly ListingStatMetric[] = [
  "profile_views",
  "contact_clicks",
  "leads_routed",
  "review_link_visits",
  "review_submissions",
] as const;

export type ListingStatTotals = Record<ListingStatMetric, number>;

export type ListingStatDay = ListingStatTotals & { day: string };

export type ListingPerformance = {
  /** Inclusive start (YYYY-MM-DD UTC) of the current 30-day window. */
  currentStart: string;
  /** Inclusive end (YYYY-MM-DD UTC) of the current window (today). */
  currentEnd: string;
  previousStart: string;
  previousEnd: string;
  current: ListingStatTotals;
  previous: ListingStatTotals;
  /** Daily series for the current 30-day window (oldest → newest). */
  daily: ListingStatDay[];
};

const EMPTY_TOTALS: ListingStatTotals = {
  profile_views: 0,
  contact_clicks: 0,
  leads_routed: 0,
  review_link_visits: 0,
  review_submissions: 0,
};

const METRIC_COLUMNS: Record<ListingStatMetric, string> = {
  profile_views: "profile_views",
  contact_clicks: "contact_clicks",
  leads_routed: "leads_routed",
  review_link_visits: "review_link_visits",
  review_submissions: "review_submissions",
};

/**
 * Obvious crawlers / automation UAs. Best-effort only — never blocks humans
 * with unusual browsers; event writes remain fail-open.
 */
const BOT_UA_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|phantom|selenium|wget|curl|python-requests|scrapy|httpclient|monitor|uptimerobot|pingdom|bytespider|gptbot|claudebot|anthropic|chatgpt|bingpreview|yandex|baidu|duckduck|semrush|ahrefs|mj12|dotbot|petalbot|lighthouse|pagespeed|gtmetrix|pingdom|statuscake|newrelic|datadog|site24x7/i;

export function isLikelyBot(userAgent: string | null | undefined): boolean {
  const ua = (userAgent ?? "").trim();
  if (!ua || ua.length < 12) return true;
  return BOT_UA_RE.test(ua);
}

/** UTC calendar day as YYYY-MM-DD. */
export function utcDay(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Subtract whole UTC days from a YYYY-MM-DD (or Date). */
export function addUtcDays(day: string, deltaDays: number): string {
  const d = new Date(`${day}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

export function emptyListingTotals(): ListingStatTotals {
  return { ...EMPTY_TOTALS };
}

function isMetric(value: string): value is ListingStatMetric {
  return (LISTING_STAT_METRICS as readonly string[]).includes(value);
}

/**
 * Increment a daily counter. Fail-open: never throws to callers that await
 * via void / try/catch wrappers — returns false on failure.
 */
export async function bumpListingStat(
  db: D1Database,
  companySlug: string,
  metric: ListingStatMetric,
  amount = 1,
  day: string = utcDay(),
): Promise<boolean> {
  const slug = companySlug.trim();
  if (!slug || amount <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  if (!isMetric(metric)) return false;

  const column = METRIC_COLUMNS[metric];
  try {
    await db
      .prepare(
        `INSERT INTO listing_stats_daily (company_slug, day, ${column})
         VALUES (?, ?, ?)
         ON CONFLICT(company_slug, day) DO UPDATE SET
           ${column} = listing_stats_daily.${column} + excluded.${column}`,
      )
      .bind(slug, day, amount)
      .run();
    return true;
  } catch (err) {
    console.error("listing-stats bump failed", metric, slug, err);
    return false;
  }
}

/**
 * Best-effort bump that never rejects. Safe to fire without awaiting page render.
 */
export function bumpListingStatSafe(
  db: D1Database,
  companySlug: string,
  metric: ListingStatMetric,
  amount = 1,
): void {
  void bumpListingStat(db, companySlug, metric, amount).catch(() => {
    /* fail open */
  });
}

type DailyRow = {
  day: string;
  profile_views: number;
  contact_clicks: number;
  leads_routed: number;
  review_link_visits: number;
  review_submissions: number;
};

function sumRows(rows: DailyRow[]): ListingStatTotals {
  const totals = emptyListingTotals();
  for (const row of rows) {
    totals.profile_views += Number(row.profile_views) || 0;
    totals.contact_clicks += Number(row.contact_clicks) || 0;
    totals.leads_routed += Number(row.leads_routed) || 0;
    totals.review_link_visits += Number(row.review_link_visits) || 0;
    totals.review_submissions += Number(row.review_submissions) || 0;
  }
  return totals;
}

function fillDailySeries(
  start: string,
  end: string,
  rows: DailyRow[],
): ListingStatDay[] {
  const byDay = new Map(rows.map((r) => [r.day, r]));
  const series: ListingStatDay[] = [];
  let cursor = start;
  while (cursor <= end) {
    const row = byDay.get(cursor);
    series.push({
      day: cursor,
      profile_views: Number(row?.profile_views) || 0,
      contact_clicks: Number(row?.contact_clicks) || 0,
      leads_routed: Number(row?.leads_routed) || 0,
      review_link_visits: Number(row?.review_link_visits) || 0,
      review_submissions: Number(row?.review_submissions) || 0,
    });
    cursor = addUtcDays(cursor, 1);
  }
  return series;
}

/**
 * Aggregate last 30 UTC days vs the prior 30, plus a daily series for trends.
 */
export async function getListingPerformance(
  db: D1Database,
  companySlug: string,
  today: string = utcDay(),
): Promise<ListingPerformance> {
  const slug = companySlug.trim();
  const currentEnd = today;
  const currentStart = addUtcDays(currentEnd, -29);
  const previousEnd = addUtcDays(currentStart, -1);
  const previousStart = addUtcDays(previousEnd, -29);

  if (!slug) {
    return {
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
      current: emptyListingTotals(),
      previous: emptyListingTotals(),
      daily: fillDailySeries(currentStart, currentEnd, []),
    };
  }

  const { results } = await db
    .prepare(
      `SELECT day, profile_views, contact_clicks, leads_routed,
              review_link_visits, review_submissions
       FROM listing_stats_daily
       WHERE company_slug = ?
         AND day >= ?
         AND day <= ?
       ORDER BY day ASC`,
    )
    .bind(slug, previousStart, currentEnd)
    .all<DailyRow>();

  const rows = results ?? [];
  const previousRows = rows.filter(
    (r) => r.day >= previousStart && r.day <= previousEnd,
  );
  const currentRows = rows.filter(
    (r) => r.day >= currentStart && r.day <= currentEnd,
  );

  return {
    currentStart,
    currentEnd,
    previousStart,
    previousEnd,
    current: sumRows(currentRows),
    previous: sumRows(previousRows),
    daily: fillDailySeries(currentStart, currentEnd, currentRows),
  };
}

/** Percent change helper for UI (null when previous is zero). */
export function percentChange(
  current: number,
  previous: number,
): number | null {
  if (previous <= 0) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export const LISTING_STAT_LABELS: Record<ListingStatMetric, string> = {
  profile_views: "Profile views",
  contact_clicks: "Contact clicks",
  leads_routed: "Leads routed",
  review_link_visits: "Review link visits",
  review_submissions: "Review submissions",
};
