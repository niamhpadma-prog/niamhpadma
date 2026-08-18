// Restore Niamh's ORIGINAL journal posts into Sanity.
//
// Background: the journal in Sanity was populated by scripts/seed-sanity.ts with
// AI-written one-line summaries under her real poem titles (see
// docs/content-safety.md). Her genuine writing survives in the Wayback Machine's
// capture of the old Wix blog and was pulled down verbatim by
// scripts/recover-wix-posts.mjs into recovered/.
//
// This script writes those originals back. It NEVER authors text: every
// character it writes comes from recovered/<slug>.json.
//
// Safety rules it enforces:
//   - Dry run by default; writes require --apply (and SANITY_API_TOKEN).
//   - `patch` only. No createOrReplace, no create, no delete.
//   - Refuses to overwrite a body that is longer than ~200 chars, i.e. anything
//     that looks like real writing rather than a seed stub, unless --force is
//     passed for that specific run. post-what-if is skipped unconditionally:
//     Niamh retyped it herself on 2026-08-17 and hers is authoritative.
//
// Usage:
//   node scripts/restore-journal.mjs            # dry run
//   node scripts/restore-journal.mjs --apply    # write (needs SANITY_API_TOKEN)
import { createClient } from "@sanity/client";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ckid5xtf",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: APPLY ? process.env.SANITY_API_TOKEN : undefined, // reads are public
  useCdn: false,
});

// Recovered Wix slug -> the Sanity document that holds that post today.
// Everything matches on slug except the Argentina retreat, whose Wix URL slug
// ("...-retreat-loving") differs from the slug the site now uses.
const SLUG_OVERRIDES = {
  "awaken-your-senses-retreat-loving": "awaken-your-senses-argentina-retreat",
};

// Niamh retyped this one into the Studio herself; hers is the source of truth.
const SKIP = new Set(["what-if"]);

// "Mar 22, 2024" -> ISO. Wix shows no time of day, so keep the 10:00Z the
// existing documents already use rather than inventing a more precise one.
function toIso(dateStr) {
  const d = new Date(`${dateStr} 10:00:00 UTC`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// One Portable Text block per line, blank lines kept as empty blocks. This is
// exactly how Niamh formats her own poems in the Studio (verified against her
// hand-typed "What If.." document), and it is the only shape that preserves a
// poem's line breaks and stanza gaps.
function toPortableText(text, slug) {
  return text
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .map((line, i) => ({
      _type: "block",
      _key: `${slug}-${i}`,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `${slug}-${i}-0`, text: line, marks: [] }],
    }));
}

// The listing page needs a one-line excerpt. Use her own opening line — never a
// summary, which is precisely what went wrong the first time.
function excerptFrom(text) {
  const first = text.split("\n").find((l) => l.trim().length > 0) || "";
  return first.length > 160 ? `${first.slice(0, 157).trimEnd()}...` : first;
}

const plain = (body) =>
  (body || [])
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c) => c.text).join(""))
    .join("\n");

async function main() {
  if (APPLY && !client.config().token) {
    throw new Error("SANITY_API_TOKEN not set — required for --apply. Dry run works without it.");
  }

  const files = readdirSync("recovered").filter((f) => f.endsWith(".json"));
  const recovered = files.map((f) => JSON.parse(readFileSync(path.join("recovered", f), "utf8")));

  const live = await client.fetch(`*[_type == "post"]{_id, title, "slug": slug.current, body, publishedAt}`);
  const bySlug = new Map(live.map((p) => [p.slug, p]));

  const tx = client.transaction();
  let planned = 0;
  const skipped = [];

  for (const r of recovered.sort((a, b) => a.slug.localeCompare(b.slug))) {
    const targetSlug = SLUG_OVERRIDES[r.slug] || r.slug;
    if (SKIP.has(r.slug)) {
      skipped.push(`${targetSlug} — Niamh's own Studio version is authoritative`);
      continue;
    }
    const doc = bySlug.get(targetSlug);
    if (!doc) {
      skipped.push(`${targetSlug} — no matching document in Sanity`);
      continue;
    }
    const existing = plain(doc.body).trim();
    if (existing.length > 200 && !FORCE) {
      skipped.push(`${targetSlug} — live body is ${existing.length} chars (real writing?); re-run with --force to overwrite`);
      continue;
    }

    const set = {
      title: r.title,
      body: toPortableText(r.body, targetSlug),
      excerpt: excerptFrom(r.body),
    };
    const iso = r.date ? toIso(r.date) : null;
    if (iso) set.publishedAt = iso;

    console.log(
      `  ${doc._id.padEnd(28)} ${String(existing.length).padStart(5)} -> ${String(r.body.length).padStart(5)} chars` +
        `  (${set.body.length} blocks, ${r.date})\n      title: "${doc.title}" -> "${r.title}"`
    );
    planned++;
    if (APPLY) tx.patch(doc._id, { set });
  }

  const recoveredTargets = new Set(recovered.map((r) => SLUG_OVERRIDES[r.slug] || r.slug));
  const orphans = live.filter((p) => !recoveredTargets.has(p.slug) && plain(p.body).trim().length < 200);

  console.log(`\nWill restore ${planned} post(s) from recovered/.`);
  if (skipped.length) console.log(`\nSkipped:\n${skipped.map((s) => `  - ${s}`).join("\n")}`);
  if (orphans.length) {
    console.log(
      `\nNo original exists for these — they are not on the archived Wix blog at all,\n` +
        `so their bodies are AI-written with nothing to restore. This script does not\n` +
        `touch them; decide with Niamh whether to delete or rewrite:\n` +
        orphans.map((p) => `  - ${p.slug} ("${p.title}")`).join("\n")
    );
  }

  if (APPLY) {
    await tx.commit();
    console.log("\n✅ Applied.");
  } else {
    console.log("\nDry run only. Re-run with --apply to commit.");
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
