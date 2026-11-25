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

export type CitySeoSection = {
  heading: string;
  /** Markdown-style [label](/path/) links are rendered as internal links. */
  paragraphs: string[];
};

export type CitySeoCopy = {
  /** Full SERP <title> when set (skips the layout brand suffix). */
  title?: string;
  /** Meta / OG description when set; otherwise intro is reused. */
  description?: string;
  /** Visible H1 override for hub pages. */
  h1?: string;
  intro: string;
  /** Extra local content blocks (neighborhoods, climate, costs) on strong hubs. */
  localSections?: CitySeoSection[];
  faqs: { question: string; answer: string }[];
};

/** Unique copy for highest-volume city hubs (problem + place SEO). */
export const CITY_SEO: Record<string, CitySeoCopy> = {
  detroit: {
    title: "Detroit Garage Door Repair Pros Near You | Compare Quotes",
    description:
      "Compare Metro Detroit garage door pros for repair, broken springs, opener installs, and new doors. Browse local companies and request quotes in one place.",
    h1: "Detroit Garage Door Repair Pros Near You",
    intro:
      "Compare Metro Detroit garage door companies for repair, broken springs, opener installation, and new doors — then request quotes from multiple local pros on this statewide directory.",
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
    title: "Grand Rapids Garage Door Repair Near You | Compare Local Pros",
    description:
      "Compare Grand Rapids garage door repair, broken springs, opener installs & new doors across Kent County. Browse real local pros, typical cost ranges, and request free quotes.",
    h1: "Grand Rapids Garage Door Repair & Local Pros",
    intro:
      "Grand Rapids and greater Kent County put garage doors through lake-effect winters, road salt, and daily cycles on everything from Eastown bungalows to Cascade and Ada subdivision two-cars. Compare real directory companies for repair, broken springs, opener installs, and new doors on Michigan Garage Pros — then shortlist by service tags, service area, and claimed profiles before you request a free quote.",
    localSections: [
      {
        heading: "Neighborhoods and nearby areas we cover",
        paragraphs: [
          "Homeowners search this hub for help across downtown and near-eastside streets, the West Side, and suburban routes toward [Wyoming](/cities/wyoming/), Kentwood, Walker, Grandville, and [Holland](/cities/holland/). Many listings also note travel into Ottawa County lakeshore ZIPs — confirm your address on each profile before you wait on a tech outside their normal route.",
          "When you already know the job type, jump straight to [Grand Rapids repair](/cities/grand-rapids/garage-door-repair/), [broken springs](/cities/grand-rapids/broken-springs/), [openers](/cities/grand-rapids/garage-door-openers/), [installation](/cities/grand-rapids/garage-door-installation/), [maintenance](/cities/grand-rapids/maintenance/), or [emergency service](/cities/grand-rapids/emergency-service/). West Michigan region coverage lives on the [West Michigan hub](/regions/west/).",
        ],
      },
      {
        heading: "Local climate and housing-stock notes",
        paragraphs: [
          "Lake-effect snow and humidity off Lake Michigan wear weather seals, cables, and rollers faster than dry inland winters. Freeze-thaw heave on older slabs makes doors bind; new-build insulated doors still snap springs when daily cycles stack up without a balance check. Salt film from plowed arterials accelerates hardware corrosion on high-mileage openers.",
          "Housing stock here mixes older wood and steel doors on city lots with heavier insulated sectionals in growth corridors. Thin single-layer doors struggle on polar-vortex mornings; insulated doors still need healthy seals and springs. For cold-season habits, see the [winter maintenance checklist](/blog/winter-garage-door-maintenance-checklist-michigan/) and [winter open troubleshooting](/blog/garage-door-wont-open-winter-michigan/).",
        ],
      },
      {
        heading: "Typical Grand Rapids repair cost ranges",
        paragraphs: [
          "Use our shared planning bands as a starting point — West Michigan tables track the statewide [/cost/](/cost/) guides. Common residential repair visits often land around a service call or diagnosis in the low-to-mid hundreds before parts, with rollers, hinges, or sensors frequently in a roughly $125–$350 planning band and cable or track work higher. Matched torsion spring pairs commonly plan in the mid-hundreds; after-hours spring calls cost more.",
          "Compare the live table on this page with the statewide [repair](/cost/garage-door-repair/), [springs](/cost/broken-springs/), [openers](/cost/garage-door-openers/), [installation](/cost/garage-door-installation/), [maintenance](/cost/maintenance/), and [emergency](/cost/emergency-service/) guides. Michigan Garage Pros does not set prices — get written quotes with photos of your door.",
        ],
      },
    ],
    faqs: [
      {
        question: "Who repairs garage door springs in Grand Rapids?",
        answer:
          "Browse Grand Rapids listings tagged for repair or springs below, or open the Grand Rapids broken springs service page and confirm your ZIP. Never wind a torsion spring yourself — schedule a pro when you hear a bang or the door will not lift.",
      },
      {
        question: "Can I get a free garage door quote in Grand Rapids?",
        answer:
          "Yes. Use Get a Free Quote with your Kent County ZIP — local companies receive your request directly. You can also call a company from its profile once you shortlist by service and coverage.",
      },
      {
        question: "What suburbs are covered with Grand Rapids garage door pros?",
        answer:
          "Many pros also serve Wyoming, Kentwood, Walker, Grandville, and Holland. Nearby community links on this page jump to indexable city hubs; always confirm travel to your exact ZIP.",
      },
      {
        question: "How much does garage door repair cost in Grand Rapids?",
        answer:
          "Planning ranges follow our West Michigan /cost/ guides — diagnosis often starts in the low hundreds, hardware repairs span a few hundred dollars, and spring pairs commonly plan in the mid-hundreds before urgency. Photos and a clear description help pros quote accurately.",
      },
      {
        question: "Do Grand Rapids companies offer emergency or same-day service?",
        answer:
          "Several West Michigan listings note emergency or flexible scheduling. Mention ASAP timing, whether the door is stuck open, and your cross streets so dispatch can confirm same-day windows and after-hours rates.",
      },
      {
        question: "Is Michigan Garage Pros a garage door company in Grand Rapids?",
        answer:
          "No — we are a statewide directory. We help homeowners compare local companies and help pros claim or feature their listings. Featured Pros are sponsored placements.",
      },
      {
        question: "When should Grand Rapids homeowners replace a door instead of repairing it?",
        answer:
          "Repair usually wins for isolated springs, cables, rollers, or openers on a sound door. Lean toward replacement when panels are rusted or mismatched, insulation is outdated, or stacked repairs approach the cost of a correctly specified insulated door — see our repair vs replace guide, then request installation quotes.",
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
    title: "Warren Garage Door Repair Pros | Macomb County Quotes",
    description:
      "Compare Warren garage door repair, broken springs, openers & installs near Van Dyke and I-696. Browse Macomb County pros, typical costs, and request free quotes.",
    h1: "Warren Garage Door Repair & Macomb County Pros",
    intro:
      "Warren’s postwar ranch homes, brick bungalows, and denser Macomb corridors put single- and double-car doors through daily cycles — and Metro Detroit winters punish seals, springs, and sensors with freeze-thaw and salt spray off Van Dyke and I-696. Off-track doors and broken torsion springs show up often after cold snaps. Compare real directory companies that serve Warren, Center Line, Sterling Heights, and nearby suburbs on Michigan Garage Pros, then weigh service area, emergency notes, and claimed listings before you send a quote.",
    localSections: [
      {
        heading: "Neighborhoods and nearby areas served",
        paragraphs: [
          "This hub covers Warren city routes plus nearby Center Line demand and cross-town travel toward [Sterling Heights](/cities/sterling-heights/), [Troy](/cities/troy/), and [Detroit](/cities/detroit/). Confirm whether your ZIP sits inside each company’s regular Macomb route — especially for evening emergency calls.",
          "Known job type? Open [Warren repair](/cities/warren/garage-door-repair/), [broken springs](/cities/warren/broken-springs/), [openers](/cities/warren/garage-door-openers/), [installation](/cities/warren/garage-door-installation/), [maintenance](/cities/warren/maintenance/), or [emergency service](/cities/warren/emergency-service/). Broader Metro coverage: [Southeast Michigan](/regions/southeast/).",
        ],
      },
      {
        heading: "Climate and housing stock that stress Warren doors",
        paragraphs: [
          "Older ranch doors and aging torsion springs fail when temperatures plunge overnight. Salt spray and grit from major corridors accelerate roller and hinge wear. Photo eyes near the floor blind easily after plow piles and ice chunks — a “broken opener” is often a sensor or frozen seal problem first.",
          "Many Warren homes still run single-layer or lightly insulated doors that sweat and freeze on attached-garage slabs. If panels are rusting or sections no longer match, compare repair against a new insulated door using the [repair vs replace guide](/blog/repair-vs-replace-garage-door-michigan/) and local installation quotes.",
        ],
      },
      {
        heading: "Typical Warren-area cost planning",
        paragraphs: [
          "Southeast Michigan planning bands track our [/cost/](/cost/) guides with a modest Metro adjustment. Expect diagnosis commonly in a roughly $75–$160 band before parts, rollers/sensors often in the low-to-mid hundreds, and matched torsion spring pairs frequently planning in the mid-hundreds — higher for heavy doors or after-hours visits.",
          "Cross-check the table on this page with [repair](/cost/garage-door-repair/), [springs](/cost/broken-springs/), [openers](/cost/garage-door-openers/), and [emergency](/cost/emergency-service/) guides. Always get a written estimate; the directory does not set prices.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is same-day garage door service available in Warren?",
        answer:
          "Several Warren-area listings advertise emergency or flexible scheduling. Mention ASAP timing and your cross streets on the quote request so pros can confirm same-day windows and after-hours rates.",
      },
      {
        question: "What garage door problems are common in Warren?",
        answer:
          "Broken springs after hard freezes, weather seals stuck to the slab, and photo-eye sensors blocked by snow are frequent Macomb County calls. Older ranch doors may also need roller or cable work before a full replacement.",
      },
      {
        question: "How do I compare Warren garage door companies?",
        answer:
          "Filter by the service you need, confirm Warren or your ZIP is in their service area, and compare a couple of written estimates. Featured Pros are sponsored; check organic listings too.",
      },
      {
        question: "How much does garage door spring repair cost near Warren?",
        answer:
          "Use the broken-springs cost guide for planning — matched residential torsion pairs often land in the mid-hundreds before urgency, with heavy or after-hours jobs higher. Photos of the spring type help pros quote parts accurately.",
      },
      {
        question: "Do Warren pros also serve Sterling Heights and Troy?",
        answer:
          "Many Macomb and Oakland listings cover neighboring cities. Use the nearby community links and each profile’s service area — do not assume a Warren-tagged company automatically routes your Troy or Sterling Heights ZIP every evening.",
      },
      {
        question: "Can I request a free garage door quote in Warren?",
        answer:
          "Yes. Start Get a Free Quote with your ZIP and a short description (bang heard, door crooked, opener straining). You can also call companies directly from the listings below.",
      },
      {
        question: "Is Michigan Garage Pros a contractor in Warren?",
        answer:
          "No — we are a Michigan directory. We help homeowners compare local pros and help companies claim and feature listings.",
      },
    ],
  },
  "sterling-heights": {
    title: "Sterling Heights Garage Door Pros | Repair & Quotes",
    description:
      "Find Sterling Heights garage door repair, springs, openers & installs near Hall Road and Lakeside-area corridors. Compare Macomb pros and request free quotes.",
    h1: "Sterling Heights Garage Door Repair & Local Pros",
    intro:
      "Sterling Heights sits in the heart of Macomb County’s residential grid — large subdivision doors, attached two-car garages, and plenty of daily opener cycles from Lakeside-area and Hall Road corridors. Michigan winters here mean ice on weather seals, weak remote batteries, and spring failures when doors have not been balanced since the last tune-up. Browse real directory companies that serve Sterling Heights, Utica, Shelby Township, and Warren on Michigan Garage Pros, then compare who lists your ZIP, which services they tag, and whether the profile is claimed before you request quotes.",
    localSections: [
      {
        heading: "Neighborhoods and nearby Macomb routes",
        paragraphs: [
          "Homeowners use this page for subdivision ZIPs across Sterling Heights plus travel toward Utica, Shelby Township, [Warren](/cities/warren/), and [Troy](/cities/troy/). Confirm Hall Road–corridor vs southern Warren routing on each profile — travel windows vary for after-hours calls.",
          "Service shortcuts: [Sterling Heights repair](/cities/sterling-heights/garage-door-repair/), [broken springs](/cities/sterling-heights/broken-springs/), [openers](/cities/sterling-heights/garage-door-openers/), [installation](/cities/sterling-heights/garage-door-installation/), [maintenance](/cities/sterling-heights/maintenance/), and [emergency](/cities/sterling-heights/emergency-service/). Metro context: [Southeast Michigan](/regions/southeast/).",
        ],
      },
      {
        heading: "Climate and door types in Sterling Heights",
        paragraphs: [
          "Insulated two-car doors are common in newer sections, but they still snap springs after heavy daily cycles and freeze-thaw. Ice bonding on weather seals and snow-buried photo eyes create “opener failure” calls that cleaning and a gentle ice break often explain — until a bang or crooked door points to springs or cables.",
          "Salt and grit from major arterials wear rollers and hinges. Mid-season lubrication and a balance check (opener disconnected) catch problems before a polar vortex morning. Pair local repair with the [winter checklist](/blog/winter-garage-door-maintenance-checklist-michigan/) when the door still moves.",
        ],
      },
      {
        heading: "Cost ranges consistent with statewide guides",
        paragraphs: [
          "Sterling Heights pricing language follows Southeast Michigan bands on our [/cost/](/cost/) hub. Plan for diagnosis in roughly the $75–$160 range before parts, hardware repairs often in the low-to-mid hundreds, and torsion spring pairs commonly in the mid-hundreds — with emergency premiums when the door is stuck open overnight.",
          "See [repair](/cost/garage-door-repair/), [springs](/cost/broken-springs/), [openers](/cost/garage-door-openers/), [installation](/cost/garage-door-installation/), and [emergency](/cost/emergency-service/) for full tables. Request written quotes; we do not sell repairs.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which companies serve Sterling Heights garage doors?",
        answer:
          "The listings below include companies that name Sterling Heights as a home city or service area. Nearby city links cover Warren, Troy, Utica, and Shelby Township when those hubs are indexable.",
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
      {
        question: "How much does garage door repair cost in Sterling Heights?",
        answer:
          "Use the cost table on this page and the statewide repair guide for planning. Hardware and sensor jobs often land in the low-to-mid hundreds; spring work and after-hours visits run higher. Photos speed accurate quotes.",
      },
      {
        question: "Is emergency garage door service available in Sterling Heights?",
        answer:
          "Several listings note emergency or same-day options. Say if the door is stuck open for security reasons and ask about after-hours rates before the tech rolls.",
      },
      {
        question: "Can I get a free quote for Sterling Heights?",
        answer:
          "Yes. Use Get a Free Quote with your ZIP, or contact a company from its profile after you confirm service tags and coverage.",
      },
      {
        question: "Do Sterling Heights companies also cover Warren?",
        answer:
          "Often yes — many Macomb pros list both. Still verify your exact address; evening routes may prioritize one corridor over another.",
      },
    ],
  },
  troy: {
    title: "Troy Garage Door Repair & Pros | Oakland County Quotes",
    description:
      "Compare Troy garage door repair, springs, openers & new doors near Big Beaver and Rochester Road. Browse Oakland County pros and request free quotes.",
    h1: "Troy Garage Door Repair & Oakland County Pros",
    intro:
      "Troy and northern Oakland County homes — from Big Beaver corridor townhomes to larger subdivision doors toward Rochester Road — see heavy daily use and sharp winter temperature swings that stress torsion springs and insulated panels. Ice buildup, salt corrosion on hardware, and aging openers without battery backup are common reasons homeowners shop for repair or a full door upgrade. Compare real directory companies serving Troy, Clawson, Birmingham-adjacent ZIPs, and Rochester Hills on Michigan Garage Pros by service tags, service area, and claimed status, then request a free quote when you have a shortlist.",
    localSections: [
      {
        heading: "Neighborhoods and nearby Oakland cities",
        paragraphs: [
          "This hub serves Troy proper plus routes toward Rochester Hills, [Sterling Heights](/cities/sterling-heights/), Clawson, and Birmingham-adjacent streets. Confirm whether your ZIP is on the tech’s regular northern Oakland loop before booking evening work.",
          "Jump to [Troy repair](/cities/troy/garage-door-repair/), [broken springs](/cities/troy/broken-springs/), [openers](/cities/troy/garage-door-openers/), [installation](/cities/troy/garage-door-installation/), [maintenance](/cities/troy/maintenance/), or [emergency](/cities/troy/emergency-service/). Regional scan: [Southeast Michigan](/regions/southeast/).",
        ],
      },
      {
        heading: "Climate and housing notes for Troy doors",
        paragraphs: [
          "Insulated doors are common on newer builds, but high-cycle openers and tired springs still fail on the coldest mornings. Townhome and condo doors see frequent daily cycles; larger subdivision doors pick up salt corrosion on bottom brackets and rollers along plowed arterials.",
          "Battery backup matters during Oakland County ice storms — backup helps only when the door is balanced. Pair opener shopping with [battery backup guidance](/blog/garage-door-opener-battery-backup-michigan/) and the [winter open guide](/blog/garage-door-wont-open-winter-michigan/) when remotes die but the wall button still works.",
        ],
      },
      {
        heading: "Planning costs for Troy repairs and installs",
        paragraphs: [
          "Troy-area planning follows Southeast Michigan bands on [/cost/](/cost/). Diagnosis commonly starts near the low hundreds, opener board or gear work often spans the mid-hundreds, and new residential openers plan from roughly the mid-hundreds into about $1,100 for premium units before door issues are fixed. Full door installation spans a wide range by size and insulation — use the installation guide, then get local bids.",
          "Reference [repair](/cost/garage-door-repair/), [openers](/cost/garage-door-openers/), [installation](/cost/garage-door-installation/), and [springs](/cost/broken-springs/). Written scopes beat phone-only numbers.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I get garage door opener repair in Troy?",
        answer:
          "Use the Garage Door Openers city service page for Troy, or filter Find Pros for opener help with a Troy-area ZIP. Mention brand and age if you know them, and rule out ice and sensors first in winter.",
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
      {
        question: "How much does a new garage door cost in Troy?",
        answer:
          "Use the installation cost guide for planning bands — single doors often plan from roughly the low thousands, doubles higher, with premium insulated packages above that. Local bids should itemize door, labor, disposal, and opener if bundled.",
      },
      {
        question: "Do Troy pros serve Rochester Hills and Sterling Heights?",
        answer:
          "Many northern Oakland and Macomb companies cover neighboring cities. Check each profile’s service area and the nearby community links on this page.",
      },
      {
        question: "Is emergency spring repair available in Troy?",
        answer:
          "Several listings note emergency or same-day options. If you heard a bang or the door will not lift, stop forcing the opener and request urgent spring help with your ZIP.",
      },
      {
        question: "Can I request multiple quotes in Troy?",
        answer:
          "Yes. Shortlist from the companies below or send one Get a Free Quote request and let local pros follow up with pricing for repair or installation.",
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
    title: "Novi Garage Door Repair Pros Near You | Compare Quotes",
    description:
      "Compare Novi garage door repair, springs, openers & installs near Twelve Oaks, Northville & Wixom. Browse western Oakland pros and request free quotes.",
    h1: "Novi Garage Door Repair & Local Pros",
    intro:
      "Novi’s newer subdivisions and larger insulated doors still face classic Michigan problems: springs that fail after heavy daily cycles, weather seals that freeze on heated-slab garages, and openers that quit during power outages when battery backup was never installed. Homeowners near Twelve Oaks, Northville-adjacent streets, and Wixom often want same-week repair or a clean install quote. Compare real directory companies serving Novi, Northville, Wixom, and Farmington Hills on Michigan Garage Pros by service tags and coverage, then send one quote request instead of repeating the story to every cold call.",
    localSections: [
      {
        heading: "Neighborhoods and nearby western Oakland areas",
        paragraphs: [
          "This hub covers Novi subdivisions plus travel toward [Farmington Hills](/cities/farmington-hills/), Northville, Wixom, and [Canton](/cities/canton/) when listings include those ZIPs. Confirm your address on each profile — western Oakland routes are dense, but evening emergency windows still vary.",
          "Service pages: [Novi repair](/cities/novi/garage-door-repair/), [broken springs](/cities/novi/broken-springs/), [openers](/cities/novi/garage-door-openers/), [installation](/cities/novi/garage-door-installation/), and [maintenance](/cities/novi/maintenance/). Emergency city coverage may stay thinner than repair — use statewide [emergency service](/emergency-service/) or neighboring hubs like [Troy](/cities/troy/emergency-service/) when you need after-hours help. Region: [Southeast Michigan](/regions/southeast/).",
        ],
      },
      {
        heading: "Climate and housing stock around Novi",
        paragraphs: [
          "Heated slabs and tight insulated doors still freeze bottom seals overnight; forcing the opener tears rubber and strains motors. Newer homes often have quieter belt or wall-mount openers — great until a spring fails and the door becomes too heavy to lift. Power outages during ice storms strand cars when battery backup was never installed.",
          "Compare opener types and winter behavior in our [opener buyer guide](/blog/chain-vs-belt-vs-wall-mount-garage-door-opener-michigan/) and [insulated door guide](/blog/insulated-garage-doors-michigan/). Commercial or light-industrial bays near major corridors can also use the [commercial repair guide](/blog/commercial-garage-door-repair-michigan/).",
        ],
      },
      {
        heading: "Cost ranges for Novi homeowners",
        paragraphs: [
          "Novi planning language matches Southeast Michigan bands on [/cost/](/cost/). Expect diagnosis commonly near the low hundreds, spring pairs in the mid-hundreds for standard residential doors, and full insulated installs spanning from roughly the low thousands upward depending on size and finish — always verify with local written bids.",
          "Use [repair](/cost/garage-door-repair/), [springs](/cost/broken-springs/), [openers](/cost/garage-door-openers/), [installation](/cost/garage-door-installation/), and [maintenance](/cost/maintenance/) tables alongside the snapshot on this page.",
        ],
      },
    ],
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
      {
        question: "How much does garage door spring replacement cost in Novi?",
        answer:
          "Plan with the broken-springs cost guide — matched residential torsion pairs often land in the mid-hundreds before heavy-door or after-hours premiums. Never attempt torsion spring winding yourself.",
      },
      {
        question: "Why won’t my Novi garage door open in winter?",
        answer:
          "Frozen weather seals, snow-blocked sensors, and weak remote batteries are the usual first suspects. Clear ice gently and wipe photo eyes before assuming the opener failed — then call a pro if you heard a bang or the door is crooked.",
      },
      {
        question: "Do Novi pros install openers with battery backup?",
        answer:
          "Many installation and opener listings can quote modern units with backup. Ask about battery status lights and cycle limits during outages when you request a quote.",
      },
      {
        question: "Is Michigan Garage Pros a Novi garage door company?",
        answer:
          "No — we are a statewide directory that helps you compare local pros and helps companies claim or feature their listings.",
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
