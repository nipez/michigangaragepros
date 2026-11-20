import { SERVICE_OPTIONS } from "@/data/site";
import { representativeZipForCitySlug } from "@/data/zipCodes";

/**
 * First-party funnel page types for quote CTAs.
 * Keep values short and stable — stored on leads + quote_funnel_daily.
 */
export const QUOTE_SOURCE_PAGES = [
  "city",
  "city_service",
  "company",
  "cost",
  "service",
  "pros",
  "home",
  "other",
] as const;

export type QuoteSourcePage = (typeof QUOTE_SOURCE_PAGES)[number];

export type QuoteLinkParams = {
  /** Directory city slug (e.g. detroit) — used for ZIP prefill + banner. */
  city?: string;
  /** Optional display name when slug is unknown. */
  cityName?: string;
  /** Service directory name or quote chip label. */
  service?: string;
  /** Company listing slug. */
  company?: string;
  /** Explicit ZIP (wins over city-derived ZIP). */
  zip?: string;
  /** Urgency prefill (timing chip). */
  timing?: string;
  /** Funnel source page type. */
  source?: QuoteSourcePage;
};

const SERVICE_ALIASES: Record<string, (typeof SERVICE_OPTIONS)[number]> = {
  "broken springs": "Broken Spring",
  "broken spring": "Broken Spring",
  "garage door openers": "Garage Door Opener",
  "garage door opener": "Garage Door Opener",
  "garage door repair": "Garage Door Repair",
  "new door installation": "New Door Installation",
  maintenance: "Maintenance",
  "emergency service": "Emergency Service",
  other: "Other",
};

/** Map directory / CTA service labels onto LeadForm chip values. */
export function normalizeQuoteService(
  service: string | undefined | null,
): string {
  const raw = (service ?? "").trim();
  if (!raw) return "";
  const exact = (SERVICE_OPTIONS as readonly string[]).find(
    (opt) => opt.toLowerCase() === raw.toLowerCase(),
  );
  if (exact) return exact;
  return SERVICE_ALIASES[raw.toLowerCase()] ?? raw;
}

export function isQuoteSourcePage(value: string): value is QuoteSourcePage {
  return (QUOTE_SOURCE_PAGES as readonly string[]).includes(value);
}

export function normalizeQuoteSourcePage(
  value: string | undefined | null,
): QuoteSourcePage {
  const raw = (value ?? "").trim().toLowerCase();
  if (isQuoteSourcePage(raw)) return raw;
  return "other";
}

/**
 * Build a /get-a-quote/ href that carries page context for prefills + funnel.
 */
export function buildQuoteHref(params: QuoteLinkParams = {}): string {
  const qs = new URLSearchParams();

  const service = normalizeQuoteService(params.service);
  if (service) qs.set("service", service);

  const company = params.company?.trim();
  if (company) qs.set("company", company);

  const city = params.city?.trim().toLowerCase();
  if (city) qs.set("city", city);

  const cityName = params.cityName?.trim();
  if (cityName) qs.set("cityName", cityName);

  let zip = params.zip?.trim() ?? "";
  if (!zip && city) {
    zip = representativeZipForCitySlug(city) ?? "";
  }
  if (zip) qs.set("zip", zip);

  const timing = params.timing?.trim();
  if (timing) qs.set("timing", timing);

  if (params.source) qs.set("src", params.source);

  const query = qs.toString();
  return query ? `/get-a-quote/?${query}` : "/get-a-quote/";
}
