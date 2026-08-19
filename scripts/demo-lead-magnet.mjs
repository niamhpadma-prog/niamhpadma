// Fill the Free Download Pop-Up with demo content so Niamh can see it working
// on the live site before the real ebook exists.
//
// EVERY STRING BELOW IS PLACEHOLDER. It is deliberately plain, functional copy
// — not written in Niamh's voice — and is hers to replace in the Studio. See
// docs/content-safety.md.
//
//   node scripts/demo-lead-magnet.mjs            # dry run
//   SANITY_API_TOKEN=... node scripts/demo-lead-magnet.mjs --apply
import fs from "node:fs";

const PROJECT = "ckid5xtf";
const DATASET = "production";
const IMAGE = "public/images/rest.jpg";

const fields = {
  enabled: true,
  heading: "A free guide to mindful nutrition",
  body: "Simple, practical ways to eat with more attention and less pressure. Pop your email in and I'll send it over.",
  buttonLabel: "Send me the guide",
  successMessage: "Thank you — it's on its way to your inbox.",
  successLinkLabel: "Get in touch",
  successLinkUrl: "/contact",
  delaySeconds: 20,
};

const apply = process.argv.includes("--apply");

console.log("Free Download Pop-Up — demo content (all placeholder):\n");
for (const [k, v] of Object.entries(fields)) console.log(`  ${k.padEnd(18)} ${v}`);
console.log(`  ${"image".padEnd(18)} ${IMAGE}`);

if (!apply) {
  console.log("\nDry run only. Re-run with --apply to commit.");
  process.exit(0);
}

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("\nSANITY_API_TOKEN is not set.");
  process.exit(1);
}
const auth = { Authorization: `Bearer ${token}` };

// Upload the photo, then point the document at the resulting asset.
const upload = await fetch(
  `https://${PROJECT}.api.sanity.io/v2024-01-01/assets/images/${DATASET}?filename=lead-magnet-placeholder.jpg`,
  { method: "POST", headers: { ...auth, "Content-Type": "image/jpeg" }, body: fs.readFileSync(IMAGE) }
);
const uploaded = await upload.json();
if (!upload.ok || !uploaded.document?._id) {
  console.error("\nImage upload failed:", JSON.stringify(uploaded, null, 2));
  process.exit(1);
}
console.log(`\nUploaded image asset ${uploaded.document._id}`);

const res = await fetch(`https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`, {
  method: "POST",
  headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({
    mutations: [
      { createIfNotExists: { _id: "leadMagnet", _type: "leadMagnet" } },
      {
        patch: {
          id: "leadMagnet",
          set: {
            ...fields,
            image: {
              _type: "image",
              alt: "Niamh sitting with a notebook",
              asset: { _type: "reference", _ref: uploaded.document._id },
            },
          },
        },
      },
    ],
  }),
});
const out = await res.json();
if (!res.ok || out.error) {
  console.error("\nFailed:", JSON.stringify(out.error || out, null, 2));
  process.exit(1);
}
console.log("✅ Applied.");
