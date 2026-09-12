export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogImage = {
  /** Path under /public, e.g. /blog/broken-garage-door-spring-signs.webp */
  src: string;
  alt: string;
  caption?: string;
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMinutes: number;
  category: string;
  /** Optional override; defaults to /blog/{slug}.webp for drop-in images. */
  image?: BlogImage;
  sections: BlogSection[];
  /** Optional Q&A for on-page FAQ + FAQPage JSON-LD. */
  faqs?: BlogFaq[];
};

/** Default image path convention — drop files in public/blog/{slug}.webp */
export function getBlogImage(post: BlogPost): BlogImage {
  if (post.image) return post.image;
  return {
    src: `/blog/${post.slug}.webp`,
    alt: post.title,
  };
}

/**
 * Only reference blog images that exist under public/blog to avoid live 404s.
 * Add a .webp (or .jpg) named after the slug to enable images.
 */
const EXISTING_BLOG_IMAGES = new Set<string>([
  // Populate as assets are added, e.g. "broken-garage-door-spring-signs",
]);

export function hasBlogImageFile(post: BlogPost): boolean {
  if (post.image) {
    const base = post.image.src.replace(/^\/blog\//, "").replace(/\.(webp|jpe?g|png)$/i, "");
    return EXISTING_BLOG_IMAGES.has(base) || EXISTING_BLOG_IMAGES.has(post.slug);
  }
  return EXISTING_BLOG_IMAGES.has(post.slug);
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "broken-garage-door-spring-signs",
    title: "7 Signs Your Garage Door Spring Is Failing",
    description:
      "Learn the warning signs of a worn or broken garage door spring, why DIY replacement is risky, and when to call a Michigan pro.",
    date: "2026-03-02",
    readMinutes: 6,
    category: "Repair",
    sections: [
      {
        paragraphs: [
          "Garage door springs carry almost the full weight of the door. When they wear out, the opener works harder, the door feels heavy, and a sudden break can leave you stranded. In Michigan winters, freeze-thaw cycles make spring failures especially common.",
          "Here are the clearest signs it is time to schedule spring service before a small problem becomes an emergency.",
        ],
      },
      {
        heading: "1. The door feels much heavier than usual",
        paragraphs: [
          "If you disconnect the opener and the door is hard to lift by hand, the spring is no longer balancing the door correctly. A healthy door should stay roughly halfway open when lifted manually.",
        ],
      },
      {
        heading: "2. You hear a loud bang from the garage",
        paragraphs: [
          "A sharp bang often means a torsion spring has snapped. The door may refuse to open, or it may open only a few inches before the opener strains.",
        ],
      },
      {
        heading: "3. The door opens unevenly or looks crooked",
        paragraphs: [
          "Extension-spring systems use a spring on each side. If one side fails, the door can rack or bind in the tracks. Stop using the opener until a technician inspects it.",
        ],
      },
      {
        heading: "4. The opener sounds strained or reverses mid-travel",
        paragraphs: [
          "Openers are not designed to lift an unbalanced door. Grinding, hesitation, or mid-travel reversing can point to spring wear rather than a bad motor.",
        ],
      },
      {
        heading: "5. Visible gaps or stretching in the spring coils",
        paragraphs: [
          "Look (from a safe distance) for separation in torsion spring coils or a spring hanging loosely. Never try to adjust a wound torsion spring yourself — the stored energy is dangerous.",
        ],
      },
      {
        heading: "6. The door slams shut or drops quickly",
        paragraphs: [
          "A door that falls hard instead of closing smoothly is a serious safety issue. Keep kids and pets clear and call for repair the same day when possible.",
        ],
      },
      {
        heading: "7. Your door is older than the spring's expected life",
        paragraphs: [
          "Many residential springs are rated for a set number of cycles. Daily use in a Michigan household can reach end-of-life in several years. Proactive replacement is cheaper than an emergency call at night.",
          "Browse [broken spring repair](/broken-springs/) companies by ZIP on Michigan Garage Pros, or compare [Detroit spring pros](/cities/detroit/broken-springs/), [Grand Rapids](/cities/grand-rapids/broken-springs/), [Ann Arbor](/cities/ann-arbor/broken-springs/), and [Traverse City](/cities/traverse-city/broken-springs/). For planning ranges, see [garage door spring repair cost in Michigan](/blog/garage-door-spring-repair-cost-michigan/).",
        ],
      },
    ],
  },
  {
    slug: "garage-door-repair-cost-michigan",
    title: "Garage Door Repair Cost in Michigan: What to Expect",
    description:
      "A practical guide to typical Michigan garage door repair costs for springs, openers, cables, and service calls — plus what drives the price up or down.",
    date: "2026-03-10",
    readMinutes: 7,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "Homeowners usually want a ballpark before they call. Exact pricing varies by city, parts, and how urgent the visit is, but Michigan repair jobs tend to fall into a few common ranges.",
          "Use these figures as planning ranges — not quotes — then compare local companies for a firm price.",
        ],
      },
      {
        heading: "Service call and diagnosis",
        paragraphs: [
          "Many companies charge a trip or diagnostic fee that may be applied toward the repair. Same-day or after-hours emergency visits usually cost more than weekday appointments.",
        ],
      },
      {
        heading: "Broken spring replacement",
        paragraphs: [
          "Spring replacement is one of the most common repairs. Cost depends on door weight, spring type (torsion vs extension), and whether both springs should be replaced as a pair for even wear.",
        ],
      },
      {
        heading: "Opener repair vs replacement",
        paragraphs: [
          "Logic-board, gear, or sensor repairs can be cheaper than a full opener swap. If the unit is old, noisy, or lacks battery backup for winter outages, replacement may be the better long-term value.",
        ],
      },
      {
        heading: "Cables, rollers, and tracks",
        paragraphs: [
          "Frayed cables, worn rollers, and bent tracks are mid-range repairs. Ignoring them can damage the door panels or create unsafe operation.",
        ],
      },
      {
        heading: "What changes the price in Michigan",
        paragraphs: [
          "Urban markets like Metro Detroit or Grand Rapids may have more competition. Remote Northern Michigan or Upper Peninsula visits can include travel time. Winter emergencies and commercial doors also push pricing higher.",
          "For spring-specific ranges, read [garage door spring repair cost in Michigan](/blog/garage-door-spring-repair-cost-michigan/). If you are weighing a full door swap, see [repair vs replace a garage door in Michigan](/blog/repair-vs-replace-garage-door-michigan/).",
          "The best way to get a real number is to shortlist local pros on [garage door repair in Michigan](/garage-door-repair/) — including [Detroit](/cities/detroit/garage-door-repair/) and [Grand Rapids](/cities/grand-rapids/garage-door-repair/) — and request quotes with photos or a clear description of the problem.",
        ],
      },
    ],
  },
  {
    slug: "garage-door-wont-open-winter-michigan",
    title: "Garage Door Won't Open in a Michigan Winter? Try This",
    description:
      "Troubleshooting steps for a garage door that won't open in freezing weather — plus when ice, sensors, or a broken spring mean you should call a pro.",
    date: "2026-03-18",
    readMinutes: 6,
    category: "Maintenance",
    sections: [
      {
        paragraphs: [
          "Cold snaps are hard on garage doors. Weather seals freeze to the floor, batteries weaken, and sensors get blocked by snow. Before you assume the opener is dead, run through a few safe checks — use our [fall garage door maintenance checklist](/blog/fall-garage-door-maintenance-checklist-michigan/) before the season starts, and keep the [winter garage door maintenance checklist](/blog/winter-garage-door-maintenance-checklist-michigan/) handy once freeze-thaw is in full swing.",
        ],
      },
      {
        heading: "Clear ice and snow from the seal and sensors",
        paragraphs: [
          "Gently break ice along the bottom weather seal. Wipe the photo-eye sensors near the floor — if their lights are blinking or out of alignment, the opener may refuse to close or act erratically.",
        ],
      },
      {
        heading: "Check the power and the wall button",
        paragraphs: [
          "Confirm the outlet has power and the opener isn't on a tripped GFCI. Try the wall control. If remotes fail but the wall button works, cold weather may have weakened remote batteries.",
        ],
      },
      {
        heading: "Look for a locked or disconnected trolley",
        paragraphs: [
          "Some doors have a lock or an emergency release cord. Make sure the door isn't manually locked and that the trolley is re-engaged after a power outage or manual operation.",
        ],
      },
      {
        heading: "When to stop and call a pro",
        paragraphs: [
          "If you heard a bang, the door is crooked, cables look frayed, or the opener strains without lifting, stop. Those symptoms often mean a broken spring or cable — not something to force. During outages, see [opener battery backup and power outages in Michigan](/blog/garage-door-opener-battery-backup-michigan/).",
          "Michigan Garage Pros can help you find [emergency garage door service](/emergency-service/) near your ZIP — try [Detroit emergency](/cities/detroit/emergency-service/), [Grand Rapids](/cities/grand-rapids/emergency-service/), or [Traverse City](/cities/traverse-city/emergency-service/) when the door has to move today.",
        ],
      },
    ],
  },
  {
    slug: "how-to-choose-garage-door-company-michigan",
    title: "How to Choose a Garage Door Company in Michigan",
    description:
      "A homeowner checklist for hiring a garage door company in Michigan: licensing basics, service area, warranties, and red flags to avoid.",
    date: "2026-03-26",
    readMinutes: 8,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "A good garage door company should be easy to compare: clear service area, transparent pricing process, and the skills for your specific issue — springs, openers, installation, or emergency repair.",
        ],
      },
      {
        heading: "Confirm they actually serve your city",
        paragraphs: [
          "Ask whether your ZIP is in their regular route. A company two hours away may take longer in winter weather and charge for travel. Start with [city pages](/cities/) like [Ann Arbor](/cities/ann-arbor/), [Detroit](/cities/detroit/), and [Grand Rapids](/cities/grand-rapids/) to scan coverage.",
        ],
      },
      {
        heading: "Match the company to the job",
        paragraphs: [
          "Spring replacement, opener programming, full door installation, and commercial doors are different skill sets. Look for service tags that match what you need, and ask about parts availability for your door brand.",
        ],
      },
      {
        heading: "Ask about warranty and what the visit includes",
        paragraphs: [
          "Clarify parts warranty, labor warranty, and whether balance testing, lubrication, or safety-reverse checks are included. Written estimates beat vague phone quotes.",
        ],
      },
      {
        heading: "Red flags",
        paragraphs: [
          "Be cautious with high-pressure 'today only' pricing, requests for full payment before work, or technicians who won't explain why a part failed. Reputable pros can describe the issue in plain language.",
          "Shopping a new insulated door or a brand like Clopay? Use our checklist of [questions to ask a garage door dealer in Michigan](/blog/questions-to-ask-garage-door-dealer-michigan/) before you sign.",
          "Shortlist two or three local companies on [Find Pros](/pros/), compare profiles, and [request quotes](/get-a-quote/) so you can decide with real options — not the first flyer on the door.",
          "If your job is specifically a new opener in West Michigan, read [garage door opener installation in Grand Rapids](/blog/garage-door-opener-installation-grand-rapids/) for drive-type tradeoffs and install-day questions before you book.",
        ],
      },
    ],
  },
  {
    slug: "emergency-garage-door-repair-michigan",
    title: "Emergency Garage Door Repair in Michigan: What to Do Next",
    description:
      "What counts as a garage door emergency, how to secure your home, and how to find same-day help across Michigan.",
    date: "2026-04-03",
    readMinutes: 5,
    category: "Emergency",
    sections: [
      {
        paragraphs: [
          "A door stuck open overnight, a snapped spring, or a door off its tracks is more than an inconvenience — it can be a security and safety problem. Here's a calm order of operations for Michigan homeowners.",
        ],
      },
      {
        heading: "Make the area safe",
        paragraphs: [
          "Keep people and pets away from a damaged door. Do not try to force a door with a broken spring. If the door is open and won't close, park elsewhere if you can and secure the entrance to the house from the garage.",
        ],
      },
      {
        heading: "Gather a few details before you call",
        paragraphs: [
          "Note whether you heard a bang, whether the door is crooked, your door type if you know it, and your ZIP code. Photos help pros bring the right springs or parts.",
        ],
      },
      {
        heading: "Look for emergency or same-day availability",
        paragraphs: [
          "Filter for companies that advertise emergency service and confirm after-hours rates up front. In Metro Detroit, Grand Rapids, and other larger markets you often have more same-day options; in Northern Michigan or the U.P., call early and ask about travel windows.",
        ],
      },
      {
        heading: "Use the directory to move faster",
        paragraphs: [
          "Start with your ZIP on [Find Pros](/pros/), open [emergency service](/emergency-service/) listings for [Detroit](/cities/detroit/emergency-service/) or [Grand Rapids](/cities/grand-rapids/emergency-service/), and call or [request a quote](/get-a-quote/). If you heard a bang, budget with [spring repair cost in Michigan](/blog/garage-door-spring-repair-cost-michigan/) once the door is safe.",
          "The goal is simple: get a qualified local tech on the way, then decide on permanent repairs once the door is safe again.",
        ],
      },
    ],
  },
  {
    slug: "garage-door-wont-open-or-close",
    title: "Garage Door Won't Open or Close? What to Check First",
    description:
      "A practical Michigan homeowner checklist when your garage door won't open or close — power, sensors, locks, springs — and when to stop and call a pro.",
    date: "2026-04-12",
    readMinutes: 8,
    category: "Repair",
    sections: [
      {
        paragraphs: [
          "A door that refuses to move is one of the most common calls Michigan homeowners make. The cause might be as simple as a misaligned sensor — or as serious as a broken spring. Work through safe checks first so you do not damage the opener or the door.",
          "If you already heard a loud bang, see a crooked door, or notice frayed cables, skip DIY troubleshooting and call a local repair company.",
        ],
      },
      {
        heading: "1. Confirm power and the wall control",
        paragraphs: [
          "Make sure the opener is plugged in and the outlet has power. Reset any tripped GFCI. Try the hard-wired wall button. If the wall button works but remotes do not, replace remote batteries before assuming the opener failed.",
        ],
      },
      {
        heading: "2. Check the photo-eye sensors",
        paragraphs: [
          "Near the floor on each track you will see small sensors. Wipe dirt, cobwebs, or snow off the lenses and make sure both lights are steady. If either light blinks, realign the brackets until both stay solid — a blocked beam often stops the door from closing.",
        ],
      },
      {
        heading: "3. Look for a lock or emergency release",
        paragraphs: [
          "Some doors have a sliding lock near the top center. Unlock it. Also check the red emergency release cord: after a power outage people sometimes leave the door disconnected from the trolley. Re-engage it per your opener’s instructions before testing again.",
        ],
      },
      {
        heading: "4. Test balance carefully (optional)",
        paragraphs: [
          "With the opener disconnected, try lifting the door halfway by hand. A healthy door should hold roughly mid-travel. If it feels extremely heavy or drops hard, the spring system is the problem — reconnect nothing and call a pro. Do not adjust torsion springs yourself.",
        ],
      },
      {
        heading: "5. Michigan-specific gotchas",
        paragraphs: [
          "In winter, weather seals freeze to the floor and sensors get buried in snow. In humid summers, warped tracks or sticky rollers show up after storms. For cold-weather specifics, see our guide to a [garage door that will not open in a Michigan winter](/blog/garage-door-wont-open-winter-michigan/).",
        ],
      },
      {
        heading: "When to call for repair",
        paragraphs: [
          "Call if the opener strains and the door does not move, the door is crooked, cables look damaged, or nothing changes after sensor and power checks. Browse [garage door repair](/garage-door-repair/) near your ZIP — including [Ann Arbor repair](/cities/ann-arbor/garage-door-repair/) — or [request a quote](/get-a-quote/) with a short description of what happens when you press the button.",
        ],
      },
    ],
  },
  {
    slug: "garage-door-off-track",
    title: "Garage Door Off Track: What It Means and What Not to Do",
    description:
      "Learn why garage doors leave their tracks, how to keep the area safe, and why forcing an off-track door usually makes a Michigan repair more expensive.",
    date: "2026-04-14",
    readMinutes: 7,
    category: "Repair",
    sections: [
      {
        paragraphs: [
          "An off-track door looks dramatic: rollers popped out, panels twisted, or one side hanging lower than the other. It is also one of the easiest repairs to make worse if you force the opener or try to hammer the door back into place.",
        ],
      },
      {
        heading: "Common causes",
        paragraphs: [
          "Bent tracks from vehicle impact, worn rollers, broken cables, or an unbalanced spring can pull a door out of alignment. Soft Michigan soil and settling garages sometimes contribute to track brackets shifting over years.",
        ],
      },
      {
        heading: "Make the area safe first",
        paragraphs: [
          "Unplug the opener or flip its breaker so nobody accidentally runs the motor. Keep kids, pets, and cars clear. If the door is partially open and unstable, do not stand underneath it.",
        ],
      },
      {
        heading: "What not to do",
        paragraphs: [
          "Do not keep hitting the remote. Do not pry panels with a crowbar. Do not loosen torsion springs. DIY “fixes” often crack panels or snap cables, turning a track repair into a full door replacement.",
        ],
      },
      {
        heading: "What a technician typically does",
        paragraphs: [
          "A pro will support the door, inspect rollers and cables, straighten or replace track sections, re-seat rollers, then rebalance and test the safety reverse. Ask them to check spring condition while they are there — an unbalanced door is a frequent root cause.",
        ],
      },
      {
        heading: "Getting help in Michigan",
        paragraphs: [
          "Search [garage door repair](/garage-door-repair/) companies that list track and spring work — try [Detroit](/cities/detroit/garage-door-repair/) or [Grand Rapids](/cities/grand-rapids/garage-door-repair/). Send photos of both tracks if you [request a quote](/get-a-quote/).",
        ],
      },
    ],
  },
  {
    slug: "garage-door-noisy-grinding-squeaking",
    title: "Noisy Garage Door? Grinding and Squeaking Explained",
    description:
      "Decode grinding, squeaking, and scraping garage door sounds — what you can lubricate safely, and which noises mean call a Michigan repair pro now.",
    date: "2026-04-16",
    readMinutes: 7,
    category: "Maintenance",
    sections: [
      {
        paragraphs: [
          "Garage doors should not sound like a freight train. New noises are useful diagnostics: metal-on-metal grinding often means worn rollers or dry hinges, while a sudden harsh grind during travel can signal a failing opener gear.",
        ],
      },
      {
        heading: "Squeaks vs scrapes vs grinds",
        paragraphs: [
          "Light squeaks on hinges or springs often respond to the right lubricant. Scraping usually means the door is rubbing a track or weather seal. Deep grinding from the motor head is different — that can be internal opener wear.",
        ],
      },
      {
        heading: "Safe DIY maintenance",
        paragraphs: [
          "Use a garage-door lubricant (not WD-40 as a long-term fix) on steel roller stems, hinges, and bearings as the manufacturer allows. Wipe excess so dust does not cake on. Do not spray inside the opener housing or soak nylon rollers that are designed to stay dry.",
        ],
      },
      {
        heading: "When noise means stop using the door",
        paragraphs: [
          "Stop and call a pro if you hear grinding plus vibration from the opener, popping from cables, or the door shakes violently in the tracks. Continuing to run a failing gear kit or frayed cable can leave you with a door that will not open at all.",
        ],
      },
      {
        heading: "Michigan climate note",
        paragraphs: [
          "Road salt, cold metal contraction, and dry winter air accelerate wear on rollers and hinges. A quick fall tune-up — lubrication, balance check, and hardware inspection — prevents a lot of January emergency calls.",
        ],
      },
      {
        heading: "Next step",
        paragraphs: [
          "If lubrication does not quiet the door within a day or two, browse [maintenance](/maintenance/) and [repair](/garage-door-repair/) companies — including [Ann Arbor](/cities/ann-arbor/maintenance/) — and describe the sound and when it happens (opening, closing, or mid-travel).",
        ],
      },
    ],
  },
  {
    slug: "garage-door-dent-panel-repair-or-replace",
    title: "Dented Garage Door Panels: Repair or Replace?",
    description:
      "How to decide whether a dented or damaged garage door panel can be repaired, sectionally replaced, or needs a full new door — with Michigan cost and curb-appeal context.",
    date: "2026-04-18",
    readMinutes: 8,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "Basketball hits, bike handlebars, and bumper taps leave dents that bother homeowners as much for looks as for function. Not every dent requires a whole new door — but some damage is structural.",
        ],
      },
      {
        heading: "Cosmetic dents vs structural damage",
        paragraphs: [
          "A shallow dent on a single panel that still seals and travels smoothly is often cosmetic. Cracked paint that invites rust, creased steel that binds in the track, or a panel that no longer sits flush with neighbors is a bigger job.",
        ],
      },
      {
        heading: "Sectional doors can sometimes swap one panel",
        paragraphs: [
          "Many Michigan homes use sectional doors. If your model is still produced, a tech may replace only the damaged section. Older or discontinued styles may not match, which pushes you toward a full replacement for appearance.",
        ],
      },
      {
        heading: "When full replacement makes more sense",
        paragraphs: [
          "Consider a new door if insulation is outdated, multiple panels are damaged, the door is single-layer steel rusting through, or you were already planning a curb-appeal upgrade. Pairing a new door with an opener refresh can be efficient if both are aging.",
        ],
      },
      {
        heading: "Insurance and storm damage",
        paragraphs: [
          "Wind, hail, and vehicle impact may be insurance claims. Photograph damage before repairs, and ask the company for an itemized estimate that separates panel work from hardware or opener upgrades.",
        ],
      },
      {
        heading: "Get comparable local options",
        paragraphs: [
          "For a fuller decision framework, read [repair vs replace a garage door in Michigan](/blog/repair-vs-replace-garage-door-michigan/). Shortlist [installation](/garage-door-installation/) and [repair](/garage-door-repair/) companies that serve your city — such as [Detroit installation](/cities/detroit/garage-door-installation/) — share photos, and ask for repair-vs-replace recommendations in writing. Or [start a quote](/get-a-quote/).",
        ],
      },
    ],
  },
  {
    slug: "garage-door-reverses-before-closing",
    title: "Garage Door Reverses Before Closing? Fix the Real Cause",
    description:
      "Why garage doors reverse before they hit the floor — photo eyes, force settings, binding tracks — and how Michigan homeowners can troubleshoot safely.",
    date: "2026-04-20",
    readMinutes: 7,
    category: "Repair",
    sections: [
      {
        paragraphs: [
          "If your door goes down, then backs up before touching the ground, the opener thinks it hit an obstacle or lost the sensor beam. That safety behavior is good — but it is frustrating when nothing is in the way.",
        ],
      },
      {
        heading: "Start with the photo eyes",
        paragraphs: [
          "Clean both sensor lenses and confirm they face each other with steady indicator lights. Sun glare in late afternoon, spider webs, and snow buildup are common Michigan triggers. Temporarily shade the sensors while testing if bright light seems to be the issue.",
        ],
      },
      {
        heading: "Look for binding or uneven travel",
        paragraphs: [
          "A door that sticks in the tracks can trip the opener’s force sensor. Watch both sides as it closes. Scraping sounds, a tilted top section, or a weather seal catching on an uneven floor slab are clues.",
        ],
      },
      {
        heading: "Be careful with force and limit settings",
        paragraphs: [
          "Openers have travel limits and force adjustments. Turning force up to “fix” a reverse can hide a broken spring or binding door and creates a safety risk. If basic sensor cleaning does not help, have a technician set limits and test the safety reverse with a board on the floor.",
        ],
      },
      {
        heading: "Other frequent causes",
        paragraphs: [
          "Loose sensor wires, a failing logic board, worn rollers, or an unbalanced spring can all cause nuisance reversing. After a power outage, some openers need a limit reset.",
        ],
      },
      {
        heading: "Get it fixed properly",
        paragraphs: [
          "If the door still reverses after sensor cleaning and visual checks, browse [opener repair](/garage-door-openers/) near you — including [Grand Rapids openers](/cities/grand-rapids/garage-door-openers/) — or [request a quote](/get-a-quote/). Mention whether the reverse happens every time or only at certain times of day.",
        ],
      },
    ],
  },
  {
    slug: "garage-door-rollers-cables-hinges-wear",
    title: "Worn Garage Door Rollers, Cables, and Hinges: Catch It Early",
    description:
      "How to spot worn rollers, frayed cables, and loose hinges on a garage door — plus why replacing hardware early prevents Michigan emergency breakdowns.",
    date: "2026-04-22",
    readMinutes: 8,
    category: "Maintenance",
    sections: [
      {
        paragraphs: [
          "Hardware wear is quiet until it is not. Plastic rollers flat-spot, cables fray strand by strand, and hinges loosen until the door shakes through every cycle. Catching these parts early is cheaper than replacing a damaged panel or opener.",
        ],
      },
      {
        heading: "Rollers",
        paragraphs: [
          "Steel rollers with ball bearings last longer than basic nylon rollers, but all of them wear. Look for cracked wheels, flat spots, or rollers that barely turn. Rumbling in the tracks is a classic sign. Upgrading rollers during a tune-up is a common, high-value maintenance job.",
        ],
      },
      {
        heading: "Cables",
        paragraphs: [
          "Lift cables should sit neatly on the drums. Fraying, rust rust-through, or a cable off the drum is urgent — stop using the door. Cable failure can drop a door or bend the shaft. Cable work pairs with spring service; do not attempt it without proper tools and training.",
        ],
      },
      {
        heading: "Hinges and brackets",
        paragraphs: [
          "Center and end hinges take constant stress. Bent hinges, missing fasteners, or elongated bolt holes mean the door sections are shifting. Tighten only hardware that is meant to be adjusted; if holes are wallowed out, replace the hinge.",
        ],
      },
      {
        heading: "A simple seasonal inspection",
        paragraphs: [
          "Twice a year — before winter and after — look at cables from a safe distance, listen for new noise, and note any screws on the floor (a hint that hardware is backing out). Add lubrication where appropriate and schedule a professional tune-up if the door is over five years old and has never been serviced.",
        ],
      },
      {
        heading: "Find maintenance help",
        paragraphs: [
          "Search Michigan Garage Pros for [maintenance](/maintenance/) or [repair](/garage-door-repair/) in your city — try [Traverse City maintenance](/cities/traverse-city/maintenance/) or [Detroit repair](/cities/detroit/garage-door-repair/). Ask for a safety inspection that includes rollers, cables, springs, and the reverse test.",
        ],
      },
    ],
  },
  {
    slug: "fall-garage-door-maintenance-checklist-michigan",
    title: "Fall Garage Door Maintenance Checklist for Michigan",
    description:
      "A practical fall checklist for Michigan garage doors — weather seals, lubrication, balance, sensors, and opener battery backup — before freeze-thaw season hits.",
    date: "2026-09-04",
    readMinutes: 7,
    category: "Maintenance",
    sections: [
      {
        paragraphs: [
          "Michigan winters punish neglected garage doors. Weather seals freeze to the slab, batteries weaken, and worn springs snap on the first hard cold snap. A short fall tune-up is cheaper than a January [emergency service](/emergency-service/) call — and it keeps the door quieter and safer through freeze-thaw season.",
          "Use this checklist at home for the safe items, then book [garage door maintenance](/maintenance/) for springs, cables, and balance if anything feels heavy, crooked, or noisy.",
        ],
      },
      {
        heading: "1. Clean and check the weather seal",
        paragraphs: [
          "Inspect the bottom rubber seal for cracks, flattening, or gaps that let in drafts and road salt. Wipe dirt off so ice has less to grab. If the seal is torn or hard, plan a replacement before deep winter — a tight seal also helps attached-garage energy loss.",
        ],
      },
      {
        heading: "2. Clear the tracks and photo-eye sensors",
        paragraphs: [
          "Wipe both tracks with a dry cloth (do not grease the tracks themselves). Clean the photo-eye lenses near the floor and confirm both indicator lights stay steady. Misaligned sensors are a top reason doors reverse or refuse to close after the first snow.",
        ],
      },
      {
        heading: "3. Lubricate hinges, rollers, and springs — safely",
        paragraphs: [
          "Use a garage-door lubricant on steel roller stems, hinges, and bearings as the manufacturer allows. Wipe excess so dust does not cake on. Do not spray inside the opener housing or soak nylon rollers designed to stay dry. Skip DIY torsion-spring adjustments entirely.",
        ],
      },
      {
        heading: "4. Test balance and listen for new noise",
        paragraphs: [
          "With the opener disconnected, lift the door halfway by hand. A healthy door should hold roughly mid-travel. If it feels extremely heavy or drops hard, stop and schedule [broken spring repair](/broken-springs/) — do not force the opener. New grinding or squeaking after summer heat is a cue to check [rollers, cables, and hinges](/blog/garage-door-rollers-cables-hinges-wear/) before winter cycles them harder.",
        ],
      },
      {
        heading: "5. Confirm opener backup and remotes",
        paragraphs: [
          "If your opener has a battery backup, check the status light and replace aging batteries before storm season. Swap remote and keypad batteries too — cold kills them fast. For units that reverse randomly or strain mid-travel, browse [opener repair](/garage-door-openers/) rather than turning force settings up.",
        ],
      },
      {
        heading: "6. Walk the hardware once more",
        paragraphs: [
          "From a safe distance, look for frayed cables, loose hinge on the floor, bent hinges, or a door that sits crooked in the opening. Any of those symptoms mean [garage door repair](/garage-door-repair/) before the first polar vortex — not after the door is stuck open overnight.",
        ],
      },
      {
        heading: "When to call a Michigan pro this fall",
        paragraphs: [
          "DIY covers cleaning, lubrication, and visual checks. Leave springs, cables, off-track doors, and opener logic-board work to trained technicians. Once freeze-thaw starts, keep our [winter garage door maintenance checklist](/blog/winter-garage-door-maintenance-checklist-michigan/) nearby. Compare local options on city pages like [Detroit maintenance](/cities/detroit/maintenance/), [Grand Rapids maintenance](/cities/grand-rapids/maintenance/), [Ann Arbor](/cities/ann-arbor/maintenance/), and [Traverse City](/cities/traverse-city/maintenance/), or [request a free quote](/get-a-quote/) with your ZIP and a short note about what you noticed.",
        ],
      },
    ],
    faqs: [
      {
        question: "When should Michigan homeowners service a garage door before winter?",
        answer:
          "September through early November is ideal — after summer heat and before consistent freezes — so seals, batteries, and balance issues get fixed while parts and scheduling are still easy.",
      },
      {
        question: "Can I lubricate garage door springs myself?",
        answer:
          "Light exterior lubrication on accessible spring surfaces is sometimes fine per manufacturer guidance, but never wind, unwind, or remove torsion springs yourself. Stored energy can cause serious injury.",
      },
      {
        question: "What fall maintenance prevents a door that will not open in winter?",
        answer:
          "A healthy weather seal, clean sensors, fresh opener/remote batteries, and a balance check prevent many cold-weather no-open calls. See also our guide to a garage door that will not open in a Michigan winter.",
      },
    ],
  },
  {
    slug: "garage-door-spring-repair-cost-michigan",
    title: "Garage Door Spring Repair Cost in Michigan",
    description:
      "What Michigan homeowners typically pay for torsion and extension spring replacement, what drives the price, and how to compare local quotes without DIY risk.",
    date: "2026-09-08",
    readMinutes: 9,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "Broken garage door springs are one of the most searched repairs in Michigan — especially after the first hard freeze. Homeowners want a planning number before they call, but spring jobs are not one flat price. Door weight, spring type, pair vs single replacement, and same-day urgency all change the invoice.",
          "Use the ranges below as budgeting context, then compare real quotes from local pros on [broken spring repair](/broken-springs/). Exact pricing belongs on a written estimate for your door — not a national average pulled from another climate.",
        ],
      },
      {
        heading: "Typical Michigan spring repair ranges",
        paragraphs: [
          "Residential torsion spring replacement (the most common setup on the shaft above the door) often lands in a mid-hundreds planning range for a standard single-car or light double-car door when both springs are addressed as a matched pair. Heavier insulated doors, commercial-grade cycle ratings, or uncommon wire sizes push higher.",
          "Extension springs (mounted along the horizontal tracks) can price differently per side. If one side failed, techs usually recommend replacing both so the door stays balanced. Trip or diagnostic fees, after-hours emergency rates, and cable or drum work done in the same visit add to the total — ask whether the trip fee applies toward the repair.",
          "These are planning bands, not quotes. A lightweight older door in Lansing will not price like a tall insulated door in a Metro Detroit subdivision, and a midnight emergency call will not match a Tuesday morning appointment.",
        ],
      },
      {
        heading: "Torsion vs extension: why the invoice looks different",
        paragraphs: [
          "Torsion systems store energy in springs wound on a center shaft. Replacement requires specialty winding bars, correct wire size, and careful balancing. Extension systems use stretch springs with safety cables; parts and labor patterns differ, and missing safety cables are a red flag you should insist on correcting.",
          "If you are not sure which system you have, a photo of the shaft above the door (torsion) versus springs along the tracks (extension) helps a pro quote before they arrive. Never touch a wound torsion spring yourself.",
        ],
      },
      {
        heading: "What drives the price up or down",
        paragraphs: [
          "Door weight and height matter most: a tall double insulated door needs heavier springs than a lightweight single-layer door. High-cycle springs cost more upfront but last longer for households that open the door many times per day — useful for busy families and attached-garage homes that treat the door like a front entrance.",
          "Metro markets like [Detroit](/cities/detroit/broken-springs/) and [Grand Rapids](/cities/grand-rapids/broken-springs/) often have more same-day competition. Ann Arbor and Oakland County routes are typically well covered; Northern Michigan routes — including [Traverse City](/cities/traverse-city/broken-springs/) — may include travel time. Weekend or midnight emergency visits cost more than weekday appointments.",
          "Related hardware changes the number too. Frayed lift cables, worn drums, or bent bearing plates discovered during spring work should be priced as line items so you can approve them instead of getting a surprise total at the truck.",
        ],
      },
      {
        heading: "Why “replace both” is usually the right call",
        paragraphs: [
          "Torsion springs wear together. Replacing only the broken one leaves a tired spring on the other side that often fails weeks or months later — meaning a second service call, second trip fee, and another day with an unreliable door.",
          "Ask every quote whether parts and labor assume a matched pair, what cycle rating is proposed, and whether cables and drums are inspected in the same visit. A slightly higher pair quote is usually cheaper than two separate emergencies.",
        ],
      },
      {
        heading: "Do not DIY torsion springs",
        paragraphs: [
          "Wound torsion springs store dangerous energy. Homeowner attempts with locking pliers and YouTube shortcuts cause serious injuries every year. If you heard a bang, the door is extremely heavy, or it will not stay mid-travel when disconnected from the opener, stop using the motor and call a trained tech.",
          "Warning signs before a full break — door feeling heavy, uneven travel, visible coil gaps — are covered in [7 signs your garage door spring is failing](/blog/broken-garage-door-spring-signs/). Catching wear early can turn an emergency night call into a scheduled weekday repair.",
        ],
      },
      {
        heading: "How to compare spring quotes fairly",
        paragraphs: [
          "Ask each company for spring type, cycle rating, whether both sides are included, warranty length on parts and labor, and whether balance testing and lubrication are in the price. Photos of the end bearing plates, door width/height, and the broken spring help pros arrive with the right parts.",
          "For broader repair budgeting context, see [garage door repair cost in Michigan](/blog/garage-door-repair-cost-michigan/). If the door panels are failing too, read [repair vs replace](/blog/repair-vs-replace-garage-door-michigan/) before you approve stacked hardware invoices.",
          "Shortlist [broken springs](/broken-springs/) companies near you — including [Ann Arbor](/cities/ann-arbor/broken-springs/), [Detroit](/cities/detroit/broken-springs/), [Grand Rapids](/cities/grand-rapids/broken-springs/), and [Traverse City](/cities/traverse-city/broken-springs/) — or [request a free quote](/get-a-quote/) with your ZIP and a note that you heard a bang or the door will not lift.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does it cost to replace a garage door spring in Michigan?",
        answer:
          "Most residential torsion jobs fall in a mid-hundreds planning range when a matched pair is replaced on a standard door, but heavy doors, emergency timing, and extra hardware raise the total. Get local written quotes for your door.",
      },
      {
        question: "Should I replace one spring or both?",
        answer:
          "Replace both torsion springs as a matched pair in almost every case. The surviving spring is usually near end-of-life and failing soon after a one-sided repair is common.",
      },
      {
        question: "Is spring repair cheaper than a new garage door?",
        answer:
          "Usually yes when panels and tracks are still sound. If the door is rusted, poorly insulated, and needs multiple structural repairs, compare against a full replacement using our repair-vs-replace guide.",
      },
    ],
  },
  {
    slug: "repair-vs-replace-garage-door-michigan",
    title: "Repair vs Replace a Garage Door in Michigan",
    description:
      "A practical Michigan guide to when garage door repair still makes sense — and when a full insulated replacement is the better long-term value.",
    date: "2026-09-09",
    readMinutes: 10,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "Michigan homeowners hit this fork often: a dented panel after a parking scrape, a door that still works but barely seals against January wind, or a spring-and-opener invoice that approaches the cost of a new insulated door. Repair is usually right for isolated failures. Replacement wins when the door itself is at end-of-life.",
          "This guide helps you sort the decision before you [request quotes](/get-a-quote/) from local [repair](/garage-door-repair/) and [installation](/garage-door-installation/) companies — and before you approve a stack of short-term fixes on a door that will not last another winter.",
        ],
      },
      {
        heading: "Repair usually wins when…",
        paragraphs: [
          "A single broken spring pair, frayed cables, worn rollers, a misaligned track, or an opener logic-board failure on an otherwise solid door are classic repair jobs. If panels are straight, the door seals reasonably well, and you like the look, fixing hardware is almost always cheaper than ripping everything out.",
          "Cosmetic dents on one sectional panel can sometimes be section-swapped if the model is still produced — details in our [dented panel repair-or-replace](/blog/garage-door-dent-panel-repair-or-replace/) guide. A quiet door with good insulation and one mechanical failure is not a reason to buy a whole new unit.",
        ],
      },
      {
        heading: "Replacement usually wins when…",
        paragraphs: [
          "Consider a new door if you have multiple rusted or cracked panels, outdated single-layer steel that sweats and freezes, sections that no longer match after prior repairs, or insulation so poor that the attached garage stays cold all winter. Pairing a new door with a modern opener (ideally with battery backup) can be efficient if both are aging.",
          "Storm or vehicle damage that bends the frame or racks the entire door often exceeds sensible repair cost — ask for an itemized repair-vs-replace estimate for insurance, with photos taken before anything is removed.",
          "Another signal: you have paid for springs, cables, and rollers in the last couple of years and the panels are still failing. At that point you are maintaining a door that no longer earns the next repair.",
        ],
      },
      {
        heading: "Michigan climate tips the scale",
        paragraphs: [
          "Freeze-thaw cycles punish thin doors and worn weather seals. If you already budget for repeated winter emergency visits, a tighter insulated door can reduce draft complaints and opener strain. Road salt accelerates hardware corrosion on lakeshore and Metro Detroit corridors — factor remaining life of tracks and hinges into the math, not just panel paint.",
          "Homes with living space above or beside the garage feel insulation upgrades immediately. Homes with detached garages may prioritize durability and wind resistance over R-value — say which situation you have when you request bids.",
        ],
      },
      {
        heading: "Cost framing without fake price tags",
        paragraphs: [
          "Spring-only repairs are typically a fraction of a full door project — see [spring repair cost in Michigan](/blog/garage-door-spring-repair-cost-michigan/) for that lane. Full replacement spans a wide range based on insulation, windows, color, removal of the old door, and whether the opener is included.",
          "Ask every bid to separate door, labor, disposal, and opener line items so you can compare apples to apples. A low door price that omits springs, tracks, or haul-away is not a bargain. Likewise, a repair quote that stacks every optional upgrade without explaining necessity deserves a second opinion.",
        ],
      },
      {
        heading: "A simple decision checklist",
        paragraphs: [
          "1) Is the failure limited to springs, cables, rollers, sensors, or the opener? Lean repair. 2) Are multiple panels rusted, delaminated, or mismatched? Lean replace. 3) Does the door fight every winter despite recent hardware work? Lean replace. 4) Do you need curb appeal or insulation for a listing or remodel timeline? Often replace. 5) Is insurance involved after impact or storm damage? Get both options in writing.",
        ],
      },
      {
        heading: "Questions to ask before you decide",
        paragraphs: [
          "Will repaired parts outlast a tired door skin? Is the model still available for panel matches? What warranty applies to a full install vs a repair? If you are shopping brands through a dealer, bring our [dealer questions checklist](/blog/questions-to-ask-garage-door-dealer-michigan/).",
          "Compare local options on [garage door repair](/garage-door-repair/) and [new door installation](/garage-door-installation/) — including [Detroit](/cities/detroit/garage-door-installation/), [Grand Rapids](/cities/grand-rapids/garage-door-installation/), [Ann Arbor](/cities/ann-arbor/garage-door-repair/), and [Traverse City](/cities/traverse-city/garage-door-installation/) — and ask each pro for a written repair-vs-replace recommendation with photos attached.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is it cheaper to repair or replace a garage door in Michigan?",
        answer:
          "Isolated spring, cable, roller, or opener failures are almost always cheaper to repair. Full replacement makes more sense when panels are failing, insulation is outdated, or multiple structural issues stack up.",
      },
      {
        question: "Should I replace the opener when I replace the door?",
        answer:
          "Not always required, but pairing a new door with a modern opener and battery backup is common if the opener is noisy, slow, or lacks backup for winter outages.",
      },
      {
        question: "Can one dented panel be replaced without a full door?",
        answer:
          "Sometimes, if your sectional model is still produced and color-matched. Discontinued styles often look mismatched, which pushes homeowners toward a full door.",
      },
    ],
  },
  {
    slug: "winter-garage-door-maintenance-checklist-michigan",
    title: "Winter Garage Door Maintenance Checklist for Michigan",
    description:
      "A mid-winter Michigan checklist for garage doors — ice, seals, sensors, batteries, and safe balance checks — plus when to call a pro instead of forcing the opener.",
    date: "2026-09-10",
    readMinutes: 9,
    category: "Maintenance",
    sections: [
      {
        paragraphs: [
          "Fall tune-ups prevent problems; winter checklists keep a door usable through polar vortex weeks. Michigan freeze-thaw, lake-effect snow, and road salt create a predictable failure pattern: seals stick, sensors blind, batteries die, and worn springs snap on the coldest mornings.",
          "Work through the safe items below. For preseason prep, use the [fall garage door maintenance checklist](/blog/fall-garage-door-maintenance-checklist-michigan/). If the door already will not move, see [garage door won't open in a Michigan winter](/blog/garage-door-wont-open-winter-michigan/).",
          "Treat this as a monthly mid-winter walkaround, not a one-time January chore. After each major storm or polar vortex, sensors and seals deserve a two-minute check before you assume the opener failed.",
        ],
      },
      {
        heading: "1. Break ice on the weather seal — gently",
        paragraphs: [
          "If the bottom rubber is frozen to the slab, do not run the opener to rip it free — that is how seals tear and openers strain. Crack ice along the seal with care, clear snow from the threshold, and check for tears that let drafts and salt into an attached garage.",
          "A flattened or split seal is worth replacing mid-season if warm spells allow a short service visit. Waiting until March often means weeks of drafts and more ice bonding every night.",
        ],
      },
      {
        heading: "2. Keep photo eyes clear after every storm",
        paragraphs: [
          "Wipe lenses and confirm both indicator lights stay steady. Snow piles, ice chunks, and bright low winter sun can make the door reverse or refuse to close. Realign brackets only if you can do so without bending tracks.",
          "If the door reverses with clean sensors, do not crank force settings higher to “muscle through” ice. That hides binding or spring problems and creates a safety risk — see [door reverses before closing](/blog/garage-door-reverses-before-closing/).",
        ],
      },
      {
        heading: "3. Treat batteries as winter wear parts",
        paragraphs: [
          "Cold kills remote, keypad, and opener backup batteries. Swap weak cells before a storm if the wall button works but remotes fail. If your opener supports battery backup, verify the status light — details in [opener battery backup and power outages](/blog/garage-door-opener-battery-backup-michigan/).",
          "Keep a spare 3V remote battery in a warm drawer inside the house. Michigan homeowners lose more mornings to dead remotes than to failed motors.",
        ],
      },
      {
        heading: "4. Listen for strain and test balance carefully",
        paragraphs: [
          "An opener that sounds labored in deep cold may be fighting a binding door or a tired spring — not just “cold grease.” With the opener disconnected, a healthy door should hold roughly halfway. If it feels extremely heavy or drops hard, stop and schedule [broken spring repair](/broken-springs/); do not increase force settings to compensate.",
          "New grinding or scraping after a thaw-refreeze cycle can mean rollers binding with salt and grit. Safe lubrication tips live in our [noisy door guide](/blog/garage-door-noisy-grinding-squeaking/); cable and spring work stays with pros.",
        ],
      },
      {
        heading: "5. Spot salt and hardware wear mid-season",
        paragraphs: [
          "Look from a safe distance for frayed cables, rollers that no longer turn, and hinges white with corrosion. Mid-winter lubrication on steel roller stems and hinges (per manufacturer guidance) can quiet squeaks; leave cable and spring work to technicians.",
          "More on catching wear early: [rollers, cables, and hinges](/blog/garage-door-rollers-cables-hinges-wear/). A mid-winter hardware tune-up is cheaper than a door that will not close during a February ice storm.",
        ],
      },
      {
        heading: "6. Plan for outages and stuck-open nights",
        paragraphs: [
          "Know how to use the emergency release and how to re-engage the trolley afterward. If the door is stuck open overnight, treat it as a security issue: move cars if you can, secure the house entry from the garage, and look for [emergency service](/emergency-service/) rather than waiting for a weekday special.",
          "If the outage is the problem rather than ice, confirm battery backup status and wall-button power before calling it an opener failure.",
        ],
      },
      {
        heading: "7. Know when to stop DIY",
        paragraphs: [
          "Call for [garage door repair](/garage-door-repair/) if you heard a bang, the door is crooked, cables look damaged, or cleaning sensors and seals changed nothing. Compare [Detroit repair](/cities/detroit/garage-door-repair/), [Grand Rapids](/cities/grand-rapids/garage-door-repair/), [Ann Arbor maintenance](/cities/ann-arbor/maintenance/), and [Traverse City](/cities/traverse-city/maintenance/), or [request a quote](/get-a-quote/) with your ZIP and what changed after the last cold snap.",
          "When you call or quote, mention outdoor temperature, whether you heard a bang, and whether the wall button differs from remotes — those details help techs bring springs, batteries, or sensor parts on the first visit.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I lubricate my garage door in winter?",
        answer:
          "Light garage-door lubricant on hinges and steel roller stems can help in dry cold. Do not grease the tracks themselves, and never adjust torsion springs DIY.",
      },
      {
        question: "Why does my garage door reverse only in winter?",
        answer:
          "Snow-blocked sensors, ice on the weather seal, and binding rollers are common causes. Clean sensors first; if it continues, have a tech check balance and travel limits.",
      },
      {
        question: "Is winter a bad time to replace a garage door in Michigan?",
        answer:
          "Installs still happen year-round, but extreme cold can delay non-emergency projects. Emergency spring and opener repairs should not wait if the door is unsafe.",
      },
    ],
  },
  {
    slug: "garage-door-opener-battery-backup-michigan",
    title: "Garage Door Opener Battery Backup for Michigan Power Outages",
    description:
      "Why Michigan homeowners want garage door opener battery backup, what to check before the next outage, and when to repair vs replace an aging opener.",
    date: "2026-09-11",
    readMinutes: 8,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "Ice storms and summer thunderstorms knock out power across Michigan often enough that a dead opener is a security and convenience problem — especially when the only car is stuck inside. Battery backup on a modern opener lets you open or close the door a limited number of times without grid power.",
          "If you are already troubleshooting a door that will not move in the cold, pair this guide with [winter open failures](/blog/garage-door-wont-open-winter-michigan/) and [opener repair listings](/garage-door-openers/). Backup power helps only when the door itself is balanced and safe to move.",
          "Metro Detroit, Grand Rapids, and lakeshore communities see outage clusters during ice storms; rural northern routes can stay dark longer. Planning backup before the forecast is easier than learning the release cord by phone flashlight.",
        ],
      },
      {
        heading: "What battery backup actually does",
        paragraphs: [
          "When utility power drops, a charged backup battery supplies the motor for a handful of cycles. It is not infinite runtime — heavy doors and weak batteries reduce capacity. After power returns, the unit should recharge; a failing battery shows as short backup life or warning lights on the opener head.",
          "Think of backup as a bridge through an outage, not a substitute for a generator. If you expect multi-day outages in rural or northern areas, still know the manual release procedure and keep the path to the release cord clear.",
        ],
      },
      {
        heading: "Quick checks before the next outage",
        paragraphs: [
          "Know where your emergency release cord is and how to re-engage the trolley afterward. Test the wall button on utility power monthly. If your model has a battery status LED, glance at it in the fall and again mid-winter. Store a flashlight in the garage so you are not searching for the release in the dark.",
          "Label the breaker that feeds the opener. Homeowners sometimes assume an outage when a GFCI or garage circuit tripped after a storm. Confirm utility vs circuit issues before you declare the opener dead.",
        ],
      },
      {
        heading: "Add-on kits vs replacing the opener",
        paragraphs: [
          "If the motor and rails are sound but the unit lacks backup, some models accept an add-on battery kit — ask a tech for your brand and rail type. If the opener is noisy, slow, uses an obsolete logic board, or needs repeated gear repairs, a new belt-drive unit with built-in backup is often the cleaner path.",
          "Pairing opener replacement with a door upgrade can make sense when both are aging — see [repair vs replace a garage door](/blog/repair-vs-replace-garage-door-michigan/). If only the opener is failing and the door is solid, a standalone opener job is usually enough.",
          "Ask quotes to list battery part numbers, expected cycle count on backup, and labor warranty separately from the opener motor so you can compare kits against full replacements fairly.",
        ],
      },
      {
        heading: "Safety notes Michigan homeowners miss",
        paragraphs: [
          "Manual operation with a broken spring is dangerous — backup power will not fix an unbalanced door, and neither will yanking the release if the door is extremely heavy. Photo eyes still need to work; a door that reverses with power will reverse on battery too.",
          "After any outage, confirm travel limits and the safety reverse still behave correctly. Some units need a limit refresh after prolonged power loss. If the door feels wrong after the outage, schedule [opener](/garage-door-openers/) or [repair](/garage-door-repair/) service instead of forcing cycles.",
        ],
      },
      {
        heading: "Find opener help near you",
        paragraphs: [
          "Browse [garage door openers](/garage-door-openers/) companies serving your ZIP — including [Detroit](/cities/detroit/garage-door-openers/), [Grand Rapids](/cities/grand-rapids/garage-door-openers/), [Ann Arbor](/cities/ann-arbor/garage-door-openers/), and [Traverse City](/cities/traverse-city/garage-door-openers/). Mention your opener brand, whether you want battery backup, and if the door already feels heavy.",
          "Planning a full opener swap in West Michigan? See [garage door opener installation in Grand Rapids](/blog/garage-door-opener-installation-grand-rapids/) for cost ranges, drive types, and what a clean install visit includes.",
          "Or [request a free quote](/get-a-quote/) with photos of the opener head and a note about recent outages or warning lights. Keep our [winter maintenance checklist](/blog/winter-garage-door-maintenance-checklist-michigan/) handy so ice and sensors are ruled out before you replace hardware.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do all garage door openers have battery backup?",
        answer:
          "No. Many older units lack it. Newer models often include backup or offer a kit. Ask a local opener tech what fits your rail and door weight.",
      },
      {
        question: "How long does opener battery backup last in an outage?",
        answer:
          "Typically a limited number of open/close cycles — not days of continuous use. Capacity drops in extreme cold and as the battery ages.",
      },
      {
        question: "Can I open my garage door manually during a power outage?",
        answer:
          "Yes, using the emergency release — but only if the springs are healthy. A door with a broken spring can be extremely heavy or unsafe to lift by hand.",
      },
    ],
  },
  {
    slug: "questions-to-ask-garage-door-dealer-michigan",
    title: "Questions to Ask a Garage Door Dealer in Michigan",
    description:
      "What to ask before buying a new garage door in Michigan — insulation, wind rating, warranties, Clopay and other brands, install details, and red flags.",
    date: "2026-09-12",
    readMinutes: 9,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "A new garage door is a big curb-appeal and energy decision. Whether you are talking to a Clopay dealer, another major brand showroom, or a local installer who sources multiple lines, the right questions separate a clear proposal from a vague sales pitch.",
          "Use this checklist alongside [repair vs replace](/blog/repair-vs-replace-garage-door-michigan/) and [how to choose a garage door company](/blog/how-to-choose-garage-door-company-michigan/). Michigan Garage Pros is a directory — we help you compare local installers; we do not sell doors ourselves.",
          "Bring door width and height, photos of the opening, and notes about insulation goals so every dealer is pricing the same job.",
        ],
      },
      {
        heading: "Insulation and Michigan winters",
        paragraphs: [
          "Ask for the door’s insulation rating and whether the bid includes a full perimeter weather seal. For attached garages, insulation and seal quality matter as much as panel style. Confirm how the door handles freeze-thaw floors — bottom seals should be replaceable later without buying a whole door.",
          "If you park in an attached garage under living space, say so. Dealers sometimes default to mid-grade insulation that underperforms for Michigan winters when a higher-spec door is only a modest step up.",
        ],
      },
      {
        heading: "Brand, model, and what “Clopay” (or any brand) includes",
        paragraphs: [
          "Brand names are product families, not install quality by themselves. Ask which exact model and color are quoted, whether windows are included, lead times for your color, and who honors the manufacturer warranty locally if something fails after a year.",
          "Clopay and other major brands offer many insulation and style tiers. A “Clopay door” quote without a model number is incomplete. Request the brochure page or spec sheet that matches the bid, including R-value or U-factor language the manufacturer publishes.",
          "If a dealer pushes a house brand instead, ask for the same insulation and warranty terms in writing so you can compare construction — not just the logo on the brochure.",
        ],
      },
      {
        heading: "Hardware, springs, and opener scope",
        paragraphs: [
          "Does the bid include high-cycle springs, new rollers, track adjustments, and disposal of the old door? Is an opener included, optional, or assumed existing? If you want battery backup for outages, say so up front — see [opener battery backup](/blog/garage-door-opener-battery-backup-michigan/).",
          "Clarify whether existing tracks are reused or replaced. Reusing bent or corroded tracks to save money often creates noisy travel and callbacks after install.",
        ],
      },
      {
        heading: "Install day and site conditions",
        paragraphs: [
          "Ask how long the install usually takes, whether you need to clear the garage, and how they handle out-of-square openings common in older Michigan homes. Get in writing what happens if framing repairs are needed once the old door is off.",
          "Winter installs are common but weather can delay non-emergency projects. Ask about scheduling flexibility if temperatures plunge mid-week.",
        ],
      },
      {
        heading: "Warranty, paperwork, and red flags",
        paragraphs: [
          "Separate manufacturer panel warranty from installer labor warranty. Ask what voids coverage (DIY painting, neglected maintenance, impact). Keep the model number and warranty packet after install.",
          "Be cautious with pressure to decide “today only,” large cash-only deposits before materials are ordered, or bids that refuse to itemize door vs labor vs opener. Reputable dealers can explain options in plain language and leave you a written quote to compare.",
        ],
      },
      {
        heading: "Compare installers on the directory",
        paragraphs: [
          "Shortlist [garage door installation](/garage-door-installation/) companies — including [Detroit](/cities/detroit/garage-door-installation/), [Grand Rapids](/cities/grand-rapids/garage-door-installation/), [Ann Arbor](/cities/ann-arbor/garage-door-installation/), and [Traverse City](/cities/traverse-city/garage-door-installation/) — and ask each for the same model spec so quotes are comparable.",
          "Or [start a quote](/get-a-quote/) with door width/height, insulation preference, and whether an opener with battery backup should be included. Compare at least two written proposals before you lock a date.",
          "For spring-only repairs on a door you are keeping, use [spring repair cost](/blog/garage-door-spring-repair-cost-michigan/) instead of a full dealer install quote.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Clopay a good garage door brand for Michigan?",
        answer:
          "Clopay is a widely installed residential brand with insulated options suited to cold climates. Model choice, insulation, and install quality matter more than the logo alone — compare exact specs and local warranty support.",
      },
      {
        question: "What warranty should I expect on a new garage door?",
        answer:
          "Panel warranties vary by model and finish; labor warranties are set by the installer. Get both in writing and ask who performs warranty service in your city.",
      },
      {
        question: "Should the opener be part of the door quote?",
        answer:
          "Optional, but requesting a line-item with and without a new opener (and battery backup) makes it easier to compare dealers and avoid surprises on install day.",
      },
    ],
  },
  {
    slug: "garage-door-opener-installation-grand-rapids",
    title:
      "Garage Door Opener Installation in Grand Rapids: Cost, Process, and Choosing the Right Opener",
    description:
      "Grand Rapids homeowners’ guide to garage door opener installation — typical cost ranges, belt vs chain vs screw vs wall-mount, winter outage tips, and how to compare local pros.",
    date: "2026-09-12",
    readMinutes: 9,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "When the motor strains, the gears strip, or remotes stop responding, Grand Rapids homeowners often need a new garage door opener — not another band-aid repair. A clean install restores quiet daily use and is a chance to add battery backup before the next West Michigan ice storm.",
          "This guide covers planning ranges for opener installation cost, what a typical visit looks like, how belt, chain, screw, and wall-mount drives differ, and how to shortlist companies that actually serve Grand Rapids and nearby Kent County ZIPs. Michigan Garage Pros is a directory: we help you compare local pros; we do not install openers ourselves.",
          "Start from the [Grand Rapids city hub](/cities/grand-rapids/), the [Grand Rapids openers](/cities/grand-rapids/garage-door-openers/) lander, or statewide [garage door opener](/garage-door-openers/) listings when you are ready to browse.",
        ],
      },
      {
        heading: "What opener installation usually costs in Grand Rapids",
        paragraphs: [
          "Treat these as planning ranges, not quotes. A straightforward residential opener replacement in the Grand Rapids area often lands roughly in the mid-hundreds to low thousands once parts and labor are combined — commonly something like a few hundred dollars for a basic chain or belt unit installed, up through higher totals for quiet belt drives, wall-mount (jackshaft) units, smart connectivity, or built-in battery backup.",
          "Labor alone may include removing the old rail or head, hanging the new unit, wiring the wall control and photo eyes, programming remotes and keypads, and testing force and travel limits. Same-day or evening appointments, commercial doors, and nonstandard ceilings (low headroom, finished ceilings that need a wall-mount) push the total up.",
          "Ask every bid to separate opener model, labor, disposal of the old unit, new photo eyes if needed, and battery backup as line items. That makes Grand Rapids quotes comparable even when brands differ. For broader repair ballparks, see [garage door repair cost in Michigan](/blog/garage-door-repair-cost-michigan/).",
        ],
      },
      {
        heading: "The install process, step by step",
        paragraphs: [
          "A good tech starts by checking that the door is balanced. If springs are weak or broken, the opener will fight the door and fail early — springs get fixed or replaced before a new motor goes on the ceiling. Expect a short safety briefing and a clear walk-through of what stays vs what gets swapped.",
          "Next comes removal of the old opener and rail (or prep for a wall-mount beside the torsion bar), mounting the new hardware, running low-voltage wiring for the wall button and sensors, and setting travel limits so the door stops flush without slamming. Remotes, keypads, and any smartphone hub get programmed before the tech leaves.",
          "Before you sign off, watch a full open and close, test the safety reverse (a soft object under the door should reverse travel), and confirm photo-eye alignment. Keep the model number and warranty packet. If you are also replacing the door, pair this job with [new door installation](/garage-door-installation/) — including the [Grand Rapids installation](/cities/grand-rapids/garage-door-installation/) city service page — so hardware and motor are sized together.",
        ],
      },
      {
        heading: "Belt vs chain vs screw vs wall-mount",
        paragraphs: [
          "Chain-drive openers are durable and usually the lowest sticker price, but they are noisier — a tradeoff if bedrooms sit above the garage. Belt-drive units run quieter and are a common upgrade for attached Grand Rapids homes; they cost more up front but are easier to live with day to day.",
          "Screw-drive openers use a threaded rod instead of a chain or belt. They have fewer moving parts to lubricate but can be sensitive to temperature swings and may need more limit attention in cold weather. Not every tech stocks every screw-drive brand, so ask about parts availability for your model.",
          "Wall-mount (jackshaft) openers mount beside the torsion spring shaft and free up ceiling space — useful for low-headroom garages, finished ceilings, or storage racks. They typically cost more and require a torsion-spring door setup. Confirm your door type before you assume a wall-mount will fit.",
          "Horsepower marketing matters less than a door that is properly balanced and an opener rated for your door’s weight and size. A quiet mid-range belt unit on a balanced door outperforms an oversized motor on worn springs.",
        ],
      },
      {
        heading: "Michigan winters and power outages",
        paragraphs: [
          "West Michigan ice storms and summer thunderstorms knock out power often enough that battery backup is worth pricing on any new opener. Backup lets you open or close a limited number of times without grid power — useful when the only car is parked inside. Details and pre-storm checks live in [opener battery backup for Michigan outages](/blog/garage-door-opener-battery-backup-michigan/).",
          "Cold also weakens remote and keypad batteries and can freeze weather seals to the slab so the opener strains or reverses. Rule out ice and sensors before you condemn a motor — our [winter open troubleshooting](/blog/garage-door-wont-open-winter-michigan/) guide covers safe checks. A new opener will not fix a broken spring or a door that is too heavy to lift by hand.",
          "Ask the installer to leave you with the emergency release location, how to re-engage the trolley after manual use, and whether the unit’s backup battery is installed and charged on day one.",
        ],
      },
      {
        heading: "How to compare Grand Rapids opener pros",
        paragraphs: [
          "Confirm they regularly serve your ZIP — Grand Rapids proper, Wyoming, Kentwood, Walker, Grandville, or nearby West Michigan towns — not only a metro label on an ad. Start on [Find Pros](/pros/) or the [Grand Rapids](/cities/grand-rapids/) hub, then filter for opener work on [Grand Rapids garage door openers](/cities/grand-rapids/garage-door-openers/).",
          "Match the company to the job: opener-only swap, opener plus spring service, or opener bundled with a new door. Ask which drive types they install most, whether battery backup is in stock, and how long labor warranty lasts. Written estimates beat vague phone numbers.",
          "Use the same checklist mindset as [how to choose a garage door company in Michigan](/blog/how-to-choose-garage-door-company-michigan/): clear service area, plain-language diagnosis, and no high-pressure “today only” pricing. Featured Pros on this directory are sponsored placements; organic cards stay relevance-based.",
          "When you are ready, [request a free quote](/get-a-quote/) with your ZIP, opener brand if known, door width, whether you want belt or wall-mount, and if battery backup should be included. Photos of the current opener head and ceiling height help pros bring the right rail kit the first time.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does garage door opener installation cost in Grand Rapids?",
        answer:
          "Most residential installs fall in a broad mid-hundreds to low-thousands range depending on drive type, smart features, battery backup, and labor. Ask for line-item quotes so you can compare models fairly.",
      },
      {
        question: "Is a belt-drive opener better than a chain drive for an attached garage?",
        answer:
          "Belt drives are usually quieter and preferred when living space sits above or beside the garage. Chain drives can be durable and cheaper but noisier. Match the unit to door weight and your noise tolerance.",
      },
      {
        question: "Should I fix springs before installing a new opener?",
        answer:
          "Yes if the door is heavy, crooked, or will not stay halfway open when disconnected. Openers are not designed to lift an unbalanced door; fixing springs first protects the new motor.",
      },
      {
        question: "Do Grand Rapids companies install openers with battery backup?",
        answer:
          "Many do. Ask whether backup is built-in or an add-on kit, and confirm it is installed and tested before the tech leaves — especially useful for West Michigan outages.",
      },
    ],
  },
];


export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
