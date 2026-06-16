# Unify Events & Retreats Into One `event` Type Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the overlapping `event` and `retreat` Sanity types into a single `event` type whose `type` field (Retreat / Workshop / Class / Online) is the tag that drives both the editing form and how pages render — so Niamh only ever creates "Events," and "Retreats" are simply `type == "Retreat"`.

**Architecture:** One `event` document type. The lightweight fields (title, date, location, price, excerpt, body, image) are always visible. All the rich retreat-landing-page fields (Concept, Schedule, Venue, Pricing tiers, Guide…) are added to the same schema in field groups, each `hidden` unless `type == "Retreat"`. Retreat-tagged events keep their rich page at `/retreats/[slug]`; all other events get the simple page at `/events/[slug]` (decision: URLs stay split, no redirects). The `retreat` document type is retired after a one-time data migration moves its single document into an `event`.

**Tech Stack:** Next.js 15 App Router (RSC), Sanity v3 (GROQ, `next-sanity`), TypeScript, Tailwind. No unit-test framework — verification is `npm run build`, `npx eslint`, GROQ queries via `curl`, and route smoke-checks against `npm run dev`.

---

## Background — current broken state (verified 2026-06-16)

- **`/events` listing** (`app/(site)/events/page.tsx`) queries `retreatsQuery` only. It renders `retreat` docs + three hardcoded sections. It **never renders `event` docs.**
- **`/events/[slug]`** (`app/(site)/events/[slug]/page.tsx`) is **hardcoded placeholder data** (`// TODO: Fetch from Sanity`). Not wired to Sanity at all.
- **`/retreats/[slug]`** (`app/(site)/retreats/[slug]/page.tsx`) is real and Sanity-backed (rich page).
- **`EventsListing.tsx`** + `eventsQuery` exist but `EventsListing` is imported nowhere — dead code.
- **Live Sanity data:** 5 `event` docs (all `status: upcoming`, all have slugs) + 1 `retreat` doc (`retreat-recovery-advantage`, "The Recovery Advantage"). The 5 events are invisible everywhere.
  - Note: several event docs have **past `dateStart`** (March/April 2026, today is June 2026). The listing only shows future-dated events, so even once wired, Niamh must set future dates. This is content, not code — flag it to her, don't "fix" in code.
  - There is a **duplicate** "Roots & Restore: A Summer Evening Retreat" (`_id` `5312a0b9-…` and `event-yoga-nidra-sound-bath`, same date). Flag for Niamh to delete one in Studio — keep both in the migration (do not auto-delete).

## Field reconciliation (event ← retreat)

The merged `event` schema keeps all current event fields and **adds** every retreat field that isn't already present. Fields present in BOTH (same shape) are kept once, in "Basics":

- Shared, keep single copy: `title`, `slug`, `dateStart`, `dateEnd`, `location` (object), `status`, `gallery`, `faq`, plus `...seoFields`.
- Event-only (keep): `type`, `price`, `capacity`, `excerpt`, `body`, `image` (cover).
- Retreat-only to ADD (all `hidden` unless `type == "Retreat"`): `subtitle`, `tagline`, `secondaryTagline`, `partnership`, `locationLine`, `heroImage`, `cardImage`, `conceptHeading`, `conceptBody`, `conceptImage`, `whoHeading`, `whoSubheading`, `whoIntro`, `whoBullets`, `whoImage`, `experienceHeading`, `experienceSubheading`, `experienceBody`, `experienceImage`, `scheduleHeading`, `schedule`, `venueHeading`, `venueSubheading`, `venueBody`, `venueBullets`, `venueImage`, `includedHeading`, `includedItems`, `includedImage`, `guideHeading`, `guideName`, `guideRoles`, `guideBio`, `guideImage`, `whatIsHeading`, `whatIsBody`, `whatIsImage`, `finalHeadline`, `limitedSpotsCopy`, `pricingTiers`, `secureCtaLabel`, `bookCallUrl`, `enquiryRecipient`.

Because the rich retreat page reads fields by name, **keeping the names identical means the `/retreats/[slug]` component needs no field renames** — only its query source changes.

## File Structure

