/**
 * Homeowner lead follow-up check-in (~2.5 days after submit).
 *
 * Cron (reuses hourly unanswered-fallback trigger) emails the homeowner
 * once: "Did a garage door pro get in touch?" with signed Yes / Not yet
 * links. Designed for Cloudflare Cron with env.DB / Resend directly.
 *
 * Idempotent: checkin_sent_at claimed once; response recorded once.
 * Missing RESEND_API_KEY: skip send without claiming (retry when configured).
 */

import type { D1Database } from "@cloudflare/workers-types";
import { SITE_URL } from "@/data/site";
import {
  findAreaRouteRecipients,
  LEAD_ROUTE_TOTAL_CAP,
  listExistingRoutingSlugs,
  persistLeadRouting,
  type LeadRouteRecipient,
} from "@/lib/lead-routing";
import {
  FALLBACK_ADD_PER_RUN,
  selectFallbackRecipients,
} from "@/lib/lead-fallback";
import { isValidHomeownerEmail } from "@/lib/lead-review-request";
import { formatCompanyLeadNotify } from "@/lib/notify-lead";
import { ensureReviewToken, reviewRequestUrl } from "@/lib/review-request";
import {
  type CheckinAction,
  resolveCheckinSigningSecret,
  signCheckinToken,
} from "@/lib/homeowner-checkin-sign";

/** Hours after lead submit before the homeowner check-in email. ~2.5 days. */
export const HOMEOWNER_CHECKIN_HOURS = 60;

/**
 * Max age for a check-in send. Leads older than this are never emailed
 * (copy says "You recently requested"). 7 days.
 */
export const HOMEOWNER_CHECKIN_MAX_AGE_HOURS = 168;

/**
 * Migration 0031 stamps pre-existing leads with this response so the first
 * cron never picks them. Not a homeowner answer — excluded from funnel /
 * admin "sent" pills (no checkin_sent_at, not yes/not_yet).
 */
export const HOMEOWNER_CHECKIN_GRANDFATHER_RESPONSE = "skipped";

/**
 * Reuses the hourly cron expression already registered for unanswered
 * fallback — both jobs run on the same trigger in custom-worker.ts.
 */
export const HOMEOWNER_CHECKIN_CRON = "0 * * * *";

/** Operator lead statuses that may still receive a check-in. */
export const HOMEOWNER_CHECKIN_ELIGIBLE_STATUSES = ["new", "contacted"] as const;

export type CheckinResponse = "yes" | "not_yet";

export type CheckinLeadRow = {
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
  created_at: string;
  checkin_sent_at: string | null;
  checkin_response: string | null;
  checkin_responded_at: string | null;
  checkin_helped_company_slug: string | null;
  checkin_opt_out: number;
};

export type CheckinRoutedCompany = {
  companySlug: string;
  companyName: string;
  reason: string;
  reviewToken: string | null;
};

export type CheckinSendOutcome =
  | "sent"
  | "skipped-no-email"
  | "skipped-opt-out"
  | "skipped-spam"
  | "skipped-already-sent"
  | "skipped-already-responded"
  | "skipped-under-window"
  | "skipped-too-old"
  | "skipped-closed"
  | "skipped-no-resend"
  | "skipped-no-signing"
  | "dry-run-would-send"
  | "error";

export type CheckinSendResult = {
  leadId: number;
  outcome: CheckinSendOutcome;
};

export type CheckinRunSummary = {
  scanned: number;
  sent: number;
  skipped: number;
  errors: number;
  results: CheckinSendResult[];
};

export type CheckinRunOptions = {
  dryRun?: boolean;
  nowIso?: string;
  limit?: number;
  hours?: number;
  maxAgeHours?: number;
};

type CheckinEnv = {
  DB: D1Database;
  RESEND_API_KEY?: string;
  NOTIFY_FROM_EMAIL?: string;
  ADMIN_TOKEN?: string;
  CHECKIN_SIGNING_SECRET?: string;
};

const TEST_EMAIL_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "test.org",
  "localhost",
  "mailinator.com",
  "guerrillamail.com",
  "trashmail.com",
  "yopmail.com",
]);

const TEST_NAME_RE =
  /^(test|testing|asdf|qwerty|spam|bot|fake|xxx+|sample|demo)(\s|$)/i;

