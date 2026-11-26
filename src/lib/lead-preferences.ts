/**
 * Claimed-company lead preferences: which cities/services to receive, and a
 * temporary pause (vacation / full schedule) with optional resume date.
 *
 * Defaults (NULL / empty / not paused) keep current routing for every existing
 * company. Preferences only narrow — they never expand geographic matching.
 */

import type { D1Database } from "@cloudflare/workers-types";
import { CITIES, getCityBySlug } from "@/data/cities";
import { SERVICE_OPTIONS } from "@/data/site";

/** Canonical service chips for the lead-preferences form (quote flow options). */
export const LEAD_PREF_SERVICE_OPTIONS = SERVICE_OPTIONS.filter(
  (s) => s !== "Other",
);

/**
 * Soft service match — mirrors lead-routing.leadServiceMatchesCompany so
 * preference filters and directory ranking stay aligned (no circular import).
 */
function softServiceMatch(
  leadService: string | null | undefined,
  preferred: string[] | string | null | undefined,
): boolean {
  const needle = (leadService ?? "").trim().toLowerCase();
  if (!needle || needle === "other") return true;

  const list = Array.isArray(preferred)
    ? preferred
    : typeof preferred === "string"
      ? preferred.split(/\n|\|/).map((s) => s.trim()).filter(Boolean)
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

const MAX_PREF_CITIES = 80;
const MAX_PREF_SERVICES = 20;

export type CompanyLeadPreferences = {
  /** When true (and resume date not yet reached), skip this company for new leads. */
  paused: boolean;
  /** Optional YYYY-MM-DD when pause should auto-end (inclusive start of that day UTC). */
  resumeAt: string | null;
  /** City slugs to accept. Empty = all cities (current behavior). */
  citySlugs: string[];
  /** Quote service labels to accept. Empty = all services (current behavior). */
  services: string[];
};

export type LeadPreferenceSkipReason = "paused" | "city" | "service";

export type LeadPreferenceEligibility = {
  eligible: boolean;
  reason?: LeadPreferenceSkipReason;
  /** True when pause was set but resumeAt has passed (treated as not paused). */
  autoResumed?: boolean;
};

export type LeadPreferenceAdminSummary = {
  slug: string;
  name: string;
  city: string;
  paused: boolean;
  resumeAt: string | null;
  cityLimited: boolean;
  serviceLimited: boolean;
  citySlugs: string[];
  services: string[];
  /** Human-readable status for admin inbox. */
  statusLabel: string;
};

export const EMPTY_LEAD_PREFERENCES: CompanyLeadPreferences = {
  paused: false,
  resumeAt: null,
  citySlugs: [],
  services: [],
};

type PrefRow = {
  leads_paused: number | null;
  leads_resume_at: string | null;
  lead_pref_cities: string | null;
  lead_pref_services: string | null;
};

function parseJsonStringArray(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: string[] = [];
    const seen = new Set<string>();
    for (const item of parsed) {
      if (typeof item !== "string") continue;
      const v = item.trim();
      if (!v) continue;
      const key = v.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(v);
    }
    return out;
  } catch {
    return [];
  }
}

/** Normalize resume date to YYYY-MM-DD or null. */
export function normalizeResumeAt(
  value: string | null | undefined,
): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  // Accept YYYY-MM-DD or full ISO — keep calendar day in UTC.
  const dayMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!dayMatch) return null;
  const day = dayMatch[1]!;
  const t = Date.parse(`${day}T00:00:00Z`);
  if (!Number.isFinite(t)) return null;
  return day;
}

/**
 * Pause is active when flagged AND (no resume date OR today UTC is before resume day).
 * On/after resume day the company is treated as accepting leads again.
 */
export function isLeadPauseActive(
  prefs: Pick<CompanyLeadPreferences, "paused" | "resumeAt">,
  now: Date = new Date(),
): { active: boolean; autoResumed: boolean } {
  if (!prefs.paused) return { active: false, autoResumed: false };
  const resumeAt = normalizeResumeAt(prefs.resumeAt);
  if (!resumeAt) return { active: true, autoResumed: false };
  const resumeMs = Date.parse(`${resumeAt}T00:00:00Z`);
  if (!Number.isFinite(resumeMs)) return { active: true, autoResumed: false };
  const nowDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).getTime();
  if (nowDay >= resumeMs) {
    return { active: false, autoResumed: true };
  }
  return { active: true, autoResumed: false };
}

