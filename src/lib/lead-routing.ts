import type { D1Database } from "@cloudflare/workers-types";
import {
  CITIES,
  citySlug,
  getCityBySlug,
  type City,
} from "@/data/cities";
import type { FeaturedPlanId } from "@/data/growth";
import { citySlugForZip, normalizeZip } from "@/data/zipCodes";
import {
  isHealthySubscriptionStatus,
  normalizeSubscriptionStatus,
} from "@/lib/featured-billing";
import { bumpListingStatSafe } from "@/lib/listing-stats";

/** Max claimed companies notified for an open (no company_slug) lead. */
export const AREA_ROUTE_CAP = 3;

export type LeadRouteReason = "direct" | "area" | "retained";

export type LeadRouteRecipient = {
  companyId: number | null;
  companySlug: string;
  companyName: string;
  email: string;
  reason: LeadRouteReason;
};

/** Candidate row used by pure ranking helpers (also useful in tests). */
export type AreaRouteCandidate = {
  companyId: number;
  companySlug: string;
  companyName: string;
  email: string;
  /** companies.featured flag (directory placement). */
  featured: boolean;
  citySlug: string;
  /** True when company.city_slug matches the lead's resolved city. */
  homeCityMatch: boolean;
  /** Soft service relevance (empty lead service ⇒ true). */
  serviceMatch: boolean;
  stripeSubscriptionStatus: string | null;
  featuredPlan: FeaturedPlanId | null;
  featuredCity: string | null;
};

