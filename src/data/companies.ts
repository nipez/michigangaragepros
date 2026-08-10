export type Review = {
  name: string;
  stars: number;
  location: string;
  when: string;
  body: string;
};

export type Company = {
  slug: string;
  name: string;
  rating: number;
  reviews: number;
  city: string;
  citySlug: string;
  tags: string[];
  featured?: boolean;
  emergency?: boolean;
  about: string;
  services: string[];
  serviceArea: string[];
  hours: string;
  emergencyHours?: string;
  onPlatform: string;
  phone?: string;
};

export const COMPANIES: Company[] = [
  {
    slug: "lakeside-garage-door-service",
    name: "Lakeside Garage Door Service",
    rating: 4.9,
    reviews: 184,
    city: "Grand Rapids, MI",
    citySlug: "grand-rapids",
    tags: ["Repair", "Springs", "Openers", "Installation"],
    featured: true,
    emergency: true,
    about:
      "Lakeside Garage Door Service is a family-run company serving Grand Rapids and West Michigan. The team handles residential repair, spring and opener replacement, and full door installations — with same-day emergency response in most of the metro area.",
    services: [
      "Garage Door Repair",
      "Broken Spring Replacement",
      "Opener Repair & Install",
      "New Door Installation",
      "Maintenance & Tune-ups",
      "Emergency Service",
    ],
    serviceArea: [
      "Grand Rapids",
      "Wyoming",
      "Kentwood",
      "Walker",
      "Grandville",
      "Rockford",
    ],
    hours: "Mon–Sat, 7am–7pm",
    emergencyHours: "24/7 response",
    onPlatform: "Since 2026",
    phone: "616-555-0142",
  },
  {
    slug: "great-lakes-garage-doors",
    name: "Great Lakes Garage Doors",
    rating: 4.8,
    reviews: 126,
    city: "Lansing, MI",
    citySlug: "lansing",
    tags: ["Repair", "Installation", "Maintenance"],
    about:
      "Great Lakes Garage Doors serves Lansing and mid-Michigan with residential repair, installation, and preventive maintenance.",
    services: [
      "Garage Door Repair",
      "New Door Installation",
      "Maintenance & Tune-ups",
      "Opener Repair & Install",
    ],
    serviceArea: ["Lansing", "East Lansing", "Okemos", "Holt"],
    hours: "Mon–Fri, 8am–6pm",
    onPlatform: "Since 2026",
  },
  {
    slug: "north-shore-garage-door-co",
    name: "North Shore Garage Door Co.",
    rating: 4.9,
    reviews: 93,
    city: "Traverse City, MI",
    citySlug: "traverse-city",
    tags: ["Repair", "Openers", "Emergency"],
    emergency: true,
    about:
      "North Shore Garage Door Co. covers Traverse City and northern Michigan with repair, openers, and emergency service.",
    services: [
      "Garage Door Repair",
      "Opener Repair & Install",
      "Emergency Service",
      "Broken Spring Replacement",
    ],
    serviceArea: ["Traverse City", "Acme", "Elk Rapids"],
    hours: "Mon–Sat, 7am–6pm",
    emergencyHours: "24/7 response",
    onPlatform: "Since 2026",
  },
  {
    slug: "motor-city-garage-door-service",
    name: "Motor City Garage Door Service",
    rating: 4.7,
    reviews: 211,
    city: "Detroit, MI",
    citySlug: "detroit",
    tags: ["Repair", "Springs", "Commercial"],
    about:
      "Motor City Garage Door Service handles residential and light commercial garage door work across metro Detroit.",
    services: [
      "Garage Door Repair",
      "Broken Spring Replacement",
      "Commercial Service",
      "Maintenance & Tune-ups",
    ],
    serviceArea: ["Detroit", "Warren", "Sterling Heights", "Troy"],
    hours: "Mon–Sat, 7am–7pm",
    onPlatform: "Since 2026",
  },
  {
    slug: "river-city-door-works",
    name: "River City Door Works",
    rating: 4.8,
    reviews: 74,
    city: "Grand Rapids, MI",
    citySlug: "grand-rapids",
    tags: ["Repair", "Installation", "Maintenance"],
    about:
      "River City Door Works is a Grand Rapids–based shop focused on residential repair, installation, and seasonal maintenance.",
    services: [
      "Garage Door Repair",
      "New Door Installation",
      "Maintenance & Tune-ups",
    ],
    serviceArea: ["Grand Rapids", "Wyoming", "Kentwood"],
    hours: "Mon–Fri, 8am–5pm",
    onPlatform: "Since 2026",
  },
  {
    slug: "west-michigan-overhead-door",
    name: "West Michigan Overhead Door",
    rating: 4.7,
    reviews: 58,
    city: "Wyoming, MI",
    citySlug: "grand-rapids",
    tags: ["Repair", "Springs", "Commercial"],
    about:
      "West Michigan Overhead Door serves Wyoming and the Grand Rapids metro with residential and commercial garage door service.",
    services: [
      "Garage Door Repair",
      "Broken Spring Replacement",
      "Commercial Service",
    ],
    serviceArea: ["Wyoming", "Grand Rapids", "Grandville"],
    hours: "Mon–Fri, 7am–6pm",
    onPlatform: "Since 2026",
  },
];

export const SAMPLE_REVIEWS: Review[] = [
  {
    name: "Sarah M.",
    stars: 5,
    location: "Grand Rapids",
    when: "2 weeks ago",
    body: "Spring snapped on a Sunday morning and they were out the same afternoon. Fair price, quick work, and they walked me through what failed.",
  },
  {
    name: "David R.",
    stars: 5,
    location: "Kentwood",
    when: "1 month ago",
    body: "Replaced our 20-year-old door and opener. Showed up on time, cleaned up after, and the new door is whisper quiet.",
  },
  {
    name: "Jennifer L.",
    stars: 4,
    location: "Walker",
    when: "2 months ago",
    body: "Good communication and solid repair work on our off-track door. Scheduling took a couple days during a busy week.",
  },
];

export function getCompanyBySlug(slug: string): Company | undefined {
  return COMPANIES.find((c) => c.slug === slug);
}

export function getFeaturedCompany(): Company {
  return COMPANIES.find((c) => c.featured) ?? COMPANIES[0];
}

export function getOrganicCompanies(limit = 3): Company[] {
  return COMPANIES.filter((c) => !c.featured).slice(0, limit);
}

export function getCompaniesForCity(citySlug: string): Company[] {
  const inCity = COMPANIES.filter((c) => c.citySlug === citySlug);
  const featured = inCity.filter((c) => c.featured);
  const organic = inCity.filter((c) => !c.featured);
  return [...featured, ...organic];
}
