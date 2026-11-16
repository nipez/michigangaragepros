/**
 * Listing profile completeness score for claimed companies.
 * Pure scoring + optional D1 loaders for manage / digest / admin.
 * Does not affect public ranking.
 */

import type { D1Database } from "@cloudflare/workers-types";
import { getCompanyBySlug } from "@/data/companies";
import { trustHasAny, type CompanyTrust } from "@/lib/company-trust";
import {
  listingFieldsFromCompany,
  type ListingFields,
} from "@/lib/listing-manage";

/** Minimum trimmed about length to count as filled. */
export const MIN_ABOUT_LENGTH = 40;

export type CompletenessItemId =
  | "about"
  | "phone"
  | "website"
  | "services"
  | "serviceAreas"
  | "hours"
  | "logo"
  | "photo"
  | "trust"
  | "review"
  | "reviewLinkUsed"
  | "notifyEmail";

export type CompletenessInput = {
  about: string;
  phone: string;
  website: string;
  services: readonly string[];
  serviceAreas: readonly string[];
  hours: string;
  hasLogo: boolean;
  hasPhoto: boolean;
  hasTrust: boolean;
  /** Visible reviews on the listing. */
  approvedReviewCount: number;
  /** Lifetime review-request link visits (listing_stats_daily). */
  reviewLinkVisits: number;
  notifyEmail: string | null | undefined;
};

export type CompletenessChecklistItem = {
  id: CompletenessItemId;
  label: string;
  /** Short imperative for checklists / digest. */
  action: string;
  weight: number;
  /** Manage-page section hash (without #). */
  sectionId: string;
  filled: boolean;
};

export type ListingCompleteness = {
  /** 0–100 integer. */
  score: number;
  maxScore: 100;
  filledWeight: number;
  missingWeight: number;
  items: CompletenessChecklistItem[];
  /** Missing items, highest weight first. */
  missing: CompletenessChecklistItem[];
  complete: boolean;
};

type ItemDef = {
  id: CompletenessItemId;
  label: string;
  action: string;
  weight: number;
  sectionId: string;
  isFilled: (input: CompletenessInput) => boolean;
};

/**
 * Weighted checklist. Weights sum to 100.
 * Ordered by conversion impact (about / phone / services first).
 */
export const COMPLETENESS_ITEM_DEFS: readonly ItemDef[] = [
  {
    id: "about",
    label: "About / description",
    action: "Add a company description homeowners can read",
    weight: 15,
    sectionId: "details-about",
    isFilled: (i) => i.about.trim().length >= MIN_ABOUT_LENGTH,
  },
  {
    id: "phone",
    label: "Phone number",
    action: "Add a primary phone number",
    weight: 12,
    sectionId: "details-phone",
    isFilled: (i) => i.phone.trim().length > 0,
  },
  {
    id: "services",
    label: "Services",
    action: "List the services you offer",
    weight: 10,
    sectionId: "details-services",
    isFilled: (i) => i.services.some((s) => s.trim().length > 0),
  },
  {
    id: "serviceAreas",
    label: "Service areas",
    action: "Add the cities / areas you serve",
    weight: 10,
    sectionId: "details-service-areas",
    isFilled: (i) => i.serviceAreas.some((a) => a.trim().length > 0),
  },
  {
    id: "logo",
    label: "Logo",
    action: "Upload your company logo",
    weight: 10,
    sectionId: "media",
    isFilled: (i) => i.hasLogo,
  },
  {
    id: "trust",
    label: "Trust credentials",
    action: "Add licensed, insured, or other trust credentials",
    weight: 10,
    sectionId: "trust",
    isFilled: (i) => i.hasTrust,
  },
  {
    id: "photo",
    label: "Profile photo",
    action: "Upload a profile photo",
    weight: 8,
    sectionId: "media",
    isFilled: (i) => i.hasPhoto,
  },
  {
    id: "review",
    label: "Customer review",
    action: "Collect at least one customer review",
    weight: 7,
    sectionId: "review-link",
    isFilled: (i) => i.approvedReviewCount > 0,
  },
  {
    id: "website",
    label: "Website",
    action: "Add your website URL",
    weight: 6,
    sectionId: "details-website",
    isFilled: (i) => i.website.trim().length > 0,
  },
  {
    id: "hours",
    label: "Business hours",
    action: "Add your business hours",
    weight: 5,
    sectionId: "details-hours",
    isFilled: (i) => i.hours.trim().length > 0,
  },
  {
    id: "reviewLinkUsed",
    label: "Review request link shared",
    action: "Share your review request link with customers",
    weight: 4,
    sectionId: "review-link",
    isFilled: (i) => i.reviewLinkVisits > 0,
  },
  {
    id: "notifyEmail",
    label: "Notification email",
    action: "Set a notification email for leads and digests",
    weight: 3,
    sectionId: "notify-email",
    isFilled: (i) => Boolean((i.notifyEmail ?? "").trim()),
  },
] as const;

