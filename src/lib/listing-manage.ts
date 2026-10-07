import type { Company } from "@/data/companies";
import { SITE_URL } from "@/data/site";
import type { getDb } from "@/lib/db";

type ListingDb = Awaited<ReturnType<typeof getDb>>;

/** Editable fields that appear on the public company profile. */
export type ListingFields = {
  about: string;
  phone: string;
  phoneAlt: string;
  website: string;
  address: string;
  hours: string;
  emergencyHours: string;
  services: string[];
  serviceArea: string[];
};

export const EMPTY_LISTING_FIELDS: ListingFields = {
  about: "",
  phone: "",
  phoneAlt: "",
  website: "",
  address: "",
  hours: "",
  emergencyHours: "",
  services: [],
  serviceArea: [],
};

/** Canonical service checkboxes for the manage form (matches common seed lists). */
export const MANAGE_SERVICE_OPTIONS = [
  "Garage Door Repair",
  "Broken Spring Replacement",
  "Opener Repair & Install",
  "New Door Installation",
  "Maintenance & Tune-ups",
  "Emergency Service",
  "Commercial Service",
] as const;

const MAX_ABOUT = 1200;
const MAX_PHONE = 40;
const MAX_WEBSITE = 200;
const MAX_ADDRESS = 200;
const MAX_HOURS = 120;
const MAX_EMERGENCY_HOURS = 120;
const MAX_SERVICES = 20;
const MAX_SERVICE_LEN = 80;
const MAX_AREAS = 40;
const MAX_AREA_LEN = 80;

/** 32 random bytes → 64 hex chars (unguessable manage URL token). */
export function generateManageToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function manageUrl(token: string): string {
  return `${SITE_URL}/manage/${token}/`;
}

export function isValidManageTokenFormat(token: string): boolean {
  return /^[a-f0-9]{64}$/i.test(token.trim());
}

export function listingFieldsFromCompany(company: Company): ListingFields {
  return {
    about: company.about ?? "",
    phone: company.phone ?? "",
    phoneAlt: company.phoneAlt ?? "",
    website: company.website ?? "",
    address: company.address ?? "",
    hours: company.hours ?? "",
    emergencyHours: company.emergencyHours ?? "",
    services: [...(company.services ?? [])],
    serviceArea: [...(company.serviceArea ?? [])],
  };
}

export function mergeListingFields(
  company: Company,
  live: ListingFields,
): Company {
  return {
    ...company,
    about: live.about,
    phone: live.phone || undefined,
    phoneAlt: live.phoneAlt || undefined,
    website: live.website || undefined,
    address: live.address || undefined,
    hours: live.hours || company.hours,
    emergencyHours: live.emergencyHours || undefined,
    services: live.services.length ? live.services : company.services,
    serviceArea: live.serviceArea.length ? live.serviceArea : company.serviceArea,
  };
}

function cleanList(values: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of values) {
    if (typeof raw !== "string") continue;
    const v = raw.trim().replace(/\s+/g, " ");
    if (!v || v.length > maxLen) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
    if (out.length >= maxItems) break;
  }
  return out;
}

export function normalizeListingFields(
  input: Partial<ListingFields> | null | undefined,
): ListingFields {
  const src = input ?? {};
  return {
    about: typeof src.about === "string" ? src.about.trim() : "",
    phone: typeof src.phone === "string" ? src.phone.trim() : "",
    phoneAlt: typeof src.phoneAlt === "string" ? src.phoneAlt.trim() : "",
    website: typeof src.website === "string" ? src.website.trim() : "",
    address: typeof src.address === "string" ? src.address.trim() : "",
    hours: typeof src.hours === "string" ? src.hours.trim() : "",
    emergencyHours:
      typeof src.emergencyHours === "string" ? src.emergencyHours.trim() : "",
    services: cleanList(src.services, MAX_SERVICES, MAX_SERVICE_LEN),
    serviceArea: cleanList(src.serviceArea, MAX_AREAS, MAX_AREA_LEN),
  };
}