- **Modify** `sanity/schemas/event.ts` — add field groups + all retreat fields (conditional `hidden`).
- **Modify** `sanity/schemas/index.ts` — remove `retreat` registration (final task).
- **Delete** `sanity/schemas/retreat.ts` (final task).
- **Modify** `lib/sanity/queries.ts` — repoint retreat/event queries onto `event` + `type`.
- **Modify** `app/(site)/events/page.tsx` — Retreats section from `type=="Retreat"`; wire `EventsListing` for non-retreat upcoming events.
- **Rewrite** `app/(site)/events/[slug]/page.tsx` — fetch from Sanity, guard against retreat-typed slugs.
- **Modify** `app/(site)/retreats/[slug]/page.tsx` — no field changes; verify it still builds against the event-backed query.
- **Modify** `app/api/revalidate/route.ts` — `event` revalidates `/`, `/events`, and the correct detail path by `type`.
- **Modify** `app/sitemap.ts` + `lib/sanity/queries.ts` (`sitemapQuery`) — retreats sourced from `event` `type=="Retreat"`.
- **Create** `scripts/migrate-events.mjs` — one-time data migration (dry-run by default).

---

## Task 1: Add retreat field groups + fields to the `event` schema

**Files:**
- Modify: `sanity/schemas/event.ts`

- [ ] **Step 1: Add `bulletBlock` to the import and define `groups`**

In `sanity/schemas/event.ts`, change the shared import line:

```ts
import { bulletBlock, imageCaptionFields, richBlock } from "./_shared";
```

Then add a `groups` array to the `defineType` object, immediately after `type: "document",`:

```ts
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "hero", title: "Retreat · Hero" },
    { name: "concept", title: "Retreat · Concept" },
    { name: "who", title: "Retreat · Who It’s For" },
    { name: "experience", title: "Retreat · Experience & Schedule" },
    { name: "venue", title: "Retreat · Venue" },
    { name: "included", title: "Retreat · What’s Included" },
    { name: "guide", title: "Retreat · Guide" },
    { name: "whatIs", title: "Retreat · What Is…" },
    { name: "pricing", title: "Retreat · Pricing & CTAs" },
    { name: "faq", title: "FAQ" },
    { name: "seo", title: "SEO" },
  ],
```

- [ ] **Step 2: Put existing simple fields in the `basics` group**

Add `group: "basics",` to each existing field: `title`, `slug`, `type`, `dateStart`, `dateEnd`, `location`, `price`, `capacity`, `status`, `excerpt`, `body`, `image`, `gallery`. Move `faq` to `group: "faq"`. Leave `...seoFields` to be regrouped in Step 4.

Also update the `type` field description to make clear it drives the page:

```ts
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      group: "basics",
      options: { list: ["Retreat", "Workshop", "Class", "Online"] },
      description:
        "The category. Choose “Retreat” to unlock the full retreat landing-page fields (Concept, Schedule, Venue, Pricing…) and publish at /retreats/your-slug. Any other type uses the simpler event page at /events/your-slug.",
      validation: (r) => r.required(),
    }),
```

- [ ] **Step 3: Append the retreat-only fields (conditional)**

Insert the following fields **after** the `gallery` field and **before** `faq`. Every one carries `hidden: ({ document }) => document?.type !== "Retreat"` and its retreat group. (Copy field bodies verbatim from `sanity/schemas/retreat.ts`; the version below is complete and self-contained.)

