export type Service = {
  slug: string;
  name: string;
  shortName: string;
  desc: string;
  icon: "wrench" | "spring" | "opener" | "install" | "maintenance" | "emergency";
  heroTitle: string;
  heroSub: string;
  ctaTitle: string;
  ctaSub: string;
  findLabel: string;
};

export const SERVICES: Service[] = [
  {
    slug: "garage-door-repair",
    name: "Garage Door Repair",
    shortName: "Repair",
    desc: "Get help with broken, stuck, noisy, or damaged garage doors.",
    icon: "wrench",
    heroTitle: "Garage Door Repair in Michigan",
    heroSub:
      "Broken, stuck, noisy, or off-track — enter your ZIP to see local companies that repair residential garage doors.",
    ctaTitle: "Need Your Garage Door Fixed?",
    ctaSub:
      "Browse local repair companies near you, or request quotes if you'd rather get matched.",
    findLabel: "Find Repair Pros →",
  },
  {
    slug: "broken-springs",
    name: "Broken Springs",
    shortName: "Springs",
    desc: "Find professionals who repair and replace garage door springs.",
    icon: "spring",
    heroTitle: "Broken Spring Repair in Michigan",
    heroSub:
      "A broken torsion or extension spring is a common emergency — enter your ZIP to see local pros who can replace it safely.",
    ctaTitle: "Need a Spring Replaced?",
    ctaSub:
      "See spring-repair companies serving your area, or request quotes if you want us to match you.",
    findLabel: "Find Spring Pros →",
  },
  {
    slug: "garage-door-openers",
    name: "Garage Door Openers",
    shortName: "Openers",
    desc: "Repair, replacement, and installation of garage door openers.",
    icon: "opener",
    heroTitle: "Garage Door Opener Repair in Michigan",
    heroSub:
      "Opener not responding, grinding, or failing mid-cycle — enter your ZIP to find local technicians for repair or replacement.",
    ctaTitle: "Need Opener Help?",
    ctaSub:
      "Browse opener specialists near you, or request quotes if you'd rather get matched.",
    findLabel: "Find Opener Pros →",
  },
  {
    slug: "garage-door-installation",
    name: "New Door Installation",
    shortName: "New Doors",
    desc: "Find local professionals for new garage door installation and full replacements.",
    icon: "install",
    heroTitle: "New Garage Door Installation in Michigan",
    heroSub:
      "Enter your ZIP to compare local companies for new residential garage doors, upgrades, and full replacements.",
    ctaTitle: "Ready for a New Door?",
    ctaSub:
      "Browse installation companies in your area, or request quotes for your project.",
    findLabel: "Find New Door Pros →",
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    shortName: "Maintenance",
    desc: "Keep your garage door operating smoothly and safely.",
    icon: "maintenance",
    heroTitle: "Garage Door Maintenance in Michigan",
    heroSub:
      "Tune-ups, lubrication, and safety checks — enter your ZIP to see local pros who keep doors running quietly and reliably.",
    ctaTitle: "Schedule Maintenance?",
    ctaSub:
      "Browse maintenance pros near you, or request quotes if you'd rather get matched.",
    findLabel: "Find Maintenance Pros →",
  },
  {
    slug: "emergency-service",
    name: "Emergency Service",
    shortName: "Emergency",
    desc: "Find local help when your garage door problem can't wait.",
    icon: "emergency",
    heroTitle: "Emergency Garage Door Service in Michigan",
    heroSub:
      "Door stuck open, spring snapped, or locked out — enter your ZIP to see local pros offering same-day and after-hours help.",
    ctaTitle: "Need Help Fast?",
    ctaSub:
      "See emergency-ready companies near you right away, or request a quote for a faster match.",
    findLabel: "Find Emergency Pros →",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const RELATED_SERVICE_LINKS = [
  { href: "/broken-springs/", label: "Broken Spring Repair" },
  { href: "/garage-door-openers/", label: "Garage Door Opener Repair" },
  { href: "/garage-door-installation/", label: "New Door Installation" },
  { href: "/maintenance/", label: "Maintenance" },
  { href: "/emergency-service/", label: "Emergency Service" },
] as const;
