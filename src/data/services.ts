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
      "Broken, stuck, noisy, or off-track — compare local companies that repair residential garage doors, then request a free quote.",
    ctaTitle: "Need Your Garage Door Fixed?",
    ctaSub:
      "Tell us what's happening and where you are — we'll match you with local repair pros.",
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
      "A broken torsion or extension spring is a common emergency — compare local pros who can replace it safely.",
    ctaTitle: "Need a Spring Replaced?",
    ctaSub:
      "Tell us what happened and your ZIP — we'll match you with local spring repair pros.",
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
      "Opener not responding, grinding, or failing mid-cycle — find local technicians for repair or replacement.",
    ctaTitle: "Need Opener Help?",
    ctaSub:
      "Share your issue and location — we'll connect you with opener specialists nearby.",
    findLabel: "Find Opener Pros →",
  },
  {
    slug: "garage-door-installation",
    name: "Garage Door Installation",
    shortName: "Installation",
    desc: "Find local professionals for new garage door installation.",
    icon: "install",
    heroTitle: "Garage Door Installation in Michigan",
    heroSub:
      "Compare local companies for new residential garage door installation, upgrades, and full replacements.",
    ctaTitle: "Ready for a New Door?",
    ctaSub:
      "Tell us about your project — we'll match you with installation pros in your area.",
    findLabel: "Find Install Pros →",
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    shortName: "Maintenance",
    desc: "Keep your garage door operating smoothly and safely.",
    icon: "maintenance",
    heroTitle: "Garage Door Maintenance in Michigan",
    heroSub:
      "Tune-ups, lubrication, and safety checks — find local pros who keep doors running quietly and reliably.",
    ctaTitle: "Schedule Maintenance?",
    ctaSub:
      "Tell us what you need and where you are — we'll match you with local maintenance pros.",
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
      "Door stuck open, spring snapped, or locked out — connect with local pros offering same-day and after-hours help.",
    ctaTitle: "Need Help Fast?",
    ctaSub:
      "Tell us what's happening — we'll match you with emergency-ready pros near you.",
    findLabel: "Find Emergency Pros →",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const RELATED_SERVICE_LINKS = [
  { href: "/broken-springs/", label: "Broken Spring Repair" },
  { href: "/garage-door-openers/", label: "Garage Door Opener Repair" },
  { href: "/garage-door-installation/", label: "Installation" },
  { href: "/maintenance/", label: "Maintenance" },
  { href: "/emergency-service/", label: "Emergency Service" },
] as const;
