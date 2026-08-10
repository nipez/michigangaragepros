export type City = {
  slug: string;
  name: string;
  state: string;
  nearby: string[];
  region?: string;
};

export const CITIES: City[] = [
  {
    slug: "detroit",
    name: "Detroit",
    state: "MI",
    region: "Southeast",
    nearby: ["Dearborn", "Warren", "Livonia", "Southfield", "Royal Oak"],
  },
  {
    slug: "grand-rapids",
    name: "Grand Rapids",
    state: "MI",
    region: "West",
    nearby: ["Wyoming", "Kentwood", "Walker", "Grandville", "Holland"],
  },
  {
    slug: "lansing",
    name: "Lansing",
    state: "MI",
    region: "Central",
    nearby: ["East Lansing", "Okemos", "Holt", "Mason"],
  },
  {
    slug: "ann-arbor",
    name: "Ann Arbor",
    state: "MI",
    region: "Southeast",
    nearby: ["Ypsilanti", "Saline", "Chelsea", "Dexter"],
  },
  {
    slug: "warren",
    name: "Warren",
    state: "MI",
    region: "Southeast",
    nearby: ["Sterling Heights", "Troy", "Detroit", "Center Line"],
  },
  {
    slug: "sterling-heights",
    name: "Sterling Heights",
    state: "MI",
    region: "Southeast",
    nearby: ["Warren", "Troy", "Utica", "Shelby Township"],
  },
  {
    slug: "troy",
    name: "Troy",
    state: "MI",
    region: "Southeast",
    nearby: ["Rochester Hills", "Sterling Heights", "Clawson", "Birmingham"],
  },
  {
    slug: "kalamazoo",
    name: "Kalamazoo",
    state: "MI",
    region: "Southwest",
    nearby: ["Portage", "Battle Creek", "Parchment"],
  },
  {
    slug: "flint",
    name: "Flint",
    state: "MI",
    region: "Central",
    nearby: ["Grand Blanc", "Burton", "Fenton"],
  },
  {
    slug: "muskegon",
    name: "Muskegon",
    state: "MI",
    region: "West",
    nearby: ["Norton Shores", "Grand Haven", "Holland"],
  },
  {
    slug: "holland",
    name: "Holland",
    state: "MI",
    region: "West",
    nearby: ["Zeeland", "Grand Haven", "Grand Rapids"],
  },
  {
    slug: "traverse-city",
    name: "Traverse City",
    state: "MI",
    region: "North",
    nearby: [
      "Acme",
      "Elk Rapids",
      "Cadillac",
      "Interlochen",
      "Kingsley",
      "Petoskey",
    ],
  },
  {
    slug: "saginaw",
    name: "Saginaw",
    state: "MI",
    region: "Central",
    nearby: ["Bay City", "Midland", "Freeland"],
  },
  {
    slug: "midland",
    name: "Midland",
    state: "MI",
    region: "Central",
    nearby: ["Saginaw", "Bay City", "Mount Pleasant"],
  },
  {
    slug: "bay-city",
    name: "Bay City",
    state: "MI",
    region: "Central",
    nearby: ["Saginaw", "Midland", "Essexville"],
  },
  {
    slug: "dearborn",
    name: "Dearborn",
    state: "MI",
    region: "Southeast",
    nearby: ["Detroit", "Dearborn Heights", "Allen Park", "Livonia"],
  },
  {
    slug: "livonia",
    name: "Livonia",
    state: "MI",
    region: "Southeast",
    nearby: ["Detroit", "Farmington Hills", "Plymouth", "Westland"],
  },
  {
    slug: "farmington-hills",
    name: "Farmington Hills",
    state: "MI",
    region: "Southeast",
    nearby: ["Livonia", "Novi", "Southfield", "West Bloomfield"],
  },
  {
    slug: "rochester-hills",
    name: "Rochester Hills",
    state: "MI",
    region: "Southeast",
    nearby: ["Troy", "Rochester", "Auburn Hills", "Shelby Township"],
  },
  {
    slug: "southfield",
    name: "Southfield",
    state: "MI",
    region: "Southeast",
    nearby: ["Detroit", "Farmington Hills", "Oak Park", "Royal Oak"],
  },
  {
    slug: "novi",
    name: "Novi",
    state: "MI",
    region: "Southeast",
    nearby: ["Farmington Hills", "Northville", "Wixom", "Canton"],
  },
  {
    slug: "canton",
    name: "Canton",
    state: "MI",
    region: "Southeast",
    nearby: ["Plymouth", "Westland", "Livonia", "Ann Arbor"],
  },
  {
    slug: "westland",
    name: "Westland",
    state: "MI",
    region: "Southeast",
    nearby: ["Livonia", "Canton", "Garden City", "Dearborn"],
  },
  {
    slug: "royal-oak",
    name: "Royal Oak",
    state: "MI",
    region: "Southeast",
    nearby: ["Berkley", "Clawson", "Troy", "Ferndale"],
  },
  {
    slug: "birmingham",
    name: "Birmingham",
    state: "MI",
    region: "Southeast",
    nearby: ["Troy", "Bloomfield Hills", "Royal Oak", "Beverly Hills"],
  },
  {
    slug: "pontiac",
    name: "Pontiac",
    state: "MI",
    region: "Southeast",
    nearby: ["Auburn Hills", "Waterford", "Bloomfield Hills", "Troy"],
  },
  {
    slug: "clinton-township",
    name: "Clinton Township",
    state: "MI",
    region: "Southeast",
    nearby: ["Sterling Heights", "Mount Clemens", "Macomb", "Roseville"],
  },
  {
    slug: "shelby-township",
    name: "Shelby Township",
    state: "MI",
    region: "Southeast",
    nearby: ["Sterling Heights", "Utica", "Rochester Hills", "Macomb"],
  },
  {
    slug: "macomb",
    name: "Macomb",
    state: "MI",
    region: "Southeast",
    nearby: ["Clinton Township", "Shelby Township", "Chesterfield"],
  },
  {
    slug: "wyoming",
    name: "Wyoming",
    state: "MI",
    region: "West",
    nearby: ["Grand Rapids", "Grandville", "Kentwood", "Byron Center"],
  },
  {
    slug: "kentwood",
    name: "Kentwood",
    state: "MI",
    region: "West",
    nearby: ["Grand Rapids", "Wyoming", "Cascade", "Caledonia"],
  },
  {
    slug: "walker",
    name: "Walker",
    state: "MI",
    region: "West",
    nearby: ["Grand Rapids", "Comstock Park", "Grandville"],
  },
  {
    slug: "portage",
    name: "Portage",
    state: "MI",
    region: "Southwest",
    nearby: ["Kalamazoo", "Battle Creek", "Vicksburg"],
  },
  {
    slug: "battle-creek",
    name: "Battle Creek",
    state: "MI",
    region: "Southwest",
    nearby: ["Kalamazoo", "Portage", "Marshall", "Jackson"],
  },
  {
    slug: "jackson",
    name: "Jackson",
    state: "MI",
    region: "Central",
    nearby: ["Ann Arbor", "Battle Creek", "Lansing"],
  },
  {
    slug: "east-lansing",
    name: "East Lansing",
    state: "MI",
    region: "Central",
    nearby: ["Lansing", "Okemos", "Haslett", "Holt"],
  },
  {
    slug: "ypsilanti",
    name: "Ypsilanti",
    state: "MI",
    region: "Southeast",
    nearby: ["Ann Arbor", "Canton", "Belleville", "Saline"],
  },
  {
    slug: "monroe",
    name: "Monroe",
    state: "MI",
    region: "Southeast",
    nearby: ["Frenchtown", "Temperance", "Dundee", "Toledo"],
  },
  {
    slug: "port-huron",
    name: "Port Huron",
    state: "MI",
    region: "Southeast",
    nearby: ["Marysville", "St. Clair", "Fort Gratiot"],
  },
  {
    slug: "mount-pleasant",
    name: "Mount Pleasant",
    state: "MI",
    region: "Central",
    nearby: ["Midland", "Clare", "Alma"],
  },
  {
    slug: "cadillac",
    name: "Cadillac",
    state: "MI",
    region: "North",
    nearby: ["Traverse City", "Reed City", "Big Rapids"],
  },
  {
    slug: "petoskey",
    name: "Petoskey",
    state: "MI",
    region: "North",
    nearby: ["Harbor Springs", "Charlevoix", "Gaylord"],
  },
  {
    slug: "marquette",
    name: "Marquette",
    state: "MI",
    region: "Upper Peninsula",
    nearby: ["Ishpeming", "Negaunee", "Gwinn"],
  },
  {
    slug: "benton-harbor",
    name: "Benton Harbor",
    state: "MI",
    region: "Southwest",
    nearby: ["Saint Joseph", "Niles", "South Haven"],
  },
  {
    slug: "brighton",
    name: "Brighton",
    state: "MI",
    region: "Southeast",
    nearby: ["Howell", "Ann Arbor", "Novi", "Milford"],
  },
  {
    slug: "howell",
    name: "Howell",
    state: "MI",
    region: "Southeast",
    nearby: ["Brighton", "Fowlerville", "Lansing"],
  },
  {
    slug: "grand-blanc",
    name: "Grand Blanc",
    state: "MI",
    region: "Central",
    nearby: ["Flint", "Burton", "Fenton"],
  },
  {
    slug: "norton-shores",
    name: "Norton Shores",
    state: "MI",
    region: "West",
    nearby: ["Muskegon", "Grand Haven", "Spring Lake"],
  },
  {
    slug: "zeeland",
    name: "Zeeland",
    state: "MI",
    region: "West",
    nearby: ["Holland", "Hudsonville", "Grand Rapids"],
  },
  {
    slug: "comstock-park",
    name: "Comstock Park",
    state: "MI",
    region: "West",
    nearby: ["Grand Rapids", "Walker", "Rockford"],
  },
  {
    slug: "byron-center",
    name: "Byron Center",
    state: "MI",
    region: "West",
    nearby: ["Wyoming", "Grand Rapids", "Kentwood"],
  },
  {
    slug: "auburn-hills",
    name: "Auburn Hills",
    state: "MI",
    region: "Southeast",
    nearby: ["Pontiac", "Rochester Hills", "Troy", "Waterford"],
  },
];

/** Cities shown in the homepage grid (full list lives on /cities/). */
export const HOMEPAGE_CITY_SLUGS = [
  "detroit",
  "grand-rapids",
  "lansing",
  "ann-arbor",
  "warren",
  "sterling-heights",
  "troy",
  "kalamazoo",
  "flint",
  "muskegon",
  "holland",
  "traverse-city",
  "saginaw",
  "midland",
  "bay-city",
] as const;

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function citySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getHomepageCities(): City[] {
  return HOMEPAGE_CITY_SLUGS.map((slug) => getCityBySlug(slug)).filter(
    (c): c is City => Boolean(c),
  );
}

export function getCitiesByRegion(): Record<string, City[]> {
  const groups: Record<string, City[]> = {};
  for (const city of CITIES) {
    const region = city.region ?? "Michigan";
    if (!groups[region]) groups[region] = [];
    groups[region].push(city);
  }
  return groups;
}
