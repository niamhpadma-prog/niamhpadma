# Content safety — Niamh's writing is never machine-generated

## The rule

**Nothing in this repo may ever write prose into Niamh's journal, poems, or any
other authored field.** Scripts may create structural scaffolding (services,
event stubs, testimonials) on a fresh dataset. They may never author, summarise,
rewrite, or "improve" her words, and they may never overwrite a document she has
edited.

If you want placeholder text while building a layout, use obviously-fake filler
(`Lorem ipsum`, `TODO`) — never plausible prose in her voice, and never in
production.

## What went wrong (2026-03-23)

`scripts/seed-sanity.ts` was run against the **production** dataset. It created
24 `post` documents using hardcoded IDs (`post-turn-on`, `post-what-if`, …) and
titles copied from Niamh's real journal. Each document's `body` was set to its
`excerpt` field — and those excerpts were AI-written one-line descriptions
*about* each poem. For example, the entire body of "Turn On." became:

> A poem about awakening to sensation, presence, and the courage to feel fully alive.

Her poems were never overwritten, because they were never in the CMS to begin
with. The journal was pre-populated with AI-written summaries under her real poem
titles and published live. From the Studio this was indistinguishable from her
work having been "re-written by AI" — which is exactly how it was reported.

A second, worse defect never fired: the script used `createOrReplace` on those
fixed IDs with no dry run and no confirmation. Any re-run would have silently
destroyed real writing. By 2026-08-17 that included her genuine "What If.." poem.

## What now prevents it

`scripts/seed-sanity.ts` enforces four things:

1. **No journal seeding.** The `post` block is gone and must not come back.
2. **`createIfNotExists` only.** A hard tripwire in `mutate()` throws if any
   mutation is not `createIfNotExists`, so a re-run can add missing scaffolding
   but can never modify or delete an existing document.
3. **Dry run by default.** Writes require `--apply`.
4. **Production is opt-in.** Writing to the `production` dataset also requires
   `--i-am-sure-production`, and exits 1 otherwise.

`scripts/migrate-events.mjs` already follows the same dry-run-by-default pattern.
Any new script that touches Sanity must do likewise.

## The restore (recovered/)

`scripts/recover-wix-posts.mjs` pulls Niamh's originals down from the Wayback
Machine's capture of the old Wix blog into `recovered/<slug>.json`. It is
read-only with respect to Sanity. All 21 of her real posts survive there; the
only other archived URLs are Wix's own demo template posts.

`scripts/restore-journal.mjs` writes those originals back into Sanity. It never
authors text — every character it writes comes from `recovered/`. It patches
only, is dry-run by default, refuses to overwrite a body over ~200 characters
without `--force`, and skips `what-if` outright because Niamh retyped that one
into the Studio herself.

Formatting: one Portable Text block per line, with blank blocks for stanza
breaks. That is exactly how Niamh formats her own poems in the Studio — verified
by diffing the recovered "What If.." against her hand-typed version, which came
out identical across all 113 lines. `journalPortableTextComponents` in
`lib/sanity/portableText.tsx` renders that shape without inter-line margins so a
poem's line breaks survive to the page.

**Status: applied 2026-08-18.** All 20 restorable posts are back in production
and verified byte-identical to `recovered/<slug>.txt`. `what-if` was left alone.

### Three posts have no original

`equinox-thoughts`, `finding-love-in-the-being` and
`appreciating-the-little-things` do not exist on the archived Wix blog at all.
Their titles and bodies were invented outright. Nothing can be restored — they
need to be deleted or rewritten by Niamh. The restore script reports them and
does not touch them.

**Resolved 2026-08-19:** all three were deleted from production at Niamh's
request. A copy is kept at `backups/deleted-fabricated-posts-2026-08-19.ndjson`
in case anything needs checking later.

## Offerings live in Sanity too

`scripts/seed-ways-to-work.mjs` populated the "Ways to Work Together" singleton.
Every word it wrote was lifted verbatim from the copy already hardcoded on
`app/(site)/work-with-me/page.tsx` — it reformats, it does not author. It uses
`createIfNotExists`, so re-running it can never overwrite Niamh's Studio edits.

## The journal now reads from Sanity

`app/(site)/journal/page.tsx` and `app/(site)/journal/[slug]/page.tsx` used to
hold hardcoded copies of the journal, and those copies were machine-written.
Both now fetch from Sanity with `revalidate = 60`. No post text may be hardcoded
in the app again — if a post looks wrong, fix it in the Studio.

## Before any script writes to production

Take an export first. It takes seconds and is the only real undo:

```bash
npx sanity dataset export production backups/production-$(git rev-parse --short HEAD).tar.gz
```

There is an existing export at `backups/production-8a7cbdc.tar.gz` (2026-06-29).

## Recovering an individual document

Sanity keeps per-document revision history. In the Studio, open the document →
the "⋯" menu → **History**, then restore the revision you want. Retention depends
on the plan, so restore sooner rather than later. History is per document, so a
bad bulk write must be reverted document by document — another reason the guards
above matter more than the recovery path.

## Checking the live state without credentials

Reads on this dataset are public, so you can always inspect production directly:

```bash
node -e '
const q=encodeURIComponent(`*[_type=="post"]{_id,title,_updatedAt,body}`);
fetch(`https://ckid5xtf.api.sanity.io/v2024-01-01/data/query/production?query=${q}`)
 .then(r=>r.json()).then(d=>{
  const t=b=>(b||[]).filter(x=>x._type==="block").map(x=>(x.children||[]).map(c=>c.text).join("")).join("\n");
  for(const p of d.result) console.log(String(t(p.body).length).padStart(6), p._updatedAt.slice(0,10), p._id, "|", p.title);
 });'
```

A journal post whose body is under ~100 characters and whose `_updatedAt` is
still `2026-03-23` is leftover seed text, not Niamh's writing.
