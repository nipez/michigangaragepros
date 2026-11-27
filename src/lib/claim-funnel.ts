import type { D1Database } from "@cloudflare/workers-types";
import { addUtcDays, utcDay } from "@/lib/listing-stats";

export const CLAIM_FUNNEL_EVENTS = [
  "view",
  "search",
  "start",
  "submit",
] as const;
export type ClaimFunnelEvent = (typeof CLAIM_FUNNEL_EVENTS)[number];

export type ClaimFunnelTotals = {
  views: number;
  searches: number;
  starts: number;
  submits: number;
};

export type ClaimFunnelReport = {
  windowDays: number;
  startDay: string;
  endDay: string;
  totals: ClaimFunnelTotals;
  /** searches / views when views > 0 */
  viewToSearchRate: number | null;
  /** starts / views when views > 0 */
  viewToStartRate: number | null;
  /** starts / searches when searches > 0 */
  searchToStartRate: number | null;
  /** submits / starts when starts > 0 */
  startToSubmitRate: number | null;
  /** submits / views when views > 0 */
  viewToSubmitRate: number | null;
};

const EMPTY: ClaimFunnelTotals = {
  views: 0,
  searches: 0,
  starts: 0,
  submits: 0,
};

const EVENT_COLUMN: Record<ClaimFunnelEvent, keyof ClaimFunnelTotals> = {
  view: "views",
  search: "searches",
  start: "starts",
  submit: "submits",
};

export function isClaimFunnelEvent(value: string): value is ClaimFunnelEvent {
  return (CLAIM_FUNNEL_EVENTS as readonly string[]).includes(value);
}

export function emptyClaimFunnelTotals(): ClaimFunnelTotals {
  return { ...EMPTY };
}

export function rate(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return numerator / denominator;
}

export function withClaimFunnelRates(
  totals: ClaimFunnelTotals,
): Omit<ClaimFunnelReport, "windowDays" | "startDay" | "endDay"> {
  return {
    totals,
    viewToSearchRate: rate(totals.searches, totals.views),
    viewToStartRate: rate(totals.starts, totals.views),
    searchToStartRate: rate(totals.starts, totals.searches),
    startToSubmitRate: rate(totals.submits, totals.starts),
    viewToSubmitRate: rate(totals.submits, totals.views),
  };
}

/** Merge daily rows into totals (pure; used by tests + admin). */
export function summarizeClaimFunnelRows(
  rows: Array<{
    views: number;
    searches: number;
    starts: number;
    submits: number;
  }>,
): ClaimFunnelTotals {
  const totals = emptyClaimFunnelTotals();
  for (const row of rows) {
    totals.views += Number(row.views) || 0;
    totals.searches += Number(row.searches) || 0;
    totals.starts += Number(row.starts) || 0;
    totals.submits += Number(row.submits) || 0;
  }
  return totals;
}

/**
 * Increment a daily claim-funnel counter. Fail-open callers should catch.
 */
export async function bumpClaimFunnel(
  db: D1Database,
  event: ClaimFunnelEvent,
  day: string = utcDay(),
): Promise<void> {
  const column = EVENT_COLUMN[event];

  await db
    .prepare(
      `INSERT INTO claim_funnel_daily (day, views, searches, starts, submits)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(day) DO UPDATE SET
         ${column} = ${column} + 1`,
    )
    .bind(
      day,
      event === "view" ? 1 : 0,
      event === "search" ? 1 : 0,
      event === "start" ? 1 : 0,
      event === "submit" ? 1 : 0,
    )
    .run();
}

export async function loadClaimFunnelReport(
  db: D1Database,
  windowDays = 30,
): Promise<ClaimFunnelReport> {
  const endDay = utcDay();
  const startDay = addUtcDays(endDay, -(Math.max(1, windowDays) - 1));

  const { results } = await db
    .prepare(
      `SELECT views, searches, starts, submits
       FROM claim_funnel_daily
       WHERE day >= ? AND day <= ?`,
    )
    .bind(startDay, endDay)
    .all<{
      views: number;
      searches: number;
      starts: number;
      submits: number;
    }>();

  const totals = summarizeClaimFunnelRows(results ?? []);
  return {
    windowDays,
    startDay,
    endDay,
    ...withClaimFunnelRates(totals),
  };
}
