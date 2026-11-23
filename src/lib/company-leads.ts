import type { D1Database } from "@cloudflare/workers-types";
import { getCityBySlug } from "@/data/cities";
import { citySlugForZip, normalizeZip } from "@/data/zipCodes";

/**
 * Per-company pipeline status on a lead_routings row.
 * Distinct from leads.status (admin operator: new|contacted|closed).
 */
export const COMPANY_LEAD_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
] as const;

export type CompanyLeadStatus = (typeof COMPANY_LEAD_STATUSES)[number];

export const COMPANY_LEAD_STATUS_LABELS: Record<CompanyLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export type CompanyLead = {
  routingId: number;
  leadId: number;
  name: string;
  phone: string | null;
  email: string | null;
  zip: string;
  city: string | null;
  service: string;
  /** Homeowner's free-text issue / message. */
  issue: string;
  timing: string;
  reason: string;
  companyStatus: CompanyLeadStatus;
  statusUpdatedAt: string | null;
  /** First time this company opened the lead in the manage inbox. */
  firstViewedAt: string | null;
  /** First time this company left status "new" (contacted/quoted/won/lost). */
  firstActedAt: string | null;
  createdAt: string;
  emailed: boolean;
  /** When the owner emailed a review request for this routing; null if never. */
  reviewRequestedAt: string | null;
};

export type CompanyLeadTotals = {
  total: number;
  byStatus: Record<CompanyLeadStatus, number>;
};

type LeadRoutingRow = {
  routing_id: number;
  lead_id: number;
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

export function isCompanyLeadStatus(value: string): value is CompanyLeadStatus {
  return (COMPANY_LEAD_STATUSES as readonly string[]).includes(value);
}

export function emptyCompanyLeadTotals(): CompanyLeadTotals {
  return {
    total: 0,
    byStatus: {
      new: 0,
      contacted: 0,
      quoted: 0,
      won: 0,
      lost: 0,
    },
  };
}

export function summarizeCompanyLeads(
  leads: Array<{ companyStatus: CompanyLeadStatus }>,
): CompanyLeadTotals {
  const totals = emptyCompanyLeadTotals();
  for (const lead of leads) {
    totals.total += 1;
    totals.byStatus[lead.companyStatus] += 1;
  }
  return totals;
}

/** Resolve a display city for a lead ZIP; null when unknown. */
export function cityLabelForZip(zip: string): string | null {
  const normalized = normalizeZip(zip) ?? zip.trim().replace(/\D/g, "").slice(0, 5);
  if (!normalized) return null;
  const slug = citySlugForZip(normalized);
  if (!slug) return null;
  return getCityBySlug(slug)?.name ?? null;
}

/**
 * Pure scoping helper for tests + defensive filtering.
 * Only rows whose companySlug matches the requester are kept.
 */
export function scopeRoutingsToCompany<T extends { companySlug: string }>(
  rows: T[],
  companySlug: string,
): T[] {
  const slug = companySlug.trim();
  if (!slug) return [];
  return rows.filter((row) => row.companySlug === slug);
}

/**
 * Whether a routing row may be updated by the company identified by companySlug.
 * Used by the manage API after looking up the row (or as a pure check in tests).
 */
export function routingBelongsToCompany(
  routing: { companySlug: string } | null | undefined,
  companySlug: string,
): boolean {
  if (!routing) return false;
  const slug = companySlug.trim();
  if (!slug) return false;
  return routing.companySlug === slug;
}

export function parseCompanyLeadStatusPatch(body: unknown):
  | { routingId: number; status: CompanyLeadStatus }
  | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid JSON" };
  }
  const raw = body as { routingId?: unknown; id?: unknown; status?: unknown };
  const routingId = Number(raw.routingId ?? raw.id);
  const status =
    typeof raw.status === "string" ? raw.status.trim().toLowerCase() : "";
  if (!Number.isInteger(routingId) || routingId <= 0) {
    return { error: "routingId is required" };
  }
  if (!isCompanyLeadStatus(status)) {
    return {
      error: `status must be one of: ${COMPANY_LEAD_STATUSES.join(", ")}`,
    };
  }
  return { routingId, status };
}