export function companyAcceptsLeadCity(
  prefs: Pick<CompanyLeadPreferences, "citySlugs">,
  leadCitySlug: string | null | undefined,
): boolean {
  if (prefs.citySlugs.length === 0) return true;
  const slug = (leadCitySlug ?? "").trim();
  if (!slug) return false;
  return prefs.citySlugs.some((s) => s.trim() === slug);
}

/**
 * Soft service match against preference list (same heuristics as directory tags).
 * Empty preference list ⇒ accept all (including blank / Other).
 */
export function companyAcceptsLeadService(
  prefs: Pick<CompanyLeadPreferences, "services">,
  leadService: string | null | undefined,
): boolean {
  if (prefs.services.length === 0) return true;
  return softServiceMatch(leadService, prefs.services);
}

export function companyEligibleForLead(
  prefs: CompanyLeadPreferences,
  lead: { citySlug?: string | null; service?: string | null },
  now: Date = new Date(),
): LeadPreferenceEligibility {
  const pause = isLeadPauseActive(prefs, now);
  if (pause.active) {
    return { eligible: false, reason: "paused", autoResumed: false };
  }
  if (!companyAcceptsLeadCity(prefs, lead.citySlug)) {
    return {
      eligible: false,
      reason: "city",
      autoResumed: pause.autoResumed,
    };
  }
  if (!companyAcceptsLeadService(prefs, lead.service)) {
    return {
      eligible: false,
      reason: "service",
      autoResumed: pause.autoResumed,
    };
  }
  return { eligible: true, autoResumed: pause.autoResumed };
}

export function preferencesFromRow(
  row: PrefRow | null | undefined,
): CompanyLeadPreferences {
  if (!row) return { ...EMPTY_LEAD_PREFERENCES };
  return {
    paused: Boolean(row.leads_paused),
    resumeAt: normalizeResumeAt(row.leads_resume_at),
    citySlugs: parseJsonStringArray(row.lead_pref_cities),
    services: parseJsonStringArray(row.lead_pref_services),
  };
}

export function serializeLeadPreferences(
  prefs: CompanyLeadPreferences,
): {
  leads_paused: number;
  leads_resume_at: string | null;
  lead_pref_cities: string | null;
  lead_pref_services: string | null;
} {
  return {
    leads_paused: prefs.paused ? 1 : 0,
    leads_resume_at: prefs.paused ? normalizeResumeAt(prefs.resumeAt) : null,
    lead_pref_cities:
      prefs.citySlugs.length > 0 ? JSON.stringify(prefs.citySlugs) : null,
    lead_pref_services:
      prefs.services.length > 0 ? JSON.stringify(prefs.services) : null,
  };
}

export function normalizeLeadPreferencesInput(
  input: Partial<CompanyLeadPreferences> | null | undefined,
): CompanyLeadPreferences {
  const src = input ?? {};
  const paused = Boolean(src.paused);
  const resumeAt = paused ? normalizeResumeAt(src.resumeAt) : null;

  const knownCitySlugs = new Set(CITIES.map((c) => c.slug));
  const citySlugs: string[] = [];
  const seenCities = new Set<string>();
  for (const raw of Array.isArray(src.citySlugs) ? src.citySlugs : []) {
    if (typeof raw !== "string") continue;
    const slug = raw.trim();
    if (!slug || !knownCitySlugs.has(slug) || seenCities.has(slug)) continue;
    seenCities.add(slug);
    citySlugs.push(slug);
    if (citySlugs.length >= MAX_PREF_CITIES) break;
  }

  const allowedServices = new Set<string>([
    ...(LEAD_PREF_SERVICE_OPTIONS as readonly string[]),
    ...(SERVICE_OPTIONS as readonly string[]),
  ]);
  const services: string[] = [];
  const seenServices = new Set<string>();
  for (const raw of Array.isArray(src.services) ? src.services : []) {
    if (typeof raw !== "string") continue;
    const v = raw.trim();
    if (!v || v.length > 80) continue;
    // Prefer canonical quote options; allow known manage labels that soft-match.
    const canonical =
      (SERVICE_OPTIONS as readonly string[]).find(
        (s) => s.toLowerCase() === v.toLowerCase(),
      ) ??
      (allowedServices.has(v) ? v : null);
    if (!canonical && !softServiceMatch(v, [...allowedServices])) {
      // Still allow free-text that looks like a service (soft match vs itself).
      if (v.length < 2) continue;
    }
    const stored = canonical ?? v;
    const key = stored.toLowerCase();
    if (seenServices.has(key)) continue;
    seenServices.add(key);
    services.push(stored);
    if (services.length >= MAX_PREF_SERVICES) break;
  }

  return { paused, resumeAt, citySlugs, services };
}

