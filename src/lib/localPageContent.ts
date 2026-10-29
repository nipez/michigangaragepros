/**
 * Local intros, FAQs, and cost blurbs for city / city×service landers.
 * Uses only existing city, region, nearby, and cost-table data — never invents
 * populations, named businesses, or unsourced statistics.
 */
import type { City } from "@/data/cities";
import { getCitySeo } from "@/data/growth";
import {
  formatCostRange,
  getLocalizedCostTable,
  getRegionForCity,
  type LocalizedCostTable,
} from "@/data/serviceCosts";
import type { Service } from "@/data/services";
import { INDEX_PRO_THRESHOLD } from "@/lib/indexability";

export type LocalFaq = { question: string; answer: string };

/** Stable 0..n-1 picker from a slug (varies templates without randomness). */
function variantIndex(seed: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return modulo === 0 ? 0 : h % modulo;
}

function nearbyPhrase(city: City): string {
  const names = city.nearby.slice(0, 4);
  if (names.length === 0) return "nearby communities";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function climateNote(city: City): string {
  const region = getRegionForCity(city);
  const issues = region?.commonIssues ?? [];
  const v = variantIndex(city.slug, 4);
  if (issues.length === 0) {
    const fallbacks = [
      "freeze-thaw winters that stress springs, seals, and openers",
      "lake-effect cold snaps and ice on weather seals",
      "road salt and temperature swings that wear rollers and cables",
      "deep freezes that make unbalanced doors fail overnight",
    ];
    return fallbacks[v];
  }
  return issues[v % issues.length].replace(/\.$/, "").toLowerCase();
}

function countyPhrase(city: City): string | null {
  const region = getRegionForCity(city);
  if (!region?.counties?.length) return null;
  const counties = region.counties.slice(0, 3);
  if (counties.length === 1) return `${counties[0]} County`;
  if (counties.length === 2)
    return `${counties[0]} and ${counties[1]} counties`;
  return `${counties[0]}, ${counties[1]}, and ${counties[2]} counties`;
}

/**
 * Genuinely local city-hub intro. Prefers curated CITY_SEO.intro when present;
 * otherwise builds from region / nearby / climate notes in repo data.
 */
export function buildCityIntro(city: City, proCount: number): string {
  const curated = getCitySeo(city.slug)?.intro;
  if (curated && curated.length > 120) return curated;

  const region = getRegionForCity(city);
  const nearby = nearbyPhrase(city);
  const climate = climateNote(city);
  const counties = countyPhrase(city);
  const regionTitle = region?.title ?? "Michigan";
  const v = variantIndex(`${city.slug}:intro`, 3);

  const leadOptions = [
    `${city.name} sits in ${regionTitle}, where homeowners deal with ${climate}.`,
    `Garage doors in ${city.name} and ${nearby} take a beating from ${climate}.`,
    `${city.name}-area doors see daily cycles plus ${climate}.`,
  ];
  const coverage = counties
    ? ` Compare directory listings that serve ${city.name}${city.nearby.length ? `, ${nearby}` : ""} across ${counties}.`
    : ` Compare directory listings that serve ${city.name}${city.nearby.length ? ` and ${nearby}` : ""}.`;
  const close =
    proCount >= INDEX_PRO_THRESHOLD
      ? ` Michigan Garage Pros lists ${proCount} companies for this market so you can shortlist by services, service area, and claimed profiles before you request a quote.`
      : ` Browse the companies below, or request a free quote with your ZIP if you need a faster match.`;

  return `${leadOptions[v]}${coverage}${close}`;
}

export function buildCityServiceIntro(
  city: City,
  service: Service,
  proCount: number,
): string {
  const region = getRegionForCity(city);
  const nearby = nearbyPhrase(city);
  const climate = climateNote(city);
  const v = variantIndex(`${city.slug}:${service.slug}:intro`, 3);
  const serviceLower = service.localTitle.toLowerCase();

  const leads = [
    `Looking for ${serviceLower} in ${city.name}? This page lists local directory companies that tag ${service.name.toLowerCase()} for ${city.name} and ${nearby}.`,
    `${city.name} homeowners searching ${serviceLower} usually need help after ${climate} — compare pros that list this service for ${city.name}-area ZIPs.`,
    `Compare ${serviceLower} companies serving ${city.name}${region ? ` in ${region.title}` : ""}, including routes toward ${nearby}.`,
  ];

  const mid =
    proCount >= INDEX_PRO_THRESHOLD
      ? ` ${proCount} companies currently list this service for the ${city.name} market on Michigan Garage Pros.`
      : ` Coverage for this specific service is still building in ${city.name}; you can still browse statewide ${service.name.toLowerCase()} or request a quote.`;

  const close =
    " Michigan Garage Pros is a directory — not a single contractor — so you can compare listings, then call or request a free quote.";

  return `${leads[v]}${mid}${close}`;
}

function costFaq(
  city: City,
  service: Service,
  costs: LocalizedCostTable | null,
): LocalFaq {
  const sample = costs?.lines[0];
  const range = sample
    ? formatCostRange(sample.low, sample.high)
    : "a few hundred dollars";
  return {
    question: `How much does ${service.localTitle.toLowerCase()} cost in ${city.name}?`,
    answer: `Use typical ranges as planning estimates only — for example, ${sample?.label ?? "common jobs"} often land around ${range} in the ${city.name} area before urgency or specialty parts. Get written quotes from local pros with photos of your door; Michigan Garage Pros does not set prices.`,
  };
}

export function buildCityFaqs(city: City, proCount: number): LocalFaq[] {
  const curated = getCitySeo(city.slug)?.faqs;
  if (curated && curated.length >= 3) {
    return curated.slice(0, 5);
  }

  const nearby = nearbyPhrase(city);
  const region = getRegionForCity(city);
  const climate = climateNote(city);
  const v = variantIndex(`${city.slug}:faq`, 2);

  const faqs: LocalFaq[] = [
    {
      question: `How do I find garage door pros in ${city.name}?`,
      answer: `Browse the ${proCount} ${proCount === 1 ? "company" : "companies"} listed on this page, open a profile to confirm service area, or enter your ZIP on Find Pros to see listings that serve ${city.name} and ${nearby}.`,
    },
    {
      question: `What garage door problems are common around ${city.name}?`,
      answer: `Local homeowners often call about ${climate}. Check whether a listing tags repair, springs, openers, or installation before you request a quote.`,
    },
    {
      question: `Which nearby cities do ${city.name} garage door companies cover?`,
      answer: city.nearby.length
        ? `Many listings that serve ${city.name} also name ${nearby}. Confirm your ZIP on each profile — travel windows vary, especially for after-hours calls.`
        : `Check each profile’s service area or search Find Pros with your ZIP. ${region ? `${region.title} routes can span multiple towns.` : "Coverage varies by company."}`,
    },
  ];

  if (v === 0) {
    faqs.push({
      question: `Is Michigan Garage Pros a garage door company in ${city.name}?`,
      answer:
        "No — we are a statewide directory. We help homeowners compare local companies and help pros claim or feature their listings.",
    });
  } else {
    faqs.push({
      question: `How should I compare garage door companies in ${city.name}?`,
      answer:
        "Match the service tag to your job, confirm they serve your ZIP, prefer clear written estimates, and note whether the listing is claimed. Featured Pros are sponsored placements.",
    });
  }

  if (curated?.length) {
    for (const f of curated) {
      if (faqs.length >= 5) break;
      if (!faqs.some((x) => x.question === f.question)) faqs.push(f);
    }
  }

  return faqs.slice(0, 5);
}

export function buildCityServiceFaqs(
  city: City,
  service: Service,
  proCount: number,
): LocalFaq[] {
  const costs = getLocalizedCostTable(service, city);
  const nearby = nearbyPhrase(city);
  const climate = climateNote(city);
  const v = variantIndex(`${city.slug}:${service.slug}:faq`, 3);
  const serviceLower = service.localTitle.toLowerCase();

  const faqs: LocalFaq[] = [
    {
      question: `Who does ${serviceLower} in ${city.name}?`,
      answer:
        proCount >= INDEX_PRO_THRESHOLD
          ? `This page lists ${proCount} directory companies that serve ${city.name} and tag ${service.name.toLowerCase()} (or a closely related service). Open a profile to confirm your ZIP, or browse all ${city.name} pros from the city hub.`
          : `We do not yet have ${INDEX_PRO_THRESHOLD}+ specialists tagged for ${serviceLower} in ${city.name}. Check the ${city.name} city hub, statewide ${service.name.toLowerCase()}, or request a quote with your ZIP.`,
    },
    costFaq(city, service, costs),
    {
      question: `How do I get a quote for ${serviceLower} in ${city.name}?`,
      answer: `Open a company profile to call them, or use Get a Free Quote with your ${city.name}-area ZIP and the service you need. Photos of the door help pros arrive prepared.`,
    },
  ];

  const extras: LocalFaq[] = [
    {
      question: `Does weather around ${city.name} affect ${serviceLower}?`,
      answer: `Yes — ${climate} is a frequent reason ${city.name} homeowners need ${serviceLower}. Ask pros about weather seals, spring balance, and opener battery backup when relevant.`,
    },
    {
      question: `Do ${city.name} ${service.shortName.toLowerCase()} pros also serve nearby towns?`,
      answer: city.nearby.length
        ? `Many listings that cover ${city.name} also serve ${nearby}. Confirm travel to your address on the profile before you wait on a tech outside their normal route.`
        : `Check each profile’s service area. Same-region companies may cover neighboring towns even when they are not listed on this page.`,
    },
    {
      question: `Is ${serviceLower} an emergency in ${city.name}?`,
      answer:
        service.slug === "emergency-service" || service.slug === "broken-springs"
          ? `If the door is stuck open, will not close securely, or a spring has snapped, treat it as urgent for safety and security — especially overnight in Michigan winters. Ask about after-hours rates up front.`
          : `Same-day help matters when the door will not secure the home. For non-urgent tune-ups or planned installs, weekday appointments are usually less expensive than after-hours calls.`,
    },
  ];

  faqs.push(extras[v % extras.length]);
  if (faqs.length < 5) {
    faqs.push(extras[(v + 1) % extras.length]);
  }

  // Fold in one generic service FAQ when it stays distinct.
  for (const f of service.faqs) {
    if (faqs.length >= 5) break;
    if (faqs.some((x) => x.question === f.question)) continue;
    faqs.push(f);
  }

  return faqs.slice(0, 5);
}

export function buildCityCostBlurb(city: City): LocalizedCostTable | null {
  // City hubs show a repair-focused snapshot; service pages use their own table.
  const repair = { slug: "garage-door-repair" };
  return getLocalizedCostTable(repair, city);
}
