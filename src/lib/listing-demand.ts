import type { D1Database } from "@cloudflare/workers-types";
import { addUtcDays, utcDay } from "@/lib/listing-stats";

/** Rolling window used for owner-facing claim demand signals. */
export const LISTING_DEMAND_WINDOW_DAYS = 30;

/**
 * Minimum profile views before we surface a count publicly.
 * Below this, copy softens so we never show "viewed 0 times".
 */
export const MIN_VIEWS_TO_SHOW = 5;

/** Minimum quote requests before we mention them by number. */
export const MIN_QUOTES_TO_SHOW = 1;

/** Minimum contact clicks before we mention them by number. */
export const MIN_CONTACTS_TO_SHOW = 2;

export type ListingDemand = {
  companySlug: string;
  /** Inclusive UTC start (YYYY-MM-DD) of the window. */
  windowStart: string;
  /** Inclusive UTC end (YYYY-MM-DD) of the window (today). */
  windowEnd: string;
  profileViews: number;
  contactClicks: number;
  /** Leads submitted targeting this company_slug in the window. */
  quoteRequests: number;
};

export type ClaimDemandCopy = {
  /** Short owner-facing paragraph; never invents or shows zero counts. */
  body: string;
  /** Compact admin / prioritization line; null when nothing meaningful. */
  adminSummary: string | null;
  showViews: boolean;
  showQuotes: boolean;
  showContacts: boolean;
  hasSignal: boolean;
};

export function emptyListingDemand(
  companySlug = "",
  today: string = utcDay(),
): ListingDemand {
  const windowEnd = today;
  const windowStart = addUtcDays(windowEnd, -(LISTING_DEMAND_WINDOW_DAYS - 1));
  return {
    companySlug: companySlug.trim(),
    windowStart,
    windowEnd,
    profileViews: 0,
    contactClicks: 0,
    quoteRequests: 0,
  };
}

export function shouldShowViews(views: number): boolean {
  return views >= MIN_VIEWS_TO_SHOW;
}

export function shouldShowQuotes(quotes: number): boolean {
  return quotes >= MIN_QUOTES_TO_SHOW;
}

export function shouldShowContacts(contacts: number): boolean {
  return contacts >= MIN_CONTACTS_TO_SHOW;
}

function plural(n: number, singular: string, pluralForm?: string): string {
  return n === 1 ? singular : (pluralForm ?? `${singular}s`);
}

/**
 * Build owner-facing claim copy from real demand totals.
 * Never fabricates numbers; omits metrics that are too low to be meaningful.
 */
export function formatClaimDemandCopy(demand: ListingDemand): ClaimDemandCopy {
  const views = Math.max(0, Math.floor(Number(demand.profileViews) || 0));
  const quotes = Math.max(0, Math.floor(Number(demand.quoteRequests) || 0));
  const contacts = Math.max(0, Math.floor(Number(demand.contactClicks) || 0));

  const showViews = shouldShowViews(views);
  const showQuotes = shouldShowQuotes(quotes);
  const showContacts = shouldShowContacts(contacts);
  const hasSignal = showViews || showQuotes || showContacts;

  const parts: string[] = [];
  if (showViews) {
    parts.push(
      `viewed ${views.toLocaleString("en-US")} ${plural(views, "time")} in the last ${LISTING_DEMAND_WINDOW_DAYS} days`,
    );
  }
  if (showQuotes) {
    parts.push(
      `${quotes.toLocaleString("en-US")} homeowner${quotes === 1 ? "" : "s"} requested a quote`,
    );
  }
  if (showContacts) {
    parts.push(
      `${contacts.toLocaleString("en-US")} contact ${plural(contacts, "click")} from this page`,
    );
  }

  let body: string;
  if (parts.length === 0) {
    body =
      "Homeowners are finding this page. Claim it free to update your info and receive quote requests in your inbox.";
  } else if (parts.length === 1) {
    body = `This listing was ${parts[0]}. Claim it free to respond and manage your page.`;
  } else if (parts.length === 2) {
    body = `This listing was ${parts[0]}, and ${parts[1]}. Claim it free to respond and manage your page.`;
  } else {
    body = `This listing was ${parts[0]}, ${parts[1]}, and ${parts[2]}. Claim it free to respond and manage your page.`;
  }

  // Fix awkward "was X homeowners requested" grammar when views are omitted.
  if (!showViews && (showQuotes || showContacts)) {
    const interest: string[] = [];
    if (showQuotes) {
      interest.push(
        `${quotes.toLocaleString("en-US")} homeowner${quotes === 1 ? "" : "s"} requested a quote`,
      );
    }
    if (showContacts) {
      interest.push(
        `${contacts.toLocaleString("en-US")} contact ${plural(contacts, "click")}`,
      );
    }
    body =
      interest.length === 1
        ? `In the last ${LISTING_DEMAND_WINDOW_DAYS} days, ${interest[0]} on this listing. Claim it free to respond and manage your page.`
        : `In the last ${LISTING_DEMAND_WINDOW_DAYS} days, ${interest[0]} and ${interest[1]} on this listing. Claim it free to respond and manage your page.`;
  }

  let adminSummary: string | null = null;
  if (hasSignal) {
    const bits: string[] = [];
    if (showViews) bits.push(`${views} views`);
    if (showQuotes) bits.push(`${quotes} quotes`);
    if (showContacts) bits.push(`${contacts} contacts`);
    adminSummary = `30d demand: ${bits.join(" · ")}`;
  }

  return {
    body,
    adminSummary,
    showViews,
    showQuotes,
    showContacts,
    hasSignal,
  };
}

