export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMinutes: number;
  category: string;
  sections: BlogSection[];
};

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
          "Browse local spring-repair companies by ZIP on Michigan Garage Pros, or open a city page to compare pros near you.",
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
          "The best way to get a real number is to shortlist local pros and request quotes with photos or a clear description of the problem.",
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
          "Cold snaps are hard on garage doors. Weather seals freeze to the floor, batteries weaken, and sensors get blocked by snow. Before you assume the opener is dead, run through a few safe checks.",
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
          "If you heard a bang, the door is crooked, cables look frayed, or the opener strains without lifting, stop. Those symptoms often mean a broken spring or cable — not something to force.",
          "Michigan Garage Pros can help you find emergency-ready companies near your ZIP when the door has to move today.",
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
          "Ask whether your ZIP is in their regular route. A company two hours away may take longer in winter weather and charge for travel. City and region pages on Michigan Garage Pros make coverage easier to scan.",
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
          "Shortlist two or three local companies, compare profiles, and request quotes so you can decide with real options — not the first flyer on the door.",
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
          "Start with your ZIP on the Find Pros page, open a few company profiles, and call or request a quote. If you want matching without browsing, the quote form can route your request while you wait.",
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
          "In winter, weather seals freeze to the floor and sensors get buried in snow. In humid summers, warped tracks or sticky rollers show up after storms. For cold-weather specifics, see our guide to a garage door that will not open in a Michigan winter.",
        ],
      },
      {
        heading: "When to call for repair",
        paragraphs: [
          "Call if the opener strains and the door does not move, the door is crooked, cables look damaged, or nothing changes after sensor and power checks. Browse companies near your ZIP on Find Pros, or request a quote with a short description of what happens when you press the button.",
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
          "Search your city or ZIP for repair companies that list track and spring work. Send photos of both tracks if you request a quote — that helps the tech bring the right parts the first visit.",
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
          "If lubrication does not quiet the door within a day or two, browse local maintenance and repair companies and describe the sound and when it happens (opening, closing, or mid-travel). That detail speeds diagnosis.",
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
          "Shortlist install and repair companies that serve your city, share photos from straight on and at an angle, and ask for repair-vs-replace recommendations in writing. Browse installation pros or start a quote if you want several Michigan companies to respond.",
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
          "If the door still reverses after sensor cleaning and visual checks, browse opener-repair companies near you or request a quote. Mention whether the reverse happens every time or only at certain times of day — that helps isolate glare vs mechanical binding.",
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
          "Search Michigan Garage Pros for companies offering maintenance or repair in your city. Ask for a safety inspection that includes rollers, cables, springs, and the reverse test — not just a quick spray of lubricant.",
        ],
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