/** Sanity: weights must total 100. */
const WEIGHT_SUM = COMPLETENESS_ITEM_DEFS.reduce((s, d) => s + d.weight, 0);
if (WEIGHT_SUM !== 100) {
  throw new Error(
    `listing-completeness weights must sum to 100 (got ${WEIGHT_SUM})`,
  );
}

export function emptyCompletenessInput(): CompletenessInput {
  return {
    about: "",
    phone: "",
    website: "",
    services: [],
    serviceAreas: [],
    hours: "",
    hasLogo: false,
    hasPhoto: false,
    hasTrust: false,
    approvedReviewCount: 0,
    reviewLinkVisits: 0,
    notifyEmail: null,
  };
}

/**
 * Build scoring input from manage-page live state (form + media + trust + stats).
 */
export function completenessInputFromManageState(state: {
  fields: Pick<
    ListingFields,
    "about" | "phone" | "website" | "hours" | "services" | "serviceArea"
  >;
  hasLogo: boolean;
  hasPhoto: boolean;
  trust: CompanyTrust;
  approvedReviewCount: number;
  reviewLinkVisits: number;
  notifyEmail: string | null | undefined;
}): CompletenessInput {
  return {
    about: state.fields.about ?? "",
    phone: state.fields.phone ?? "",
    website: state.fields.website ?? "",
    services: state.fields.services ?? [],
    serviceAreas: state.fields.serviceArea ?? [],
    hours: state.fields.hours ?? "",
    hasLogo: Boolean(state.hasLogo),
    hasPhoto: Boolean(state.hasPhoto),
    hasTrust: trustHasAny(state.trust),
    approvedReviewCount: Math.max(0, Number(state.approvedReviewCount) || 0),
    reviewLinkVisits: Math.max(0, Number(state.reviewLinkVisits) || 0),
    notifyEmail: state.notifyEmail,
  };
}

/** Compute 0–100 score + ordered missing checklist. */
export function computeListingCompleteness(
  input: CompletenessInput,
): ListingCompleteness {
  const items: CompletenessChecklistItem[] = COMPLETENESS_ITEM_DEFS.map(
    (def) => ({
      id: def.id,
      label: def.label,
      action: def.action,
      weight: def.weight,
      sectionId: def.sectionId,
      filled: def.isFilled(input),
    }),
  );

  const filledWeight = items
    .filter((i) => i.filled)
    .reduce((s, i) => s + i.weight, 0);
  const missing = items
    .filter((i) => !i.filled)
    .slice()
    .sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id));
  const missingWeight = 100 - filledWeight;
  const score = Math.max(0, Math.min(100, Math.round(filledWeight)));

  return {
    score,
    maxScore: 100,
    filledWeight,
    missingWeight,
    items,
    missing,
    complete: missing.length === 0,
  };
}

/** Top N missing items (already weight-sorted). */
export function topMissingCompletenessItems(
  result: ListingCompleteness,
  limit = 3,
): CompletenessChecklistItem[] {
  const n = Math.max(0, Math.floor(limit));
  return result.missing.slice(0, n);
}

/** Compact admin label, e.g. "72% · missing logo, trust". */
export function formatCompletenessAdminSummary(
  result: ListingCompleteness,
  missingLimit = 2,
): string {
  if (result.complete) return "100% · complete";
  const tops = topMissingCompletenessItems(result, missingLimit)
    .map((m) => m.label.toLowerCase())
    .join(", ");
  return tops ? `${result.score}% · missing ${tops}` : `${result.score}%`;
}