export function validateListingFields(fields: ListingFields): string | null {
  if (fields.about.length > MAX_ABOUT) {
    return `About must be ${MAX_ABOUT} characters or fewer`;
  }
  if (fields.phone.length > MAX_PHONE) {
    return `Phone must be ${MAX_PHONE} characters or fewer`;
  }
  if (fields.phone && fields.phone.replace(/\D/g, "").length < 10) {
    return "Enter a valid phone number (at least 10 digits)";
  }
  if (fields.phoneAlt.length > MAX_PHONE) {
    return `Alt phone must be ${MAX_PHONE} characters or fewer`;
  }
  if (fields.phoneAlt && fields.phoneAlt.replace(/\D/g, "").length < 10) {
    return "Enter a valid alt phone number (at least 10 digits)";
  }
  if (fields.website.length > MAX_WEBSITE) {
    return `Website must be ${MAX_WEBSITE} characters or fewer`;
  }
  if (fields.website) {
    const ok =
      /^https?:\/\/.+/i.test(fields.website) ||
      /^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(fields.website);
    if (!ok) return "Website must be a valid URL or domain";
  }
  if (fields.address.length > MAX_ADDRESS) {
    return `Address must be ${MAX_ADDRESS} characters or fewer`;
  }
  if (fields.hours.length > MAX_HOURS) {
    return `Hours must be ${MAX_HOURS} characters or fewer`;
  }
  if (fields.emergencyHours.length > MAX_EMERGENCY_HOURS) {
    return `Emergency hours must be ${MAX_EMERGENCY_HOURS} characters or fewer`;
  }
  if (fields.services.length === 0) {
    return "Select at least one service";
  }
  if (fields.serviceArea.length === 0) {
    return "Add at least one service area city";
  }
  return null;
}

export function listingFieldsEqual(a: ListingFields, b: ListingFields): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function parseListingFieldsJson(raw: string | null | undefined): ListingFields {
  if (!raw) return { ...EMPTY_LISTING_FIELDS };
  try {
    return normalizeListingFields(JSON.parse(raw) as Partial<ListingFields>);
  } catch {
    return { ...EMPTY_LISTING_FIELDS };
  }
}

type CompanyListingRow = {
  id: number;
  slug: string;
  name: string;
  about: string;
  phone: string | null;
  phone_alt: string | null;
  website: string | null;
  address: string | null;
  hours: string;
  emergency_hours: string | null;
  claimed: number;
  manage_token: string | null;
  listing_updated_at: string | null;
};

async function loadServicesAndAreas(
  db: ListingDb,
  companyId: number,
): Promise<{ services: string[]; serviceArea: string[] }> {
  const [servicesRes, areasRes] = await Promise.all([
    db
      .prepare(
        `SELECT service FROM company_services WHERE company_id = ? ORDER BY id ASC`,
      )
      .bind(companyId)
      .all<{ service: string }>(),
    db
      .prepare(
        `SELECT area FROM company_service_areas WHERE company_id = ? ORDER BY id ASC`,
      )
      .bind(companyId)
      .all<{ area: string }>(),
  ]);
  return {
    services: (servicesRes.results ?? []).map((r) => r.service),
    serviceArea: (areasRes.results ?? []).map((r) => r.area),
  };
}

export async function getCompanyByManageToken(
  db: ListingDb,
  token: string,
): Promise<{
  id: number;
  slug: string;
  name: string;
  claimed: boolean;
  fields: ListingFields;
} | null> {
  if (!isValidManageTokenFormat(token)) return null;
  const row = await db
    .prepare(
      `SELECT id, slug, name, about, phone, phone_alt, website, address, hours,
              emergency_hours, claimed, manage_token, listing_updated_at
       FROM companies WHERE manage_token = ? LIMIT 1`,
    )
    .bind(token.trim())
    .first<CompanyListingRow>();

  if (!row || !row.claimed) return null;

  const related = await loadServicesAndAreas(db, row.id);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    claimed: true,
    fields: normalizeListingFields({
      about: row.about,
      phone: row.phone ?? "",
      phoneAlt: row.phone_alt ?? "",
      website: row.website ?? "",
      address: row.address ?? "",
      hours: row.hours,
      emergencyHours: row.emergency_hours ?? "",
      services: related.services,
      serviceArea: related.serviceArea,
    }),
  };
}

