// One-time migration: fold the legacy `retreat` document type into `event`.
//
// What it does:
//   - Converts each `retreat` doc into a new `event` doc with type="Retreat",
//     copying every content field and preserving the slug, then deletes the
//     old retreat doc. URLs stay the same (/retreats/<slug>).
//   - Safety net: sets `type` on any `event` doc that somehow has none
//     (heuristic: title contains "retreat" => Retreat, else Class).
//
// Usage:
//   node scripts/migrate-events.mjs           # dry run, prints planned changes (no writes)
//   node scripts/migrate-events.mjs --apply   # performs the changes (needs SANITY_API_TOKEN)
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

// Load .env.local without extra deps.
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const APPLY = process.argv.includes("--apply");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ckid5xtf",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: APPLY ? process.env.SANITY_API_TOKEN : undefined, // reads are public; token only for writes
  useCdn: false,
});

// Heuristic type for untyped events: title contains "retreat" => Retreat, else Class.
function guessType(title = "") {
  return /retreat/i.test(title) ? "Retreat" : "Class";
}

const STRIP = new Set(["_id", "_rev", "_type", "_createdAt", "_updatedAt"]);

async function main() {
  if (APPLY && !client.config().token) {
    throw new Error("SANITY_API_TOKEN not set — required for --apply. Dry run works without it.");
  }

  const retreats = await client.fetch(`*[_type == "retreat"]`);
  const events = await client.fetch(`*[_type == "event"]{_id, title, type}`);

  console.log(`Found ${retreats.length} retreat doc(s), ${events.length} event doc(s).\n`);
  const tx = client.transaction();

  for (const r of retreats) {
    const content = Object.fromEntries(Object.entries(r).filter(([k]) => !STRIP.has(k)));
    const newId = `event.${r._id.replace(/^retreat[.-]?/, "")}`;
    const newDoc = { _id: newId, _type: "event", type: "Retreat", ...content };
    console.log(`  retreat ${r._id} -> event ${newId} (type=Retreat, slug=${r.slug?.current})`);
    if (APPLY) {
      tx.createOrReplace(newDoc);
      tx.delete(r._id);
    }
  }

  let untyped = 0;
  for (const e of events) {
    if (!e.type) {
      untyped++;
      const t = guessType(e.title);
      console.log(`  event ${e._id} ("${e.title}") set type=${t}`);
      if (APPLY) tx.patch(e._id, { set: { type: t } });
    }
  }
  if (untyped === 0) console.log("  (all existing event docs already have a type — nothing to backfill)");

  if (APPLY) {
    await tx.commit();
    console.log("\n✅ Applied.");
  } else {
    console.log("\nDry run only. Re-run with --apply to commit.");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