function normalizeStatus(raw: string | null | undefined): CompanyLeadStatus {
  const v = (raw ?? "new").trim().toLowerCase();
  return isCompanyLeadStatus(v) ? v : "new";
}

function mapRow(row: LeadRoutingRow): CompanyLead {
  return {
    routingId: row.routing_id,
    leadId: row.lead_id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    zip: row.zip,
    city: cityLabelForZip(row.zip),
    service: row.service,
    issue: row.issue,
    timing: row.timing,
    reason: row.reason,
    companyStatus: normalizeStatus(row.company_status),
    statusUpdatedAt: row.status_updated_at,
    firstViewedAt: row.first_viewed_at,
    firstActedAt: row.first_acted_at,
    createdAt: row.created_at,
    emailed: Boolean(row.emailed),
    reviewRequestedAt: row.review_requested_at,
  };
}

const LEAD_SELECT_SQL = `SELECT lr.id AS routing_id,
              lr.lead_id AS lead_id,
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
       INNER JOIN leads l ON l.id = lr.lead_id`;

/**
 * Stamp first_viewed_at on unviewed routings for this company.
 * Idempotent: only fills NULL. Fail-open — never throws to callers.
 */
export async function markCompanyLeadsViewed(
  db: D1Database,
  companySlug: string,
): Promise<number> {
  const slug = companySlug.trim();
  if (!slug) return 0;
  try {
    const result = await db
      .prepare(
        `UPDATE lead_routings
         SET first_viewed_at = datetime('now')
         WHERE company_slug = ?
           AND first_viewed_at IS NULL`,
      )
      .bind(slug)
      .run();
    return Number(result.meta.changes ?? 0);
  } catch (err) {
    // Column may be missing until migration 0029 is applied.
    console.error("markCompanyLeadsViewed failed", err);
    return 0;
  }
}

/**
 * Leads actually routed to this company (lead_routings.company_slug).
 * Consent/routing already happened in lead-routing; we never invent rows.
 * When markViewed is true (manage inbox), stamps first_viewed_at once.
 */
export async function listCompanyLeads(
  db: D1Database,
  companySlug: string,
  options?: { limit?: number; markViewed?: boolean },
): Promise<CompanyLead[]> {
  const slug = companySlug.trim();
  if (!slug) return [];
  const limit = Math.min(Math.max(options?.limit ?? 100, 1), 200);

  if (options?.markViewed) {
    await markCompanyLeadsViewed(db, slug);
  }

  const { results } = await db
    .prepare(
      `${LEAD_SELECT_SQL}
       WHERE lr.company_slug = ?
       ORDER BY datetime(l.created_at) DESC
       LIMIT ?`,
    )
    .bind(slug, limit)
    .all<LeadRoutingRow>();

  return (results ?? []).map(mapRow);
}

/**
 * Update company_status for a routing row owned by companySlug.
 * Returns null when the row is missing or belongs to another company.
 */
export async function updateCompanyLeadStatus(
  db: D1Database,
  companySlug: string,
  routingId: number,
  status: CompanyLeadStatus,
): Promise<CompanyLead | null> {
  const slug = companySlug.trim();
  if (!slug || !Number.isInteger(routingId) || routingId <= 0) return null;
  if (!isCompanyLeadStatus(status)) return null;

  // First action = leaving "new". Also fill first_viewed_at if still null
  // (acting without a prior list view still counts as having seen the lead).
  const setsFirstAction = status !== "new";
  const result = await db
    .prepare(
      setsFirstAction
        ? `UPDATE lead_routings
           SET company_status = ?,
               status_updated_at = datetime('now'),
               first_acted_at = COALESCE(first_acted_at, datetime('now')),
               first_viewed_at = COALESCE(first_viewed_at, datetime('now'))
           WHERE id = ? AND company_slug = ?`
        : `UPDATE lead_routings
           SET company_status = ?,
               status_updated_at = datetime('now')
           WHERE id = ? AND company_slug = ?`,
    )
    .bind(status, routingId, slug)
    .run();

  if (!result.meta.changes) return null;

  const row = await db
    .prepare(
      `${LEAD_SELECT_SQL}
       WHERE lr.id = ? AND lr.company_slug = ?
       LIMIT 1`,
    )
    .bind(routingId, slug)
    .first<LeadRoutingRow>();

  return row ? mapRow(row) : null;
}
