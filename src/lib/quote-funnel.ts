import type { D1Database } from "@cloudflare/workers-types";
import { addUtcDays, utcDay } from "@/lib/listing-stats";
import {
  normalizeQuoteSourcePage,
  type QuoteSourcePage,
} from "@/lib/quote-links";

export const QUOTE_FUNNEL_EVENTS = ["view", "start", "submit"] as const;
export type QuoteFunnelEvent = (typeof QUOTE_FUNNEL_EVENTS)[number];

export type QuoteFunnelTotals = {
  views: number;
  starts: number;
  submits: number;
};

export type QuoteFunnelSourceRow = QuoteFunnelTotals & {
  sourcePage: QuoteSourcePage | string;
  /** submits / views when views > 0, else null */
  viewToSubmitRate: number | null;
  /** starts / views when views > 0, else null */
  viewToStartRate: number | null;
  /** submits / starts when starts > 0, else null */
  startToSubmitRate: number | null;
};

export type QuoteFunnelReport = {
  windowDays: number;
  startDay: string;
  endDay: string;
  totals: QuoteFunnelTotals;
  bySource: QuoteFunnelSourceRow[];
};

const EMPTY: QuoteFunnelTotals = { views: 0, starts: 0, submits: 0 };

export function isQuoteFunnelEvent(value: string): value is QuoteFunnelEvent {
  return (QUOTE_FUNNEL_EVENTS as readonly string[]).includes(value);
}

export function emptyQuoteFunnelTotals(): QuoteFunnelTotals {
  return { ...EMPTY };
}

export function rate(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return numerator / denominator;
}

export function withFunnelRates(
  sourcePage: string,
  totals: QuoteFunnelTotals,
): QuoteFunnelSourceRow {
  return {
    sourcePage,
    ...totals,
    viewToSubmitRate: rate(totals.submits, totals.views),
    viewToStartRate: rate(totals.starts, totals.views),
    startToSubmitRate: rate(totals.submits, totals.starts),
  };
}

/** Merge daily rows into per-source totals (pure; used by tests + admin). */
export function summarizeQuoteFunnelRows(
  rows: Array<{
    source_page: string;
    views: number;
    starts: number;
    submits: number;
  }>,
): { totals: QuoteFunnelTotals; bySource: QuoteFunnelSourceRow[] } {
  const bySourceMap = new Map<string, QuoteFunnelTotals>();
  const totals = emptyQuoteFunnelTotals();

  for (const row of rows) {
    const source = normalizeQuoteSourcePage(row.source_page);
    const bucket = bySourceMap.get(source) ?? emptyQuoteFunnelTotals();
    bucket.views += Number(row.views) || 0;
    bucket.starts += Number(row.starts) || 0;
    bucket.submits += Number(row.submits) || 0;
    bySourceMap.set(source, bucket);

    totals.views += Number(row.views) || 0;
    totals.starts += Number(row.starts) || 0;
    totals.submits += Number(row.submits) || 0;
  }

  const bySource = [...bySourceMap.entries()]
    .map(([sourcePage, t]) => withFunnelRates(sourcePage, t))
    .sort((a, b) => b.views - a.views || a.sourcePage.localeCompare(b.sourcePage));

  return { totals, bySource };
}

/**
 * Increment a daily funnel counter. Fail-open callers should catch.
 * Uses INSERT … ON CONFLICT for D1-friendly upserts.
 */
export async function bumpQuoteFunnel(
  db: D1Database,
  event: QuoteFunnelEvent,
  sourcePage: QuoteSourcePage | string,
  day: string = utcDay(),
): Promise<void> {
  const source = normalizeQuoteSourcePage(sourcePage);
  const column =
    event === "view" ? "views" : event === "start" ? "starts" : "submits";

  await db
    .prepare(
      `INSERT INTO quote_funnel_daily (day, source_page, views, starts, submits)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(day, source_page) DO UPDATE SET
         ${column} = ${column} + 1`,
    )
    .bind(
      day,
      source,
      event === "view" ? 1 : 0,
      event === "start" ? 1 : 0,
      event === "submit" ? 1 : 0,
    )
    .run();
}

export async function loadQuoteFunnelReport(
  db: D1Database,
  windowDays = 30,
): Promise<QuoteFunnelReport> {
  const endDay = utcDay();
  const startDay = addUtcDays(endDay, -(Math.max(1, windowDays) - 1));

  const { results } = await db
    .prepare(
      `SELECT source_page, views, starts, submits
       FROM quote_funnel_daily
       WHERE day >= ? AND day <= ?`,
    )
    .bind(startDay, endDay)
    .all<{
      source_page: string;
      views: number;
      starts: number;
      submits: number;
    }>();

  const { totals, bySource } = summarizeQuoteFunnelRows(results ?? []);

  return {
    windowDays,
    startDay,
    endDay,
    totals,
    bySource,
  };
}
