/**
 * Weekly performance email digest for claimed companies.
 *
 * Designed to run from a Cloudflare Cron Trigger (custom Worker entry) with
 * env.DB / env.RESEND_API_KEY directly — no Next.js request ALS required.
 * Admin preview / dry-run routes reuse the same helpers via getDb().
 */

import type { D1Database } from "@cloudflare/workers-types";
import { SITE_URL } from "@/data/site";
import {
  addUtcDays,
  emptyListingTotals,
  LISTING_STAT_LABELS,
  sumListingStatsForRange,
  utcDay,
  type ListingStatTotals,
} from "@/lib/listing-stats";
import { manageUrl } from "@/lib/listing-manage";

/** Monday 9:00 AM Eastern Standard ≈ 14:00 UTC (10:00 AM EDT). */
export const WEEKLY_DIGEST_CRON = "0 14 * * 1";

export type DigestWindow = {
  /** Monday (UTC) of the week being summarized — idempotency key. */
  weekStart: string;
  /** Inclusive start day (YYYY-MM-DD UTC). */
  periodStart: string;
  /** Inclusive end day (YYYY-MM-DD UTC). */
  periodEnd: string;
  /** UTC calendar day the job is running (typically the following Monday). */
  asOfDay: string;
};

export type DigestRecipient = {
  slug: string;
  name: string;
  city: string;
  featured: boolean;
  notifyEmail: string;
  manageToken: string;
  weeklyDigestOptOut: boolean;
};

export type CompanyDigestStats = {
  listing: ListingStatTotals;
  leadsCount: number;
  reviewsCount: number;
};

export type CompanyDigest = {
  company: DigestRecipient;
  window: DigestWindow;
  stats: CompanyDigestStats;
  managePageUrl: string;
  unsubscribeUrl: string;
  featuredUrl: string;
  hasActivity: boolean;
};

export type DigestPayload = {
  kind: "weekly-digest";
  subject: string;
  text: string;
  html: string;
};

export type DigestSendResult = {
  slug: string;
  weekStart: string;
  status:
    | "sent"
    | "dry-run"
    | "skipped-no-email"
    | "skipped-opt-out"
    | "skipped-no-activity"
    | "skipped-already-sent"
    | "skipped-no-resend"
    | "skipped-no-manage-token"
    | "failed-send"
    | "failed-claim";
  emailed: boolean;
  preview?: DigestPayload;
};

export type DigestRunOptions = {
  /** When true, never call Resend and never insert send rows. */
  dryRun?: boolean;
  /** Limit to one company slug (admin preview / single send). */
  slug?: string;
  /** Override "today" for tests (UTC YYYY-MM-DD). */
  asOfDay?: string;
  /**
   * When true with a slug, return the formatted email even if the company
   * would normally be skipped for no activity (admin preview).
   */
  forcePreview?: boolean;
};

type DigestEnv = {
  DB: D1Database;
  RESEND_API_KEY?: string;
  NOTIFY_FROM_EMAIL?: string;
};

/**
 * UTC Monday on or before `day`. Sunday maps back to the prior Monday.
 */
export function mondayOnOrBefore(day: string): string {
  const d = new Date(`${day}T00:00:00.000Z`);
  const dow = d.getUTCDay(); // 0 Sun … 6 Sat
  const delta = dow === 0 ? -6 : 1 - dow;
  return addUtcDays(day, delta);
}

/**
 * Digest covers the previous Mon–Sun relative to the Monday the cron runs.
 * Idempotency key (`weekStart`) is that previous Monday.
 */
export function digestWindowFor(asOfDay: string = utcDay()): DigestWindow {
  const cronMonday = mondayOnOrBefore(asOfDay);
  const periodStart = addUtcDays(cronMonday, -7);
  const periodEnd = addUtcDays(cronMonday, -1);
  return {
    weekStart: periodStart,
    periodStart,
    periodEnd,
    asOfDay,
  };
}

export function hasDigestActivity(stats: CompanyDigestStats): boolean {
  const { listing, leadsCount, reviewsCount } = stats;
  return (
    listing.profile_views > 0 ||
    listing.contact_clicks > 0 ||
    listing.leads_routed > 0 ||
    listing.review_link_visits > 0 ||
    listing.review_submissions > 0 ||
    leadsCount > 0 ||
    reviewsCount > 0
  );
}

export function digestUnsubscribeUrl(manageToken: string): string {
  return `${SITE_URL}/api/manage/${manageToken}/digest/?action=unsubscribe`;
}

