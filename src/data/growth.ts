/**
 * Growth / SEO priorities for Michigan Garage Pros.
 * Focus: problem+place demand → directory → Featured (then CPL).
 */

export const PRIORITY_CITY_SLUGS = [
  "detroit",
  "grand-rapids",
  "lansing",
  "ann-arbor",
  "warren",
  "sterling-heights",
  "troy",
  "kalamazoo",
  "flint",
  "holland",
  "traverse-city",
  "saginaw",
  "livonia",
  "dearborn",
  "rochester-hills",
  "farmington-hills",
  "novi",
  "wyoming",
  "southfield",
  "midland",
] as const;

export type FeaturedPlanId = "city" | "metro" | "statewide";

export type FeaturedPlan = {
  id: FeaturedPlanId;
  name: string;
  priceMonthly: number;
  blurb: string;
  includes: string[];
};

/** Early monetization while SEO compounds — Stripe checkout wires to these ids. */
export const FEATURED_PLANS: FeaturedPlan[] = [
  {
    id: "city",
    name: "City Featured",
    priceMonthly: 149,
    blurb: "Top placement on one Michigan city page and matching ZIP results.",
    includes: [
      "Featured Pro badge (labeled Sponsored)",
      "Priority card on that city hub",
      "Listed first in related ZIP searches when possible",
    ],
  },
  {
    id: "metro",
    name: "Metro Featured",
    priceMonthly: 299,
    blurb: "Stand out across a full metro (e.g. Metro Detroit or Grand Rapids).",
    includes: [
      "Everything in City Featured",
      "Coverage across the metro’s priority cities",
      "Homepage / service-page rotation eligibility",
    ],
  },
  {
    id: "statewide",
    name: "Statewide Featured",
    priceMonthly: 499,
    blurb: "Maximum exposure for multi-location Michigan operators.",
    includes: [
      "Everything in Metro Featured",
      "Statewide directory boost",
      "Priority on major service landing pages",
    ],
  },
];

export type CitySeoCopy = {
  intro: string;
  faqs: { question: string; answer: string }[];
};