/** Pure: email/name look like spam or operator test traffic. */
export function isLikelyTestOrSpamLead(input: {
  email?: string | null;
  name?: string | null;
}): boolean {
  const email = (input.email ?? "").trim().toLowerCase();
  if (email) {
    const [, domain] = email.split("@");
    if (domain && TEST_EMAIL_DOMAINS.has(domain)) return true;
    if (
      email.startsWith("test@") ||
      email.startsWith("spam@") ||
      email.startsWith("fake@") ||
      email.includes("+test@") ||
      email.includes("+spam@")
    ) {
      return true;
    }
  }
  const name = (input.name ?? "").trim();
  if (name && TEST_NAME_RE.test(name)) return true;
  return false;
}

/** Operator lead.status that may receive a check-in (not closed). */
export function isCheckinEligibleLeadStatus(
  status: string | null | undefined,
): boolean {
  const normalized = (status ?? "").trim().toLowerCase();
  return (HOMEOWNER_CHECKIN_ELIGIBLE_STATUSES as readonly string[]).includes(
    normalized,
  );
}

/** Migration / backfill sentinel — never treat as a homeowner answer. */
export function isGrandfatheredCheckinResponse(
  response: string | null | undefined,
): boolean {
  return (
    (response ?? "").trim().toLowerCase() ===
    HOMEOWNER_CHECKIN_GRANDFATHER_RESPONSE
  );
}

/**
 * Pure eligibility for sending a check-in email.
 * Requires valid email, open lead status, consent (not opted out),
 * not already sent/responded/grandfathered, not spam/test, and created
 * between windowHours and maxAgeHours ago.
 */
export function leadNeedsHomeownerCheckin(input: {
  email?: string | null;
  name?: string | null;
  status?: string | null;
  checkinSentAt?: string | null;
  checkinResponse?: string | null;
  checkinOptOut?: number | boolean | null;
  createdAt: string;
  windowHours?: number;
  maxAgeHours?: number;
  nowMs?: number;
}): boolean {
  if (!isValidHomeownerEmail(input.email)) return false;
  if (input.status !== undefined && !isCheckinEligibleLeadStatus(input.status)) {
    return false;
  }
  if (input.checkinOptOut === 1 || input.checkinOptOut === true) return false;
  if (input.checkinSentAt?.trim()) return false;
  if (input.checkinResponse?.trim()) return false;
  if (isLikelyTestOrSpamLead(input)) return false;

  const windowHours = input.windowHours ?? HOMEOWNER_CHECKIN_HOURS;
  const maxAgeHours = input.maxAgeHours ?? HOMEOWNER_CHECKIN_MAX_AGE_HOURS;
  const nowMs = input.nowMs ?? Date.now();
  const createdRaw = input.createdAt.trim();
  const createdMs = Date.parse(
    createdRaw.includes("T") ? createdRaw : `${createdRaw}Z`,
  );
  if (!Number.isFinite(createdMs)) return false;
  const ageMs = nowMs - createdMs;
  if (ageMs < windowHours * 60 * 60 * 1000) return false;
  if (ageMs > maxAgeHours * 60 * 60 * 1000) return false;
  return true;
}

/** Admin / UI label for check-in status. */
export function formatCheckinStatus(lead: {
  checkin_sent_at?: string | null;
  checkin_response?: string | null;
  checkin_helped_company_slug?: string | null;
  checkin_opt_out?: number | null;
}): {
  key: "not_sent" | "sent" | "yes" | "not_yet" | "opt_out" | "skipped";
  label: string;
} {
  if (lead.checkin_opt_out) {
    return { key: "opt_out", label: "Opted out" };
  }
  const response = (lead.checkin_response ?? "").trim().toLowerCase();
  if (response === "yes") {
    const slug = lead.checkin_helped_company_slug?.trim();
    return {
      key: "yes",
      label: slug ? `Yes · ${slug}` : "Yes, set",
    };
  }
  if (response === "not_yet") {
    return { key: "not_yet", label: "Not yet" };
  }
  // Grandfathered / migration-skipped: hide from inbox (not "sent").
  if (isGrandfatheredCheckinResponse(response)) {
    return { key: "skipped", label: "Skipped (legacy)" };
  }
  if (lead.checkin_sent_at?.trim()) {
    return { key: "sent", label: "Sent · no response" };
  }
  return { key: "not_sent", label: "Not sent" };
}

export function checkinActionUrl(token: string): string {
  return `${SITE_URL}/check-in/?t=${encodeURIComponent(token)}`;
}