export function featuredPlansUrl(company: {
  name: string;
  city: string;
  slug: string;
}): string {
  const q = new URLSearchParams({
    company: company.name,
    city: company.city,
    slug: company.slug,
  });
  return `${SITE_URL}/for-companies/?${q.toString()}#featured`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatDayLabel(day: string): string {
  const d = new Date(`${day}T00:00:00.000Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Build subject/text/html for one company's weekly digest. */
export function formatWeeklyDigestNotify(digest: CompanyDigest): DigestPayload {
  const { company, window, stats } = digest;
  const rangeLabel = `${formatDayLabel(window.periodStart)} – ${formatDayLabel(window.periodEnd)}`;
  const subject = `Your week on Michigan Garage Pros (${formatDayLabel(window.periodStart)})`;

  const metricLines = [
    `${LISTING_STAT_LABELS.profile_views}: ${stats.listing.profile_views}`,
    `${LISTING_STAT_LABELS.contact_clicks}: ${stats.listing.contact_clicks}`,
    `New leads: ${stats.leadsCount}`,
    `New reviews: ${stats.reviewsCount}`,
  ];

  const textLines = [
    `Hi ${company.name},`,
    "",
    `Here's your listing activity for ${rangeLabel} (UTC):`,
    "",
    ...metricLines.map((l) => `  • ${l}`),
    "",
    "Open your manage page to update your listing, reply to reviews, and work leads:",
    digest.managePageUrl,
    "",
    "Lead inbox is on the same page (scroll to Leads).",
  ];

  if (!company.featured) {
    textLines.push(
      "",
      "Optional: Featured Pros sit at the top of city results when you want more visibility:",
      digest.featuredUrl,
    );
  }

  textLines.push(
    "",
    "To stop these weekly emails:",
    digest.unsubscribeUrl,
    "",
    "— Michigan Garage Pros",
    SITE_URL,
  );

  const metricHtml = metricLines
    .map((l) => `<li>${escapeHtml(l)}</li>`)
    .join("");

  const featuredHtml = company.featured
    ? ""
    : [
        `<p>Optional: Featured Pros sit at the top of city results when you want more visibility — <a href="${escapeHtml(digest.featuredUrl)}">see Featured plans</a>.</p>`,
      ].join("\n");

  const html = [
    `<p>Hi ${escapeHtml(company.name)},</p>`,
    `<p>Here's your listing activity for <strong>${escapeHtml(rangeLabel)}</strong> (UTC):</p>`,
    `<ul>${metricHtml}</ul>`,
    `<p><a href="${escapeHtml(digest.managePageUrl)}">Open your manage page</a> to update your listing, reply to reviews, and work your <strong>lead inbox</strong>.</p>`,
    featuredHtml,
    `<p style="color:#666;font-size:13px">To stop these weekly emails, <a href="${escapeHtml(digest.unsubscribeUrl)}">unsubscribe</a>.</p>`,
    `<p>— Michigan Garage Pros<br/><a href="${escapeHtml(SITE_URL)}">${escapeHtml(SITE_URL)}</a></p>`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    kind: "weekly-digest",
    subject,
    text: textLines.join("\n"),
    html,
  };
}

export async function listDigestRecipients(
  db: D1Database,
  slug?: string,
): Promise<DigestRecipient[]> {
  const base = `
    SELECT slug, name, city, featured, notify_email, manage_token,
           COALESCE(weekly_digest_opt_out, 0) AS weekly_digest_opt_out
    FROM companies
    WHERE claimed = 1
  `;
  const { results } = slug
    ? await db
        .prepare(`${base} AND slug = ? LIMIT 1`)
        .bind(slug.trim())
        .all<{
          slug: string;
          name: string;
          city: string;
          featured: number;
          notify_email: string | null;
          manage_token: string | null;
          weekly_digest_opt_out: number;
        }>()
    : await db
        .prepare(
          `${base}
           AND notify_email IS NOT NULL AND trim(notify_email) != ''
           AND manage_token IS NOT NULL AND trim(manage_token) != ''
           AND COALESCE(weekly_digest_opt_out, 0) = 0
           ORDER BY slug ASC`,
        )
        .all<{
          slug: string;
          name: string;
          city: string;
          featured: number;
          notify_email: string | null;
          manage_token: string | null;
          weekly_digest_opt_out: number;
        }>();

  return (results ?? []).map((row) => ({
    slug: row.slug,
    name: row.name,
    city: row.city ?? "",
    featured: Boolean(row.featured),
    notifyEmail: (row.notify_email ?? "").trim(),
    manageToken: (row.manage_token ?? "").trim(),
    weeklyDigestOptOut: Boolean(row.weekly_digest_opt_out),
  }));
}

export async function loadCompanyDigestStats(
  db: D1Database,
  companySlug: string,
  window: DigestWindow,
): Promise<CompanyDigestStats> {
  const listing = await sumListingStatsForRange(
    db,
    companySlug,
    window.periodStart,
    window.periodEnd,
  );

  // Inclusive day range → SQLite datetime bounds (UTC calendar days).
  const startBound = `${window.periodStart} 00:00:00`;
  const endBound = `${window.periodEnd} 23:59:59`;

  const [leadsRow, reviewsRow] = await Promise.all([
    db
      .prepare(
        `SELECT COUNT(*) AS n
         FROM lead_routings lr
         INNER JOIN leads l ON l.id = lr.lead_id
         WHERE lr.company_slug = ?
           AND datetime(l.created_at) >= datetime(?)
           AND datetime(l.created_at) <= datetime(?)`,
      )
      .bind(companySlug, startBound, endBound)
      .first<{ n: number }>(),
    db
      .prepare(
        `SELECT COUNT(*) AS n
         FROM company_reviews
         WHERE company_slug = ?
           AND datetime(created_at) >= datetime(?)
           AND datetime(created_at) <= datetime(?)`,
      )
      .bind(companySlug, startBound, endBound)
      .first<{ n: number }>(),
  ]);

  return {
    listing,
    leadsCount: Number(leadsRow?.n ?? 0),
    reviewsCount: Number(reviewsRow?.n ?? 0),
  };
}

export async function buildCompanyDigest(
  db: D1Database,
  company: DigestRecipient,
  window: DigestWindow,
): Promise<CompanyDigest> {
  const stats = await loadCompanyDigestStats(db, company.slug, window);
  return {
    company,
    window,
    stats,
    managePageUrl: manageUrl(company.manageToken),
    unsubscribeUrl: digestUnsubscribeUrl(company.manageToken),
    featuredUrl: featuredPlansUrl(company),
    hasActivity: hasDigestActivity(stats),
  };
}

async function alreadySent(
  db: D1Database,
  companySlug: string,
  weekStart: string,
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1 AS ok FROM weekly_digest_sends
       WHERE company_slug = ? AND week_start = ? LIMIT 1`,
    )
    .bind(companySlug, weekStart)
    .first<{ ok: number }>();
  return Boolean(row);
}

/**
 * Insert send row first (PRIMARY KEY) so concurrent / retried cron runs
 * cannot double-email. Returns false if the row already existed.
 */
async function claimDigestSend(
  db: D1Database,
  input: {
    companySlug: string;
    weekStart: string;
    notifyEmail: string;
    stats: CompanyDigestStats;
    emailed: boolean;
  },
): Promise<boolean> {
  try {
    const result = await db
      .prepare(
        `INSERT INTO weekly_digest_sends (
           company_slug, week_start, emailed, notify_email,
           profile_views, contact_clicks, leads_count, reviews_count
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.companySlug,
        input.weekStart,
        input.emailed ? 1 : 0,
        input.notifyEmail,
        input.stats.listing.profile_views,
        input.stats.listing.contact_clicks,
        input.stats.leadsCount,
        input.stats.reviewsCount,
      )
      .run();
    return (result.meta.changes ?? 0) > 0;
  } catch (err) {
    // UNIQUE conflict → already claimed
    const message = err instanceof Error ? err.message : String(err);
    if (/unique|constraint|PRIMARY/i.test(message)) return false;
    console.error("weekly-digest claim failed", input.companySlug, err);
    return false;
  }
}

