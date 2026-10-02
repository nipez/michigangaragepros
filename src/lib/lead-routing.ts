import type { D1Database } from "@cloudflare/workers-types";
import { getCityBySlug } from "@/data/cities";
import { citySlugForZip, normalizeZip } from "@/data/zipCodes";

/** Max claimed companies notified for an open (no company_slug) lead. */
export const AREA_ROUTE_CAP = 3;

export type LeadRouteReason = "direct" | "area";

export type LeadRouteRecipient = {
  companyId: number | null;
  companySlug: string;
  companyName: string;
  email: string;
  reason: LeadRouteReason;
};

type ClaimedCompanyRow = {
  id: number;
  slug: string;
  name: string;
  notify_email: string | null;
  claim_email: string | null;
  featured: number;
};

function pickEmail(row: {
  notify_email: string | null;
  claim_email: string | null;
}): string | null {
  const notify = row.notify_email?.trim();
  if (notify) return notify;
  const claim = row.claim_email?.trim();
  if (claim) return claim;
  return null;
}

/**
 * Resolve the claim contact email for a company.
 * Prefer companies.notify_email; fall back to latest approved claim_requests.email.
 */
export async function resolveCompanyNotifyEmail(
  db: D1Database,
  companySlug: string,
): Promise<string | null> {
  const row = await db
    .prepare(
      `SELECT c.notify_email AS notify_email,
              (
                SELECT cr.email
                FROM claim_requests cr
                WHERE cr.company_slug = c.slug
                  AND cr.status = 'approved'
                  AND cr.email IS NOT NULL
                  AND trim(cr.email) != ''
                ORDER BY datetime(COALESCE(cr.reviewed_at, cr.created_at)) DESC
                LIMIT 1
              ) AS claim_email
       FROM companies c
       WHERE c.slug = ?
       LIMIT 1`,
    )
    .bind(companySlug)
    .first<{ notify_email: string | null; claim_email: string | null }>();

  if (!row) return null;
  return pickEmail(row);
}

/**
 * Direct route: lead targets a specific company_slug that is claimed
 * and has a durable notify email (notify_email or approved claim contact).
 */
export async function findDirectRouteRecipient(
  db: D1Database,
  companySlug: string,
): Promise<LeadRouteRecipient | null> {
  const slug = companySlug.trim();
  if (!slug) return null;

  const row = await db
    .prepare(
      `SELECT c.id, c.slug, c.name, c.claimed, c.notify_email AS notify_email,
              (
                SELECT cr.email
                FROM claim_requests cr
                WHERE cr.company_slug = c.slug
                  AND cr.status = 'approved'
                  AND cr.email IS NOT NULL
                  AND trim(cr.email) != ''
                ORDER BY datetime(COALESCE(cr.reviewed_at, cr.created_at)) DESC
                LIMIT 1
              ) AS claim_email
       FROM companies c
       WHERE c.slug = ?
       LIMIT 1`,
    )
    .bind(slug)
    .first<{
      id: number;
      slug: string;
      name: string;
      claimed: number;
      notify_email: string | null;
      claim_email: string | null;
    }>();

  if (!row || !row.claimed) return null;
  const email = pickEmail(row);
  if (!email) return null;

  return {
    companyId: row.id,
    companySlug: row.slug,
    companyName: row.name,
    email,
    reason: "direct",
  };
}

/**
 * Area route: claimed companies that serve the lead's city (from ZIP → city map,
 * then companies.city_slug or company_service_areas.area match).
 *
 * Limitation: service areas are city/metro names, not ZIPs. Matching is only as
 * good as ZIP_TO_CITY_SLUG / ZIP3_TO_CITY_SLUG plus seeded service area strings.
 * Cap recipients to avoid spam.
 */
