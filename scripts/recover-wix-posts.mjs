// Recover Niamh's ORIGINAL journal posts from the archived Wix site.
//
// Why this exists: the current journal was populated with AI-written text under
// her real titles (see docs/content-safety.md). Her genuine writing survives in
// the Wayback Machine's capture of the old Wix site at www.niamhpadma.com/post/<slug>.
// This script pulls the originals down verbatim so they can be restored.
//
// It is READ-ONLY with respect to Sanity. It only writes local files.
//
// Usage:
//   node scripts/recover-wix-posts.mjs                  # recover all known slugs
//   node scripts/recover-wix-posts.mjs what-if turn-on  # recover specific slugs
//
// Output: recovered/<slug>.json  and  recovered/<slug>.txt
import fs from "node:fs";
import path from "node:path";

// Her real posts on the old Wix blog. (Wix demo/template posts and colour-code
// junk URLs from the CDX index are deliberately excluded.)
const SLUGS = [
  "what-if",
  "turn-on",
  "poems-for-shavasanah",
  "poems-and-inspiration-from-the-heart",
  "words",
  "awaken-your-senses-ireland-retreat",
  "awaken-your-senses-retreat-loving",
  "swapping-alcohol-for-chai-lattes",
  "how-to-overcome-fear-of-what-others-think",
  "making-yoga-a-practice-of-self-compassion",
  "why-being-a-chameleon-is-a-superpower",
  "be-the-architect-of-your-brain",
  "why-eating-at-your-desk-is-illegal-in-france",
  "food-restrictions",
  "eating-for-your-mind",
  "overnight-fasting",
  "setting-new-moon-intentions",
  "growing-through-fear",
  "power-of-morning-routine",
  "the-inner-critic",
  "success-is-an-inside-job",
];

const OUT = path.resolve("recovered");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function snapshots(slug) {
  const url = `http://web.archive.org/cdx/search/cdx?url=niamhpadma.com/post/${slug}&output=json&fl=timestamp,statuscode`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const rows = await res.json();
  return rows
    .slice(1)
    .filter((r) => r[1] === "200")
    .map((r) => r[0])
    .sort()
    .reverse(); // newest first
}

function extract(htmlText, snapshotTs) {
  // Match paragraphs AND Wix's stanza breaks in document order. A blank line
  // between stanzas is not an empty <p> — Wix emits a bare
  // `<br role="presentation">` in its own div — so it needs its own branch or
  // the poem comes back as one undifferentiated wall of lines.
  const paras = [...htmlText.matchAll(/<p[^>]*>(.*?)<\/p>|<br role="presentation"\s*\/?>/gs)]
    .map((m) =>
      m[1] === undefined
        ? ""
        : m[1]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&#39;|&#x27;|&rsquo;|&lsquo;/g, "'")
        .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
        .replace(/&mdash;/g, "—")
        .replace(/&hellip;/g, "…")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim()
    );
  // NOTE: empty paragraphs are KEPT. Wix renders a stanza break as an empty
  // <p>, and in a poem that blank line is part of the writing. They are
  // trimmed/collapsed at the end, once the body range is known.

  // The Wix header collapses nav + title + byline + "N min read" + the first
  // line of the post into one paragraph. Split on the read-time marker.
  let start = 0;
  let title = null;
  let date = null;
  let firstLine = null;
  for (let i = 0; i < paras.length; i++) {
    // Header shape: "…Search<Title>niamhpadma<Mon D, YYYY><N> min read<first line>"
    // The date's year runs straight into the read-time ("Aug 24, 20233 min read"),
    // so match the date explicitly rather than letting \d+ eat the year.
    // Wix omits the year for posts made in the capture's own year ("Feb 28"),
    // so the year group is optional and inferred from the snapshot when absent.
    const m = paras[i].match(
      /Search(.*?)niamhpadma\s*([A-Z][a-z]{2}\s+\d{1,2})(?:,?\s*(\d{4}))?.*?\d+\s*min read(.*)$/s
    );
    if (m) {
      title = m[1].trim();
      const year = m[3] || (snapshotTs ? snapshotTs.slice(0, 4) : null);
      date = m[2] ? `${m[2].trim()}${year ? `, ${year}` : ""}` : null;
      firstLine = m[4].trim();
      start = i + 1;
      break;
    }
  }

  // Body ends at the Wix footer / related-posts block.
  let end = paras.length;
  for (let i = start; i < paras.length; i++) {
    if (
      /^Recent Posts/.test(paras[i]) ||
      /©\d{4} by NiamhPadma/.test(paras[i]) ||
      /^hellosensinity@gmail\.com$/.test(paras[i])
    ) {
      end = i;
      break;
    }
  }

  // Collapse runs of blank lines to a single one, and trim the ends, so the
  // Wix layout's padding paragraphs don't survive as stray gaps.
  const lines = [firstLine, ...paras.slice(start, end)];
  const body = lines
    .filter((l, i) => l !== "" || (lines[i - 1] ?? "") !== "")
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
  return { title, date, body };
}

async function recover(slug) {
  const stamps = await snapshots(slug);
  if (stamps.length === 0) return { slug, ok: false, reason: "no 200 snapshot" };

  for (const ts of stamps.slice(0, 8)) {
    try {
      const res = await fetch(
        `https://web.archive.org/web/${ts}id_/https://www.niamhpadma.com/post/${slug}`
      );
      if (!res.ok) continue;
      const { title, date, body } = extract(await res.text(), ts);
      // A real Wix capture always yields the "…niamhpadma…N min read" header.
      // Snapshots taken AFTER the migration are the new Next.js shell, which
      // parses to a short boilerplate string with no title — reject those and
      // keep walking back to an older, genuinely-Wix capture.
      if (!title || !body || body.length < 200) continue;
      if (/Guiding you home to yourself|All rights reserved/.test(body)) continue;
      return { slug, ok: true, timestamp: ts, title, date, body };
    } catch {
      /* try next snapshot */
    }
    await sleep(400);
  }
  return { slug, ok: false, reason: "no Wix-era capture with a readable body" };
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : SLUGS;
fs.mkdirSync(OUT, { recursive: true });

const results = [];
for (const slug of targets) {
  const r = await recover(slug);
  results.push(r);
  if (r.ok) {
    fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(r, null, 2));
    fs.writeFileSync(
      path.join(OUT, `${slug}.txt`),
      `${r.title}\n${r.date}\n${"=".repeat(50)}\n\n${r.body}\n`
    );
    console.log(`✓ ${slug.padEnd(46)} ${String(r.body.length).padStart(6)} chars  (${r.timestamp})`);
  } else {
    console.log(`✗ ${slug.padEnd(46)} ${r.reason}`);
  }
  await sleep(600);
}

const ok = results.filter((r) => r.ok);
console.log(`\nRecovered ${ok.length}/${targets.length} into ${OUT}/`);
if (ok.length < targets.length) {
  console.log("Failed:", results.filter((r) => !r.ok).map((r) => r.slug).join(", "));
}
