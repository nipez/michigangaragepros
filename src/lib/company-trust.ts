/**
 * Self-reported trust credentials for claimed companies.
 * Stored on companies.*; edited live from /manage/<token>/ (like media).
 * Public surfaces must label values as self-reported — no verification.
 */

import type { getDb } from "@/lib/db";

export type CompanyTrust = {
  licensed: boolean;
  licenseNumber: string | null;
  insured: boolean;
  bonded: boolean;
  familyOwned: boolean;
  yearsInBusiness: number | null;
  updatedAt: string | null;
};

export type CompanyTrustInput = {
  licensed?: unknown;
  licenseNumber?: unknown;
  insured?: unknown;
  bonded?: unknown;
  familyOwned?: unknown;
  yearsInBusiness?: unknown;
};

export const TRUST_LIMITS = {
  licenseNumberMaxLen: 40,
  yearsMin: 0,
  yearsMax: 150,
} as const;

const LICENSE_NUMBER_RE = /^[A-Za-z0-9][A-Za-z0-9 .#/-]{0,39}$/;

export function emptyCompanyTrust(): CompanyTrust {
  return {
    licensed: false,
    licenseNumber: null,
    insured: false,
    bonded: false,
    familyOwned: false,
    yearsInBusiness: null,
    updatedAt: null,
  };
}

function asBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "on";
  }
  return false;
}

function asOptionalYears(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!/^\d{1,3}$/.test(trimmed)) return Number.NaN;
    return Number.parseInt(trimmed, 10);
  }
  return Number.NaN;
}

function asOptionalLicenseNumber(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed || null;
}

/** Normalize + validate trust payload. Returns errors or a clean CompanyTrust patch. */
export function normalizeTrustInput(
  input: CompanyTrustInput,
  current: CompanyTrust = emptyCompanyTrust(),
): { ok: true; trust: CompanyTrust } | { ok: false; error: string } {
  const licensed =
    input.licensed === undefined ? current.licensed : asBool(input.licensed);
  const insured =
    input.insured === undefined ? current.insured : asBool(input.insured);
  const bonded =
    input.bonded === undefined ? current.bonded : asBool(input.bonded);
  const familyOwned =
    input.familyOwned === undefined
      ? current.familyOwned
      : asBool(input.familyOwned);

  let licenseNumber: string | null;
  if (!licensed) {
    licenseNumber = null;
  } else if (input.licenseNumber === undefined) {
    licenseNumber = current.licenseNumber;
  } else {
    const parsed = asOptionalLicenseNumber(input.licenseNumber);
    if (parsed === undefined) {
      return { ok: false, error: "License number must be a string" };
    }
    licenseNumber = parsed;
  }

  if (licenseNumber) {
    if (licenseNumber.length > TRUST_LIMITS.licenseNumberMaxLen) {
      return {
        ok: false,
        error: `License number must be ≤${TRUST_LIMITS.licenseNumberMaxLen} characters`,
      };
    }
    if (!LICENSE_NUMBER_RE.test(licenseNumber)) {
      return {
        ok: false,
        error:
          "License number may only use letters, numbers, spaces, and . # / -",
      };
    }
  }

  let yearsInBusiness: number | null;
  if (input.yearsInBusiness === undefined) {
    yearsInBusiness = current.yearsInBusiness;
  } else {
    const parsed = asOptionalYears(input.yearsInBusiness);
    if (parsed !== null && parsed !== undefined && Number.isNaN(parsed)) {
      return {
        ok: false,
        error: "Years in business must be a whole number",
      };
    }
    yearsInBusiness = parsed === undefined ? current.yearsInBusiness : parsed;
  }

  if (yearsInBusiness !== null) {
    if (
      !Number.isInteger(yearsInBusiness) ||
      yearsInBusiness < TRUST_LIMITS.yearsMin ||
      yearsInBusiness > TRUST_LIMITS.yearsMax
    ) {
      return {
        ok: false,
        error: `Years in business must be between ${TRUST_LIMITS.yearsMin} and ${TRUST_LIMITS.yearsMax}`,
      };
    }
  }

  return {
    ok: true,
    trust: {
      licensed,
      licenseNumber,
      insured,
      bonded,
      familyOwned,
      yearsInBusiness,
      updatedAt: current.updatedAt,
    },
  };
}

export function trustHasAny(trust: CompanyTrust): boolean {
  return (
    trust.licensed ||
    trust.insured ||
    trust.bonded ||
    trust.familyOwned ||
    trust.yearsInBusiness !== null
  );
}

export type TrustBadge = {
  key: string;
  label: string;
  detail?: string;
};

