export type City = {
  slug: string;
  name: string;
  state: string;
  nearby: string[];
};

export const CITIES: City[] = [
  {
    slug: "detroit",
    name: "Detroit",
    state: "MI",
    nearby: ["Warren", "Sterling Heights", "Troy", "Dearborn", "Livonia"],
  },
  {
    slug: "grand-rapids",
    name: "Grand Rapids",
    state: "MI",
    nearby: [
      "Wyoming",
      "Kentwood",
      "Walker",
      "Grandville",
      "Rockford",
      "Holland",
      "Muskegon",
    ],
  },
  {
    slug: "lansing",
    name: "Lansing",
    state: "MI",
    nearby: ["East Lansing", "Okemos", "Holt", "Mason"],
  },
  {
    slug: "ann-arbor",
    name: "Ann Arbor",
    state: "MI",
    nearby: ["Ypsilanti", "Saline", "Chelsea", "Dexter"],
  },
  {
    slug: "warren",
    name: "Warren",
    state: "MI",
    nearby: ["Sterling Heights", "Troy", "Detroit"],
  },
  {
    slug: "sterling-heights",
    name: "Sterling Heights",
    state: "MI",
    nearby: ["Warren", "Troy", "Utica"],
  },
  {
    slug: "troy",
    name: "Troy",
    state: "MI",
    nearby: ["Rochester", "Sterling Heights", "Clawson"],
  },
  {
    slug: "kalamazoo",
    name: "Kalamazoo",
    state: "MI",
    nearby: ["Portage", "Battle Creek", "Parchment"],
  },
  {
    slug: "flint",
    name: "Flint",
    state: "MI",
    nearby: ["Grand Blanc", "Burton", "Fenton"],
  },
  {
    slug: "muskegon",
    name: "Muskegon",
    state: "MI",
    nearby: ["Norton Shores", "Grand Haven", "Holland"],
  },
  {
    slug: "holland",
    name: "Holland",
    state: "MI",
    nearby: ["Zeeland", "Grand Haven", "Grand Rapids"],
  },
  {
    slug: "traverse-city",
    name: "Traverse City",
    state: "MI",
    nearby: ["Acme", "Elk Rapids", "Cadillac"],
  },
  {
    slug: "saginaw",
    name: "Saginaw",
    state: "MI",
    nearby: ["Bay City", "Midland", "Freeland"],
  },
  {
    slug: "midland",
    name: "Midland",
    state: "MI",
    nearby: ["Saginaw", "Bay City", "Mount Pleasant"],
  },
  {
    slug: "bay-city",
    name: "Bay City",
    state: "MI",
    nearby: ["Saginaw", "Midland", "Essexville"],
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function citySlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