function mergeFieldsWithSeed(
  slug: string,
  live: {
    about: string;
    phone: string;
    website: string;
    hours: string;
    services: string[];
    serviceAreas: string[];
  },
): CompletenessInput {
  const seed = getCompanyBySlug(slug);
  if (!seed) {
    return {
      ...emptyCompletenessInput(),
      about: live.about,
      phone: live.phone,
      website: live.website,
      hours: live.hours,
      services: live.services,
      serviceAreas: live.serviceAreas,
    };
  }
  const seedFields = listingFieldsFromCompany(seed);
  return {
    ...emptyCompletenessInput(),
    about: live.about.trim() || seedFields.about,
    phone: live.phone.trim() || seedFields.phone,
    website: live.website.trim() || seedFields.website,
    hours: live.hours.trim() || seedFields.hours,
    services: live.services.length ? live.services : seedFields.services,
    serviceAreas: live.serviceAreas.length
      ? live.serviceAreas
      : seedFields.serviceArea,
  };
}

type CompanyCompletenessRow = {
  id: number;
  slug: string;
  about: string | null;
  phone: string | null;
  website: string | null;
  hours: string | null;
  logo_key: string | null;
  photo_key: string | null;
  notify_email: string | null;
  trust_licensed: number | null;
  trust_license_number: string | null;
  trust_insured: number | null;
  trust_bonded: number | null;
  trust_family_owned: number | null;
  trust_years_in_business: number | null;
};

function trustFromCompletenessRow(row: CompanyCompletenessRow): CompanyTrust {
  return {
    licensed: Boolean(row.trust_licensed),
    licenseNumber: row.trust_license_number?.trim() || null,
    insured: Boolean(row.trust_insured),
    bonded: Boolean(row.trust_bonded),
    familyOwned: Boolean(row.trust_family_owned),
    yearsInBusiness:
      row.trust_years_in_business === null ||
      row.trust_years_in_business === undefined
        ? null
        : Number(row.trust_years_in_business),
    updatedAt: null,
  };
}

async function loadServicesAndAreasByCompanyIds(
  db: D1Database,
  companyIds: number[],
): Promise<Map<number, { services: string[]; serviceAreas: string[] }>> {
  const out = new Map<number, { services: string[]; serviceAreas: string[] }>();
  for (const id of companyIds) {
    out.set(id, { services: [], serviceAreas: [] });
  }
  if (companyIds.length === 0) return out;

  const placeholders = companyIds.map(() => "?").join(",");
  const [servicesRes, areasRes] = await Promise.all([
    db
      .prepare(
        `SELECT company_id, service FROM company_services
         WHERE company_id IN (${placeholders})
         ORDER BY id ASC`,
      )
      .bind(...companyIds)
      .all<{ company_id: number; service: string }>(),
    db
      .prepare(
        `SELECT company_id, area FROM company_service_areas
         WHERE company_id IN (${placeholders})
         ORDER BY id ASC`,
      )
      .bind(...companyIds)
      .all<{ company_id: number; area: string }>(),
  ]);

  for (const row of servicesRes.results ?? []) {
    const entry = out.get(row.company_id);
    if (entry) entry.services.push(row.service);
  }
  for (const row of areasRes.results ?? []) {
    const entry = out.get(row.company_id);
    if (entry) entry.serviceAreas.push(row.area);
  }
  return out;
}

async function loadReviewCountsBySlugs(
  db: D1Database,
  slugs: string[],
): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  if (slugs.length === 0) return out;
  const placeholders = slugs.map(() => "?").join(",");
  const { results } = await db
    .prepare(
      `SELECT company_slug, COUNT(*) AS n
       FROM company_reviews
       WHERE company_slug IN (${placeholders}) AND status = 'visible'
       GROUP BY company_slug`,
    )
    .bind(...slugs)
    .all<{ company_slug: string; n: number }>();
  for (const row of results ?? []) {
    out.set(row.company_slug, Number(row.n) || 0);
  }
  return out;
}

