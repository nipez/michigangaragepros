/**
 * Statewide cost-guide landing pages at /cost/<service-slug>/.
 * Slugs align with SERVICES; keep in sync with generate-seo-files.mjs.
 */
import { SERVICES, getServiceBySlug, type Service } from "./services";
import {
  SERVICE_COST_GUIDES,
  formatCostRange,
  getServiceCostGuide,
} from "./serviceCosts";

export const COST_GUIDE_SLUGS = SERVICE_COST_GUIDES.map((g) => g.serviceSlug);

export type CostGuidePage = {
  service: Service;
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  faqs: { question: string; answer: string }[];
};

export function getCostGuideBySlug(slug: string): CostGuidePage | undefined {
  const service = getServiceBySlug(slug);
  const guide = getServiceCostGuide(slug);
  if (!service || !guide) return undefined;

  const sample = guide.lines[0];
  const sampleRange = sample
    ? formatCostRange(sample.low, sample.high)
    : "a few hundred dollars";

  return {
    service,
    path: `/cost/${service.slug}/`,
    title: `${service.localTitle} Cost in Michigan | Typical Price Ranges`,
    description: `Typical Michigan ${service.localTitle.toLowerCase()} cost ranges for homeowners — planning estimates, what changes the price, and how to compare local quotes.`,
    h1: `${service.localTitle} Cost in Michigan`,
    intro: `Homeowners shopping for ${service.localTitle.toLowerCase()} usually want a planning number before they call. The ranges below are typical Michigan estimates drawn from our shared cost table — not quotes, and not tied to any single contractor. Parts, door size, travel, and urgency change the invoice; always get a written estimate for your door.`,
    faqs: [
      {
        question: `How much does ${service.localTitle.toLowerCase()} cost in Michigan?`,
        answer: `As a planning estimate, common jobs like ${sample?.label ?? "standard residential work"} often land around ${sampleRange}, with heavier doors, emergency timing, and specialty parts higher. Compare local written quotes on Michigan Garage Pros.`,
      },
      {
        question: "Are these prices guarantees?",
        answer:
          "No. They are typical ranges for budgeting only. Michigan Garage Pros is a directory and does not set contractor prices. Ask each pro for a written estimate with parts and labor itemized.",
      },
      {
        question: `How do I compare ${service.localTitle.toLowerCase()} quotes?`,
        answer: `Ask for the same scope on every bid, confirm your ZIP is in-route, and share photos. Browse statewide ${service.name.toLowerCase()} listings or open a city service page for markets with enough local pros.`,
      },
      {
        question: "Why do Northern Michigan or U.P. jobs cost more?",
        answer:
          "Longer travel windows and fewer same-day options can raise trip fees. Metro Detroit and Grand Rapids markets often have more competition on routine weekday work.",
      },
    ],
  };
}

export function getAllCostGuides(): CostGuidePage[] {
  return COST_GUIDE_SLUGS.map((slug) => getCostGuideBySlug(slug)).filter(
    (g): g is CostGuidePage => Boolean(g),
  );
}

/** Services that have a /cost/ guide (same set as SERVICES today). */
export function costGuidePathForService(serviceSlug: string): string | null {
  return COST_GUIDE_SLUGS.includes(serviceSlug)
    ? `/cost/${serviceSlug}/`
    : null;
}

export { SERVICES };