export async function findAreaRouteRecipients(
  db: D1Database,
  zip: string,
  options?: { cap?: number; excludeSlug?: string | null },
): Promise<LeadRouteRecipient[]> {
  const cap = options?.cap ?? AREA_ROUTE_CAP;
  const excludeSlug = options?.excludeSlug?.trim() || null;
  const normalized = normalizeZip(zip) ?? zip.trim().replace(/\D/g, "").slice(0, 5);
  if (!normalized || normalized.length < 3) return [];

  const citySlug = citySlugForZip(normalized);
  if (!citySlug) return [];

  const city = getCityBySlug(citySlug);
  const cityName = city?.name ?? citySlug.replace(/-/g, " ");

  // Match claimed companies whose home city_slug matches, or whose service_areas
  // list includes the resolved city name (case-insensitive).
  const { results } = await db
    .prepare(
      `SELECT DISTINCT c.id, c.slug, c.name, c.featured,
              c.notify_email AS notify_email,
              (
                SELECT cr.email
                FROM claim_requests cr
                WHERE cr.company_slug = c.slug
                  AND cr.status = 'approved'
                  AND cr.email IS NOT NULL
                  AND trim(cr.email) != ''
                ORDER BY datetime(COALESCE(cr.reviewed_at, cr.created_at)) DESC
                LIMIT 1
              ) AS claim_email
       FROM companies c
       LEFT JOIN company_service_areas csa ON csa.company_id = c.id
       WHERE c.claimed = 1
         AND (
           c.city_slug = ?
           OR lower(csa.area) = lower(?)
         )
       ORDER BY c.featured DESC, c.name ASC
       LIMIT 20`,
    )
    .bind(citySlug, cityName)
    .all<ClaimedCompanyRow>();

  const recipients: LeadRouteRecipient[] = [];
  const seenEmails = new Set<string>();

  for (const row of results ?? []) {
    if (excludeSlug && row.slug === excludeSlug) continue;
    const email = pickEmail(row);
    if (!email) continue;
    const emailKey = email.toLowerCase();
    if (seenEmails.has(emailKey)) continue;
    seenEmails.add(emailKey);
    recipients.push({
      companyId: row.id,
      companySlug: row.slug,
      companyName: row.name,
      email,
      reason: "area",
    });
    if (recipients.length >= cap) break;
  }

  return recipients;
}

export async function resolveLeadRecipients(
  db: D1Database,
  lead: { zip: string; companySlug?: string | null },
): Promise<LeadRouteRecipient[]> {
  const companySlug = lead.companySlug?.trim() || null;

  if (companySlug) {
    const direct = await findDirectRouteRecipient(db, companySlug);
    if (direct) return [direct];
    // Targeted company unclaimed / no email: fall through to area matches,
    // excluding the (unclaimed) target so we don't double-count later.
    return findAreaRouteRecipients(db, lead.zip, {
      excludeSlug: companySlug,
    });
  }

  return findAreaRouteRecipients(db, lead.zip);
}

export type RoutingOutcome = {
  routedAt: string;
  recipients: Array<LeadRouteRecipient & { emailed: boolean }>;
  summary: string;
};

export async function persistLeadRouting(
  db: D1Database,
  leadId: number,
  recipients: Array<LeadRouteRecipient & { emailed: boolean }>,
): Promise<RoutingOutcome> {
  const routedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const summary = recipients
    .map(
      (r) =>
        `${r.reason}:${r.companySlug}<${r.email}>${r.emailed ? "" : "(failed)"}`,
    )
    .join(", ");

  const statements = [
    db
      .prepare(
        `UPDATE leads SET routed_at = ?, routed_to = ? WHERE id = ?`,
      )
      .bind(routedAt, summary || null, leadId),
  ];

  for (const r of recipients) {
    statements.push(
      db
        .prepare(
          `INSERT INTO lead_routings
             (lead_id, company_id, company_slug, email, reason, emailed)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          leadId,
          r.companyId,
          r.companySlug,
          r.email,
          r.reason,
          r.emailed ? 1 : 0,
        ),
    );
  }

  // Even with zero recipients, stamp routed_at so admin can see routing ran.
  if (recipients.length === 0) {
    await db
      .prepare(`UPDATE leads SET routed_at = ?, routed_to = ? WHERE id = ?`)
      .bind(routedAt, null, leadId)
      .run();
  } else {
    await db.batch(statements);
  }

  return { routedAt, recipients, summary };
}