/** Unique copy for highest-volume city hubs (problem + place SEO). */
export const CITY_SEO: Record<string, CitySeoCopy> = {
  detroit: {
    intro:
      "Metro Detroit homeowners use Michigan Garage Pros to compare garage door repair, broken spring service, opener fixes, and new door installation across Detroit and nearby suburbs. Browse local companies by service area, then request a quote when you’re ready.",
    faqs: [
      {
        question: "How do I find garage door repair near me in Detroit?",
        answer:
          "Open the Detroit city page, filter by the service you need, or enter your ZIP on Find Pros. You’ll see companies that list Detroit or nearby suburbs in their service area.",
      },
      {
        question: "Do Detroit garage door companies offer emergency service?",
        answer:
          "Many Detroit-area listings note emergency or same-day options. Check each profile for emergency hours, or start a quote and mention urgency.",
      },
      {
        question: "Is Michigan Garage Pros a garage door company?",
        answer:
          "No — we’re a Michigan directory. We help homeowners compare local pros and help companies claim and feature their listings.",
      },
    ],
  },
  "grand-rapids": {
    intro:
      "Looking for garage door pros in Grand Rapids and Kent County? Compare repair, spring replacement, openers, and installation companies that serve Grand Rapids, Wyoming, Kentwood, and nearby West Michigan communities.",
    faqs: [
      {
        question: "Who repairs garage door springs in Grand Rapids?",
        answer:
          "Browse Grand Rapids listings tagged for repair or springs, or jump to our broken springs service page and search a local ZIP.",
      },
      {
        question: "Can I get a free garage door quote in Grand Rapids?",
        answer:
          "Yes. Use Get a Free Quote with your ZIP — local companies receive your request directly. You can also contact a company from its profile.",
      },
      {
        question: "What suburbs are covered with Grand Rapids?",
        answer:
          "Many pros also serve Wyoming, Kentwood, Walker, Grandville, and Holland. Nearby community links on this page jump to those city hubs.",
      },
    ],
  },
  lansing: {
    intro:
      "Compare garage door companies serving Lansing, East Lansing, and mid-Michigan. Find repair, opener, installation, and maintenance pros, then request a quote without calling around.",
    faqs: [
      {
        question: "How much does garage door repair cost in Lansing?",
        answer:
          "Costs vary by part and labor. Spring and opener jobs are common. Request quotes from multiple Lansing-area pros to compare upfront pricing.",
      },
      {
        question: "Are there emergency garage door techs in Lansing?",
        answer:
          "Check profiles marked for emergency service, or submit a quote with ASAP timing so pros know you need a fast response.",
      },
    ],
  },
  "ann-arbor": {
    intro:
      "Ann Arbor and Washtenaw County homeowners can compare garage door repair and installation companies serving Ann Arbor, Ypsilanti, Saline, and nearby communities — then connect for a free quote.",
    faqs: [
      {
        question: "Do Ann Arbor companies install new garage doors?",
        answer:
          "Yes — look for New Door Installation on company cards, or use Find Pros with that service selected.",
      },
      {
        question: "How do I choose a garage door company in Ann Arbor?",
        answer:
          "Compare services, service area, and whether the listing is claimed. Featured Pros are sponsored placements; organic results stay relevance-based.",
      },
    ],
  },
  warren: {
    intro:
      "Warren and Macomb County residents can browse garage door repair, spring, and opener companies that serve Warren, Sterling Heights, Troy, and the surrounding Metro Detroit suburbs.",
    faqs: [
      {
        question: "Is same-day garage door service available in Warren?",
        answer:
          "Several Warren-area listings advertise emergency or flexible scheduling. Mention timing on your quote request so pros can confirm availability.",
      },
    ],
  },
  "sterling-heights": {
    intro:
      "Find garage door pros serving Sterling Heights and nearby Macomb communities. Compare local repair and installation companies, then request a quote from the shortlist that fits your ZIP.",
    faqs: [
      {
        question: "Which companies serve Sterling Heights garage doors?",
        answer:
          "The listings below include companies that name Sterling Heights as a home city or service area. Nearby links cover Warren, Troy, and Utica.",
      },
    ],
  },
  troy: {
    intro:
      "Compare garage door companies in Troy and Oakland County — repair, openers, springs, and new doors — then browse profiles or send a free quote request.",
    faqs: [
      {
        question: "How do I get garage door opener repair in Troy?",
        answer:
          "Use the Garage Door Openers service page or filter Find Pros for opener help with a Troy-area ZIP.",
      },
    ],
  },
  kalamazoo: {
    intro:
      "Southwest Michigan homeowners can compare garage door pros serving Kalamazoo, Portage, and nearby cities for repair, installation, and maintenance.",
    faqs: [
      {
        question: "Are there garage door installers in Kalamazoo?",
        answer:
          "Yes. Look for New Door Installation on local listings, or start a quote specifying installation.",
      },
    ],
  },
  flint: {
    intro:
      "Browse garage door repair and service companies covering Flint and Genesee County. Compare local options for springs, openers, and emergency help.",
    faqs: [
      {
        question: "Who fixes broken garage door springs in Flint?",
        answer:
          "Open Broken Springs under Services or browse Flint companies tagged for repair, then request a quote with your ZIP.",
      },
    ],
  },
  "traverse-city": {
    intro:
      "Northern Michigan garage door help for Traverse City and nearby towns — compare repair and installation pros that serve the Grand Traverse area.",
    faqs: [
      {
        question: "Do Traverse City pros cover surrounding towns?",
        answer:
          "Many listings include nearby North region communities. Check each profile’s service area or use Find Pros with your ZIP.",
      },
    ],
  },
};

export function getCitySeo(slug: string): CitySeoCopy | undefined {
  return CITY_SEO[slug];
}
