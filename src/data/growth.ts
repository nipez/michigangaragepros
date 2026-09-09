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
      "Lansing-area garage doors take a beating from mid-Michigan freeze-thaw cycles, lake-effect moisture, and the mix of older ranches, campus rentals near East Lansing, and newer subdivisions toward Delta Township and Okemos. Springs snap after hard winters, weather seals freeze to uneven slabs, and openers struggle when rollers gum up with road salt. Use Michigan Garage Pros to compare repair, spring, opener, and installation companies that serve Lansing, East Lansing, Holt, and nearby ZIP codes — then shortlist by service tags, claimed profiles, and whether they list your suburb before you request a quote.",
    faqs: [
      {
        question: "How much does garage door repair cost in Lansing?",
        answer:
          "Spring replacement and opener repairs are the most common mid-Michigan jobs; pricing depends on door weight, parts, and whether the visit is same-day. Request quotes from more than one Lansing-area pro with photos so you can compare labor and parts line items.",
      },
      {
        question: "Are there emergency garage door techs in Lansing?",
        answer:
          "Several listings note emergency or flexible scheduling. Check profiles for after-hours notes, or submit a quote with ASAP timing so pros know you need a fast response across Lansing or East Lansing.",
      },
      {
        question: "Which nearby cities do Lansing garage door companies cover?",
        answer:
          "Many mid-Michigan pros also serve East Lansing, Holt, Okemos, Haslett, and Delta Township. Confirm your ZIP on each profile or use Find Pros so you are not waiting on a tech outside their normal route.",
      },
      {
        question: "How should I compare garage door pros in Lansing?",
        answer:
          "Match the service tag to your job (springs vs new door vs opener), confirm they serve your ZIP, and prefer clear written estimates. Featured Pros are sponsored placements; organic cards stay relevance-based.",
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
      "Warren’s postwar ranch homes, brick bungalows, and denser Macomb corridors put a lot of single- and double-car doors through daily cycles — and Metro Detroit winters punish seals, springs, and sensors with freeze-thaw and salt spray off Van Dyke and I-696. Off-track doors and broken torsion springs show up often after cold snaps. Compare garage door repair, spring, opener, and installation companies that serve Warren, Center Line, Sterling Heights, and nearby suburbs on Michigan Garage Pros, then weigh service area, emergency notes, and claimed listings before you send a quote request.",
    faqs: [
      {
        question: "Is same-day garage door service available in Warren?",
        answer:
          "Several Warren-area listings advertise emergency or flexible scheduling. Mention ASAP timing and your cross streets on the quote request so pros can confirm same-day windows.",
      },
      {
        question: "What garage door problems are common in Warren?",
        answer:
          "Broken springs after hard freezes, weather seals stuck to the slab, and photo-eye sensors blocked by snow are frequent Macomb County calls. Older doors on ranch homes may also need roller or cable work before a full replacement.",
      },
      {
        question: "How do I compare Warren garage door companies?",
        answer:
          "Filter by the service you need, confirm Warren or your ZIP is in their service area, and compare a couple of written estimates. Featured Pros are sponsored; check organic listings too.",
      },
    ],
  },
  "sterling-heights": {
    intro:
      "Sterling Heights sits in the heart of Macomb County’s residential grid — large subdivision doors, attached two-car garages, and plenty of daily opener cycles from Lakeside-area and Hall Road corridors. Michigan winters here mean ice on weather seals, weak remote batteries, and spring failures when doors have not been balanced since the last tune-up. Browse garage door repair and installation companies that serve Sterling Heights, Utica, Shelby Township, and Warren on Michigan Garage Pros, then compare who lists your ZIP, which services they tag, and whether the profile is claimed before you request quotes.",
    faqs: [
      {
        question: "Which companies serve Sterling Heights garage doors?",
        answer:
          "The listings below include companies that name Sterling Heights as a home city or service area. Nearby city links cover Warren, Troy, Utica, and Shelby Township.",
      },
      {
        question: "Do Sterling Heights pros offer spring and opener repair?",
        answer:
          "Most full-service Macomb listings cover torsion springs, extension springs, and opener diagnosis. Use the broken springs or openers city service pages if you already know the issue.",
      },
      {
        question: "How should homeowners shortlist pros in Sterling Heights?",
        answer:
          "Match services to the job, confirm travel to your subdivision ZIP, ask about parts warranty in writing, and compare at least two quotes when the repair is not an emergency.",
      },
    ],
  },
  troy: {
    intro:
      "Troy and northern Oakland County homes — from Big Beaver corridor townhomes to larger subdivision doors toward Rochester Road — see heavy daily use and sharp winter temperature swings that stress torsion springs and insulated panels. Ice buildup, salt corrosion on hardware, and aging openers without battery backup are common reasons homeowners shop for repair or a full door upgrade. Compare garage door companies serving Troy, Clawson, Birmingham-adjacent ZIPs, and Rochester Hills on Michigan Garage Pros by service tags, service area, and claimed status, then request a free quote when you have a shortlist.",
    faqs: [
      {
        question: "How do I get garage door opener repair in Troy?",
        answer:
          "Use the Garage Door Openers city service page for Troy, or filter Find Pros for opener help with a Troy-area ZIP. Mention brand and age if you know them.",
      },
      {
        question: "Is new garage door installation common in Troy?",
        answer:
          "Yes — many Oakland County homeowners replace thin single-layer doors with insulated models for energy and curb appeal. Look for New Door Installation on local cards and ask about panel warranties.",
      },
      {
        question: "How do I compare Troy garage door companies?",
        answer:
          "Confirm they regularly serve your Troy ZIP, match skills to springs vs installation vs openers, and get written estimates. Featured Pros are sponsored placements on the directory.",
      },
    ],
  },
  kalamazoo: {
    intro:
      "Kalamazoo and Portage garages deal with Southwest Michigan lake-effect snow, freeze-thaw heave on slabs, and a housing mix of older bungalows near downtown plus larger subdivision doors toward Portage and Texas Township. Springs and cables wear faster when doors bind on uneven floors; openers fail more often after storm-related outages. Use Michigan Garage Pros to compare repair, spring, opener, and installation companies serving Kalamazoo, Portage, Oshtemo, and nearby ZIPs — then shortlist by service coverage and request quotes instead of calling every truck on a search ad.",
    faqs: [
      {
        question: "Are there garage door installers in Kalamazoo?",
        answer:
          "Yes. Look for New Door Installation on local listings, or start a quote specifying installation, door size, and whether you want insulation upgrades.",
      },
      {
        question: "What winter issues hit Kalamazoo garage doors?",
        answer:
          "Seals freezing to the floor, weak remote batteries, and snapped springs after cold snaps are typical Southwest Michigan calls. Clear sensors of snow before assuming the opener failed.",
      },
      {
        question: "How do I choose a garage door pro in Kalamazoo?",
        answer:
          "Confirm Portage or your township ZIP is in their route, match the service tag to your problem, and compare written estimates. Claimed profiles and clear service lists are useful signals on this directory.",
      },
    ],
  },
  flint: {
    intro:
      "Flint and Genesee County garage doors face harsh mid-Michigan winters, older housing stock with aging springs and tracks, and plenty of daily wear on attached-garage ranches across the city and suburbs like Flushing, Grand Blanc, and Burton. Broken torsion springs, frayed cables, and openers that strain on unbalanced doors are the jobs homeowners search for most after a cold snap. Compare repair, spring, opener, and emergency-capable companies on Michigan Garage Pros, verify they list Flint or your ZIP, and send a quote with photos so pros can bring the right parts.",
    faqs: [
      {
        question: "Who fixes broken garage door springs in Flint?",
        answer:
          "Open Broken Springs under Services or browse Flint companies tagged for repair, then request a quote with your ZIP. Never try to wind a torsion spring yourself.",
      },
      {
        question: "Is emergency garage door service available in Flint?",
        answer:
          "Some Genesee County listings note emergency or same-day options. Mention if the door is stuck open for security reasons and ask about after-hours rates up front.",
      },
      {
        question: "Which suburbs are covered with Flint garage door pros?",
        answer:
          "Many companies also serve Burton, Grand Blanc, Flushing, Swartz Creek, and nearby townships. Check each profile’s service area or search Find Pros with your ZIP.",
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
      "Farmington Hills and western Oakland County see a steady mix of insulated two-car doors on subdivision homes and older single-layer doors that struggle through freeze-thaw season. Ice on seals along Orchard Lake and Grand River corridors, salt-worn rollers, and openers without backup during storm outages drive a lot of repair and upgrade calls. Browse garage door companies serving Farmington Hills, Farmington, Novi, and Livonia-area ZIPs on Michigan Garage Pros — compare repair vs installation tags, confirm your neighborhood is in-route, then request a quote from the shortlist that fits.",
    faqs: [
      {
        question: "How do I find garage door repair in Farmington Hills?",
        answer:
          "Use the Farmington Hills repair service page or enter your ZIP on Find Pros to see companies listing repair work for western Oakland County.",
      },
      {
        question: "Do Farmington Hills companies replace springs and openers?",
        answer:
          "Most full-service listings cover torsion springs, opener diagnosis, and hardware. Jump to the broken springs or openers city pages if you already know the failure.",
      },
      {
        question: "How should I compare pros in Farmington Hills?",
        answer:
          "Check service area against your ZIP, match skills to the job, and ask for written estimates that separate parts and labor. Featured Pros are sponsored directory placements.",
      },
    ],
  },
  novi: {
    intro:
      "Novi’s newer subdivisions and larger insulated doors still face classic Michigan problems: springs that fail after heavy daily cycles, weather seals that freeze on heated-slab garages, and openers that quit during power outages when battery backup was never installed. Homeowners near Twelve Oaks, Northville-adjacent streets, and Wixom often want same-week repair or a clean install quote. Compare garage door pros serving Novi, Northville, Wixom, and Farmington Hills on Michigan Garage Pros by service tags and coverage map, then send one quote request instead of repeating the story to every cold call.",
    faqs: [
      {
        question: "Do Novi companies cover surrounding suburbs?",
        answer:
          "Many listings also serve Farmington Hills, Livonia, Northville, and Wixom. Check each profile’s service area for your city before you wait on a tech outside their route.",
      },
      {
        question: "Can I request multiple quotes in Novi?",
        answer:
          "Yes. Shortlist companies from this page or send one quote request and let local pros follow up with pricing for repair or installation.",
      },
      {
        question: "When does Novi make sense for a full door replacement?",
        answer:
          "If panels are rusting, insulation is outdated, or sectional sections no longer match after damage, installation companies can price a new insulated door against repeated panel repairs.",
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
      "Southfield sits at a busy Oakland–Wayne crossroads — condo and townhome doors, office-park adjacent homes, and older steel doors that see freeze-thaw stress every winter off the Lodge and I-696. Sensors clogged with snow, noisy rollers after salt season, and doors stuck open after a snapped spring are frequent reasons residents search for same-day help. Use Michigan Garage Pros to compare repair, opener, and installation companies serving Southfield, Oak Park, Lathrup Village, and nearby suburbs, then verify service area and emergency notes before you request a quote.",
    faqs: [
      {
        question: "How do I get emergency garage door service in Southfield?",
        answer:
          "Filter for emergency-ready listings, confirm after-hours rates, and note urgency on your quote request so pros know if the door is stuck open overnight.",
      },
      {
        question: "What repairs are common for Southfield garage doors?",
        answer:
          "Broken springs, misaligned photo eyes after storms, and worn rollers on high-cycle doors are typical. Older single-layer doors may also need panel or full-door quotes after impact damage.",
      },
      {
        question: "How do I compare Southfield garage door companies?",
        answer:
          "Match the service tag to your job, confirm they serve your ZIP (not only downtown Detroit), and compare written estimates. Featured Pros are sponsored placements on this directory.",
      },
    ],
  },
  midland: {
    intro:
      "Midland-area doors deal with Great Lakes Bay cold snaps, wind-driven snow, and a mix of subdivision two-car garages and older attached doors that have never had a professional balance check. Springs fail when doors bind on frost-heaved slabs; openers without battery backup leave homeowners locked out during storm outages. Compare garage door companies for repair, springs, openers, and installation serving Midland, nearby Bay Region towns, and surrounding townships on Michigan Garage Pros — confirm travel windows for your ZIP, then request a quote with a clear description of the problem.",
    faqs: [
      {
        question: "Do Midland pros travel to nearby towns?",
        answer:
          "Check each profile’s service area or search Find Pros with your ZIP — travel windows can vary outside the city, especially for evening emergency calls.",
      },
      {
        question: "How do I choose a Midland garage door company?",
        answer:
          "Match services to your job, confirm they serve your ZIP, ask about parts warranty, and compare a couple of quotes before you book non-emergency work.",
      },
      {
        question: "Are spring and opener repairs available in Midland?",
        answer:
          "Yes — most full-service Bay Region listings cover torsion springs and opener diagnosis. Use the city service pages for broken springs or openers if you already know the failure mode.",
      },
    ],
  },
};

export function getCitySeo(slug: string): CitySeoCopy | undefined {
  return CITY_SEO[slug];
}