```ts
    // ─── Retreat · Hero ──────────────────────────────────────
    defineField({ name: "subtitle", title: "Subtitle", type: "string", group: "hero",
      description: "e.g., 5-Day Work and Wellness Immersion",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "hero",
      description: "e.g., For people who want focus without burnout.",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "secondaryTagline", title: "Secondary Tagline", type: "string", group: "hero",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "partnership", title: "Partnership Line", type: "string", group: "hero",
      description: "e.g., Sensinity Retreats × The Rebello, Porto",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "locationLine", title: "Location Line", type: "string", group: "hero",
      description: "Display string e.g., Porto · The Rebello · 13–17 September",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", group: "hero",
      options: { hotspot: true }, fields: imageCaptionFields,
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "cardImage", title: "Homepage Card Image (optional)", type: "image", group: "hero",
      options: { hotspot: true }, fields: imageCaptionFields,
      description: "Optional. Used on the homepage 'Upcoming Retreats' card. Falls back to Hero Image.",
      hidden: ({ document }) => document?.type !== "Retreat" }),

    // ─── Retreat · Concept ───────────────────────────────────
    defineField({ name: "conceptHeading", title: "Concept Heading", type: "string", group: "concept",
      initialValue: "The Concept", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "conceptBody", title: "Concept Body", type: "array", group: "concept",
      of: [richBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "conceptImage", title: "Concept Image", type: "image", group: "concept",
      options: { hotspot: true }, fields: imageCaptionFields,
      hidden: ({ document }) => document?.type !== "Retreat" }),

    // ─── Retreat · Who It’s For ──────────────────────────────
    defineField({ name: "whoHeading", title: "Heading", type: "string", group: "who",
      initialValue: "Who It’s For", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whoSubheading", title: "Subheading", type: "string", group: "who",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whoIntro", title: "Intro Paragraph", type: "text", rows: 3, group: "who",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whoBullets", title: "Bullets", type: "array", group: "who",
      of: [bulletBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whoImage", title: "Who It’s For Image", type: "image", group: "who",
      options: { hotspot: true }, fields: imageCaptionFields,
      hidden: ({ document }) => document?.type !== "Retreat" }),

    // ─── Retreat · Experience & Schedule ─────────────────────
    defineField({ name: "experienceHeading", title: "Heading", type: "string", group: "experience",
      initialValue: "The Experience", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "experienceSubheading", title: "Subheading", type: "string", group: "experience",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "experienceBody", title: "Body", type: "array", group: "experience",
      of: [richBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "experienceImage", title: "Experience Image", type: "image", group: "experience",
      options: { hotspot: true }, fields: imageCaptionFields,
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "scheduleHeading", title: "Schedule Heading", type: "string", group: "experience",
      initialValue: "A day in the life on retreat", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "schedule", title: "Daily Schedule", type: "array", group: "experience",
      hidden: ({ document }) => document?.type !== "Retreat",
      of: [{
        type: "object", name: "scheduleItem",
        fields: [
          defineField({ name: "time", title: "Time", type: "string", description: "e.g., 6:45 AM" }),
          defineField({ name: "activity", title: "Activity", type: "string" }),
          defineField({ name: "sectionLabel", title: "Section Divider (optional)", type: "string",
            description: "Use to break the schedule, e.g., 'Mornings in digital detox'" }),
        ],
        preview: {
          select: { time: "time", activity: "activity", section: "sectionLabel" },
          prepare: ({ time, activity, section }) => ({
            title: section || `${time || ""} ${activity || ""}`.trim(),
            subtitle: section ? `${time || ""} ${activity || ""}`.trim() : undefined,
          }),
        },
      }] }),

    // ─── Retreat · Venue ─────────────────────────────────────
    defineField({ name: "venueHeading", title: "Heading", type: "string", group: "venue",
      initialValue: "The Venue", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "venueSubheading", title: "Subheading", type: "string", group: "venue",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "venueBody", title: "Body", type: "array", group: "venue",
      of: [richBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "venueBullets", title: "Highlights / Between Sessions", type: "array", group: "venue",
      of: [bulletBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "venueImage", title: "Venue Image", type: "image", group: "venue",
      options: { hotspot: true }, fields: imageCaptionFields,
      hidden: ({ document }) => document?.type !== "Retreat" }),

    // ─── Retreat · What’s Included ───────────────────────────
    defineField({ name: "includedHeading", title: "Heading", type: "string", group: "included",
      initialValue: "What’s Included", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "includedItems", title: "Items", type: "array", group: "included",
      of: [bulletBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "includedImage", title: "What’s Included Banner Image", type: "image", group: "included",
      options: { hotspot: true }, fields: imageCaptionFields,
      hidden: ({ document }) => document?.type !== "Retreat" }),

    // ─── Retreat · Guide ─────────────────────────────────────
    defineField({ name: "guideHeading", title: "Heading", type: "string", group: "guide",
      initialValue: "Meet Your Guide", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "guideName", title: "Guide Name", type: "string", group: "guide",
      initialValue: "Niamh Byron", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "guideRoles", title: "Guide Roles", type: "array", group: "guide",
      of: [{ type: "string" }], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "guideBio", title: "Guide Bio", type: "array", group: "guide",
      of: [richBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "guideImage", title: "Guide Image", type: "image", group: "guide",
      options: { hotspot: true }, fields: imageCaptionFields,
      hidden: ({ document }) => document?.type !== "Retreat" }),

    // ─── Retreat · What Is… ──────────────────────────────────
    defineField({ name: "whatIsHeading", title: "Heading", type: "string", group: "whatIs",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whatIsBody", title: "Body", type: "array", group: "whatIs",
      of: [richBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whatIsImage", title: "What Is… Image", type: "image", group: "whatIs",
      options: { hotspot: true }, fields: imageCaptionFields,
      hidden: ({ document }) => document?.type !== "Retreat" }),

    // ─── Retreat · Pricing & CTAs ────────────────────────────
    defineField({ name: "finalHeadline", title: "Final Section Headline", type: "string", group: "pricing",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "limitedSpotsCopy", title: "Limited Spots Copy", type: "string", group: "pricing",
      initialValue: "Limited spots. Kept intentionally small.", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "pricingTiers", title: "Pricing Tiers", type: "array", group: "pricing",
      hidden: ({ document }) => document?.type !== "Retreat",
      of: [{
        type: "object", name: "pricingTier",
        fields: [
          defineField({ name: "label", title: "Tier Label", type: "string" }),
          defineField({ name: "options", title: "Options", type: "array",
            of: [{ type: "object",
              fields: [
                defineField({ name: "type", title: "Suite Type", type: "string" }),
                defineField({ name: "price", title: "Price", type: "string" }),
              ],
              preview: { select: { title: "type", subtitle: "price" } },
            }] }),
        ],
        preview: { select: { title: "label" } },
      }] }),
    defineField({ name: "secureCtaLabel", title: "Primary CTA Label", type: "string", group: "pricing",
      initialValue: "Secure Your Spot", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "bookCallUrl", title: "Book a Call URL (Calendly)", type: "url", group: "pricing",
      initialValue: "https://calendly.com/hello-somatictherapyinlisbon/30min",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "enquiryRecipient", title: "Enquiry Recipient Email (override)", type: "string", group: "pricing",
      description: "Leave blank to use the default site email.", hidden: ({ document }) => document?.type !== "Retreat" }),
```

