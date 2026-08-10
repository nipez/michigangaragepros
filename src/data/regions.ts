export type Region = {
  slug: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  coverageNote: string;
  /** County names matching IDs in the Michigan county SVG. */
  counties: string[];
  highlights: string[];
  commonIssues: string[];
  hubCitySlugs: string[];
  mapKey:
    | "southeast"
    | "west"
    | "central"
    | "southwest"
    | "north"
    | "upper-peninsula";
  seoTitle: string;
  seoDescription: string;
};

export const REGION_ORDER = [
  "Southeast",
  "West",
  "Central",
  "Southwest",
  "North",
  "Upper Peninsula",
] as const;

export const REGIONS: Region[] = [
  {
    slug: "southeast",
    name: "Southeast",
    title: "Southeast Michigan",
    tagline: "Metro Detroit and the densest garage-door market in the state",
    description:
      "Southeast Michigan covers Detroit, the tri-county suburbs, Ann Arbor, and Downriver communities. Homeowners here deal with older housing stock, freeze-thaw winters, and busy same-day repair demand — especially for broken springs, openers that fail in the cold, and emergency service when a door is stuck open overnight.",
    coverageNote:
      "Wayne, Oakland, Macomb, Washtenaw, Livingston, Monroe, St. Clair, Lapeer, and Lenawee counties.",
    counties: [
      "Wayne",
      "Oakland",
      "Macomb",
      "Washtenaw",
      "Livingston",
      "Monroe",
      "St. Clair",
      "Lapeer",
      "Lenawee",
    ],
    highlights: [
      "Largest concentration of garage-door companies in our directory",
      "Strong coverage for emergency and same-day spring repair",
      "Easy comparison across Detroit, suburbs, and Ann Arbor",
    ],
    commonIssues: [
      "Broken torsion springs on older residential doors",
      "Opener remotes that stop working in winter",
      "Doors that go off-track after ice buildup",
      "Replacement doors for aging Detroit-area homes",
    ],
    hubCitySlugs: [
      "detroit",
      "warren",
      "troy",
      "ann-arbor",
      "livonia",
      "sterling-heights",
    ],
    mapKey: "southeast",
    seoTitle: "Garage Door Pros in Southeast Michigan",
    seoDescription:
      "Find garage door repair, spring replacement, openers, and installation companies across Wayne, Oakland, Macomb, Washtenaw, and Southeast Michigan counties.",
  },
  {
    slug: "west",
    name: "West",
    title: "West Michigan",
    tagline: "Grand Rapids, the lakeshore, and fast-growing West Michigan towns",
    description:
      "West Michigan centers on Grand Rapids and stretches toward Holland, Muskegon, and lakeshore communities. New construction and established neighborhoods both drive demand for installation, tune-ups, and reliable repair — with lake-effect snow and humidity that can wear cables, rollers, and weather seals faster.",
    coverageNote:
      "Kent, Ottawa, Muskegon, Allegan, Newaygo, Oceana, Mason, Lake, Mecosta, Montcalm, Ionia, and Barry counties.",
    counties: [
      "Kent",
      "Ottawa",
      "Muskegon",
      "Allegan",
      "Newaygo",
      "Oceana",
      "Mason",
      "Lake",
      "Mecosta",
      "Montcalm",
      "Ionia",
      "Barry",
    ],
    highlights: [
      "Grand Rapids is a major hub for residential and commercial service",
      "Lakeshore towns need weather-ready doors and seals",
      "Good mix of repair, installation, and maintenance pros",
    ],
    commonIssues: [
      "Salt air and moisture affecting hardware near Lake Michigan",
      "New-build door installations and opener setups",
      "Noisy rollers and unbalanced doors after harsh winters",
      "Maintenance before peak lake-effect season",
    ],
    hubCitySlugs: [
      "grand-rapids",
      "holland",
      "muskegon",
      "wyoming",
      "kentwood",
      "grand-haven",
    ],
    mapKey: "west",
    seoTitle: "Garage Door Pros in West Michigan",
    seoDescription:
      "Compare garage door companies in Kent, Ottawa, Muskegon, and West Michigan counties for repair, installation, and emergency service.",
  },
  {
    slug: "central",
    name: "Central",
    title: "Central Michigan",
    tagline: "Lansing, Flint, Midland, and the heart of the Lower Peninsula",
    description:
      "Central Michigan includes the capital region, Flint, the Tri-Cities corridor, and the Thumb. Homeowners look for dependable spring repair, opener service, and maintenance that can handle Mid-Michigan winters — plus clear coverage across Lansing suburbs and mid-state markets.",
    coverageNote:
      "Ingham, Eaton, Clinton, Genesee, Saginaw, Midland, Bay, Jackson, and surrounding mid-state and Thumb counties.",
    counties: [
      "Ingham",
      "Eaton",
      "Clinton",
      "Genesee",
      "Saginaw",
      "Midland",
      "Bay",
      "Gratiot",
      "Isabella",
      "Shiawassee",
      "Gladwin",
      "Clare",
      "Osceola",
      "Jackson",
      "Huron",
      "Tuscola",
      "Sanilac",
      "Arenac",
    ],
    highlights: [
      "Statewide midpoint with strong multi-city service areas",
      "Capital-region and Tri-Cities coverage in one browse path",
      "Solid options for repair, maintenance, and emergency calls",
    ],
    commonIssues: [
      "Spring failures after temperature swings",
      "Opener sensors misaligned after snowplow season",
      "Doors that stick when weather seals freeze",
      "Commercial and residential service around campus / capital traffic",
    ],
    hubCitySlugs: [
      "lansing",
      "flint",
      "saginaw",
      "midland",
      "bay-city",
      "east-lansing",
    ],
    mapKey: "central",
    seoTitle: "Garage Door Pros in Central Michigan",
    seoDescription:
      "Find local garage door pros in Ingham, Genesee, Saginaw, Midland, Bay, and Central Michigan counties.",
  },
  {
    slug: "southwest",
    name: "Southwest",
    title: "Southwest Michigan",
    tagline: "Kalamazoo, Battle Creek, and Southwest Michigan service areas",
    description:
      "Southwest Michigan covers Kalamazoo, Battle Creek, Portage, and neighboring communities. Residents often need repair and installation help for both established neighborhoods and growing suburbs — with winter performance and quiet, reliable openers high on the list.",
    coverageNote:
      "Kalamazoo, Calhoun, Branch, St. Joseph, Cass, Berrien, Van Buren, and Hillsdale counties.",
    counties: [
      "Kalamazoo",
      "Calhoun",
      "Branch",
      "St. Joseph",
      "Cass",
      "Berrien",
      "Van Buren",
      "Hillsdale",
    ],
    highlights: [
      "Kalamazoo / Portage is a natural comparison cluster",
      "Battle Creek and surrounding towns share overlapping service areas",
      "Strong demand for springs, openers, and full door replacements",
    ],
    commonIssues: [
      "Broken springs on two-car residential doors",
      "Opener upgrades for quieter belt-drive units",
      "Weather seal replacement before winter",
      "Full door replacements on older homes",
    ],
    hubCitySlugs: [
      "kalamazoo",
      "battle-creek",
      "portage",
      "three-rivers",
      "benton-harbor",
      "south-haven",
    ],
    mapKey: "southwest",
    seoTitle: "Garage Door Pros in Southwest Michigan",
    seoDescription:
      "Browse garage door companies in Kalamazoo, Calhoun, Berrien, and Southwest Michigan counties for repair, installation, and emergency help.",
  },
  {
    slug: "north",
    name: "North",
    title: "Northern Michigan",
    tagline: "Traverse City, Petoskey, and Up North garage-door service",
    description:
      "Northern Michigan stretches from Traverse City and the Grand Traverse area through Petoskey, Cadillac, and other Up North communities. Long winters, lake-effect snow, and seasonal homes make durable doors, emergency spring repair, and trusted local coverage especially important.",
    coverageNote:
      "Grand Traverse, Emmet, Charlevoix, Antrim, Leelanau, and neighboring Northern Lower Peninsula counties.",
    counties: [
      "Grand Traverse",
      "Leelanau",
      "Benzie",
      "Manistee",
      "Wexford",
      "Missaukee",
      "Roscommon",
      "Crawford",
      "Kalkaska",
      "Antrim",
      "Charlevoix",
      "Emmet",
      "Cheboygan",
      "Otsego",
      "Montmorency",
      "Alpena",
      "Alcona",
      "Iosco",
      "Ogemaw",
      "Oscoda",
      "Presque Isle",
    ],
    highlights: [
      "Seasonal and year-round homes both need reliable door service",
      "Emergency spring and opener help matters in heavy snow months",
      "Directory coverage across key Up North hubs",
    ],
    commonIssues: [
      "Ice locking doors and weather seals",
      "Battery backup openers for winter outages",
      "Broken springs after deep freezes",
      "Maintenance before leaving a seasonal property",
    ],
    hubCitySlugs: [
      "traverse-city",
      "petoskey",
      "cadillac",
      "boyne-city",
      "grayling",
      "harbor-springs",
    ],
    mapKey: "north",
    seoTitle: "Garage Door Pros in Northern Michigan",
    seoDescription:
      "Find garage door repair and installation pros in Grand Traverse, Emmet, Charlevoix, and Northern Michigan counties.",
  },
  {
    slug: "upper-peninsula",
    name: "Upper Peninsula",
    title: "Upper Peninsula Michigan",
    tagline: "Marquette, Escanaba, and U.P. garage-door coverage",
    description:
      "The Upper Peninsula has fewer metro hubs — and that makes finding a nearby garage-door pro even more valuable. From Marquette to Escanaba and surrounding U.P. communities, homeowners need companies that understand long winters, remote service areas, and doors that have to work when temperatures plunge.",
    coverageNote:
      "All 15 Upper Peninsula counties, including Marquette, Delta, Chippewa, Houghton, and Menominee.",
    counties: [
      "Marquette",
      "Alger",
      "Schoolcraft",
      "Luce",
      "Chippewa",
      "Mackinac",
      "Delta",
      "Menominee",
      "Dickinson",
      "Iron",
      "Baraga",
      "Houghton",
      "Keweenaw",
      "Ontonagon",
      "Gogebic",
    ],
    highlights: [
      "Focused U.P. listings so you are not sorting southern Michigan results",
      "Winter-ready repair and opener support",
      "Coverage across key Upper Peninsula cities",
    ],
    commonIssues: [
      "Extreme cold stiffening tracks and weather seals",
      "Opener failures during outages and deep freezes",
      "Harder-to-source parts in remote areas",
      "Need for clear service-area coverage before you call",
    ],
    hubCitySlugs: [
      "marquette",
      "escanaba",
      "gladstone",
      "menominee",
      "houghton",
      "negaunee",
    ],
    mapKey: "upper-peninsula",
    seoTitle: "Garage Door Pros in Michigan's Upper Peninsula",
    seoDescription:
      "Compare garage door companies across Upper Peninsula counties including Marquette, Delta, Chippewa, and Houghton.",
  },
];

const COUNTY_TO_REGION_SLUG: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const region of REGIONS) {
    for (const county of region.counties) {
      map[county] = region.slug;
    }
  }
  return map;
})();

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function getRegionByName(name: string): Region | undefined {
  return REGIONS.find((r) => r.name === name);
}

export function getRegionSlugForCounty(countyName: string): string | undefined {
  return COUNTY_TO_REGION_SLUG[countyName];
}

export function regionSlugFromName(name: string): string {
  return (
    getRegionByName(name)?.slug ??
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );
}
