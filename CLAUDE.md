# Niamh Padma — website

This is Niamh's own website (www.niamhpadma.com): yoga, breathwork and somatic
wellness in Lisbon. **Niamh is the person you are talking to.** She is not a
developer. Explain things in plain English, describe what changed on the site
rather than in the code, and don't show her code unless she asks.

## How the site works

- **Next.js** site in `app/(site)/`, hosted on Niamh's **Vercel**.
- **Sanity** is the CMS. Its editor (the "Studio") is built into the site at
  **www.niamhpadma.com/studio** (`app/(studio)/`, config in `sanity/`).
- Merging to `main` puts changes live automatically in about a minute.

## Sanity and code: who owns what

Niamh keeps using the Studio for content. Code changes and Studio content have
to stay in step.

| Lives in Sanity (Niamh edits in the Studio) | Lives in code (you change it) |
| --- | --- |
| Words, poems/journal, images, events, courses, offerings, testimonials, SEO text, site settings | Layout, design, styling, page structure, new features, forms, payments |

Rules:

1. **Content changes go in the Studio, not the code.** If Niamh asks to change
   text, an image or an event that comes from Sanity, tell her where to change it
   in the Studio (step by step, e.g. "Studio → Events → pick the event → edit the
   Start Date → Publish"). Don't hardcode content into components.
2. **New editable sections need a schema.** When you build something new that
   has text or images, add fields to the schema in `sanity/schemas/` (and
   register it in `sanity/schemas/index.ts`), then fetch it through
   `lib/sanity/queries.ts`. Give every field a clear `title` and a
   `description` hint, because Niamh reads those in the Studio. Once it's live,
   tell her exactly where the new fields are and what to fill in.
3. **Schema changes don't move content.** If you rename or remove a field,
   the existing content stays under the old name and disappears from the page.
   Avoid renames. If one is unavoidable, warn Niamh first and migrate the data.
4. **Pages refresh from Sanity by webhook** (`app/api/revalidate/route.ts`).
   If a Studio edit doesn't appear on the site, check that the page is covered
   there before assuming anything else is wrong.

## Never write Niamh's words for her

Read `docs/content-safety.md`. In short:

- Never write, rewrite, summarise or "improve" her journal, poems or any
  authored text in Sanity. That has gone wrong before.
- Scripts that touch Sanity must be **dry-run by default**, use
  `createIfNotExists` only, and require explicit opt-in to write to
  `production`.
- For placeholder text while building, use obvious filler (`Lorem ipsum`),
  never made-up prose in her voice.

## Other useful docs

- `docs/how-to-add-an-event.md`: Niamh's Studio guide for events.
- `docs/niamh-why-my-events-arent-showing.md`: the usual event gotcha
  (Start Date must be in the future).

## Secrets

API keys (Stripe, Sanity, Resend, Mailchimp) live in Vercel's Environment
Variables, never in the code. `env.example` lists the names.