- [ ] **Step 4: Group SEO fields**

Replace the `...seoFields,` line at the end of the fields array with:

```ts
    ...seoFields.map((f) => ({ ...f, group: "seo" })),
```

- [ ] **Step 5: Verify the schema compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors in `sanity/schemas/event.ts`. (Pre-existing errors elsewhere, if any, are out of scope — confirm none are in the edited file.)

- [ ] **Step 6: Commit**

```bash
git add sanity/schemas/event.ts
git commit -m "feat(sanity): add conditional retreat fields to event schema"
```

---

## Task 2: Repoint queries onto `event` + `type`

**Files:**
- Modify: `lib/sanity/queries.ts`

- [ ] **Step 1: Rewrite the events + retreats query block**

Replace the existing `eventsQuery`, `retreatsQuery`, `retreatSlugsQuery`, `upcomingRetreatsQuery`, and `retreatQuery` definitions with the versions below. Leave `eventQuery` as-is except for the change in Step 2.

```ts
// Upcoming events that are NOT retreats (Workshop / Class / Online + untyped).
export const eventsQuery = groq`
  *[_type == "event" && type != "Retreat" && defined(dateStart) && dateStart >= now()] | order(dateStart asc) {
    _id,
    title,
    "slug": slug.current,
    type,
    dateStart,
    dateEnd,
    location,
    price,
    status,
    "image": image { asset->, alt, caption, creditUrl, captionPosition },
    excerpt
  }
`;

// Retreats = events tagged "Retreat". Card fields for the /events listing.
export const retreatsQuery = groq`
  *[_type == "event" && type == "Retreat"] | order(coalesce(dateStart, _updatedAt) asc) {
    _id,
    title,
    slug,
    subtitle,
    tagline,
    locationLine,
    dateStart,
    dateEnd,
    status,
    heroImage { asset->, alt, caption, creditUrl, captionPosition }
  }
`;

export const retreatSlugsQuery = groq`
  *[_type == "event" && type == "Retreat" && defined(slug.current)][].slug.current
`;

// Retreat-tagged events still selling / upcoming, for the homepage.
export const upcomingRetreatsQuery = groq`
  *[
    _type == "event"
    && type == "Retreat"
    && defined(slug.current)
    && coalesce(status, "upcoming") == "upcoming"
    && (!defined(dateEnd) || dateEnd >= now())
  ] | order(coalesce(dateStart, _createdAt) asc) [0...3] {
    _id,
    title,
    slug,
    subtitle,
    tagline,
    locationLine,
    dateStart,
    dateEnd,
    status,
    "cardImage": coalesce(cardImage, heroImage) { asset->, alt }
  }
`;

export const retreatQuery = groq`
  *[_type == "event" && type == "Retreat" && slug.current == $slug][0] {
    ...,
    heroImage { asset->, alt, caption, creditUrl, captionPosition },
    conceptImage { asset->, alt, caption, creditUrl, captionPosition },
    whoImage { asset->, alt, caption, creditUrl, captionPosition },
    experienceImage { asset->, alt, caption, creditUrl, captionPosition },
    venueImage { asset->, alt, caption, creditUrl, captionPosition },
    includedImage { asset->, alt, caption, creditUrl, captionPosition },
    guideImage { asset->, alt, caption, creditUrl, captionPosition },
    whatIsImage { asset->, alt, caption, creditUrl, captionPosition },
    gallery[] { asset->, alt, caption, creditUrl, captionPosition },
    faq[] { question, answer }
  }
`;
```

> Note: `eventsQuery` now returns `slug` as a string (`"slug": slug.current`) and `image` projected, to match what `EventCard` expects (Task 4). `retreatsQuery`/`upcomingRetreatsQuery` keep `slug` as the `{current}` object the existing retreat/homepage components already consume.