async function loadReviewLinkVisitsBySlugs(
  db: D1Database,
  slugs: string[],
): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  if (slugs.length === 0) return out;
  const placeholders = slugs.map(() => "?").join(",");
  try {
    const { results } = await db
      .prepare(
        `SELECT company_slug, COALESCE(SUM(review_link_visits), 0) AS n
         FROM listing_stats_daily
         WHERE company_slug IN (${placeholders})
         GROUP BY company_slug`,
      )
      .bind(...slugs)
      .all<{ company_slug: string; n: number }>();
    for (const row of results ?? []) {
      out.set(row.company_slug, Number(row.n) || 0);
    }
  } catch (err) {
    // Stats table may be missing on older DBs — treat as zero visits.
    console.error("listing-completeness review_link_visits load failed", err);
  }
  return out;
}

/**
 * Load completeness inputs for many company slugs (admin claims list).
 * Merges D1 live fields with seed data the same way the manage page does.
 */
export async function loadCompletenessInputsBySlugs(
  db: D1Database,
  slugs: string[],
): Promise<Record<string, CompletenessInput>> {
  const unique = [
    ...new Set(
      slugs
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 200),
    ),
  ];
  if (unique.length === 0) return {};

  const placeholders = unique.map(() => "?").join(",");
  let rows: CompanyCompletenessRow[] = [];
  try {
    const res = await db
      .prepare(
        `SELECT id, slug, about, phone, website, hours,
                logo_key, photo_key, notify_email,
                trust_licensed, trust_license_number, trust_insured,
                trust_bonded, trust_family_owned, trust_years_in_business
         FROM companies
         WHERE slug IN (${placeholders})`,
      )
      .bind(...unique)
      .all<CompanyCompletenessRow>();
    rows = res.results ?? [];
  } catch (err) {
    // Fallback without trust / media columns if migrations lag.
    console.error("listing-completeness company load failed; falling back", err);
    try {
      const res = await db
        .prepare(
          `SELECT id, slug, about, phone, website, hours, notify_email
           FROM companies
           WHERE slug IN (${placeholders})`,
        )
        .bind(...unique)
        .all<{
          id: number;
          slug: string;
          about: string | null;
          phone: string | null;
          website: string | null;
          hours: string | null;
          notify_email: string | null;
        }>();
      rows = (res.results ?? []).map((r) => ({
        ...r,
        logo_key: null,
        photo_key: null,
        trust_licensed: null,
        trust_license_number: null,
        trust_insured: null,
        trust_bonded: null,
        trust_family_owned: null,
        trust_years_in_business: null,
      }));
    } catch (err2) {
      console.error("listing-completeness company fallback failed", err2);
      return {};
    }
  }

  const ids = rows.map((r) => r.id);
  const [related, reviewCounts, linkVisits] = await Promise.all([
    loadServicesAndAreasByCompanyIds(db, ids),
    loadReviewCountsBySlugs(
      db,
      rows.map((r) => r.slug),
    ),
    loadReviewLinkVisitsBySlugs(
      db,
      rows.map((r) => r.slug),
    ),
  ]);

  const out: Record<string, CompletenessInput> = {};
  for (const row of rows) {
    const lists = related.get(row.id) ?? {
      services: [],
      serviceAreas: [],
    };
    const merged = mergeFieldsWithSeed(row.slug, {
      about: row.about ?? "",
      phone: row.phone ?? "",
      website: row.website ?? "",
      hours: row.hours ?? "",
      services: lists.services,
      serviceAreas: lists.serviceAreas,
    });
    const trust = trustFromCompletenessRow(row);
    out[row.slug] = {
      ...merged,
      hasLogo: Boolean(row.logo_key?.trim()),
      hasPhoto: Boolean(row.photo_key?.trim()),
      hasTrust: trustHasAny(trust),
      approvedReviewCount: reviewCounts.get(row.slug) ?? 0,
      reviewLinkVisits: linkVisits.get(row.slug) ?? 0,
      notifyEmail: row.notify_email?.trim() || null,
    };
  }
  return out;
}

/** Load + score one company (weekly digest). */
export async function loadListingCompleteness(
  db: D1Database,
  slug: string,
): Promise<ListingCompleteness | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;
  const map = await loadCompletenessInputsBySlugs(db, [trimmed]);
  const input = map[trimmed];
  if (!input) return null;
  return computeListingCompleteness(input);
}
