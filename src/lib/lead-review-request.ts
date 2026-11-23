/**
 * Owner-triggered review-request emails for won lead_routings rows.
 * Manage-token scoped: company A cannot send for company B's routings.
 * Idempotent per routing (review_requested_at); soft daily cap per company.
 */

import type { D1Database } from "@cloudflare/workers-types";
import {
  cityLabelForZip,
  isCompanyLeadStatus,
  type CompanyLead,
  type CompanyLeadStatus,
} from "@/lib/company-leads";
import { reviewRequestUrl } from "@/lib/review-request";

/** Soft cap: outbound review-request emails per company per UTC day. */
export const REVIEW_REQUEST_RATE_LIMIT_PER_DAY = 20;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadReviewRequestResult =
  | {
      ok: true;
      alreadySent: boolean;
      lead: CompanyLead;
      reviewUrl: string;
      emailed: boolean;
      message: string;
    }
  | { ok: false; error: string; status: number };

export function parseLeadReviewRequestBody(
  body: unknown,
): { routingId: number } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid JSON" };
  }
  const raw = body as { routingId?: unknown; id?: unknown };
  const routingId = Number(raw.routingId ?? raw.id);
  if (!Number.isInteger(routingId) || routingId <= 0) {
    return { error: "routingId is required" };
  }
  return { routingId };
}

/** Homeowner email must look deliverable before we send. */
export function isValidHomeownerEmail(email: string | null | undefined): boolean {
  const normalized = (email ?? "").trim().toLowerCase();
  if (!normalized || normalized.length > 254) return false;
  if (!EMAIL_RE.test(normalized)) return false;
  const [, domain] = normalized.split("@");
  if (
    !domain ||
    !domain.includes(".") ||
    domain.startsWith(".") ||
    domain.endsWith(".")
  ) {
    return false;
  }
  return true;
}

export function canRequestReviewForLead(lead: {
  companyStatus: CompanyLeadStatus | string;
  email: string | null | undefined;
}): { ok: true } | { ok: false; error: string } {
  const status = String(lead.companyStatus ?? "")
    .trim()
    .toLowerCase();
  if (!isCompanyLeadStatus(status) || status !== "won") {
    return { ok: false, error: "Only won leads can receive a review request" };
  }
  if (!isValidHomeownerEmail(lead.email)) {
    return {
      ok: false,
      error: "This lead has no valid homeowner email to send a review request to",
    };
  }
  return { ok: true };
}

/** Append lead routing id for attribution on submit (still company-bound by token). */
export function reviewRequestUrlForLead(
  reviewToken: string,
  routingId: number,
): string {
  const base = reviewRequestUrl(reviewToken);
  const id = Number(routingId);
  if (!Number.isInteger(id) || id <= 0) return base;
  const join = base.includes("?") ? "&" : "?";
  return `${base}${join}lead=${id}`;
}

export function formatReviewRequestedLabel(iso: string | null | undefined): string {
  if (!iso?.trim()) return "";
  const raw = iso.trim();
  const d = new Date(raw.includes("T") ? raw : `${raw}Z`);
  if (Number.isNaN(d.getTime())) return `Review requested on ${raw}`;
  const label = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `Review requested on ${label}`;
}

type RoutingLeadRow = {
  routing_id: number;
  lead_id: number;
  company_slug: string;
  reason: string;
  emailed: number;
  company_status: string | null;
  status_updated_at: string | null;
  first_viewed_at: string | null;
  first_acted_at: string | null;
  review_requested_at: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  zip: string;
  service: string;
  issue: string;
  timing: string;
  created_at: string;
};

function mapLeadRow(
  row: RoutingLeadRow,
  city: string | null,
): CompanyLead {
  const statusRaw = (row.company_status ?? "new").trim().toLowerCase();
  const companyStatus: CompanyLeadStatus = isCompanyLeadStatus(statusRaw)
    ? statusRaw
    : "new";
  return {
    routingId: row.routing_id,
    leadId: row.lead_id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    zip: row.zip,
    city,
    service: row.service,
    issue: row.issue,
    timing: row.timing,
    reason: row.reason,
    companyStatus,
    statusUpdatedAt: row.status_updated_at,
    firstViewedAt: row.first_viewed_at,
    firstActedAt: row.first_acted_at,
    createdAt: row.created_at,
    emailed: Boolean(row.emailed),
    reviewRequestedAt: row.review_requested_at,
  };
}

async function loadOwnedRouting(
  db: D1Database,
  companySlug: string,
  routingId: number,
): Promise<RoutingLeadRow | null> {
  const slug = companySlug.trim();
  if (!slug || !Number.isInteger(routingId) || routingId <= 0) return null;
  return (
    (await db
      .prepare(
        `SELECT lr.id AS routing_id,
                lr.lead_id AS lead_id,
                lr.company_slug AS company_slug,
                lr.reason AS reason,
                lr.emailed AS emailed,
                COALESCE(lr.company_status, 'new') AS company_status,
                lr.status_updated_at AS status_updated_at,
                lr.first_viewed_at AS first_viewed_at,
                lr.first_acted_at AS first_acted_at,
                lr.review_requested_at AS review_requested_at,
                l.name AS name,
                l.phone AS phone,
                l.email AS email,
                l.zip AS zip,
                l.service AS service,
                l.issue AS issue,
                l.timing AS timing,
                l.created_at AS created_at
         FROM lead_routings lr
         INNER JOIN leads l ON l.id = lr.lead_id
         WHERE lr.id = ? AND lr.company_slug = ?
         LIMIT 1`,
      )
      .bind(routingId, slug)
      .first<RoutingLeadRow>()) ?? null
  );
}