- [ ] **Step 2: Make `eventQuery` exclude retreats**

Replace `eventQuery` with a slug lookup that resolves only non-retreat events (retreat slugs are served by `/retreats/[slug]`):

```ts
export const eventQuery = groq`
  *[_type == "event" && type != "Retreat" && slug.current == $slug][0] {
    ...,
    image { asset->, alt, caption, creditUrl, captionPosition },
    gallery[] { asset->, alt, caption, creditUrl, captionPosition },
    faq[] { question, answer }
  }
`;
```

- [ ] **Step 3: Point `sitemapQuery` retreats at `event`**

Find the `retreats` projection inside `sitemapQuery` (it currently reads `*[_type == "retreat" ...]`) and change it to:

```groq
    "retreats": *[_type == "event" && type == "Retreat" && defined(slug.current)] | order(_updatedAt desc) { "slug": slug, _updatedAt },
```

Also confirm the `events` projection in `sitemapQuery` excludes retreats so the same slug isn't emitted under both `/events/` and `/retreats/`:

```groq
    "events": *[_type == "event" && type != "Retreat" && defined(slug.current)] | order(_updatedAt desc) { "slug": slug, _updatedAt },
```

(If `sitemapQuery` doesn't currently split these, edit it to match the two lines above.)

- [ ] **Step 4: Verify queries parse against live data**

Run (reads the live dataset, no mutation):

```bash
cd /Users/m/code/niamh; set -a; source .env.local 2>/dev/null; set +a
PID=$NEXT_PUBLIC_SANITY_PROJECT_ID; DS=${NEXT_PUBLIC_SANITY_DATASET:-production}
curl -s -G "https://$PID.apicdn.sanity.io/v2024-01-01/data/query/$DS" \
  --data-urlencode 'query=*[_type=="event" && type=="Retreat"]{title,"slug":slug.current}' | python3 -m json.tool
```

Expected: valid JSON (likely empty array until the migration in Task 7 runs — that's fine; we are checking the GROQ parses without error, not that data exists yet).

- [ ] **Step 5: Commit**

```bash
git add lib/sanity/queries.ts
git commit -m "refactor(sanity): source retreats and events from unified event type"
```

---

## Task 3: Rewrite `/events/[slug]` to fetch from Sanity

**Files:**
- Rewrite: `app/(site)/events/[slug]/page.tsx`

- [ ] **Step 1: Replace the placeholder file**

Replace the entire contents of `app/(site)/events/[slug]/page.tsx` with a Sanity-backed page. It uses `eventQuery` (non-retreat) + `eventsQuery` for `generateStaticParams`, and `notFound()` when no match (a retreat slug will not match `eventQuery`, so visiting `/events/the-recovery-advantage` 404s — correct, it lives at `/retreats/...`).

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FAQSection } from "@/components/sections/FAQSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { JsonLd } from "@/components/seo/JsonLd";
import { EventEnquiryForm } from "@/components/forms/EventEnquiryForm";
import { client } from "@/lib/sanity/client";
import { eventQuery, eventsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { portableTextComponents } from "@/lib/sanity/portableText";

export const revalidate = 60;

type Params = { slug: string };

interface EventDoc {
  _id: string;
  title: string;
  slug: { current: string };
  type?: string;
  dateStart?: string;
  dateEnd?: string;
  location?: { name?: string; city?: string; country?: string };
  price?: string;
  capacity?: number;
  status?: string;
  excerpt?: string;
  body?: import("@portabletext/react").PortableTextBlock[];
  image?: { asset?: { url?: string }; alt?: string };
  gallery?: { asset?: { url?: string }; alt?: string; caption?: string }[];
  faq?: { question: string; answer: string }[];
  seo?: { metaTitle?: string; metaDescription?: string };
}

export async function generateStaticParams() {
  const events = await client
    .fetch<{ slug: string }[]>(eventsQuery)
    .catch(() => []);
  return events.filter((e) => e.slug).map((e) => ({ slug: e.slug }));
}

async function getEvent(slug: string) {
  return client.fetch<EventDoc | null>(eventQuery, { slug }).catch(() => null);
}

function formatDateRange(start?: string, end?: string) {
  if (!start) return "";
  const s = new Date(start);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (!end) return s.toLocaleDateString("en-GB", opts);
  return `${s.toLocaleDateString("en-GB", opts)} – ${new Date(end).toLocaleDateString("en-GB", opts)}`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.seo?.metaTitle || event.title,
    description: event.seo?.metaDescription || event.excerpt,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const heroSrc = event.image?.asset
    ? urlFor(event.image).width(1600).height(900).fit("crop").url()
    : "/images/events-hero.jpg";
  const dateStr = formatDateRange(event.dateStart, event.dateEnd);
  const locationStr = [event.location?.name, event.location?.city, event.location?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          startDate: event.dateStart,
          endDate: event.dateEnd,
          eventStatus:
            event.status === "cancelled"
              ? "https://schema.org/EventCancelled"
              : "https://schema.org/EventScheduled",
          location: locationStr ? { "@type": "Place", name: locationStr } : undefined,
          description: event.excerpt,
        }}
      />

      <Section background="cream">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            {event.type && (
              <p className="font-sans text-xs uppercase tracking-widest text-sage mb-3">{event.type}</p>
            )}
            <h1 className="font-serif text-4xl md:text-6xl font-semibold mb-4">{event.title}</h1>
            <p className="font-sans text-base text-espresso/60">
              {[dateStr, locationStr].filter(Boolean).join(" · ")}
            </p>
            {event.price && (
              <p className="font-sans text-base text-espresso/80 mt-2">{event.price}</p>
            )}
          </div>
          <div className="relative aspect-[16/9] max-w-4xl mx-auto rounded-3xl overflow-hidden mt-10">
            <Image src={heroSrc} alt={event.image?.alt || event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 896px" priority />
          </div>
        </Container>
      </Section>

      {event.body && event.body.length > 0 && (
        <Section background="white">
          <Container>
            <div className="prose prose-lg max-w-2xl mx-auto font-sans text-espresso/80">
              <PortableText value={event.body} components={portableTextComponents} />
            </div>
          </Container>
        </Section>
      )}

      {event.gallery && event.gallery.length > 0 && <GallerySection images={event.gallery} />}

      {event.faq && event.faq.length > 0 && <FAQSection items={event.faq} />}

      <Section background="cream">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">
              {event.status === "sold-out" ? "Join the waitlist" : "Enquire about this event"}
            </h2>
          </div>
          <EventEnquiryForm eventTitle={event.title} />
        </Container>
      </Section>
    </>
  );
}
```

> Before running the build, verify the imported component prop names against the codebase: `GallerySection` (prop for image array), `FAQSection` (prop for items), `EventEnquiryForm` (prop for the event title), and that `portableTextComponents` is exported from `@/lib/sanity/portableText`. The `/retreats/[slug]` page imports the same components — match its usage exactly. Adjust prop names in this file to match if they differ; do not change the shared components.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in `app/(site)/events/[slug]/page.tsx`.

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/events/[slug]/page.tsx"
git commit -m "feat(events): wire event detail page to Sanity"
```

---

## Task 4: Show events on the `/events` listing

**Files:**
- Modify: `app/(site)/events/page.tsx`
- Verify: `components/cards/EventCard.tsx`, `components/sections/FilterBar.tsx`

- [ ] **Step 1: Confirm `EventCard` props match `eventsQuery`**

Read `components/cards/EventCard.tsx`. It links to `/events/${slug}` and expects props `{ _id, title, slug, type, dateStart, dateEnd, location, price, status, image, excerpt, index }`. `eventsQuery` (Task 2) returns exactly these with `slug` as a string and `image` projected. If `EventCard` reads any field differently (e.g. `image.asset.url`), confirm `urlFor`/`image.asset->` covers it. Make no changes unless a mismatch exists.

- [ ] **Step 2: Fetch events and render `EventsListing` on the page**

In `app/(site)/events/page.tsx`:

Add imports near the existing ones:

```ts
import { EventsListing } from "./EventsListing";
import { retreatsQuery, eventsQuery } from "@/lib/sanity/queries";
```

(remove the now-incomplete `import { retreatsQuery } from "@/lib/sanity/queries";` line and replace with the combined import above.)

Change the data fetch in `EventsPage` from the single retreats fetch to both, in parallel:

```ts
  const [retreats, events] = await Promise.all([
    client.fetch<RetreatCard[]>(retreatsQuery).catch(() => [] as RetreatCard[]),
    client.fetch<EventListItem[]>(eventsQuery).catch(() => [] as EventListItem[]),
  ]);
```

Add the `EventListItem` interface next to `RetreatCard`:

```ts
interface EventListItem {
  _id: string;
  title: string;
  slug: string;
  type?: string;
  dateStart?: string;
  dateEnd?: string;
  location?: { name?: string; city?: string; country?: string };
  price?: string;
  status?: string;
  image?: { asset?: { url?: string }; alt?: string };
  excerpt?: string;
}
```

- [ ] **Step 3: Insert the dynamic events section**

Immediately **after** the closing `</Section>` of the "Retreats" block and **before** the hardcoded "In-Person" `<Section>`, insert:

```tsx
      {/* Workshops, classes & online — from Sanity */}
      {events.length > 0 && (
        <>
          <Section background="white">
            <Container>
              <div className="max-w-2xl mx-auto text-center mb-4">
                <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">Upcoming Events</h2>
                <p className="font-sans text-base text-espresso/60">
                  Workshops, classes and online sessions — book your place below.
                </p>
              </div>
            </Container>
          </Section>
          <EventsListing events={events} />
        </>
      )}
```

> The hardcoded In-Person and Online sections stay as they are — they describe ongoing recurring offerings that aren't dated CMS events. Leave them untouched in this task.

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: build completes. `/events` and `/events/[slug]` compile.

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/events/page.tsx"
git commit -m "feat(events): render upcoming events on the events listing"
```

---

## Task 5: Update the revalidate webhook for the unified type

**Files:**
- Modify: `app/api/revalidate/route.ts`

- [ ] **Step 1: Make the `event` case revalidate the right detail path by type**

The webhook projection currently exposes `_type` and `slug`. We also need `type`. Update the `SanityProjection` interface and the `event` case. Replace the interface:

```ts
interface SanityProjection {
  _id?: string;
  _type?: string;
  type?: string;
  slug?: { current?: string } | null;
}
```

Replace the `retreat` and `event` cases in `pathsForDocument` with a single `event` case (delete the `retreat` case entirely):

```ts
    case "event": {
      const isRetreat = doc.type === "Retreat";
      const detail = slug ? [isRetreat ? `/retreats/${slug}` : `/events/${slug}`] : [];
      return ["/", "/events", ...detail];
    }
```

> The webhook must project `type` for this to work. After deploy, update the Sanity webhook's GROQ projection (Studio → API → Webhooks) to include `type`, e.g. `{ _id, _type, type, slug }`. Note this as a manual follow-up; it does not block the build.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in `app/api/revalidate/route.ts`.

- [ ] **Step 3: Commit**

```bash
git add app/api/revalidate/route.ts
git commit -m "refactor(revalidate): route event revalidation by type"
```

---

## Task 6: Verify the rich `/retreats/[slug]` page still builds (no field changes)

**Files:**
- Verify only: `app/(site)/retreats/[slug]/page.tsx`

- [ ] **Step 1: Confirm it imports `retreatQuery`/`retreatSlugsQuery`**

These now resolve `event` docs with `type == "Retreat"` but return identical field names, so the component needs no edits. Read the file's data-fetch section to confirm it only depends on field names, not on `_type`.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `/retreats/[slug]` compiles. With no retreat-typed events yet (pre-migration), `generateStaticParams` returns `[]` — that is allowed.

- [ ] **Step 3: Commit (only if a change was needed)**

If no change was required, skip. Otherwise:

```bash
git add "app/(site)/retreats/[slug]/page.tsx"
git commit -m "fix(retreats): align detail page with unified event query"
```

---

## Task 7: One-time data migration script

**Files:**
- Create: `scripts/migrate-events.mjs`

> This mutates the **live `production` dataset** (there is only one). Dry-run is the default. Take a backup first.

- [ ] **Step 1: Back up the dataset**

Run:

```bash
cd /Users/m/code/niamh
npx sanity@latest dataset export production "backups/production-$(git rev-parse --short HEAD).tar.gz"
```

Expected: a `.tar.gz` written under `backups/`. If the CLI prompts for login, run `npx sanity login` first (interactive — ask the user to run it via `! npx sanity login`).

- [ ] **Step 2: Write the migration script**

Create `scripts/migrate-events.mjs`:

```js
// One-time migration: fold the `retreat` document type into `event`.
// - Converts each `retreat` doc into a new `event` doc with type="Retreat",
//   copying all content fields and preserving the slug. Deletes the old retreat doc.
// - Sets `type` on existing `event` docs that have none (heuristic; review output).
// Usage:
//   node scripts/migrate-events.mjs           # dry run, prints planned changes
//   node scripts/migrate-events.mjs --apply   # performs the changes
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
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Heuristic type for untyped events: title contains "retreat" => Retreat, else Class.
function guessType(title = "") {
  return /retreat/i.test(title) ? "Retreat" : "Class";
}

const STRIP = new Set(["_id", "_rev", "_type", "_createdAt", "_updatedAt"]);

async function main() {
  if (!client.config().token) throw new Error("SANITY_API_TOKEN not set");

  const retreats = await client.fetch(`*[_type == "retreat"]`);
  const events = await client.fetch(`*[_type == "event"]{_id, title, type}`);

  console.log(`Found ${retreats.length} retreat doc(s), ${events.length} event doc(s).`);
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

  for (const e of events) {
    if (!e.type) {
      const t = guessType(e.title);
      console.log(`  event ${e._id} ("${e.title}") set type=${t}`);
      if (APPLY) tx.patch(e._id, { set: { type: t } });
    }
  }

  if (APPLY) {
    await tx.commit();
    console.log("✅ Applied.");
  } else {
    console.log("\nDry run only. Re-run with --apply to commit.");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Dry-run**

Run: `node scripts/migrate-events.mjs`
Expected: prints the planned `retreat → event` conversion for `retreat-recovery-advantage` and any `type` assignments for untyped events. **No mutations.** Review the output with the user — confirm the type guesses (especially the duplicate "Roots & Restore" docs) are acceptable before applying.

- [ ] **Step 4: Apply**

Run: `node scripts/migrate-events.mjs --apply`
Expected: `✅ Applied.`

- [ ] **Step 5: Verify the data moved**

Run:

```bash
cd /Users/m/code/niamh; set -a; source .env.local 2>/dev/null; set +a
PID=$NEXT_PUBLIC_SANITY_PROJECT_ID; DS=${NEXT_PUBLIC_SANITY_DATASET:-production}
curl -s -G "https://$PID.apicdn.sanity.io/v2024-01-01/data/query/$DS" \
  --data-urlencode 'query=*[_type=="event"]{title,type,"slug":slug.current} | order(type)' | python3 -m json.tool
curl -s -G "https://$PID.apicdn.sanity.io/v2024-01-01/data/query/$DS" \
  --data-urlencode 'query=count(*[_type=="retreat"])'
```

Expected: every doc is now `_type == "event"` with a `type`; the retreat count is `0`; "The Recovery Advantage" appears with `type: "Retreat"` and slug `the-recovery-advantage`.

- [ ] **Step 6: Commit the script**

```bash
git add scripts/migrate-events.mjs
git commit -m "chore(sanity): add one-time retreat->event migration script"
```

---

## Task 8: Retire the `retreat` schema

> Only after Task 7 verifies `count(*[_type=="retreat"]) == 0`.

**Files:**
- Modify: `sanity/schemas/index.ts`
- Delete: `sanity/schemas/retreat.ts`

- [ ] **Step 1: Remove the registration**

In `sanity/schemas/index.ts`, delete `import { retreat } from "./retreat";` and remove `retreat,` from the schema types array.

- [ ] **Step 2: Delete the schema file**

Run: `git rm sanity/schemas/retreat.ts`

- [ ] **Step 3: Full build + lint**

Run: `npm run build && npx eslint`
Expected: build passes; no lint errors introduced. Confirm no remaining import of `./retreat` or `_type == "retreat"`:

```bash
grep -rn "schemas/retreat\|_type == \"retreat\"\|_type==\"retreat\"" app components lib sanity
```

Expected: no matches (the revalidate `retreat` case was removed in Task 5; sitemap/queries updated in Task 2).

- [ ] **Step 4: Commit**

```bash
git add sanity/schemas/index.ts
git commit -m "chore(sanity): retire retreat type now folded into event"
```

---

## Task 9: End-to-end smoke test

**Files:** none (verification only)

- [ ] **Step 1: Run the dev server**

Run: `npm run dev` (background) and wait for "Ready".

- [ ] **Step 2: Check the pages**

- `GET /events` → shows a "Retreats" section with "The Recovery Advantage" linking to `/retreats/the-recovery-advantage`, and (if any event has a future `dateStart`) an "Upcoming Events" grid. If the grid is empty, confirm via the dry-run data that it's because seed dates are in the past — report that to the user, don't hack the query.
- `GET /retreats/the-recovery-advantage` → rich page renders (Concept, Schedule, etc.).
- `GET /events/<a-non-retreat-slug>` → simple event page renders.
- `GET /events/the-recovery-advantage` → 404 (retreats are not served here by design).
- `GET /` → homepage "Upcoming Retreats" shows the retreat with a "/events" link.
- `GET /sitemap.xml` → retreat slug under `/retreats/...`, event slugs under `/events/...`, no duplicates.

- [ ] **Step 3: Final lint + build**

Run: `npm run build && npx eslint`
Expected: clean.

- [ ] **Step 4: Hand off for review**

Use superpowers:requesting-code-review before merging. Then push the branch and open a squash-merge PR per the repo's workflow.

---

## Notes for the editor (Niamh) — to communicate after shipping

- There is now **one content type: "Events."** To make a retreat, set **Type = Retreat** and the extra retreat fields appear.
- Retreats publish at `/retreats/<slug>`; everything else at `/events/<slug>`.
- An event only appears on the site when **Published** AND its **Start Date is in the future.** Several existing events have past dates — update them to show.
- There is a **duplicate "Roots & Restore"** — delete one copy in Studio.
```