export function validateLeadPreferences(
  prefs: CompanyLeadPreferences,
): string | null {
  if (prefs.resumeAt && !normalizeResumeAt(prefs.resumeAt)) {
    return "Resume date must be a valid YYYY-MM-DD date";
  }
  if (prefs.paused && prefs.resumeAt) {
    const day = normalizeResumeAt(prefs.resumeAt)!;
    const resumeMs = Date.parse(`${day}T00:00:00Z`);
    const today = new Date();
    const todayMs = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );
    if (resumeMs < todayMs) {
      return "Resume date cannot be in the past";
    }
  }
  for (const slug of prefs.citySlugs) {
    if (!getCityBySlug(slug)) {
      return `Unknown city: ${slug}`;
    }
  }
  if (prefs.citySlugs.length > MAX_PREF_CITIES) {
    return `Choose at most ${MAX_PREF_CITIES} cities`;
  }
  if (prefs.services.length > MAX_PREF_SERVICES) {
    return `Choose at most ${MAX_PREF_SERVICES} services`;
  }
  return null;
}

export function leadPreferenceStatusLabel(
  prefs: CompanyLeadPreferences,
  now: Date = new Date(),
): string {
  const pause = isLeadPauseActive(prefs, now);
  const parts: string[] = [];
  if (pause.active) {
    parts.push(
      prefs.resumeAt
        ? `Paused until ${prefs.resumeAt}`
        : "Paused (no resume date)",
    );
  } else if (pause.autoResumed) {
    parts.push("Was paused (auto-resumed)");
  }
  if (prefs.citySlugs.length > 0) {
    parts.push(
      `Cities: ${prefs.citySlugs.length} selected`,
    );
  }
  if (prefs.services.length > 0) {
    parts.push(`Services: ${prefs.services.length} selected`);
  }
  if (parts.length === 0) return "Receiving all matching leads";
  return parts.join(" · ");
}

/**
 * Load preferences for a company. Auto-clears an expired pause in D1
 * (best-effort) so the manage form and admin stay accurate.
 */