/** Public badge labels derived from self-reported fields. */
export function trustBadges(trust: CompanyTrust): TrustBadge[] {
  const badges: TrustBadge[] = [];
  if (trust.licensed) {
    badges.push({
      key: "licensed",
      label: "Licensed",
      detail: trust.licenseNumber || undefined,
    });
  }
  if (trust.insured) {
    badges.push({ key: "insured", label: "Insured" });
  }
  if (trust.bonded) {
    badges.push({ key: "bonded", label: "Bonded" });
  }
  if (trust.familyOwned) {
    badges.push({ key: "family-owned", label: "Family-owned" });
  }
  if (trust.yearsInBusiness !== null) {
    const y = trust.yearsInBusiness;
    badges.push({
      key: "years",
      label: y === 1 ? "1 year in business" : `${y} years in business`,
    });
  }
  return badges;
}

/** Compact admin / card summary, e.g. "Licensed · Insured · 12 yrs". */
export function formatTrustSummary(trust: CompanyTrust): string | null {
  const parts: string[] = [];
  if (trust.licensed) {
    parts.push(
      trust.licenseNumber
        ? `Licensed (${trust.licenseNumber})`
        : "Licensed",
    );
  }
  if (trust.insured) parts.push("Insured");
  if (trust.bonded) parts.push("Bonded");
  if (trust.familyOwned) parts.push("Family-owned");
  if (trust.yearsInBusiness !== null) {
    parts.push(`${trust.yearsInBusiness} yrs`);
  }
  return parts.length ? parts.join(" · ") : null;
}

type TrustDb = Awaited<ReturnType<typeof getDb>>;

type TrustRow = {
  trust_licensed: number | null;
  trust_license_number: string | null;
  trust_insured: number | null;
  trust_bonded: number | null;
  trust_family_owned: number | null;
  trust_years_in_business: number | null;
  trust_updated_at: string | null;
};

export function companyTrustFromRow(
  row: TrustRow | null | undefined,
): CompanyTrust {
  if (!row) return emptyCompanyTrust();
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
    updatedAt: row.trust_updated_at ?? null,
  };
}

export async function getCompanyTrust(
  db: TrustDb,
  slug: string,
): Promise<CompanyTrust> {
  const row = await db
    .prepare(
      `SELECT trust_licensed, trust_license_number, trust_insured,
              trust_bonded, trust_family_owned, trust_years_in_business,
              trust_updated_at
       FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<TrustRow>();
  return companyTrustFromRow(row);
}

export async function getCompanyTrustBySlugs(
  db: TrustDb,
  slugs: string[],
): Promise<Record<string, CompanyTrust>> {
  const unique = [
    ...new Set(
      slugs
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 100),
    ),
  ];
  if (unique.length === 0) return {};

  const placeholders = unique.map(() => "?").join(",");
  const res = await db
    .prepare(
      `SELECT slug, trust_licensed, trust_license_number, trust_insured,
              trust_bonded, trust_family_owned, trust_years_in_business,
              trust_updated_at
       FROM companies
       WHERE slug IN (${placeholders})
         AND (
           trust_licensed = 1 OR trust_insured = 1 OR trust_bonded = 1
           OR trust_family_owned = 1 OR trust_years_in_business IS NOT NULL
         )`,
    )
    .bind(...unique)
    .all<TrustRow & { slug: string }>();

  const out: Record<string, CompanyTrust> = {};
  for (const row of res.results ?? []) {
    out[row.slug] = companyTrustFromRow(row);
  }
  return out;
}

export async function setCompanyTrust(
  db: TrustDb,
  slug: string,
  trust: CompanyTrust,
): Promise<{ ok: true; trust: CompanyTrust } | { ok: false }> {
  const existing = await db
    .prepare(`SELECT id FROM companies WHERE slug = ? LIMIT 1`)
    .bind(slug)
    .first<{ id: number }>();
  if (!existing) return { ok: false };

  await db
    .prepare(
      `UPDATE companies SET
         trust_licensed = ?,
         trust_license_number = ?,
         trust_insured = ?,
         trust_bonded = ?,
         trust_family_owned = ?,
         trust_years_in_business = ?,
         trust_updated_at = datetime('now')
       WHERE slug = ?`,
    )
    .bind(
      trust.licensed ? 1 : 0,
      trust.licenseNumber,
      trust.insured ? 1 : 0,
      trust.bonded ? 1 : 0,
      trust.familyOwned ? 1 : 0,
      trust.yearsInBusiness,
      slug,
    )
    .run();

  const saved = await getCompanyTrust(db, slug);
  return { ok: true, trust: saved };
}

export function trustEqual(a: CompanyTrust, b: CompanyTrust): boolean {
  return (
    a.licensed === b.licensed &&
    a.licenseNumber === b.licenseNumber &&
    a.insured === b.insured &&
    a.bonded === b.bonded &&
    a.familyOwned === b.familyOwned &&
    a.yearsInBusiness === b.yearsInBusiness
  );
}