type ClaimedCompanyQueryRow = {
  id: number;
  slug: string;
  name: string;
  featured: number;
  city_slug: string | null;
  notify_email: string | null;
  claim_email: string | null;
  stripe_subscription_status: string | null;
  featured_plan: string | null;
  featured_city: string | null;
  home_match: number;
  services_blob: string | null;
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

function normalizePlanId(
  plan: string | null | undefined,
): FeaturedPlanId | null {
  const value = (plan ?? "").trim().toLowerCase();
  if (value === "city" || value === "metro" || value === "statewide") {
    return value;
  }
  return null;
}

/**
 * Soft service match — mirrors Find Pros / locationSearch heuristics so
 * directory tags and manage-form service strings both count.
 */
export function leadServiceMatchesCompany(
  leadService: string | null | undefined,
  companyServices: string[] | string | null | undefined,
): boolean {
  const needle = (leadService ?? "").trim().toLowerCase();
  if (!needle || needle === "other") return true;

  const list = Array.isArray(companyServices)
    ? companyServices
    : typeof companyServices === "string"
      ? companyServices.split(/\n|\|/).map((s) => s.trim()).filter(Boolean)
      : [];
  const haystack = list.join(" ").toLowerCase();
  if (!haystack) return false;

  if (needle.includes("spring")) return haystack.includes("spring");
  if (needle.includes("opener")) return haystack.includes("opener");
  if (needle.includes("install")) return haystack.includes("install");
  if (needle.includes("maintenance")) {
    return haystack.includes("maintenance") || haystack.includes("tune");
  }
  if (needle.includes("emergency")) return haystack.includes("emergency");
  if (needle.includes("repair")) return haystack.includes("repair");
  return haystack.includes(needle);
}

/**
 * Featured lead priority: healthy paid sub (active/trialing — not past_due /
 * canceled) AND the Featured plan covers the lead's city.
 *
 * - statewide → any Michigan city
 * - metro → same region as the company's home/featured city, or nearby list
 * - city → lead city matches featured city or company home city
 */
export function featuredPlanCoversLeadCity(input: {
  plan: FeaturedPlanId | null;
  featuredCity: string | null;
  companyCitySlug: string;
  leadCitySlug: string;
  leadCity: City | null;
}): boolean {
  const plan = input.plan;
  if (!plan) return false;
  if (plan === "statewide") return true;

  const leadSlug = input.leadCitySlug.trim();
  if (!leadSlug) return false;

  const featuredSlug = input.featuredCity?.trim()
    ? citySlug(input.featuredCity)
    : "";
  const homeSlug = input.companyCitySlug.trim();

  if (plan === "city") {
    return leadSlug === featuredSlug || leadSlug === homeSlug;
  }

  // metro
  const leadCity = input.leadCity ?? getCityBySlug(leadSlug) ?? null;
  const anchorSlug = featuredSlug || homeSlug;
  const anchor = anchorSlug ? getCityBySlug(anchorSlug) : undefined;
  if (!leadCity || !anchor) {
    // Fall back to exact city match when region data is missing.
    return leadSlug === featuredSlug || leadSlug === homeSlug;
  }
  if (leadCity.region && anchor.region && leadCity.region === anchor.region) {
    return true;
  }
  const nearbySlugs = new Set(
    (anchor.nearby ?? []).map((name) => citySlug(name)),
  );
  nearbySlugs.add(anchor.slug);
  return nearbySlugs.has(leadSlug);
}

/** True when this candidate should sort into the Featured-first tier. */
export function isFeaturedLeadPriority(
  candidate: Pick<
    AreaRouteCandidate,
    | "stripeSubscriptionStatus"
    | "featuredPlan"
    | "featuredCity"
    | "citySlug"
  >,
  leadCitySlug: string,
  leadCity: City | null,
): boolean {
  if (!isHealthySubscriptionStatus(candidate.stripeSubscriptionStatus)) {
    return false;
  }
  return featuredPlanCoversLeadCity({
    plan: candidate.featuredPlan,
    featuredCity: candidate.featuredCity,
    companyCitySlug: candidate.citySlug,
    leadCitySlug,
    leadCity,
  });
}

/**
 * Deterministic ranking among area candidates.
 * Featured (healthy sub + plan covers) → home-city → service match → name.
 * Soft service filter: prefer service matches when any exist; otherwise keep all.
 * Cap of AREA_ROUTE_CAP (default 3). Never includes blank emails (caller filters).
 */
export function rankAreaRouteCandidates(
  candidates: AreaRouteCandidate[],
  options: {
    leadCitySlug: string;
    leadCity?: City | null;
    cap?: number;
    excludeSlug?: string | null;
  },
): AreaRouteCandidate[] {
  const cap = options.cap ?? AREA_ROUTE_CAP;
  const excludeSlug = options.excludeSlug?.trim() || null;
  const leadCitySlug = options.leadCitySlug.trim();
  const leadCity =
    options.leadCity ?? getCityBySlug(leadCitySlug) ?? null;

  const eligible: AreaRouteCandidate[] = [];
  const seenEmails = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const c of candidates) {
    if (excludeSlug && c.companySlug === excludeSlug) continue;
    const email = c.email.trim();
    if (!email) continue;
    const emailKey = email.toLowerCase();
    if (seenEmails.has(emailKey)) continue;
    if (seenSlugs.has(c.companySlug)) continue;
    seenEmails.add(emailKey);
    seenSlugs.add(c.companySlug);
    eligible.push(c);
  }

  const withService = eligible.filter((c) => c.serviceMatch);
  const pool = withService.length > 0 ? withService : eligible;

  const sorted = [...pool].sort((a, b) => {
    const aFeat = isFeaturedLeadPriority(a, leadCitySlug, leadCity) ? 1 : 0;
    const bFeat = isFeaturedLeadPriority(b, leadCitySlug, leadCity) ? 1 : 0;
    if (aFeat !== bFeat) return bFeat - aFeat;

    const aHome = a.homeCityMatch ? 1 : 0;
    const bHome = b.homeCityMatch ? 1 : 0;
    if (aHome !== bHome) return bHome - aHome;

    const aSvc = a.serviceMatch ? 1 : 0;
    const bSvc = b.serviceMatch ? 1 : 0;
    if (aSvc !== bSvc) return bSvc - aSvc;

    return a.companyName.localeCompare(b.companyName, "en", {
      sensitivity: "base",
    });
  });

  return sorted.slice(0, cap);
}