export async function getCompanyLeadPreferences(
  db: D1Database,
  companySlug: string,
  options?: { now?: Date; autoClearExpiredPause?: boolean },
): Promise<CompanyLeadPreferences | null> {
  const slug = companySlug.trim();
  if (!slug) return null;

  const row = await db
    .prepare(
      `SELECT leads_paused, leads_resume_at, lead_pref_cities, lead_pref_services
       FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<PrefRow>();

  if (!row) return null;

  let prefs = preferencesFromRow(row);
  const now = options?.now ?? new Date();
  const pause = isLeadPauseActive(prefs, now);

  if (
    pause.autoResumed &&
    options?.autoClearExpiredPause !== false &&
    prefs.paused
  ) {
    try {
      await db
        .prepare(
          `UPDATE companies
           SET leads_paused = 0, leads_resume_at = NULL
           WHERE slug = ? AND leads_paused = 1`,
        )
        .bind(slug)
        .run();
      prefs = { ...prefs, paused: false, resumeAt: null };
    } catch (err) {
      console.error("lead-preferences auto-clear pause failed", err);
      // Still treat as not paused for routing even if clear failed.
      prefs = { ...prefs, paused: false, resumeAt: null };
    }
  }

  return prefs;
}

export async function setCompanyLeadPreferences(
  db: D1Database,
  companySlug: string,
  prefs: CompanyLeadPreferences,
): Promise<CompanyLeadPreferences | null> {
  const slug = companySlug.trim();
  if (!slug) return null;

  const normalized = normalizeLeadPreferencesInput(prefs);
  const serialized = serializeLeadPreferences(normalized);

  const result = await db
    .prepare(
      `UPDATE companies
       SET leads_paused = ?,
           leads_resume_at = ?,
           lead_pref_cities = ?,
           lead_pref_services = ?
       WHERE slug = ?`,
    )
    .bind(
      serialized.leads_paused,
      serialized.leads_resume_at,
      serialized.lead_pref_cities,
      serialized.lead_pref_services,
      slug,
    )
    .run();

  if (!result.meta.changes) return null;
  return normalized;
}

/**
 * Pref columns for a batch of claimed companies (area routing filter).
 * Missing columns / migration pending ⇒ empty map (fail-open = current behavior).
 */
export async function loadLeadPreferencesBySlugs(
  db: D1Database,
  slugs: string[],
): Promise<Record<string, CompanyLeadPreferences>> {
  const unique = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))];
  if (unique.length === 0) return {};

  const out: Record<string, CompanyLeadPreferences> = {};
  // Chunk to keep bind lists modest.
  const chunkSize = 40;
  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const placeholders = chunk.map(() => "?").join(", ");
    try {
      const { results } = await db
        .prepare(
          `SELECT slug, leads_paused, leads_resume_at, lead_pref_cities, lead_pref_services
           FROM companies
           WHERE slug IN (${placeholders})`,
        )
        .bind(...chunk)
        .all<PrefRow & { slug: string }>();

      for (const row of results ?? []) {
        out[row.slug] = preferencesFromRow(row);
      }
    } catch (err) {
      console.error("lead-preferences batch load failed", err);
      // Fail open: leave missing entries absent → callers treat as empty prefs.
    }
  }
  return out;
}

/**
 * Admin: claimed companies that are paused or have city/service limits.
 * Explains why some leads may go unrouted or skip certain pros.
 */
export async function listLeadPreferenceRestrictedCompanies(
  db: D1Database,
  options?: { now?: Date; limit?: number },
): Promise<LeadPreferenceAdminSummary[]> {
  const limit = options?.limit ?? 100;
  const now = options?.now ?? new Date();

  const { results } = await db
    .prepare(
      `SELECT slug, name, city,
              COALESCE(leads_paused, 0) AS leads_paused,
              leads_resume_at,
              lead_pref_cities,
              lead_pref_services
       FROM companies
       WHERE claimed = 1
         AND (
           COALESCE(leads_paused, 0) = 1
           OR (lead_pref_cities IS NOT NULL AND trim(lead_pref_cities) != '' AND lead_pref_cities != '[]')
           OR (lead_pref_services IS NOT NULL AND trim(lead_pref_services) != '' AND lead_pref_services != '[]')
         )
       ORDER BY
         CASE WHEN COALESCE(leads_paused, 0) = 1 THEN 0 ELSE 1 END,
         lower(name)
       LIMIT ?`,
    )
    .bind(limit)
    .all<
      PrefRow & {
        slug: string;
        name: string;
        city: string;
      }
    >();

  const out: LeadPreferenceAdminSummary[] = [];
  for (const row of results ?? []) {
    let prefs = preferencesFromRow(row);
    const pause = isLeadPauseActive(prefs, now);
    if (pause.autoResumed && prefs.paused) {
      prefs = { ...prefs, paused: false, resumeAt: null };
    }
    const cityLimited = prefs.citySlugs.length > 0;
    const serviceLimited = prefs.services.length > 0;
    const paused = pause.active;
    if (!paused && !cityLimited && !serviceLimited) continue;

    out.push({
      slug: row.slug,
      name: row.name,
      city: row.city,
      paused,
      resumeAt: paused ? prefs.resumeAt : null,
      cityLimited,
      serviceLimited,
      citySlugs: prefs.citySlugs,
      services: prefs.services,
      statusLabel: leadPreferenceStatusLabel(
        { ...prefs, paused },
        now,
      ),
    });
  }
  return out;
}

export type LeadPreferenceStats = {
  paused: number;
  cityLimited: number;
  serviceLimited: number;
  totalRestricted: number;
  companies: LeadPreferenceAdminSummary[];
};

export async function loadLeadPreferenceStats(
  db: D1Database,
  options?: { now?: Date; limit?: number },
): Promise<LeadPreferenceStats> {
  const companies = await listLeadPreferenceRestrictedCompanies(db, options);
  let paused = 0;
  let cityLimited = 0;
  let serviceLimited = 0;
  for (const c of companies) {
    if (c.paused) paused += 1;
    if (c.cityLimited) cityLimited += 1;
    if (c.serviceLimited) serviceLimited += 1;
  }
  return {
    paused,
    cityLimited,
    serviceLimited,
    totalRestricted: companies.length,
    companies,
  };
}
