/**
 * Unanswered lead fallback: when claimed pros neither view nor act on a
 * routed lead within a window, route to the next best eligible local pro
 * (same matching rules as initial area routing) and flag admin if none remain.
 *
 * Designed for Cloudflare Cron (custom Worker entry) with env.DB / Resend
 * directly — no Next.js request ALS required. Safe to re-run: UNIQUE on
 * (lead_id, company_slug), one-time nudge_sent_at, one-time admin flag.
 */

import type { D1Database } from "@cloudflare/workers-types";
import {
  filterNewRecipients,
  findAreaRouteRecipients,
  LEAD_ROUTE_TOTAL_CAP,
  listExistingRoutingSlugs,
  persistLeadRouting,
  type LeadRouteRecipient,
} from "@/lib/lead-routing";
import {
  formatCompanyLeadNotify,
  formatCompanyLeadNudge,
} from "@/lib/notify-lead";

/** Hours after routing before a silent pro is considered unanswered. */
export const UNANSWERED_LEAD_FALLBACK_HOURS = 24;

/** Hourly — keeps latency near the window without Monday-only digest cadence. */
export const UNANSWERED_LEAD_FALLBACK_CRON = "0 * * * *";

/** Max new fallback recipients added per lead per cron pass. */
export const FALLBACK_ADD_PER_RUN = 1;

const PRIMARY_REASONS = new Set(["direct", "area", "fallback"]);

export type FallbackLeadRow = {
  id: number;
  service: string;
  issue: string;
  zip: string;
  name: string;
  phone: string | null;
  email: string | null;
  timing: string;
  company_slug: string | null;
  source_page: string | null;
  status: string;
  needs_admin_attention: number;
  fallback_exhausted_at: string | null;
};

export type FallbackRoutingRow = {
  id: number;
  lead_id: number;
  company_slug: string;
  email: string;
  reason: string;
  company_status: string;
  first_viewed_at: string | null;
  first_acted_at: string | null;
  nudge_sent_at: string | null;
  created_at: string;
  company_name: string | null;
};

export type FallbackLeadOutcome =
  | "skipped-engaged"
  | "skipped-under-window"
  | "skipped-at-cap-flagged"
  | "skipped-at-cap"
  | "routed-fallback"
  | "exhausted-flagged"
  | "exhausted-already"
  | "dry-run-would-route"
  | "dry-run-would-exhaust"
  | "error";

export type FallbackLeadResult = {
  leadId: number;
  outcome: FallbackLeadOutcome;
  addedSlugs: string[];
  nudgedSlugs: string[];
  flaggedAdmin: boolean;
};

export type FallbackRunSummary = {
  scanned: number;
  routed: number;
  exhausted: number;
  nudged: number;
  errors: number;
  results: FallbackLeadResult[];
};

export type FallbackRunOptions = {
  dryRun?: boolean;
  /** Override "now" for tests (ISO / SQLite-friendly UTC). */
  nowIso?: string;
  /** Cap how many candidate leads to process (safety). */
  limit?: number;
  hours?: number;
  totalCap?: number;
};

type FallbackEnv = {
  DB: D1Database;
  RESEND_API_KEY?: string;
  NOTIFY_FROM_EMAIL?: string;
};

/** Pure: routing has neither first view nor first action. */
export function isRoutingUnanswered(row: {
  first_viewed_at?: string | null;
  first_acted_at?: string | null;
}): boolean {
  return !row.first_viewed_at?.trim() && !row.first_acted_at?.trim();
}

/** Non-retained delivery rows that count toward the per-lead cap. */
export function isCapCountingReason(reason: string): boolean {
  return PRIMARY_REASONS.has((reason ?? "").trim());
}

/**
 * Pure eligibility gate for unanswered fallback.
 * Lead must be open, all cap-counting routings unanswered, and the oldest
 * such routing older than `windowHours`.
 */