/**
 * Cities to match when coverage is thin: lead city first, then nearby names,
 * then other cities in the same region (slug + display name pairs).
 */
export function expandLeadCityMatchTargets(leadCity: City): {
  slugs: string[];
  names: string[];
} {
  const slugs = new Set<string>([leadCity.slug]);
  const names = new Set<string>([leadCity.name]);

  for (const nearby of leadCity.nearby ?? []) {
    const trimmed = nearby.trim();
    if (!trimmed) continue;
    names.add(trimmed);
    slugs.add(citySlug(trimmed));
  }

  if (leadCity.region) {
    for (const city of CITIES) {
      if (city.region === leadCity.region) {
        slugs.add(city.slug);
        names.add(city.name);
      }
    }
  }

  return { slugs: [...slugs], names: [...names] };
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

function rowToCandidate(
  row: ClaimedCompanyQueryRow,
  leadService: string | null | undefined,
): AreaRouteCandidate | null {
  const email = pickEmail(row);
  if (!email) return null;
  return {
    companyId: row.id,
    companySlug: row.slug,
    companyName: row.name,
    email,
    featured: Boolean(row.featured),
    citySlug: (row.city_slug ?? "").trim(),
    homeCityMatch: Boolean(row.home_match),
    serviceMatch: leadServiceMatchesCompany(leadService, row.services_blob),
    stripeSubscriptionStatus: normalizeSubscriptionStatus(
      row.stripe_subscription_status,
    ),
    featuredPlan: normalizePlanId(row.featured_plan),
    featuredCity: row.featured_city?.trim() || null,
  };
}

/**
 * Area route: claimed companies that serve the lead's city (from ZIP → city map,
 * then companies.city_slug or company_service_areas.area match).
 *
 * Ranking: Featured with a healthy subscription whose plan covers the city
 * first, then home-city matches, then service relevance, then name (fair).
 * Soft service filter prefers companies listing the requested service.
 * When same-city coverage is thin, expands to nearby / same-region cities.
 *
 * Limitation: service areas are city/metro names, not ZIPs. Matching is only as
 * good as ZIP_TO_CITY_SLUG / ZIP3_TO_CITY_SLUG plus seeded service area strings.
 * Cap recipients to avoid spam. Never routes to unclaimed companies or those
 * without a notify/claim email.
 */
export async function findAreaRouteRecipients(
  db: D1Database,
  zip: string,
  options?: {
    cap?: number;
    excludeSlug?: string | null;
    service?: string | null;
  },
): Promise<LeadRouteRecipient[]> {
  const cap = options?.cap ?? AREA_ROUTE_CAP;
  const excludeSlug = options?.excludeSlug?.trim() || null;
  const service = options?.service?.trim() || null;
  const normalized =
    normalizeZip(zip) ?? zip.trim().replace(/\D/g, "").slice(0, 5);
  if (!normalized || normalized.length < 3) return [];

  const leadCitySlug = citySlugForZip(normalized);
  if (!leadCitySlug) return [];

  const leadCity = getCityBySlug(leadCitySlug) ?? null;
  const leadCityName = leadCity?.name ?? leadCitySlug.replace(/-/g, " ");

  const primarySlugs = [leadCitySlug];
  const primaryNames = [leadCityName];

  const candidates = await queryAreaCandidates(db, {
    matchSlugs: primarySlugs,
    matchNames: primaryNames,
    leadCitySlug,
    leadService: service,
  });

  let ranked = rankAreaRouteCandidates(candidates, {
    leadCitySlug,
    leadCity,
    cap,
    excludeSlug,
  });

  // Metro / nearby fallback when same-city claimed coverage is thin.
  if (ranked.length < cap && leadCity) {
    const expanded = expandLeadCityMatchTargets(leadCity);
    const more = await queryAreaCandidates(db, {
      matchSlugs: expanded.slugs,
      matchNames: expanded.names,
      leadCitySlug,
      leadService: service,
    });
    // Prefer already-ranked (exact city) by putting them first in the pool.
    const bySlug = new Map<string, AreaRouteCandidate>();
    for (const c of more) bySlug.set(c.companySlug, c);
    for (const c of candidates) bySlug.set(c.companySlug, c);
    ranked = rankAreaRouteCandidates([...bySlug.values()], {
      leadCitySlug,
      leadCity,
      cap,
      excludeSlug,
    });
  }

  return ranked.map((c) => ({
    companyId: c.companyId,
    companySlug: c.companySlug,
    companyName: c.companyName,
    email: c.email,
    reason: "area" as const,
  }));
}

async function queryAreaCandidates(
  db: D1Database,
  input: {
    matchSlugs: string[];
    matchNames: string[];
    leadCitySlug: string;
    leadService: string | null;
  },
): Promise<AreaRouteCandidate[]> {
  const slugs = [...new Set(input.matchSlugs.map((s) => s.trim()).filter(Boolean))];
  const names = [
    ...new Set(input.matchNames.map((n) => n.trim()).filter(Boolean)),
  ];
  if (slugs.length === 0 && names.length === 0) return [];

  // Build dynamic IN lists (bounded — metro expansion is dozens, not thousands).
  const slugPlaceholders = slugs.map(() => "?").join(", ") || "NULL";
  const namePlaceholders = names.map(() => "?").join(", ") || "NULL";
  const bindings: Array<string | number> = [];
  bindings.push(input.leadCitySlug);
  for (const s of slugs) bindings.push(s);
  for (const n of names) bindings.push(n.toLowerCase());

  const { results } = await db
    .prepare(
      `SELECT DISTINCT c.id, c.slug, c.name, c.featured,
              c.city_slug AS city_slug,
              c.notify_email AS notify_email,
              c.stripe_subscription_status AS stripe_subscription_status,
              CASE WHEN c.city_slug = ? THEN 1 ELSE 0 END AS home_match,
              (
                SELECT cr.email
                FROM claim_requests cr
                WHERE cr.company_slug = c.slug
                  AND cr.status = 'approved'
                  AND cr.email IS NOT NULL
                  AND trim(cr.email) != ''
                ORDER BY datetime(COALESCE(cr.reviewed_at, cr.created_at)) DESC
                LIMIT 1
              ) AS claim_email,
              (
                SELECT fr.plan
                FROM featured_requests fr
                WHERE fr.company_slug = c.slug
                  AND fr.stripe_customer_id IS NOT NULL
                  AND fr.status IN ('won', 'paid', 'closed')
                ORDER BY datetime(COALESCE(fr.paid_at, fr.created_at)) DESC
                LIMIT 1
              ) AS featured_plan,
              (
                SELECT fr.city
                FROM featured_requests fr
                WHERE fr.company_slug = c.slug
                  AND fr.stripe_customer_id IS NOT NULL
                  AND fr.status IN ('won', 'paid', 'closed')
                ORDER BY datetime(COALESCE(fr.paid_at, fr.created_at)) DESC
                LIMIT 1
              ) AS featured_city,
              (
                SELECT GROUP_CONCAT(cs.service, '|')
                FROM company_services cs
                WHERE cs.company_id = c.id
              ) AS services_blob
       FROM companies c
       LEFT JOIN company_service_areas csa ON csa.company_id = c.id
       WHERE c.claimed = 1
         AND (
           c.city_slug IN (${slugPlaceholders})
           OR lower(csa.area) IN (${namePlaceholders})
         )
       LIMIT 80`,
    )
    .bind(...bindings)
    .all<ClaimedCompanyQueryRow>();

  const out: AreaRouteCandidate[] = [];
  for (const row of results ?? []) {
    const candidate = rowToCandidate(row, input.leadService);
    if (candidate) out.push(candidate);
  }
  return out;
}

export async function resolveLeadRecipients(
  db: D1Database,
  lead: {
    zip: string;
    companySlug?: string | null;
    service?: string | null;
  },
): Promise<LeadRouteRecipient[]> {
  const companySlug = lead.companySlug?.trim() || null;

  if (companySlug) {
    const direct = await findDirectRouteRecipient(db, companySlug);
    if (direct) return [direct];
    // Targeted company unclaimed / no email: fall through to area matches,
    // excluding the (unclaimed) target so we don't double-count later.
    return findAreaRouteRecipients(db, lead.zip, {
      excludeSlug: companySlug,
      service: lead.service,
    });
  }

  return findAreaRouteRecipients(db, lead.zip, { service: lead.service });
}

/** Slugs already recorded for this lead (idempotent re-delivery guard). */
export async function listExistingRoutingSlugs(
  db: D1Database,
  leadId: number,
): Promise<Set<string>> {
  const { results } = await db
    .prepare(
      `SELECT company_slug FROM lead_routings WHERE lead_id = ?`,
    )
    .bind(leadId)
    .all<{ company_slug: string }>();
  return new Set(
    (results ?? [])
      .map((r) => r.company_slug.trim())
      .filter(Boolean),
  );
}

/**
 * Filter recipients that have not yet been recorded for this lead.
 * Pure helper so retries never re-email the same company.
 */
export function filterNewRecipients<T extends { companySlug: string }>(
  recipients: T[],
  alreadyRouted: ReadonlySet<string>,
): T[] {
  return recipients.filter(
    (r) => !alreadyRouted.has(r.companySlug.trim()),
  );
}

export type RoutingOutcome = {
  routedAt: string;
  recipients: Array<LeadRouteRecipient & { emailed: boolean }>;
  summary: string;
  /** How many NEW routing rows were inserted this call. */
  insertedCount: number;
};

export async function persistLeadRouting(
  db: D1Database,
  leadId: number,
  recipients: Array<LeadRouteRecipient & { emailed: boolean }>,
): Promise<RoutingOutcome> {
  const routedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const existing = await listExistingRoutingSlugs(db, leadId);
  const fresh = filterNewRecipients(recipients, existing);

  // Merge existing + new for the summary stamp on leads.routed_to.
  const allForSummary = [
    ...[...existing].map((slug) => ({
      reason: "area" as const,
      companySlug: slug,
      email: "",
      emailed: true,
    })),
    ...fresh,
  ];
  // Prefer the richer summary from this batch's recipients when present.
  const summaryFromBatch = recipients
    .map(
      (r) =>
        `${r.reason}:${r.companySlug}<${r.email}>${r.emailed ? "" : "(failed)"}`,
    )
    .join(", ");
  const summary =
    summaryFromBatch ||
    allForSummary.map((r) => `${r.reason}:${r.companySlug}`).join(", ");

  if (fresh.length === 0) {
    // Still stamp routed_at so admin can see routing ran (incl. zero matches /
    // idempotent retry with nothing new).
    const existingSummary = await db
      .prepare(`SELECT routed_to FROM leads WHERE id = ? LIMIT 1`)
      .bind(leadId)
      .first<{ routed_to: string | null }>();
    await db
      .prepare(`UPDATE leads SET routed_at = ?, routed_to = ? WHERE id = ?`)
      .bind(
        routedAt,
        summaryFromBatch || existingSummary?.routed_to || null,
        leadId,
      )
      .run();
    return {
      routedAt,
      recipients,
      summary: summaryFromBatch || existingSummary?.routed_to || "",
      insertedCount: 0,
    };
  }

  const statements = [
    db
      .prepare(
        `UPDATE leads SET routed_at = ?, routed_to = ? WHERE id = ?`,
      )
      .bind(routedAt, summary || null, leadId),
  ];

  for (const r of fresh) {
    statements.push(
      db
        .prepare(
          `INSERT OR IGNORE INTO lead_routings
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

  await db.batch(statements);
  // Best-effort performance counters — never fail routing on stats errors.
  for (const r of fresh) {
    bumpListingStatSafe(db, r.companySlug, "leads_routed");
  }

  return {
    routedAt,
    recipients,
    summary,
    insertedCount: fresh.length,
  };
}
