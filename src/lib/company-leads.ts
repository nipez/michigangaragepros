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
  createdAt: string;
  emailed: boolean;
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
    createdAt: row.created_at,
    emailed: Boolean(row.emailed),
  };
}

/**
 * Leads actually routed to this company (lead_routings.company_slug).
 * Consent/routing already happened in lead-routing; we never invent rows.
 */
export async function listCompanyLeads(
  db: D1Database,
  companySlug: string,
  options?: { limit?: number },
): Promise<CompanyLead[]> {
  const slug = companySlug.trim();
  if (!slug) return [];
  const limit = Math.min(Math.max(options?.limit ?? 100, 1), 200);

  const { results } = await db
    .prepare(
      `SELECT lr.id AS routing_id,
              lr.lead_id AS lead_id,
              lr.reason AS reason,
              lr.emailed AS emailed,
              COALESCE(lr.company_status, 'new') AS company_status,
              lr.status_updated_at AS status_updated_at,
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

  const result = await db
    .prepare(
      `UPDATE lead_routings
       SET company_status = ?,
           status_updated_at = datetime('now')
       WHERE id = ? AND company_slug = ?`,
    )
    .bind(status, routingId, slug)
    .run();

  if (!result.meta.changes) return null;

  const row = await db
    .prepare(
      `SELECT lr.id AS routing_id,
              lr.lead_id AS lead_id,
              lr.reason AS reason,
              lr.emailed AS emailed,
              COALESCE(lr.company_status, 'new') AS company_status,
              lr.status_updated_at AS status_updated_at,
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
    .first<LeadRoutingRow>();

  return row ? mapRow(row) : null;
}