export function leadNeedsUnansweredFallback(input: {
  status: string;
  routings: Array<{
    reason: string;
    first_viewed_at?: string | null;
    first_acted_at?: string | null;
    created_at: string;
  }>;
  windowHours?: number;
  nowMs?: number;
}): boolean {
  if ((input.status ?? "").trim() !== "new") return false;

  const counted = input.routings.filter((r) => isCapCountingReason(r.reason));
  if (counted.length === 0) return false;

  if (!counted.every((r) => isRoutingUnanswered(r))) return false;

  const windowHours = input.windowHours ?? UNANSWERED_LEAD_FALLBACK_HOURS;
  const nowMs = input.nowMs ?? Date.now();
  const oldest = counted.reduce((min, r) => {
    const t = Date.parse(r.created_at.includes("T") ? r.created_at : `${r.created_at}Z`);
    if (!Number.isFinite(t)) return min;
    return Math.min(min, t);
  }, Number.POSITIVE_INFINITY);

  if (!Number.isFinite(oldest)) return false;
  return nowMs - oldest >= windowHours * 60 * 60 * 1000;
}

/**
 * Pick next fallback recipients from a pre-ranked area pool.
 * Skips already-routed slugs and respects remaining headroom under totalCap.
 */
export function selectFallbackRecipients<T extends { companySlug: string }>(
  ranked: T[],
  alreadyRouted: ReadonlySet<string>,
  options?: {
    currentCount?: number;
    totalCap?: number;
    addCap?: number;
  },
): T[] {
  const totalCap = options?.totalCap ?? LEAD_ROUTE_TOTAL_CAP;
  const currentCount =
    options?.currentCount ?? alreadyRouted.size;
  const addCap = options?.addCap ?? FALLBACK_ADD_PER_RUN;
  const remaining = Math.max(0, totalCap - currentCount);
  const take = Math.min(addCap, remaining);
  if (take <= 0) return [];

  return filterNewRecipients(ranked, alreadyRouted).slice(0, take);
}

