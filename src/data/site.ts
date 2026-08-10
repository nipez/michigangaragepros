export const SITE_NAME = "Michigan Garage Pros";
export const SITE_URL = "https://michigangaragepros.com";

export const SERVICE_OPTIONS = [
  "Garage Door Repair",
  "Broken Spring",
  "Garage Door Opener",
  "New Door Installation",
  "Maintenance",
  "Emergency Service",
  "Other",
] as const;

export const ISSUE_OPTIONS = [
  "Door won't open",
  "Door won't close",
  "Broken spring",
  "Opener isn't working",
  "Door is damaged",
  "Need replacement",
  "Routine maintenance",
  "Other",
] as const;

export const TIMING_OPTIONS = ["ASAP", "Today", "This week", "Flexible"] as const;

export const STEP_TITLES = [
  "",
  "What do you need help with?",
  "What's happening?",
  "Where are you located?",
  "How can a pro reach you?",
  "When do you need help?",
] as const;

export const STEP_SUBS = [
  "",
  "Choose the service closest to your problem.",
  "This helps pros come prepared.",
  "We'll match you with companies serving your ZIP.",
  "Local pros will use this to send your quote.",
  "Almost done.",
] as const;

export const PRO_BENEFITS = [
  "Control your company information",
  "Add photos and services",
  "Highlight your service area",
  "Receive homeowner leads",
  "Track profile activity",
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter Your ZIP or City",
    desc: "See garage-door companies serving your area right away.",
  },
  {
    step: "02",
    title: "Compare Local Pros",
    desc: "Compare companies, services, and service areas.",
  },
  {
    step: "03",
    title: "Connect & Get the Job Done",
    desc: "Request a quote or contact the professional directly.",
  },
] as const;

export const HOW_IT_WORKS_PROS = [
  {
    step: "01",
    title: "Claim Your Page",
    desc: "Submit your company details and a contact so we can verify ownership. It's free.",
  },
  {
    step: "02",
    title: "Build It Out",
    desc: "Add your services, photos, service area, and business details so homeowners can compare you accurately.",
  },
  {
    step: "03",
    title: "Get Leads",
    desc: "Homeowners in your service area send quote requests straight to you.",
  },
] as const;

export const COMMON_PROBLEMS = [
  "Door won't open or close",
  "Door is off track",
  "Loud grinding or squeaking",
  "Damaged panels or dents",
  "Door reverses before closing",
  "Worn rollers, cables, or hinges",
] as const;

export const TRUST_POINTS = [
  {
    id: "local",
    title: "Local Pros",
    desc: "Find companies serving your city and surrounding communities.",
  },
  {
    id: "compare",
    title: "Compare Your Options",
    desc: "See services, locations, and company information in one place.",
  },
  {
    id: "free",
    title: "Free for Homeowners",
    desc: "Find and contact local professionals without paying a marketplace fee.",
  },
  {
    id: "real",
    title: "Real Local Businesses",
    desc: "Profiles are built around actual garage-door service companies.",
  },
] as const;