async function markDigestEmailed(
  db: D1Database,
  companySlug: string,
  weekStart: string,
  emailed: boolean,
): Promise<void> {
  await db
    .prepare(
      `UPDATE weekly_digest_sends
       SET emailed = ?, sent_at = datetime('now')
       WHERE company_slug = ? AND week_start = ?`,
    )
    .bind(emailed ? 1 : 0, companySlug, weekStart)
    .run();
}

async function sendResendDigest(
  env: DigestEnv,
  to: string,
  payload: DigestPayload,
): Promise<boolean> {
  const key = env.RESEND_API_KEY?.trim();
  if (!key) return false;

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
        to: [to],
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      }),
    });
    if (!res.ok) {
      console.error(
        "weekly-digest Resend failed",
        res.status,
        await res.text(),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("weekly-digest Resend error", err);
    return false;
  }
}

export async function getWeeklyDigestOptOut(
  db: D1Database,
  slug: string,
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT COALESCE(weekly_digest_opt_out, 0) AS weekly_digest_opt_out
       FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<{ weekly_digest_opt_out: number }>();
  return Boolean(row?.weekly_digest_opt_out);
}

export async function setWeeklyDigestOptOut(
  db: D1Database,
  slug: string,
  optOut: boolean,
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE companies SET weekly_digest_opt_out = ?
       WHERE slug = ? AND claimed = 1`,
    )
    .bind(optOut ? 1 : 0, slug)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

/**
 * Process one company: skip / dry-run / send. Never throws for send failures.
 */
export async function processCompanyDigest(
  env: DigestEnv,
  company: DigestRecipient,
  window: DigestWindow,
  options: DigestRunOptions = {},
): Promise<DigestSendResult> {
  const dryRun = Boolean(options.dryRun);
  const base = {
    slug: company.slug,
    weekStart: window.weekStart,
  };

  if (!company.notifyEmail) {
    return { ...base, status: "skipped-no-email", emailed: false };
  }
  if (!company.manageToken) {
    return { ...base, status: "skipped-no-manage-token", emailed: false };
  }
  if (company.weeklyDigestOptOut && !options.forcePreview) {
    return { ...base, status: "skipped-opt-out", emailed: false };
  }

  let digest: CompanyDigest;
  try {
    digest = await buildCompanyDigest(env.DB, company, window);
  } catch (err) {
    console.error("weekly-digest build failed", company.slug, err);
    return { ...base, status: "failed-claim", emailed: false };
  }

  const payload = formatWeeklyDigestNotify(digest);

  if (!digest.hasActivity && !options.forcePreview) {
    return { ...base, status: "skipped-no-activity", emailed: false };
  }

  if (dryRun) {
    return {
      ...base,
      status: "dry-run",
      emailed: false,
      preview: payload,
    };
  }

  if (await alreadySent(env.DB, company.slug, window.weekStart)) {
    return { ...base, status: "skipped-already-sent", emailed: false };
  }

  if (!env.RESEND_API_KEY?.trim()) {
    console.warn(
      "weekly-digest: no RESEND_API_KEY configured; skipping send",
      company.slug,
    );
    return { ...base, status: "skipped-no-resend", emailed: false };
  }

  // Claim the idempotency slot before calling Resend.
  const claimed = await claimDigestSend(env.DB, {
    companySlug: company.slug,
    weekStart: window.weekStart,
    notifyEmail: company.notifyEmail,
    stats: digest.stats,
    emailed: false,
  });
  if (!claimed) {
    return { ...base, status: "skipped-already-sent", emailed: false };
  }

  const emailed = await sendResendDigest(env, company.notifyEmail, payload);
  try {
    await markDigestEmailed(
      env.DB,
      company.slug,
      window.weekStart,
      emailed,
    );
  } catch (err) {
    console.error("weekly-digest mark emailed failed", company.slug, err);
  }

  console.log("weekly-digest", {
    slug: company.slug,
    weekStart: window.weekStart,
    emailed,
    to: company.notifyEmail,
  });

  return {
    ...base,
    status: emailed ? "sent" : "failed-send",
    emailed,
    preview: options.forcePreview ? payload : undefined,
  };
}

/**
 * Cron / admin entry: process all eligible companies (or one slug).
 * Never throws — logs and returns per-company results.
 */
export async function runWeeklyDigests(
  env: DigestEnv,
  options: DigestRunOptions = {},
): Promise<{
  window: DigestWindow;
  results: DigestSendResult[];
  summary: Record<DigestSendResult["status"], number>;
}> {
  const window = digestWindowFor(options.asOfDay ?? utcDay());
  const summary: Record<DigestSendResult["status"], number> = {
    sent: 0,
    "dry-run": 0,
    "skipped-no-email": 0,
    "skipped-opt-out": 0,
    "skipped-no-activity": 0,
    "skipped-already-sent": 0,
    "skipped-no-resend": 0,
    "skipped-no-manage-token": 0,
    "failed-send": 0,
    "failed-claim": 0,
  };

  let recipients: DigestRecipient[] = [];
  try {
    recipients = await listDigestRecipients(env.DB, options.slug);
  } catch (err) {
    console.error("weekly-digest list recipients failed", err);
    return { window, results: [], summary };
  }

  const results: DigestSendResult[] = [];
  for (const company of recipients) {
    try {
      const result = await processCompanyDigest(env, company, window, options);
      results.push(result);
      summary[result.status] += 1;
    } catch (err) {
      console.error("weekly-digest process failed", company.slug, err);
      const failed: DigestSendResult = {
        slug: company.slug,
        weekStart: window.weekStart,
        status: "failed-claim",
        emailed: false,
      };
      results.push(failed);
      summary["failed-claim"] += 1;
    }
  }

  console.log("weekly-digest run complete", {
    weekStart: window.weekStart,
    periodStart: window.periodStart,
    periodEnd: window.periodEnd,
    dryRun: Boolean(options.dryRun),
    count: results.length,
    summary,
  });

  return { window, results, summary };
}

/** Empty stats helper for tests. */
export function emptyDigestStats(): CompanyDigestStats {
  return {
    listing: emptyListingTotals(),
    leadsCount: 0,
    reviewsCount: 0,
  };
}
