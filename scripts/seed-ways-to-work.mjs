// Seed the "Ways to Work Together" singleton.
//
// Every word below is lifted verbatim from the hardcoded copy that was already
// on app/(site)/work-with-me/page.tsx — this script reformats Niamh's existing
// text into the new Sanity-editable structure. It authors nothing. See
// docs/content-safety.md.
//
// Uses createIfNotExists, so it can never overwrite edits she makes in the
// Studio. Dry run by default.
//
//   node scripts/seed-ways-to-work.mjs            # show what it would write
//   SANITY_API_TOKEN=... node scripts/seed-ways-to-work.mjs --apply

const PROJECT = "ckid5xtf";
const DATASET = "production";
const CALENDLY = "https://calendly.com/hello-somatictherapyinlisbon/30min";

const doc = {
  _id: "waysToWork",
  _type: "waysToWork",
  enabled: true,
  eyebrow: "Somatic Coaching",
  eyebrowItalic: "Private mentorship",
  heading: "Ways to work together",
  pdfLabel: "Read full PDF",
  offerings: [
    {
      _key: "somatic-coaching",
      _type: "offering",
      title: "1-1 Somatic Coaching",
      description:
        "Somatic coaching meets you beneath the noise of the mind, working with the body's intelligence. Nervous-system, emotional and embodied work — tailored to how you want to feel.",
      onlineUrl: CALENDLY,
    },
    {
      _key: "three-month",
      _type: "offering",
      title: "3 Month Programme",
      duration: "6 x 75 minute online sessions, fortnightly.",
      description:
        "1:1 Personalised Programme tailored to your needs and goals\nWeekday email check-ins\nAdditional resources, tools and practices\n\nMonthly payment plans available",
      price: "611 EUR",
      onlineUrl: CALENDLY,
    },
    {
      _key: "six-month",
      _type: "offering",
      title: "6 Month Programme",
      duration: "12 x 75 minute online sessions, fortnightly.",
      description:
        "1:1 Personalised Programme tailored to your needs and goals\nWeekday email check-ins\nAdditional resources, tools and practices",
      price: "1,111 EUR",
      onlineUrl: CALENDLY,
    },
  ],
};

const apply = process.argv.includes("--apply");

console.log(`Ways to Work Together — ${doc.offerings.length} offerings:\n`);
for (const [i, o] of doc.offerings.entries()) {
  console.log(`  ${i + 1}. ${o.title}${o.price ? `  (${o.price})` : ""}`);
  if (o.duration) console.log(`     ${o.duration}`);
  console.log(`     online: ${o.onlineUrl || "—"}   in person: ${o.inPersonUrl || "— (not set)"}`);
}

if (!apply) {
  console.log("\nDry run only. Re-run with --apply to commit.");
  process.exit(0);
}

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("\nSANITY_API_TOKEN is not set.");
  process.exit(1);
}

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // createIfNotExists: a re-run is a no-op once the document exists, so this
    // can never clobber Niamh's edits.
    body: JSON.stringify({ mutations: [{ createIfNotExists: doc }] }),
  }
);
const out = await res.json();
if (!res.ok || out.error) {
  console.error("\nFailed:", JSON.stringify(out.error || out, null, 2));
  process.exit(1);
}
console.log("\n✅ Applied.");
