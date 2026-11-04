import type { D1Database } from "@cloudflare/workers-types";

/**
 * Reason stamped on lead_routings rows created when an unclaimed company
 * is approved — leads were already associated via leads.company_slug and
 * kept in the admin inbox; this makes them visible in the company inbox
 * without re-emailing homeowners or area-routed companies.
 */
export const RETAINED_LEAD_REASON = "retained" as const;

export type RetainedLeadCandidate = {
  leadId: number;
  companySlug: string;
};

/**
 * Pure filter: keep leads that target this company and are not already
 * present in that company's lead_routings set.
 */
export function filterLeadsNeedingRetention(
  candidates: RetainedLeadCandidate[],
  alreadyRoutedLeadIds: Iterable<number>,
  companySlug: string,
): RetainedLeadCandidate[] {
  const slug = companySlug.trim();
  if (!slug) return [];
  const routed = new Set(
    [...alreadyRoutedLeadIds].filter((id) => Number.isInteger(id) && id > 0),
  );
  return candidates.filter(
    (c) =>
      c.companySlug === slug &&
      Number.isInteger(c.leadId) &&
      c.leadId > 0 &&
      !routed.has(c.leadId),
  );
}

export type RetainLeadsResult = {
  retained: number;
  skipped: number;
};

/**
 * After claim approval: insert lead_routings rows for historical leads that
 * targeted this company_slug so they appear in the manage lead inbox.
 *
 * Privacy / routing rules preserved:
 * - Leads stay on the admin inbox (unchanged).
 * - Area-routed claimed companies keep their existing routing rows.
 * - We do not re-email anyone (emailed = 0).
 * - Only leads that already had company_slug set for this listing.
 */
export async function retainLeadsForClaimedCompany(
  db: D1Database,
  companySlug: string,
  options?: { companyId?: number | null; email?: string | null },
): Promise<RetainLeadsResult> {
  const slug = companySlug.trim();
  if (!slug) return { retained: 0, skipped: 0 };

  let companyId = options?.companyId ?? null;
  let email = (options?.email ?? "").trim();

  if (companyId == null || !email) {
    const company = await db
      .prepare(
        `SELECT id, notify_email FROM companies WHERE slug = ? LIMIT 1`,
      )
      .bind(slug)
      .first<{ id: number; notify_email: string | null }>();
    if (!company) return { retained: 0, skipped: 0 };
    companyId = companyId ?? company.id;
    if (!email) email = (company.notify_email ?? "").trim();
  }

  // lead_routings.email is NOT NULL — fall back to a non-deliverable marker
  // so the inbox row can exist when notify_email was never set.
  if (!email) {
    email = `retained+${slug}@michigangaragepros.local`;
  }

  const { results: leadRows } = await db
    .prepare(
      `SELECT id AS lead_id
       FROM leads
       WHERE company_slug = ?
       ORDER BY datetime(created_at) ASC
       LIMIT 500`,
    )
    .bind(slug)
    .all<{ lead_id: number }>();

  const candidates: RetainedLeadCandidate[] = (leadRows ?? []).map((r) => ({
    leadId: Number(r.lead_id),
    companySlug: slug,
  }));

  if (candidates.length === 0) return { retained: 0, skipped: 0 };

  const { results: existingRows } = await db
    .prepare(
      `SELECT lead_id
       FROM lead_routings
       WHERE company_slug = ?
         AND lead_id IN (${candidates.map(() => "?").join(", ")})`,
    )
    .bind(slug, ...candidates.map((c) => c.leadId))
    .all<{ lead_id: number }>();

  const alreadyRouted = (existingRows ?? []).map((r) => Number(r.lead_id));
  const toInsert = filterLeadsNeedingRetention(
    candidates,
    alreadyRouted,
    slug,
  );

  if (toInsert.length === 0) {
    return { retained: 0, skipped: candidates.length };
  }

  const statements = toInsert.map((c) =>
    db
      .prepare(
        `INSERT INTO lead_routings
           (lead_id, company_id, company_slug, email, reason, emailed, company_status)
         VALUES (?, ?, ?, ?, ?, 0, 'new')`,
      )
      .bind(c.leadId, companyId, slug, email, RETAINED_LEAD_REASON),
  );

  await db.batch(statements);

  return {
    retained: toInsert.length,
    skipped: candidates.length - toInsert.length,
  };
}