/**
 * Aggregate 30-day demand for a listing from existing counters + leads rows.
 * Views/contacts come from listing_stats_daily; quote requests from leads
 * targeting company_slug (works for unclaimed listings where leads_routed
 * would stay at 0).
 */
export async function getListingDemand(
  db: D1Database,
  companySlug: string,
  today: string = utcDay(),
): Promise<ListingDemand> {
  const slug = companySlug.trim();
  const base = emptyListingDemand(slug, today);
  if (!slug) return base;

  const statsPromise = db
    .prepare(
      `SELECT
         COALESCE(SUM(profile_views), 0) AS profile_views,
         COALESCE(SUM(contact_clicks), 0) AS contact_clicks
       FROM listing_stats_daily
       WHERE company_slug = ?
         AND day >= ?
         AND day <= ?`,
    )
    .bind(slug, base.windowStart, base.windowEnd)
    .first<{ profile_views: number; contact_clicks: number }>();

  // leads.created_at is SQLite datetime('now') text; compare on date prefix.
  const quotesPromise = db
    .prepare(
      `SELECT COUNT(*) AS quote_requests
       FROM leads
       WHERE company_slug = ?
         AND substr(created_at, 1, 10) >= ?
         AND substr(created_at, 1, 10) <= ?`,
    )
    .bind(slug, base.windowStart, base.windowEnd)
    .first<{ quote_requests: number }>();

  const [stats, quotes] = await Promise.all([statsPromise, quotesPromise]);

  return {
    ...base,
    profileViews: Number(stats?.profile_views) || 0,
    contactClicks: Number(stats?.contact_clicks) || 0,
    quoteRequests: Number(quotes?.quote_requests) || 0,
  };
}

/**
 * Batch demand for many slugs (admin claims inbox). Missing slugs get zeros.
 */
export async function getListingDemandForSlugs(
  db: D1Database,
  companySlugs: string[],
  today: string = utcDay(),
): Promise<Map<string, ListingDemand>> {
  const unique = [
    ...new Set(
      companySlugs.map((s) => s.trim()).filter((s) => Boolean(s)),
    ),
  ];
  const map = new Map<string, ListingDemand>();
  const windowEnd = today;
  const windowStart = addUtcDays(windowEnd, -(LISTING_DEMAND_WINDOW_DAYS - 1));

  for (const slug of unique) {
    map.set(slug, emptyListingDemand(slug, today));
  }
  if (unique.length === 0) return map;

  const placeholders = unique.map(() => "?").join(", ");

  const { results: statRows } = await db
    .prepare(
      `SELECT company_slug,
              COALESCE(SUM(profile_views), 0) AS profile_views,
              COALESCE(SUM(contact_clicks), 0) AS contact_clicks
       FROM listing_stats_daily
       WHERE company_slug IN (${placeholders})
         AND day >= ?
         AND day <= ?
       GROUP BY company_slug`,
    )
    .bind(...unique, windowStart, windowEnd)
    .all<{
      company_slug: string;
      profile_views: number;
      contact_clicks: number;
    }>();

  for (const row of statRows ?? []) {
    const existing = map.get(row.company_slug) ?? emptyListingDemand(row.company_slug, today);
    map.set(row.company_slug, {
      ...existing,
      profileViews: Number(row.profile_views) || 0,
      contactClicks: Number(row.contact_clicks) || 0,
    });
  }

  const { results: quoteRows } = await db
    .prepare(
      `SELECT company_slug,
              COUNT(*) AS quote_requests
       FROM leads
       WHERE company_slug IN (${placeholders})
         AND substr(created_at, 1, 10) >= ?
         AND substr(created_at, 1, 10) <= ?
       GROUP BY company_slug`,
    )
    .bind(...unique, windowStart, windowEnd)
    .all<{ company_slug: string; quote_requests: number }>();

  for (const row of quoteRows ?? []) {
    const existing = map.get(row.company_slug) ?? emptyListingDemand(row.company_slug, today);
    map.set(row.company_slug, {
      ...existing,
      quoteRequests: Number(row.quote_requests) || 0,
    });
  }

  return map;
}