/**
 * Count review requests sent by this company in the last 24 hours
 * (rows where review_requested_at is set in the window).
 */
export async function countRecentReviewRequests(
  db: D1Database,
  companySlug: string,
): Promise<number> {
  const slug = companySlug.trim();
  if (!slug) return 0;
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM lead_routings
       WHERE company_slug = ?
         AND review_requested_at IS NOT NULL
         AND review_requested_at >= datetime('now', '-1 day')`,
    )
    .bind(slug)
    .first<{ n: number }>();
  return Number(row?.n ?? 0);
}

/**
 * Whether a submitted review may be attributed to this routing.
 * Requires: owned by company, status won, and a prior owner-triggered send.
 */
export async function resolveLeadRoutingAttribution(
  db: D1Database,
  companySlug: string,
  routingId: number | null | undefined,
): Promise<number | null> {
  if (routingId == null) return null;
  const id = Number(routingId);
  if (!Number.isInteger(id) || id <= 0) return null;
  const row = await loadOwnedRouting(db, companySlug, id);
  if (!row) return null;
  const status = (row.company_status ?? "").trim().toLowerCase();
  if (status !== "won") return null;
  if (!row.review_requested_at) return null;
  return row.routing_id;
}

export type SendLeadReviewRequestDeps = {
  db: D1Database;
  companySlug: string;
  routingId: number;
  reviewToken: string;
  /** Returns whether Resend accepted the send. */
  sendEmail: (to: string, reviewUrl: string) => Promise<boolean>;
  /** Optional city label resolver (tests can stub). */
  cityForZip?: (zip: string) => string | null;
};

/**
 * Send (or no-op idempotently) a review-request email for a won routing.
 * Always filters by companySlug so cross-company tokens cannot trigger sends.
 */
export async function sendLeadReviewRequest(
  deps: SendLeadReviewRequestDeps,
): Promise<LeadReviewRequestResult> {
  const { db, companySlug, routingId, reviewToken, sendEmail } = deps;
  const cityForZip = deps.cityForZip ?? cityLabelForZip;

  const row = await loadOwnedRouting(db, companySlug, routingId);
  if (!row) {
    return { ok: false, error: "Not found", status: 404 };
  }

  const lead = mapLeadRow(row, cityForZip(row.zip));
  const reviewUrl = reviewRequestUrlForLead(reviewToken, lead.routingId);

  if (lead.reviewRequestedAt) {
    return {
      ok: true,
      alreadySent: true,
      lead,
      reviewUrl,
      emailed: false,
      message: formatReviewRequestedLabel(lead.reviewRequestedAt),
    };
  }

  const eligibility = canRequestReviewForLead(lead);
  if (!eligibility.ok) {
    return { ok: false, error: eligibility.error, status: 400 };
  }

  const recent = await countRecentReviewRequests(db, companySlug);
  if (recent >= REVIEW_REQUEST_RATE_LIMIT_PER_DAY) {
    return {
      ok: false,
      error:
        "Daily review-request limit reached. Try again tomorrow, or copy the review link instead.",
      status: 429,
    };
  }

  const to = (lead.email ?? "").trim();
  const emailed = await sendEmail(to, reviewUrl);

  if (!emailed) {
    return {
      ok: false,
      error:
        "Email sending is not configured right now. Copy the review link and send it yourself, or try again later.",
      status: 503,
    };
  }

  // Mark sent only after Resend accepts — keeps retries possible on failure.
  await db
    .prepare(
      `UPDATE lead_routings
       SET review_requested_at = datetime('now')
       WHERE id = ? AND company_slug = ? AND review_requested_at IS NULL`,
    )
    .bind(routingId, companySlug.trim())
    .run();

  const refreshed = await loadOwnedRouting(db, companySlug, routingId);
  const updatedLead = refreshed
    ? mapLeadRow(refreshed, cityForZip(refreshed.zip))
    : { ...lead, reviewRequestedAt: new Date().toISOString() };

  return {
    ok: true,
    alreadySent: false,
    lead: updatedLead,
    reviewUrl,
    emailed: true,
    message: formatReviewRequestedLabel(updatedLead.reviewRequestedAt),
  };
}

/** Pure helpers for tests — decide outcome without D1/Resend. */
export function decideLeadReviewRequest(input: {
  ownedByCompany: boolean;
  companyStatus: string;
  email: string | null;
  alreadyRequestedAt: string | null;
  recentCount: number;
  resendConfigured: boolean;
  sendSucceeded: boolean;
}):
  | { action: "idempotent"; label: string }
  | { action: "send" }
  | { action: "reject"; error: string; status: number } {
  if (!input.ownedByCompany) {
    return { action: "reject", error: "Not found", status: 404 };
  }
  if (input.alreadyRequestedAt) {
    return {
      action: "idempotent",
      label: formatReviewRequestedLabel(input.alreadyRequestedAt),
    };
  }
  const eligibility = canRequestReviewForLead({
    companyStatus: input.companyStatus,
    email: input.email,
  });
  if (!eligibility.ok) {
    return { action: "reject", error: eligibility.error, status: 400 };
  }
  if (input.recentCount >= REVIEW_REQUEST_RATE_LIMIT_PER_DAY) {
    return {
      action: "reject",
      error:
        "Daily review-request limit reached. Try again tomorrow, or copy the review link instead.",
      status: 429,
    };
  }
  if (!input.resendConfigured || !input.sendSucceeded) {
    return {
      action: "reject",
      error:
        "Email sending is not configured right now. Copy the review link and send it yourself, or try again later.",
      status: 503,
    };
  }
  return { action: "send" };
}
