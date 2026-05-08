// Seed script — creates the Recovery Advantage retreat in Sanity.
// Run: npx tsx scripts/seed-retreat-recovery-advantage.ts
//
// Idempotent: uses `createOrReplace` keyed on a stable _id, so re-running
// updates the same document rather than creating duplicates.

import { readFileSync } from "fs";
import { resolve } from "path";

const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    if (!process.env[key]) {
      process.env[key] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN!;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  process.exit(1);
}

async function mutate(mutations: Record<string, unknown>[]) {
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sanity mutation failed: ${err}`);
  }
  return res.json();
}

// Helper to build a portable text block with a stable _key
let blockKeyCounter = 0;
function block(text: string) {
  blockKeyCounter += 1;
  return {
    _type: "block",
    _key: `b${blockKeyCounter}`,
    style: "normal",
    children: [
      { _type: "span", _key: `s${blockKeyCounter}`, text, marks: [] },
    ],
    markDefs: [],
  };
}

const retreatDoc = {
  _id: "retreat-recovery-advantage",
  _type: "retreat",
  title: "The Recovery Advantage",
  slug: { _type: "slug", current: "recovery-advantage" },
  subtitle: "5-Day Work and Wellness Immersion",
  tagline: "For people who want focus without burnout.",
  secondaryTagline: "Work that moves. Rest that restores.",
  partnership: "Sensinity Retreats × The Rebello, Porto",
  dateStart: "2026-09-13T15:00:00.000Z",
  dateEnd: "2026-09-17T11:00:00.000Z",
  locationLine: "Porto · The Rebello · 13–17 September",
  location: {
    name: "The Rebello",
    city: "Porto",
    country: "Portugal",
  },
  status: "upcoming",

  conceptHeading: "The Concept",
  conceptBody: [
    block("This isn’t a yoga retreat with Wi-Fi. It’s a structured environment where productivity meets presence."),
    block("In the modern world, there is an expectation to juggle focusing on work, a social life, an exercise schedule, a mindfulness practice, growth (personally and professionally), nature time, and experiencing new cultures all at the same time."),
    block("It isn’t easy to keep up with everything at the same time."),
    block("That’s why we have created a 4 day retreat that encompasses it all, without you having to think about a thing."),
    block("The intention is to create together, to focus on the work you care about while giving space for your mind and body in the mornings and evenings."),
    block("Mornings start slow and intentional. Afternoons are for deep, focused work. Evenings wind down with digital detoxes, dinners and restorative practices by the river."),
    block("You arrive with a project. You leave with progress, clarity, and a body that keeps up."),
  ],

  whoHeading: "Who It’s For",
  whoSubheading: "For people who don’t want to split their lives in two",
  whoIntro:
    "Founders. Creatives. Remote professionals.\nYou’re done choosing between work and your wellbeing.",
  whoBullets: [
    block("Real progress on something that matters"),
    block("Focused work in a like-minded group"),
    block("Movement that builds strength, not just stretch"),
    block("Time to experience Porto properly"),
  ],

  experienceHeading: "The Experience",
  experienceSubheading: "A Rhythm That Works",
  experienceBody: [
    block("Days begin with meditation and strength-based yoga to ground and energise, flow into structured deep work sessions designed for focus and accountability, and close with breathwork and intentional evenings that help you properly switch off."),
    block("All held inside a space built for this way of living and working."),
  ],
  scheduleHeading: "A day in the life on retreat",
  schedule: [
    { _key: "s0", sectionLabel: "Mornings in digital detox" },
    { _key: "s1", time: "6:45 AM", activity: "Meditation & journaling" },
    { _key: "s2", time: "7:30 AM", activity: "Strength-based yoga" },
    { _key: "s3", time: "8:45 AM", activity: "Nutritious group breakfast" },
    { _key: "s4", time: "9:30 AM – 12:30 PM", activity: "Structured deep work session at Rebello" },
    { _key: "s5", time: "12:30 PM", activity: "Lunch" },
    { _key: "s6", time: "2:00 PM – 4:30 PM", activity: "Co-working and idea generation from a Porto café" },
    { _key: "s7", sectionLabel: "Digital detox begins" },
    { _key: "s8", time: "5:30 PM", activity: "Personal time" },
    { _key: "s9", time: "6:30 PM", activity: "Mindful breathwork session" },
    { _key: "s10", time: "7:45 PM", activity: "Communal dinner at Rebello" },
    { _key: "s11", time: "9:00 PM", activity: "Rest" },
  ],

  venueHeading: "The Venue",
  venueSubheading: "A new hotel with an old soul",
  venueBody: [
    block("Set across restored 19th-century warehouses on the Douro river, The Rebello blends industrial heritage with modern comfort."),
    block("You’ll stay in apartment-style suites designed for living as much as sleeping, with fully equipped kitchens, separate living areas, natural light throughout, and design-led interiors that give you the space to focus without ever feeling boxed in."),
    block("Built for people who move between work and life without switching identity."),
  ],
  venueBullets: [
    block("Work from the riverside or the hotel’s relaxed social spaces"),
    block("Reset in a Roman-inspired spa with indoor pool, sauna and treatment rooms"),
    block("Head up to Bello Rooftop for sunsets over Porto"),
    block("Eat at Pot&Pan, where local ingredients meet modern Portuguese cooking"),
  ],

  includedHeading: "What’s Included",
  includedItems: [
    block("4 nights at The Rebello with daily breakfast, lunch and dinner"),
    block("Daily movement, breathwork and structured deep work sessions"),
    block("Spa access (pool, sauna, gym)"),
    block("Professional headshot session"),
    block("Pre and post 1:1 sessions with Niamh"),
    block("Workshops on creativity and productivity"),
    block("All food at the Rebello"),
  ],

  guideHeading: "Meet Your Guide",
  guideName: "Niamh Byron",
  guideRoles: ["Yoga teacher", "Breathwork facilitator", "Somatic coach"],
  guideBio: [
    block("Niamh’s work blends strength-based movement, breathwork and nervous system regulation with structured, focused work."),
    block("Her approach connects how you feel with how you perform, helping you build real momentum without burning out."),
    block("Niamh has spent 10 plus years working in both corporate roles and managing her own business. Five years ago she left the 9-5 structure to follow her passion of yoga which eventually led to building a somatics coaching business in which she now integrates psychology, movement and breath into one. As part of Niamh’s work, she now guides businesses and corporations to ensure the team’s mind functions at its highest level by first bringing them back into their body."),
  ],

  whatIsHeading: "What is The Recovery Advantage?",
  whatIsBody: [
    block("High performers don’t burn out because they lack drive. They burn out because their recovery never matches their output. The Recovery Advantage is a 5-day framework that combines strength-based movement, breathwork, psychology and structured deep work into a rhythm that actually restores you. You leave with more capacity than you arrived with, momentum on work that matters, and a system you can take home."),
  ],

  finalHeadline: "Ready to find your Recovery Advantage flow?",
  limitedSpotsCopy: "Limited spots. Kept intentionally small.",
  pricingTiers: [
    {
      _key: "tier-early",
      label: "Early access — limited availability",
      options: [
        { _key: "o1", type: "Shared suite", price: "€1,600" },
        { _key: "o2", type: "Private suite", price: "€2,200" },
      ],
    },
    {
      _key: "tier-standard",
      label: "Standard rate",
      options: [
        { _key: "o3", type: "Shared suite", price: "€1,750" },
        { _key: "o4", type: "Private suite", price: "€2,350" },
      ],
    },
  ],

  secureCtaLabel: "Secure Your Spot",
  bookCallUrl: "https://calendly.com/hello-somatictherapyinlisbon/30min",

  seo: {
    metaTitle: "The Recovery Advantage · 5-Day Porto Retreat",
    metaDescription:
      "Sensinity × The Rebello, Porto. A 5-day work and wellness immersion for founders, creatives and remote professionals. 13–17 September.",
  },
};

async function main() {
  console.log("Seeding retreat: The Recovery Advantage…");
  await mutate([{ createOrReplace: retreatDoc }]);
  console.log("✓ Created/updated retreat document");
  console.log("  /retreats/recovery-advantage");
  console.log(
    "  Studio: open /studio → Retreats → The Recovery Advantage to add hero, venue and guide images, then publish."
  );
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