/**
 * Live listing fields for a public profile when an approved edit has been applied.
 * Returns null when the company has never had a moderated listing update.
 */
export async function getLiveListingFields(
  db: ListingDb,
  slug: string,
): Promise<ListingFields | null> {
  const row = await db
    .prepare(
      `SELECT id, about, phone, phone_alt, website, address, hours,
              emergency_hours, listing_updated_at
       FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<{
      id: number;
      about: string;
      phone: string | null;
      phone_alt: string | null;
      website: string | null;
      address: string | null;
      hours: string;
      emergency_hours: string | null;
      listing_updated_at: string | null;
    }>();

  if (!row?.listing_updated_at) return null;

  const related = await loadServicesAndAreas(db, row.id);
  return normalizeListingFields({
    about: row.about,
    phone: row.phone ?? "",
    phoneAlt: row.phone_alt ?? "",
    website: row.website ?? "",
    address: row.address ?? "",
    hours: row.hours,
    emergencyHours: row.emergency_hours ?? "",
    services: related.services,
    serviceArea: related.serviceArea,
  });
}

/** Ensure a claimed company has a manage token; returns the token (existing or new). */
export async function ensureManageToken(
  db: ListingDb,
  slug: string,
): Promise<string | null> {
  const existing = await db
    .prepare(
      `SELECT manage_token, claimed FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<{ manage_token: string | null; claimed: number }>();

  if (!existing) return null;

  if (existing.manage_token) return existing.manage_token;

  const token = generateManageToken();
  await db
    .prepare(
      `UPDATE companies
       SET manage_token = ?, manage_token_created_at = datetime('now'), claimed = 1
       WHERE slug = ?`,
    )
    .bind(token, slug)
    .run();
  return token;
}

export async function regenerateManageToken(
  db: ListingDb,
  slug: string,
): Promise<string | null> {
  const existing = await db
    .prepare(`SELECT id, claimed FROM companies WHERE slug = ? LIMIT 1`)
    .bind(slug)
    .first<{ id: number; claimed: number }>();
  if (!existing || !existing.claimed) return null;

  const token = generateManageToken();
  await db
    .prepare(
      `UPDATE companies
       SET manage_token = ?, manage_token_created_at = datetime('now')
       WHERE slug = ?`,
    )
    .bind(token, slug)
    .run();
  return token;
}

export async function revokeManageToken(
  db: ListingDb,
  slug: string,
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE companies
       SET manage_token = NULL, manage_token_created_at = NULL
       WHERE slug = ?`,
    )
    .bind(slug)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

/** Apply approved listing fields to the public D1 company row + child tables. */
export async function applyListingFields(
  db: ListingDb,
  slug: string,
  fields: ListingFields,
): Promise<boolean> {
  const company = await db
    .prepare(`SELECT id FROM companies WHERE slug = ? LIMIT 1`)
    .bind(slug)
    .first<{ id: number }>();
  if (!company) return false;

  const website = fields.website
    ? /^https?:\/\//i.test(fields.website)
      ? fields.website
      : `https://${fields.website}`
    : null;

  const statements = [
    db
      .prepare(
        `UPDATE companies
         SET about = ?, phone = ?, phone_alt = ?, website = ?, address = ?,
             hours = ?, emergency_hours = ?, listing_updated_at = datetime('now')
         WHERE id = ?`,
      )
      .bind(
        fields.about,
        fields.phone || null,
        fields.phoneAlt || null,
        website,
        fields.address || null,
        fields.hours,
        fields.emergencyHours || null,
        company.id,
      ),
    db
      .prepare(`DELETE FROM company_services WHERE company_id = ?`)
      .bind(company.id),
    db
      .prepare(`DELETE FROM company_service_areas WHERE company_id = ?`)
      .bind(company.id),
  ];

  for (const service of fields.services) {
    statements.push(
      db
        .prepare(
          `INSERT INTO company_services (company_id, service) VALUES (?, ?)`,
        )
        .bind(company.id, service),
    );
  }
  for (const area of fields.serviceArea) {
    statements.push(
      db
        .prepare(
          `INSERT INTO company_service_areas (company_id, area) VALUES (?, ?)`,
        )
        .bind(company.id, area),
    );
  }

  await db.batch(statements);
  return true;
}