export function formatHomeownerCheckinNotify(input: {
  homeownerName: string;
  yesUrl: string;
  notYetUrl: string;
  unsubUrl: string;
}) {
  const firstName =
    input.homeownerName.trim().split(/\s+/)[0] || "there";

  const lines = [
    `Hi ${firstName},`,
    "",
    "You recently requested a garage door quote through Michigan Garage Pros.",
    "Quick check-in — did a garage door pro get in touch?",
    "",
    `Yes, I'm set: ${input.yesUrl}`,
    `Not yet: ${input.notYetUrl}`,
    "",
    "One click is enough. If nobody reached out, we'll try the next local pro.",
    "",
    "— Michigan Garage Pros",
    SITE_URL,
    "",
    `Prefer not to get these follow-ups? ${input.unsubUrl}`,
  ];

  const html = [
    `<p>Hi ${escapeHtml(firstName)},</p>`,
    `<p>You recently requested a garage door quote through Michigan Garage Pros. Quick check-in — did a garage door pro get in touch?</p>`,
    `<p style="margin:1.25rem 0">`,
    `<a href="${escapeHtml(input.yesUrl)}" style="display:inline-block;background:#0B3D91;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;margin-right:10px">Yes, I'm set</a>`,
    `<a href="${escapeHtml(input.notYetUrl)}" style="display:inline-block;background:#F2F4F7;color:#102A43;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px">Not yet</a>`,
    `</p>`,
    `<p>One click is enough. If nobody reached out, we'll try the next local pro.</p>`,
    `<p>— Michigan Garage Pros<br/><a href="${escapeHtml(SITE_URL)}">${escapeHtml(SITE_URL)}</a></p>`,
    `<p style="color:#667085;font-size:13px">Prefer not to get these follow-ups? <a href="${escapeHtml(input.unsubUrl)}">Unsubscribe</a>.</p>`,
  ].join("\n");

  return {
    kind: "homeowner-checkin" as const,
    subject: "Did a garage door pro get in touch?",
    text: lines.join("\n"),
    html,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseNow(nowIso?: string): Date {
  if (!nowIso?.trim()) return new Date();
  const d = new Date(nowIso);
  return Number.isFinite(d.getTime()) ? d : new Date();
}

function isoHoursAgo(hours: number, now: Date = new Date()): string {
  const ms = now.getTime() - hours * 60 * 60 * 1000;
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

async function sendHomeownerEmail(
  env: CheckinEnv,
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
      "homeowner-checkin: no RESEND_API_KEY configured",
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
        "homeowner-checkin Resend failed",
        res.status,
        await res.text(),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("homeowner-checkin Resend error", err);
    return false;
  }
}

/**
 * Candidates in the check-in window (min age … max age) with email,
 * open status, not yet emailed/responded/opted out/grandfathered.
 */
export async function listHomeownerCheckinCandidates(
  db: D1Database,
  options?: {
    hours?: number;
    maxAgeHours?: number;
    limit?: number;
    nowIso?: string;
  },
): Promise<CheckinLeadRow[]> {
  const hours = options?.hours ?? HOMEOWNER_CHECKIN_HOURS;
  const maxAgeHours = options?.maxAgeHours ?? HOMEOWNER_CHECKIN_MAX_AGE_HOURS;
  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 200);
  const now = parseNow(options?.nowIso);
  // created_at <= minCutoff ⇒ at least `hours` old
  const minCutoff = isoHoursAgo(hours, now);
  // created_at >= maxCutoff ⇒ at most `maxAgeHours` old
  const maxCutoff = isoHoursAgo(maxAgeHours, now);

  const { results } = await db
    .prepare(
      `SELECT id, service, issue, zip, name, phone, email, timing,
              company_slug, source_page, status, created_at,
              checkin_sent_at, checkin_response, checkin_responded_at,
              checkin_helped_company_slug,
              COALESCE(checkin_opt_out, 0) AS checkin_opt_out
       FROM leads
       WHERE checkin_sent_at IS NULL
         AND checkin_response IS NULL
         AND COALESCE(checkin_opt_out, 0) = 0
         AND LOWER(TRIM(COALESCE(status, ''))) IN ('new', 'contacted')
         AND email IS NOT NULL
         AND TRIM(email) != ''
         AND datetime(created_at) <= datetime(?)
         AND datetime(created_at) >= datetime(?)
       ORDER BY datetime(created_at) ASC
       LIMIT ?`,
    )
    .bind(minCutoff, maxCutoff, limit)
    .all<CheckinLeadRow>();

  return results ?? [];
}

async function claimCheckinSent(
  db: D1Database,
  leadId: number,
  nowIso: string,
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE leads
       SET checkin_sent_at = ?
       WHERE id = ?
         AND checkin_sent_at IS NULL
         AND checkin_response IS NULL
         AND COALESCE(checkin_opt_out, 0) = 0`,
    )
    .bind(nowIso, leadId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

async function buildActionUrls(
  env: CheckinEnv,
  leadId: number,
): Promise<{
  yesUrl: string;
  notYetUrl: string;
  unsubUrl: string;
} | null> {
  const secret = resolveCheckinSigningSecret(env);
  if (!secret) return null;

  const actions: CheckinAction[] = ["yes", "not_yet", "unsub"];
  const tokens = await Promise.all(
    actions.map((action) => signCheckinToken(secret, { leadId, action })),
  );
  return {
    yesUrl: checkinActionUrl(tokens[0]!),
    notYetUrl: checkinActionUrl(tokens[1]!),
    unsubUrl: checkinActionUrl(tokens[2]!),
  };
}

export async function processHomeownerCheckinLead(
  env: CheckinEnv,
  lead: CheckinLeadRow,
  options: CheckinRunOptions = {},
): Promise<CheckinSendResult> {
  const dryRun = Boolean(options.dryRun);
  const now = parseNow(options.nowIso);
  const nowIso = now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const windowHours = options.hours ?? HOMEOWNER_CHECKIN_HOURS;
  const maxAgeHours = options.maxAgeHours ?? HOMEOWNER_CHECKIN_MAX_AGE_HOURS;

  try {
    if (
      !leadNeedsHomeownerCheckin({
        email: lead.email,
        name: lead.name,
        status: lead.status,
        checkinSentAt: lead.checkin_sent_at,
        checkinResponse: lead.checkin_response,
        checkinOptOut: lead.checkin_opt_out,
        createdAt: lead.created_at,
        windowHours,
        maxAgeHours,
        nowMs: now.getTime(),
      })
    ) {
      if (lead.checkin_sent_at?.trim()) {
        return { leadId: lead.id, outcome: "skipped-already-sent" };
      }
      if (lead.checkin_response?.trim()) {
        return { leadId: lead.id, outcome: "skipped-already-responded" };
      }
      if (lead.checkin_opt_out) {
        return { leadId: lead.id, outcome: "skipped-opt-out" };
      }
      if (!isCheckinEligibleLeadStatus(lead.status)) {
        return { leadId: lead.id, outcome: "skipped-closed" };
      }
      if (isLikelyTestOrSpamLead(lead)) {
        return { leadId: lead.id, outcome: "skipped-spam" };
      }
      if (!isValidHomeownerEmail(lead.email)) {
        return { leadId: lead.id, outcome: "skipped-no-email" };
      }
      const createdMs = Date.parse(
        lead.created_at.includes("T")
          ? lead.created_at
          : `${lead.created_at}Z`,
      );
      if (
        Number.isFinite(createdMs) &&
        now.getTime() - createdMs > maxAgeHours * 60 * 60 * 1000
      ) {
        return { leadId: lead.id, outcome: "skipped-too-old" };
      }
      return { leadId: lead.id, outcome: "skipped-under-window" };
    }

    if (!resolveCheckinSigningSecret(env)) {
      return { leadId: lead.id, outcome: "skipped-no-signing" };
    }

    if (!env.RESEND_API_KEY?.trim()) {
      return { leadId: lead.id, outcome: "skipped-no-resend" };
    }

    if (dryRun) {
      return { leadId: lead.id, outcome: "dry-run-would-send" };
    }

    const urls = await buildActionUrls(env, lead.id);
    if (!urls) {
      return { leadId: lead.id, outcome: "skipped-no-signing" };
    }

    // Claim before send so concurrent hourly runs cannot double-email.
    const claimed = await claimCheckinSent(env.DB, lead.id, nowIso);
    if (!claimed) {
      return { leadId: lead.id, outcome: "skipped-already-sent" };
    }

    const payload = formatHomeownerCheckinNotify({
      homeownerName: lead.name,
      yesUrl: urls.yesUrl,
      notYetUrl: urls.notYetUrl,
      unsubUrl: urls.unsubUrl,
    });
    const emailed = await sendHomeownerEmail(
      env,
      (lead.email ?? "").trim(),
      payload,
    );
    if (!emailed) {
      // Already claimed — do not unclaim (at most one attempt / no spam).
      console.warn(
        "homeowner-checkin: claimed but Resend failed",
        lead.id,
        lead.email,
      );
    }

    return { leadId: lead.id, outcome: "sent" };
  } catch (err) {
    console.error("homeowner-checkin process lead failed", lead.id, err);
    return { leadId: lead.id, outcome: "error" };
  }
}

/**
 * Cron / admin entry: email eligible homeowners once.
 * Never throws for missing Resend — skips those leads without claiming.
 */
export async function runHomeownerCheckins(
  env: CheckinEnv,
  options: CheckinRunOptions = {},
): Promise<CheckinRunSummary> {
  if (!env.DB) {
    console.warn("homeowner-checkin: DB binding missing; skipping");
    return { scanned: 0, sent: 0, skipped: 0, errors: 0, results: [] };
  }

  if (!env.RESEND_API_KEY?.trim() && !options.dryRun) {
    console.warn(
      "homeowner-checkin: RESEND_API_KEY missing — skipping sends (will retry when configured)",
    );
  }

  if (!resolveCheckinSigningSecret(env) && !options.dryRun) {
    console.warn(
      "homeowner-checkin: no CHECKIN_SIGNING_SECRET or ADMIN_TOKEN — cannot sign links; skipping",
    );
    return { scanned: 0, sent: 0, skipped: 0, errors: 0, results: [] };
  }

  let candidates: CheckinLeadRow[] = [];
  try {
    candidates = await listHomeownerCheckinCandidates(env.DB, {
      hours: options.hours,
      maxAgeHours: options.maxAgeHours,
      limit: options.limit,
      nowIso: options.nowIso,
    });
  } catch (err) {
    console.error("homeowner-checkin candidate query failed", err);
    return { scanned: 0, sent: 0, skipped: 0, errors: 1, results: [] };
  }

  const results: CheckinSendResult[] = [];
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const lead of candidates) {
    const result = await processHomeownerCheckinLead(env, lead, options);
    results.push(result);
    if (result.outcome === "sent" || result.outcome === "dry-run-would-send") {
      sent += 1;
    } else if (result.outcome === "error") {
      errors += 1;
    } else {
      skipped += 1;
    }
  }

  console.log("homeowner-checkin run", {
    scanned: candidates.length,
    sent,
    skipped,
    errors,
    dryRun: Boolean(options.dryRun),
  });

  return {
    scanned: candidates.length,
    sent,
    skipped,
    errors,
    results,
  };
}

export async function loadLeadForCheckin(
  db: D1Database,
  leadId: number,
): Promise<CheckinLeadRow | null> {
  if (!Number.isInteger(leadId) || leadId <= 0) return null;
  return (
    (await db
      .prepare(
        `SELECT id, service, issue, zip, name, phone, email, timing,
                company_slug, source_page, status, created_at,
                checkin_sent_at, checkin_response, checkin_responded_at,
                checkin_helped_company_slug,
                COALESCE(checkin_opt_out, 0) AS checkin_opt_out
         FROM leads WHERE id = ? LIMIT 1`,
      )
      .bind(leadId)
      .first<CheckinLeadRow>()) ?? null
  );
}

export async function listRoutedCompaniesForCheckin(
  db: D1Database,
  leadId: number,
): Promise<CheckinRoutedCompany[]> {
  const { results } = await db
    .prepare(
      `SELECT lr.company_slug AS company_slug,
              COALESCE(c.name, lr.company_slug) AS company_name,
              lr.reason AS reason,
              c.review_token AS review_token
       FROM lead_routings lr
       LEFT JOIN companies c ON c.slug = lr.company_slug
       WHERE lr.lead_id = ?
         AND COALESCE(lr.reason, '') IN ('direct', 'area', 'fallback')
       ORDER BY datetime(lr.created_at) ASC`,
    )
    .bind(leadId)
    .all<{
      company_slug: string;
      company_name: string;
      reason: string;
      review_token: string | null;
    }>();

  return (results ?? []).map((row) => ({
    companySlug: row.company_slug,
    companyName: row.company_name,
    reason: row.reason,
    reviewToken: row.review_token,
  }));
}

/**
 * Record a "yes" response and credit the helped company for responsiveness.
 * Idempotent: first response wins.
 */
export async function recordCheckinYes(
  db: D1Database,
  leadId: number,
  companySlug: string | null,
  nowIso?: string,
): Promise<{
  ok: boolean;
  alreadyResponded: boolean;
  reviewUrl: string | null;
  companyName: string | null;
  error?: string;
}> {
  const lead = await loadLeadForCheckin(db, leadId);
  if (!lead) {
    return {
      ok: false,
      alreadyResponded: false,
      reviewUrl: null,
      companyName: null,
      error: "Lead not found",
    };
  }

  if (lead.checkin_opt_out) {
    return {
      ok: false,
      alreadyResponded: false,
      reviewUrl: null,
      companyName: null,
      error: "This email follow-up was unsubscribed",
    };
  }

  const existing = (lead.checkin_response ?? "").trim().toLowerCase();
  if (existing && existing !== "yes") {
    return {
      ok: false,
      alreadyResponded: true,
      reviewUrl: null,
      companyName: null,
      error: "You already responded to this check-in",
    };
  }

  const slug = (companySlug ?? "").trim();
  const routed = await listRoutedCompaniesForCheckin(db, leadId);
  const match = slug
    ? routed.find((r) => r.companySlug === slug) ?? null
    : routed.length === 1
      ? routed[0]!
      : null;

  if (slug && !match) {
    return {
      ok: false,
      alreadyResponded: false,
      reviewUrl: null,
      companyName: null,
      error: "That company was not on this quote request",
    };
  }

  if (routed.length > 1 && !match) {
    return {
      ok: false,
      alreadyResponded: false,
      reviewUrl: null,
      companyName: null,
      error: "Pick which company helped you",
    };
  }

  const now = nowIso ?? new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const helpedSlug = match?.companySlug ?? null;

  if (!existing) {
    const result = await db
      .prepare(
        `UPDATE leads
         SET checkin_response = 'yes',
             checkin_responded_at = ?,
             checkin_helped_company_slug = ?
         WHERE id = ?
           AND checkin_response IS NULL
           AND COALESCE(checkin_opt_out, 0) = 0`,
      )
      .bind(now, helpedSlug, leadId)
      .run();

    if ((result.meta.changes ?? 0) === 0) {
      const refreshed = await loadLeadForCheckin(db, leadId);
      if ((refreshed?.checkin_response ?? "").trim()) {
        return {
          ok: true,
          alreadyResponded: true,
          reviewUrl: null,
          companyName: match?.companyName ?? null,
        };
      }
    }
  } else if (
    helpedSlug &&
    !(lead.checkin_helped_company_slug ?? "").trim()
  ) {
    // Allowed: first yes without company, then pick company once.
    await db
      .prepare(
        `UPDATE leads
         SET checkin_helped_company_slug = ?
         WHERE id = ?
           AND checkin_response = 'yes'
           AND checkin_helped_company_slug IS NULL`,
      )
      .bind(helpedSlug, leadId)
      .run();
  }

  let reviewUrl: string | null = null;
  let companyName: string | null = match?.companyName ?? null;

  if (helpedSlug) {
    // Feed responsiveness: homeowner confirmed this pro engaged.
    await db
      .prepare(
        `UPDATE lead_routings
         SET first_viewed_at = COALESCE(first_viewed_at, ?),
             first_acted_at = COALESCE(first_acted_at, ?),
             company_status = CASE
               WHEN COALESCE(company_status, 'new') = 'new' THEN 'contacted'
               ELSE company_status
             END,
             status_updated_at = COALESCE(status_updated_at, ?)
         WHERE lead_id = ? AND company_slug = ?`,
      )
      .bind(now, now, now, leadId, helpedSlug)
      .run();

    try {
      const token = await ensureReviewToken(db, helpedSlug);
      if (token) {
        reviewUrl = reviewRequestUrl(token);
      } else if (match?.reviewToken) {
        reviewUrl = reviewRequestUrl(match.reviewToken);
      }
    } catch (err) {
      console.error("homeowner-checkin ensure review token failed", err);
    }

    if (!companyName) {
      const row = await db
        .prepare(`SELECT name FROM companies WHERE slug = ? LIMIT 1`)
        .bind(helpedSlug)
        .first<{ name: string }>();
      companyName = row?.name ?? helpedSlug;
    }
  }

  return {
    ok: true,
    alreadyResponded: Boolean(existing),
    reviewUrl,
    companyName,
  };
}

/**
 * Record "not yet" and immediately push into fallback re-routing
 * (next eligible claimed pro, or needs_admin_attention).
 */
export async function recordCheckinNotYet(
  env: CheckinEnv,
  leadId: number,
  options?: { nowIso?: string; dryRun?: boolean },
): Promise<{
  ok: boolean;
  alreadyResponded: boolean;
  routedSlug: string | null;
  flaggedAdmin: boolean;
  error?: string;
}> {
  const lead = await loadLeadForCheckin(env.DB, leadId);
  if (!lead) {
    return {
      ok: false,
      alreadyResponded: false,
      routedSlug: null,
      flaggedAdmin: false,
      error: "Lead not found",
    };
  }

  if (lead.checkin_opt_out) {
    return {
      ok: false,
      alreadyResponded: false,
      routedSlug: null,
      flaggedAdmin: false,
      error: "This email follow-up was unsubscribed",
    };
  }

  const existing = (lead.checkin_response ?? "").trim().toLowerCase();
  if (existing && existing !== "not_yet") {
    return {
      ok: false,
      alreadyResponded: true,
      routedSlug: null,
      flaggedAdmin: false,
      error: "You already responded to this check-in",
    };
  }

  const now = parseNow(options?.nowIso);
  const nowIso = now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const dryRun = Boolean(options?.dryRun);

  if (!existing && !dryRun) {
    const claimed = await env.DB.prepare(
      `UPDATE leads
       SET checkin_response = 'not_yet',
           checkin_responded_at = ?
       WHERE id = ?
         AND checkin_response IS NULL
         AND COALESCE(checkin_opt_out, 0) = 0`,
    )
      .bind(nowIso, leadId)
      .run();

    if ((claimed.meta.changes ?? 0) === 0) {
      const refreshed = await loadLeadForCheckin(env.DB, leadId);
      if ((refreshed?.checkin_response ?? "").trim() === "not_yet") {
        // Concurrent first write — continue into fallback once.
      } else if ((refreshed?.checkin_response ?? "").trim()) {
        return {
          ok: false,
          alreadyResponded: true,
          routedSlug: null,
          flaggedAdmin: false,
          error: "You already responded to this check-in",
        };
      }
    }
  }

  const fallback = await triggerHomeownerFallbackReroute(env, lead, {
    dryRun,
    nowIso,
  });

  return {
    ok: true,
    alreadyResponded: Boolean(existing),
    routedSlug: fallback.routedSlug,
    flaggedAdmin: fallback.flaggedAdmin,
  };
}

/**
 * Homeowner-triggered fallback: next eligible claimed pro under total cap,
 * or flag needs_admin_attention. Does not require the 24h silence gate —
 * the homeowner already said nobody helped.
 */
export async function triggerHomeownerFallbackReroute(
  env: CheckinEnv,
  lead: CheckinLeadRow,
  options?: { dryRun?: boolean; nowIso?: string; totalCap?: number },
): Promise<{ routedSlug: string | null; flaggedAdmin: boolean }> {
  const dryRun = Boolean(options?.dryRun);
  const nowIso =
    options?.nowIso ??
    new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const totalCap = options?.totalCap ?? LEAD_ROUTE_TOTAL_CAP;

  const already = new Set(await listExistingRoutingSlugs(env.DB, lead.id));
  const counted = already.size;

  if (counted >= totalCap) {
    if (dryRun) return { routedSlug: null, flaggedAdmin: true };
    const flagged = await flagLeadNeedsAdmin(env.DB, lead.id, nowIso);
    return { routedSlug: null, flaggedAdmin: flagged };
  }

  const pool = await findAreaRouteRecipients(env.DB, lead.zip, {
    cap: totalCap + already.size,
    excludeSlugs: already,
    service: lead.service,
    reason: "fallback",
  });

  const next = selectFallbackRecipients(pool, already, {
    currentCount: counted,
    totalCap,
    addCap: FALLBACK_ADD_PER_RUN,
  });

  if (next.length === 0) {
    if (dryRun) return { routedSlug: null, flaggedAdmin: true };
    const flagged = await flagLeadNeedsAdmin(env.DB, lead.id, nowIso);
    return { routedSlug: null, flaggedAdmin: flagged };
  }

  if (dryRun) {
    return { routedSlug: next[0]!.companySlug, flaggedAdmin: false };
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
    const emailed = await sendHomeownerEmail(env, recipient.email, {
      kind: payload.kind,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    routed.push({ ...recipient, reason: "fallback", emailed });
  }

  await persistLeadRouting(env.DB, lead.id, routed);
  // Clear needs-admin if we found someone (best-effort; may not have been set).
  try {
    await env.DB.prepare(
      `UPDATE leads SET needs_admin_attention = 0 WHERE id = ? AND needs_admin_attention = 1`,
    )
      .bind(lead.id)
      .run();
  } catch {
    // Column from migration 0030 — ignore if somehow missing.
  }

  return {
    routedSlug: routed[0]?.companySlug ?? null,
    flaggedAdmin: false,
  };
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

export async function recordCheckinOptOut(
  db: D1Database,
  leadId: number,
): Promise<{ ok: boolean; already: boolean }> {
  const lead = await loadLeadForCheckin(db, leadId);
  if (!lead) return { ok: false, already: false };
  if (lead.checkin_opt_out) return { ok: true, already: true };

  await db
    .prepare(
      `UPDATE leads
       SET checkin_opt_out = 1
       WHERE id = ?`,
    )
    .bind(leadId)
    .run();
  return { ok: true, already: false };
}

/** Admin strip: check-in funnel counts over a rolling window. */
export async function loadHomeownerCheckinStats(
  db: D1Database,
  windowDays = 30,
): Promise<{
  windowDays: number;
  sent: number;
  yes: number;
  notYet: number;
  noResponse: number;
  optedOut: number;
}> {
  const days = Math.min(Math.max(Math.floor(windowDays) || 30, 1), 365);

  const row = await db
    .prepare(
      `SELECT
         SUM(CASE WHEN checkin_sent_at IS NOT NULL
           AND datetime(checkin_sent_at) >= datetime('now', ?) THEN 1 ELSE 0 END) AS sent,
         SUM(CASE WHEN checkin_response = 'yes'
           AND datetime(COALESCE(checkin_responded_at, checkin_sent_at)) >= datetime('now', ?) THEN 1 ELSE 0 END) AS yes_count,
         SUM(CASE WHEN checkin_response = 'not_yet'
           AND datetime(COALESCE(checkin_responded_at, checkin_sent_at)) >= datetime('now', ?) THEN 1 ELSE 0 END) AS not_yet_count,
         SUM(CASE WHEN checkin_sent_at IS NOT NULL
           AND checkin_response IS NULL
           AND COALESCE(checkin_opt_out, 0) = 0
           AND datetime(checkin_sent_at) >= datetime('now', ?) THEN 1 ELSE 0 END) AS no_response,
         SUM(CASE WHEN COALESCE(checkin_opt_out, 0) = 1
           AND datetime(COALESCE(checkin_sent_at, created_at)) >= datetime('now', ?) THEN 1 ELSE 0 END) AS opted_out
       FROM leads`,
    )
    .bind(
      `-${days} days`,
      `-${days} days`,
      `-${days} days`,
      `-${days} days`,
      `-${days} days`,
    )
    .first<{
      sent: number | null;
      yes_count: number | null;
      not_yet_count: number | null;
      no_response: number | null;
      opted_out: number | null;
    }>();

  return {
    windowDays: days,
    sent: Number(row?.sent) || 0,
    yes: Number(row?.yes_count) || 0,
    notYet: Number(row?.not_yet_count) || 0,
    noResponse: Number(row?.no_response) || 0,
    optedOut: Number(row?.opted_out) || 0,
  };
}

/** Pure decision helper for tests. */
export function decideHomeownerCheckinSend(input: {
  email: string | null;
  name: string;
  status?: string | null;
  checkinSentAt: string | null;
  checkinResponse: string | null;
  checkinOptOut: boolean;
  createdAt: string;
  windowHours: number;
  maxAgeHours?: number;
  nowMs: number;
  resendConfigured: boolean;
  signingConfigured: boolean;
}): CheckinSendOutcome {
  const maxAgeHours = input.maxAgeHours ?? HOMEOWNER_CHECKIN_MAX_AGE_HOURS;
  if (
    !leadNeedsHomeownerCheckin({
      email: input.email,
      name: input.name,
      status: input.status ?? "new",
      checkinSentAt: input.checkinSentAt,
      checkinResponse: input.checkinResponse,
      checkinOptOut: input.checkinOptOut,
      createdAt: input.createdAt,
      windowHours: input.windowHours,
      maxAgeHours,
      nowMs: input.nowMs,
    })
  ) {
    if (input.checkinSentAt) return "skipped-already-sent";
    if (input.checkinResponse) return "skipped-already-responded";
    if (input.checkinOptOut) return "skipped-opt-out";
    if (!isCheckinEligibleLeadStatus(input.status ?? "new")) {
      return "skipped-closed";
    }
    if (isLikelyTestOrSpamLead(input)) return "skipped-spam";
    if (!isValidHomeownerEmail(input.email)) return "skipped-no-email";
    const createdMs = Date.parse(
      input.createdAt.includes("T")
        ? input.createdAt
        : `${input.createdAt}Z`,
    );
    if (
      Number.isFinite(createdMs) &&
      input.nowMs - createdMs > maxAgeHours * 60 * 60 * 1000
    ) {
      return "skipped-too-old";
    }
    return "skipped-under-window";
  }
  if (!input.signingConfigured) return "skipped-no-signing";
  if (!input.resendConfigured) return "skipped-no-resend";
  return "sent";
}
