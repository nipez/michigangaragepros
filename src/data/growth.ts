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
  holland: {
    intro:
      "Holland and Ottawa County homeowners can compare garage door repair, spring, opener, and installation companies serving Holland, Zeeland, and nearby lakeshore communities.",
    faqs: [
      {
        question: "Who repairs garage doors in Holland, MI?",
        answer:
          "Browse the Holland listings below or open the garage door repair Holland page to see companies that list repair service for this area.",
      },
      {
        question: "Do Holland pros also serve Zeeland and Hudsonville?",
        answer:
          "Many West Michigan companies include nearby towns in their service area. Check each profile, or search Find Pros with your ZIP.",
      },
    ],
  },
  saginaw: {
    intro:
      "Compare garage door companies serving Saginaw and the Great Lakes Bay Region — repair, springs, openers, and installation for Saginaw, Bay City, and nearby mid-Michigan towns.",
    faqs: [
      {
        question: "Is same-day garage door service available in Saginaw?",
        answer:
          "Several listings note emergency or flexible scheduling. Mention ASAP on your quote request so pros can confirm travel time.",
      },
      {
        question: "How do I find spring repair in Saginaw?",
        answer:
          "Use the broken springs Saginaw city service page, or filter Find Pros for spring help with a local ZIP.",
      },
    ],
  },
  livonia: {
    intro:
      "Livonia and western Wayne County residents can browse garage door repair and installation companies that serve Livonia, Westland, Farmington, and nearby Metro Detroit suburbs.",
    faqs: [
      {
        question: "Which companies serve Livonia garage doors?",
        answer:
          "The listings on this page include companies that name Livonia as a home city or service area. Nearby city links cover Farmington Hills, Novi, and Dearborn.",
      },
      {
        question: "Can I get a free quote for Livonia?",
        answer:
          "Yes. Start Get a Free Quote with your ZIP, or contact a company from its profile.",
      },
    ],
  },
  dearborn: {
    intro:
      "Find garage door pros serving Dearborn and Downriver / western Wayne communities. Compare local repair, opener, and installation companies, then request a quote.",
    faqs: [
      {
        question: "Do Dearborn companies offer emergency service?",
        answer:
          "Check profiles marked for emergency or same-day help, or submit a quote with ASAP timing.",
      },
      {
        question: "How do I compare Dearborn garage door companies?",
        answer:
          "Look at services, service area, phone, and whether the listing is claimed. Featured Pros are sponsored placements.",
      },
    ],
  },
  "rochester-hills": {
    intro:
      "Rochester Hills and northern Oakland County homeowners can compare garage door repair, springs, and new-door companies serving Rochester Hills, Troy, and nearby suburbs.",
    faqs: [
      {
        question: "Who installs garage doors in Rochester Hills?",
        answer:
          "Open the installation city service page for Rochester Hills, or look for New Door Installation on company cards below.",
      },
      {
        question: "Are there opener specialists near Rochester Hills?",
        answer:
          "Yes — use the opener repair city page or Find Pros with opener service selected and your ZIP.",
      },
    ],
  },
  "farmington-hills": {
    intro:
      "Browse garage door companies serving Farmington Hills and western Oakland County — repair, openers, springs, and installation for Farmington Hills, Novi, and Livonia-area homeowners.",
    faqs: [
      {
        question: "How do I find garage door repair in Farmington Hills?",
        answer:
          "Use the Farmington Hills repair service page or enter your ZIP on Find Pros to see companies listing repair work.",
      },
    ],
  },
  novi: {
    intro:
      "Novi and western Metro Detroit residents can compare garage door pros for repair, spring replacement, openers, and new doors serving Novi, Northville, and nearby communities.",
    faqs: [
      {
        question: "Do Novi companies cover surrounding suburbs?",
        answer:
          "Many listings also serve Farmington Hills, Livonia, and Wixom. Check each profile’s service area for your city.",
      },
      {
        question: "Can I request multiple quotes in Novi?",
        answer:
          "Yes. Shortlist companies from this page or send one quote request and let local pros follow up.",
      },
    ],
  },
  wyoming: {
    intro:
      "Wyoming and greater Grand Rapids homeowners can compare garage door repair and installation companies serving Wyoming, Kentwood, Grandville, and nearby West Michigan neighborhoods.",
    faqs: [
      {
        question: "Is Wyoming covered by Grand Rapids garage door companies?",
        answer:
          "Often yes — many West Michigan pros list both. This page focuses on companies that serve Wyoming directly.",
      },
      {
        question: "Where do I go for broken spring help in Wyoming?",
        answer:
          "Open the broken springs Wyoming service page or browse companies tagged for repair/springs below.",
      },
    ],
  },
  southfield: {
    intro:
      "Southfield and central Oakland County residents can browse garage door repair, opener, and installation companies serving Southfield, Oak Park, and nearby Metro Detroit suburbs.",
    faqs: [
      {
        question: "How do I get emergency garage door service in Southfield?",
        answer:
          "Filter for emergency-ready listings, confirm after-hours rates, and note urgency on your quote request.",
      },
    ],
  },
  midland: {
    intro:
      "Midland-area homeowners can compare garage door companies for repair, springs, openers, and installation serving Midland and nearby Great Lakes Bay communities.",
    faqs: [
      {
        question: "Do Midland pros travel to nearby towns?",
        answer:
          "Check each profile’s service area or search Find Pros with your ZIP — travel windows can vary outside the city.",
      },
      {
        question: "How do I choose a Midland garage door company?",
        answer:
          "Match services to your job, confirm they serve your ZIP, and compare a couple of quotes before you book.",
      },
    ],
  },
};

export function getCitySeo(slug: string): CitySeoCopy | undefined {
  return CITY_SEO[slug];
}