export function isoHoursAgo(hours: number, now: Date = new Date()): string {
  const ms = now.getTime() - hours * 60 * 60 * 1000;
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function parseNow(nowIso?: string): Date {
  if (!nowIso?.trim()) return new Date();
  const d = new Date(nowIso);
  return Number.isFinite(d.getTime()) ? d : new Date();
}

async function sendCompanyEmail(
  env: FallbackEnv,
  to: string,
  payload: {
    kind: string;
    subject: string;
    text: string;
    html?: string;
  },
): Promise<boolean> {
  const email = to.trim();
  if (!email) return false;

  const key = env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn(
      "lead-fallback: no RESEND_API_KEY configured",
      payload.subject,
      email,
    );
    return false;
  }

  const from =
    env.NOTIFY_FROM_EMAIL?.trim() ||
    "Michigan Garage Pros <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: payload.subject,
        text: payload.text,
        html: payload.html ?? `<pre>${escapeHtml(payload.text)}</pre>`,
      }),
    });
    if (!res.ok) {
      console.error(
        "lead-fallback Resend failed",
        res.status,
        await res.text(),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("lead-fallback Resend error", err);
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Open leads whose oldest primary/fallback routing is past the unanswered
 * window and still has zero views/actions across all cap-counting rows.
 */
export async function listUnansweredFallbackCandidates(
  db: D1Database,
  options?: { hours?: number; limit?: number; nowIso?: string },
): Promise<FallbackLeadRow[]> {
  const hours = options?.hours ?? UNANSWERED_LEAD_FALLBACK_HOURS;
  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 200);
  const now = parseNow(options?.nowIso);
  const cutoff = isoHoursAgo(hours, now);

  // Candidate when: open lead, has at least one direct/area/fallback routing
  // older than the window with no view/act, and NO cap-counting routing has
  // been viewed or acted on.
  const { results } = await db
    .prepare(
      `SELECT l.id, l.service, l.issue, l.zip, l.name, l.phone, l.email,
              l.timing, l.company_slug, l.source_page, l.status,
              COALESCE(l.needs_admin_attention, 0) AS needs_admin_attention,
              l.fallback_exhausted_at
       FROM leads l
       WHERE l.status = 'new'
         AND EXISTS (
           SELECT 1 FROM lead_routings lr
           WHERE lr.lead_id = l.id
             AND COALESCE(lr.reason, '') IN ('direct', 'area', 'fallback')
             AND lr.first_viewed_at IS NULL
             AND lr.first_acted_at IS NULL
             AND datetime(lr.created_at) <= datetime(?)
         )
         AND NOT EXISTS (
           SELECT 1 FROM lead_routings lr2
           WHERE lr2.lead_id = l.id
             AND COALESCE(lr2.reason, '') IN ('direct', 'area', 'fallback')
             AND (lr2.first_viewed_at IS NOT NULL OR lr2.first_acted_at IS NOT NULL)
         )
       ORDER BY datetime(l.created_at) ASC
       LIMIT ?`,
    )
    .bind(cutoff, limit)
    .all<FallbackLeadRow>();

  return results ?? [];
}

export async function loadLeadRoutingsForFallback(
  db: D1Database,
  leadId: number,
): Promise<FallbackRoutingRow[]> {
  const { results } = await db
    .prepare(
      `SELECT lr.id, lr.lead_id, lr.company_slug, lr.email, lr.reason,
              COALESCE(lr.company_status, 'new') AS company_status,
              lr.first_viewed_at, lr.first_acted_at, lr.nudge_sent_at,
              lr.created_at, c.name AS company_name
       FROM lead_routings lr
       LEFT JOIN companies c ON c.slug = lr.company_slug
       WHERE lr.lead_id = ?
       ORDER BY datetime(lr.created_at) ASC`,
    )
    .bind(leadId)
    .all<FallbackRoutingRow>();
  return results ?? [];
}

async function flagLeadNeedsAdmin(
  db: D1Database,
  leadId: number,
  nowIso: string,
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE leads
       SET needs_admin_attention = 1,
           fallback_exhausted_at = COALESCE(fallback_exhausted_at, ?)
       WHERE id = ? AND COALESCE(needs_admin_attention, 0) = 0`,
    )
    .bind(nowIso, leadId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

async function markNudgeSent(
  db: D1Database,
  routingId: number,
  nowIso: string,
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE lead_routings
       SET nudge_sent_at = ?
       WHERE id = ? AND nudge_sent_at IS NULL`,
    )
    .bind(nowIso, routingId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

/**
 * Process one unanswered lead: nudge originals (once), add next best pro,
 * or flag admin when exhausted / at cap with no engagement.
 */
export async function processUnansweredLead(
  env: FallbackEnv,
  lead: FallbackLeadRow,
  options: FallbackRunOptions = {},
): Promise<FallbackLeadResult> {
  const dryRun = Boolean(options.dryRun);
  const now = parseNow(options.nowIso);
  const nowIso = now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const windowHours = options.hours ?? UNANSWERED_LEAD_FALLBACK_HOURS;
  const totalCap = options.totalCap ?? LEAD_ROUTE_TOTAL_CAP;
  const empty: FallbackLeadResult = {
    leadId: lead.id,
    outcome: "skipped-engaged",
    addedSlugs: [],
    nudgedSlugs: [],
    flaggedAdmin: false,
  };

  try {
    const routings = await loadLeadRoutingsForFallback(env.DB, lead.id);
    if (
      !leadNeedsUnansweredFallback({
        status: lead.status,
        routings,
        windowHours,
        nowMs: now.getTime(),
      })
    ) {
      // Distinguish under-window vs engaged for observability.
      const counted = routings.filter((r) => isCapCountingReason(r.reason));
      const engaged = counted.some((r) => !isRoutingUnanswered(r));
      return {
        ...empty,
        outcome: engaged ? "skipped-engaged" : "skipped-under-window",
      };
    }

    const counted = routings.filter((r) => isCapCountingReason(r.reason));
    const already = new Set(
      counted.map((r) => r.company_slug.trim()).filter(Boolean),
    );
    // Also exclude retained / any other slug already on the lead.
    const allSlugs = await listExistingRoutingSlugs(env.DB, lead.id);
    for (const s of allSlugs) already.add(s);

    const nudgedSlugs: string[] = [];

    // One-time reminder to original unresponsive primary recipients (not prior fallbacks).
    const nudgeTargets = routings.filter(
      (r) =>
        (r.reason === "direct" || r.reason === "area") &&
        isRoutingUnanswered(r) &&
        !r.nudge_sent_at?.trim(),
    );

    if (!dryRun) {
      for (const target of nudgeTargets) {
        const claimed = await markNudgeSent(env.DB, target.id, nowIso);
        if (!claimed) continue;
        const payload = formatCompanyLeadNudge({
          id: lead.id,
          companyName: target.company_name?.trim() || target.company_slug,
          service: lead.service,
          issue: lead.issue,
          zip: lead.zip,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          timing: lead.timing,
        });
        await sendCompanyEmail(env, target.email, payload);
        nudgedSlugs.push(target.company_slug);
      }
    } else {
      for (const target of nudgeTargets) {
        nudgedSlugs.push(target.company_slug);
      }
    }

    if (already.size >= totalCap) {
      if (lead.needs_admin_attention) {
        return {
          leadId: lead.id,
          outcome: "skipped-at-cap",
          addedSlugs: [],
          nudgedSlugs,
          flaggedAdmin: false,
        };
      }
      if (dryRun) {
        return {
          leadId: lead.id,
          outcome: "dry-run-would-exhaust",
          addedSlugs: [],
          nudgedSlugs,
          flaggedAdmin: true,
        };
      }
      const flagged = await flagLeadNeedsAdmin(env.DB, lead.id, nowIso);
      return {
        leadId: lead.id,
        outcome: flagged ? "skipped-at-cap-flagged" : "skipped-at-cap",
        addedSlugs: [],
        nudgedSlugs,
        flaggedAdmin: flagged,
      };
    }

    const pool = await findAreaRouteRecipients(env.DB, lead.zip, {
      // Rank a wider pool; selectFallbackRecipients applies remaining headroom.
      cap: totalCap + already.size,
      excludeSlugs: already,
      service: lead.service,
      reason: "fallback",
    });

    const next = selectFallbackRecipients(pool, already, {
      currentCount: already.size,
      totalCap,
      addCap: FALLBACK_ADD_PER_RUN,
    });

    if (next.length === 0) {
      if (lead.needs_admin_attention) {
        return {
          leadId: lead.id,
          outcome: "exhausted-already",
          addedSlugs: [],
          nudgedSlugs,
          flaggedAdmin: false,
        };
      }
      if (dryRun) {
        return {
          leadId: lead.id,
          outcome: "dry-run-would-exhaust",
          addedSlugs: [],
          nudgedSlugs,
          flaggedAdmin: true,
        };
      }
      const flagged = await flagLeadNeedsAdmin(env.DB, lead.id, nowIso);
      return {
        leadId: lead.id,
        outcome: flagged ? "exhausted-flagged" : "exhausted-already",
        addedSlugs: [],
        nudgedSlugs,
        flaggedAdmin: flagged,
      };
    }

    if (dryRun) {
      return {
        leadId: lead.id,
        outcome: "dry-run-would-route",
        addedSlugs: next.map((r) => r.companySlug),
        nudgedSlugs,
        flaggedAdmin: false,
      };
    }

    const routed: Array<LeadRouteRecipient & { emailed: boolean }> = [];
    for (const recipient of next) {
      const payload = formatCompanyLeadNotify({
        id: lead.id,
        companyName: recipient.companyName,
        service: lead.service,
        issue: lead.issue,
        zip: lead.zip,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        timing: lead.timing,
        reason: "fallback",
        sourcePage: lead.source_page,
      });
      const emailed = await sendCompanyEmail(env, recipient.email, payload);
      routed.push({ ...recipient, reason: "fallback", emailed });
    }

    await persistLeadRouting(env.DB, lead.id, routed);

    return {
      leadId: lead.id,
      outcome: "routed-fallback",
      addedSlugs: routed.map((r) => r.companySlug),
      nudgedSlugs,
      flaggedAdmin: false,
    };
  } catch (err) {
    console.error("lead-fallback process lead failed", lead.id, err);
    return { ...empty, outcome: "error" };
  }
}

/**
 * Cron / admin entry: scan unanswered leads and fall back or flag admin.
 * Never throws for missing Resend — logs and continues (emailed=0 rows still insert).
 */
export async function runUnansweredLeadFallback(
  env: FallbackEnv,
  options: FallbackRunOptions = {},
): Promise<FallbackRunSummary> {
  if (!env.DB) {
    console.warn("lead-fallback: DB binding missing; skipping");
    return {
      scanned: 0,
      routed: 0,
      exhausted: 0,
      nudged: 0,
      errors: 0,
      results: [],
    };
  }

  if (!env.RESEND_API_KEY?.trim() && !options.dryRun) {
    console.warn(
      "lead-fallback: RESEND_API_KEY missing — will still route/flag; company emails skipped",
    );
  }

  let candidates: FallbackLeadRow[] = [];
  try {
    candidates = await listUnansweredFallbackCandidates(env.DB, {
      hours: options.hours,
      limit: options.limit,
      nowIso: options.nowIso,
    });
  } catch (err) {
    console.error("lead-fallback candidate query failed", err);
    return {
      scanned: 0,
      routed: 0,
      exhausted: 0,
      nudged: 0,
      errors: 1,
      results: [],
    };
  }

  const results: FallbackLeadResult[] = [];
  let routed = 0;
  let exhausted = 0;
  let nudged = 0;
  let errors = 0;

  for (const lead of candidates) {
    const result = await processUnansweredLead(env, lead, options);
    results.push(result);
    if (result.outcome === "routed-fallback" || result.outcome === "dry-run-would-route") {
      routed += 1;
    }
    if (
      result.outcome === "exhausted-flagged" ||
      result.outcome === "skipped-at-cap-flagged" ||
      result.outcome === "dry-run-would-exhaust"
    ) {
      exhausted += 1;
    }
    nudged += result.nudgedSlugs.length;
    if (result.outcome === "error") errors += 1;
  }

  console.log("lead-fallback run", {
    scanned: candidates.length,
    routed,
    exhausted,
    nudged,
    errors,
    dryRun: Boolean(options.dryRun),
  });

  return {
    scanned: candidates.length,
    routed,
    exhausted,
    nudged,
    errors,
    results,
  };
}

/** Admin lead-stats strip: fallback deliveries + needs-attention counts. */
export async function loadLeadFallbackStats(
  db: D1Database,
  windowDays = 30,
): Promise<{
  windowDays: number;
  fallbackRoutings: number;
  leadsWithFallback: number;
  needsAdminAttention: number;
  openNeedsAdminAttention: number;
}> {
  const days = Math.min(Math.max(Math.floor(windowDays) || 30, 1), 365);

  const fallbackRow = await db
    .prepare(
      `SELECT
         COUNT(*) AS fallback_routings,
         COUNT(DISTINCT lead_id) AS leads_with_fallback
       FROM lead_routings
       WHERE reason = 'fallback'
         AND datetime(created_at) >= datetime('now', ?)`,
    )
    .bind(`-${days} days`)
    .first<{ fallback_routings: number; leads_with_fallback: number }>();

  const adminRow = await db
    .prepare(
      `SELECT
         SUM(CASE WHEN COALESCE(needs_admin_attention, 0) = 1 THEN 1 ELSE 0 END) AS needs_admin,
         SUM(CASE WHEN COALESCE(needs_admin_attention, 0) = 1 AND status = 'new' THEN 1 ELSE 0 END) AS open_needs_admin
       FROM leads`,
    )
    .first<{ needs_admin: number | null; open_needs_admin: number | null }>();

  return {
    windowDays: days,
    fallbackRoutings: Number(fallbackRow?.fallback_routings) || 0,
    leadsWithFallback: Number(fallbackRow?.leads_with_fallback) || 0,
    needsAdminAttention: Number(adminRow?.needs_admin) || 0,
    openNeedsAdminAttention: Number(adminRow?.open_needs_admin) || 0,
  };
}
