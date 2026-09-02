export type ServiceFaq = { question: string; answer: string };

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
  /** Display name for city×service H1s (e.g. Broken Spring Repair). */
  localTitle: string;
  /** Keywords used to match company.services / tags. */
  matchTerms: string[];
  faqs: ServiceFaq[];
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
      "Compare Michigan garage door repair companies for stuck, noisy, off-track, or damaged doors — then browse by ZIP or request a free quote.",
    ctaTitle: "Need Your Garage Door Fixed?",
    ctaSub:
      "Browse local repair companies near you, or request quotes if you'd rather get matched.",
    findLabel: "Find Repair Pros →",
    localTitle: "Garage Door Repair",
    matchTerms: ["repair", "track", "cable", "panel", "hinge"],
    faqs: [
      {
        question: "How much does garage door repair cost in Michigan?",
        answer:
          "Common jobs like rollers, sensors, or cables often cost less than a full door replacement. Spring work and emergency after-hours visits usually cost more. Request quotes from local pros with photos of the problem for a firm price.",
      },
      {
        question: "Should I try to fix a garage door myself?",
        answer:
          "Simple checks — power, remotes, and sensor lenses — are fine. Leave springs, cables, and off-track doors to trained technicians; those parts store dangerous energy.",
      },
      {
        question: "How do I find garage door repair near me?",
        answer:
          "Enter your ZIP on Find Pros, open a city page, or jump to a city repair page like Detroit or Grand Rapids to compare companies that list repair service.",
      },
    ],
  },
  {
    slug: "broken-springs",
    name: "Broken Springs",
    shortName: "Springs",
    desc: "Find professionals who repair and replace garage door springs.",
    icon: "spring",
    heroTitle: "Broken Garage Door Spring Repair in Michigan",
    heroSub:
      "A snapped torsion or extension spring is a common Michigan emergency — compare local pros who replace springs safely, then request a quote by ZIP.",
    ctaTitle: "Need a Spring Replaced?",
    ctaSub:
      "See spring-repair companies serving your area, or request quotes if you want us to match you.",
    findLabel: "Find Spring Pros →",
    localTitle: "Broken Spring Repair",
    matchTerms: ["spring"],
    faqs: [
      {
        question: "What are signs of a broken garage door spring?",
        answer:
          "A loud bang, a door that will not lift, or a door that feels extremely heavy when disconnected from the opener usually points to spring failure. Stop using the opener until a pro inspects it.",
      },
      {
        question: "Do both springs need to be replaced?",
        answer:
          "On torsion systems, pros often replace springs as a pair so wear stays even. Ask the technician what they recommend for your door weight and cycle rating.",
      },
      {
        question: "Is broken spring repair an emergency?",
        answer:
          "If the door is stuck open or will not close securely, treat it as urgent for safety and security — especially overnight in winter. Many Michigan companies list same-day spring service.",
      },
    ],
  },
  {
    slug: "garage-door-openers",
    name: "Garage Door Openers",
    shortName: "Openers",
    desc: "Repair, replacement, and installation of garage door openers.",
    icon: "opener",
    heroTitle: "Garage Door Opener Repair in Michigan",
    heroSub:
      "Opener not responding, grinding, or failing mid-cycle? Compare Michigan technicians for opener repair or replacement, including battery-backup options for winter outages.",
    ctaTitle: "Need Opener Help?",
    ctaSub:
      "Browse opener specialists near you, or request quotes if you'd rather get matched.",
    findLabel: "Find Opener Pros →",
    localTitle: "Garage Door Opener Repair",
    matchTerms: ["opener"],
    faqs: [
      {
        question: "Should I repair or replace my garage door opener?",
        answer:
          "Logic boards, gears, and sensors are often repairable. If the unit is old, noisy, or lacks battery backup for Michigan power outages, replacement can be the better long-term value.",
      },
      {
        question: "Why does my opener reverse before closing?",
        answer:
          "Misaligned photo-eye sensors, binding tracks, or incorrect force settings are common causes. Clean and realign sensors first; if it continues, call a pro rather than cranking force settings.",
      },
      {
        question: "Do Michigan pros install new openers?",
        answer:
          "Yes. Browse companies tagged for opener repair and install on city pages, or start a quote specifying opener replacement.",
      },
    ],
  },
  {
    slug: "garage-door-installation",
    name: "New Door Installation",
    shortName: "New Doors",
    desc: "Find local professionals for new garage door installation and full replacements.",
    icon: "install",
    heroTitle: "Garage Door Installation in Michigan",
    heroSub:
      "Compare Michigan companies for new residential garage doors, insulated upgrades, and full replacements — then request quotes with your ZIP.",
    ctaTitle: "Ready for a New Door?",
    ctaSub:
      "Browse installation companies in your area, or request quotes for your project.",
    findLabel: "Find New Door Pros →",
    localTitle: "Garage Door Installation",
    matchTerms: ["installation", "install", "new door", "replacement"],
    faqs: [
      {
        question: "When should I replace a garage door instead of repairing it?",
        answer:
          "Consider replacement when panels are rusted through, insulation is outdated, multiple sections are damaged, or repair costs approach the price of a new door.",
      },
      {
        question: "Do insulated doors matter in Michigan?",
        answer:
          "Yes — insulated doors help with energy loss into attached garages and reduce winter condensation and frost on weather seals.",
      },
      {
        question: "How long does installation take?",
        answer:
          "Many residential installs finish in a day once the door is on site. Ask about lead times for your preferred style and whether the opener will be replaced at the same visit.",
      },
    ],
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    shortName: "Maintenance",
    desc: "Keep your garage door operating smoothly and safely.",
    icon: "maintenance",
    heroTitle: "Garage Door Maintenance in Michigan",
    heroSub:
      "Schedule tune-ups, lubrication, and safety checks with Michigan pros who keep doors quiet and reliable through freeze-thaw season.",
    ctaTitle: "Schedule Maintenance?",
    ctaSub:
      "Browse maintenance pros near you, or request quotes if you'd rather get matched.",
    findLabel: "Find Maintenance Pros →",
    localTitle: "Garage Door Maintenance",
    matchTerms: ["maintenance", "tune"],
    faqs: [
      {
        question: "How often should a garage door be serviced?",
        answer:
          "Once or twice a year is typical — ideally before winter and after heavy spring use. Ask for balance testing, roller/hinge inspection, and a safety-reverse check, not just a quick spray of lubricant.",
      },
      {
        question: "What maintenance prevents winter failures?",
        answer:
          "Lubricating hinges and rollers, checking weather seals, confirming sensor alignment, and testing the battery backup on the opener prevent many January no-open calls.",
      },
      {
        question: "Is noisy operation a maintenance issue?",
        answer:
          "Often yes — dry hinges or worn rollers cause squeaks and grinding. Deep grinding from the motor head may mean opener repair instead of a simple tune-up.",
      },
    ],
  },
  {
    slug: "emergency-service",
    name: "Emergency Service",
    shortName: "Emergency",
    desc: "Find local help when your garage door problem can't wait.",
    icon: "emergency",
    heroTitle: "Emergency Garage Door Service in Michigan",
    heroSub:
      "Door stuck open, spring snapped, or locked out after hours? Compare Michigan companies that advertise same-day and emergency garage door help.",
    ctaTitle: "Need Help Fast?",
    ctaSub:
      "See emergency-ready companies near you right away, or request a quote for a faster match.",
    findLabel: "Find Emergency Pros →",
    localTitle: "Emergency Garage Door Service",
    matchTerms: ["emergency"],
    faqs: [
      {
        question: "What counts as a garage door emergency?",
        answer:
          "A door stuck open overnight, a snapped spring, an off-track door, or a door that will not close securely are common emergencies because of safety and home security.",
      },
      {
        question: "What should I do before the technician arrives?",
        answer:
          "Keep people and pets clear, unplug the opener if the door is unstable, and do not force a door with a broken spring. Photos and your ZIP help pros bring the right parts.",
      },
      {
        question: "How do I find same-day garage door service in Michigan?",
        answer:
          "Filter for emergency-ready listings on Find Pros or city pages, confirm after-hours rates up front, and note ASAP timing on your quote request.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/** True when a company profile lists this service (services[] or tags). */
export function companyOffersService(
  company: { services: string[]; tags: string[]; emergency?: boolean },
  service: Service,
): boolean {
  if (service.slug === "emergency-service" && company.emergency) return true;
  const haystack = [...company.services, ...company.tags]
    .join(" ")
    .toLowerCase();
  return service.matchTerms.some((term) => haystack.includes(term.toLowerCase()));
}

export const RELATED_SERVICE_LINKS = [
  { href: "/broken-springs/", label: "Broken Spring Repair" },
  { href: "/garage-door-openers/", label: "Garage Door Opener Repair" },
  { href: "/garage-door-installation/", label: "New Door Installation" },
  { href: "/maintenance/", label: "Maintenance" },
  { href: "/emergency-service/", label: "Emergency Service" },
] as const;
