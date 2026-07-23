import { defineField, defineType } from "sanity";
import { seoFields } from "./seoFields";
import { bulletBlock, imageCaptionFields, richBlock } from "./_shared";

export const event = defineType({
  name: "event",
  title: "Events",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "hero", title: "Retreat · Hero" },
    { name: "concept", title: "Retreat · Concept" },
    { name: "who", title: "Retreat · Who It's For" },
    { name: "experience", title: "Retreat · Experience & Schedule" },
    { name: "venue", title: "Retreat · Venue" },
    { name: "included", title: "Retreat · What's Included" },
    { name: "guide", title: "Retreat · Guide" },
    { name: "whatIs", title: "Retreat · What Is…" },
    { name: "pricing", title: "Retreat · Pricing & CTAs" },
    { name: "faq", title: "FAQ" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "basics",
      description:
        `\u{1F4A1} Need help? Fill in each field top-to-bottom, then press Publish (bottom-right). Your event only appears on the site once it’s Published AND its Start Date is in the future. — This field is the event name as it appears on the site (e.g. “Spring Breathwork Retreat”).`,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basics",
      options: { source: "title" },
      description:
        "The web address for this event. Click “Generate” to fill it from the title. Avoid changing it after publishing — old links will stop working.",
      validation: (r) => r.required(),
    }),
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
    defineField({
      name: "dateStart",
      title: "Start Date",
      type: "datetime",
      group: "basics",
      description:
        "When the event starts. ⚠️ Must be a future date — the Events page only shows upcoming events, so a missing or past date means it won't appear on the site.",
      validation: (r) =>
        r.warning().custom((value) => {
          if (!value)
            return "No Start Date set — this event won't appear on the website's Events page until you add a future date.";
          if (new Date(value as string).getTime() < Date.now())
            return "This Start Date is in the past, so the event won't appear in the website's upcoming events.";
          return true;
        }),
    }),
    defineField({
      name: "dateEnd",
      title: "End Date",
      type: "datetime",
      group: "basics",
      description: "When it finishes (for multi-day retreats). Leave blank for a single-day event.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      group: "basics",
      description: "Where the event takes place. Coordinates are optional (used for maps).",
      fields: [
        defineField({ name: "name", title: "Venue Name", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" }),
        defineField({
          name: "geo",
          title: "Coordinates",
          type: "object",
          fields: [
            defineField({ name: "lat", title: "Latitude", type: "number" }),
            defineField({ name: "lng", title: "Longitude", type: "number" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      group: "basics",
      description: "Free text, e.g. “€250” or “From €180”. Leave blank to hide the price.",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking link",
      type: "url",
      group: "basics",
      hidden: ({ document }) => document?.type === "Retreat",
      description:
        "Optional. Paste a link where people book or pay — Eventbrite, a Stripe payment link, a Google Form, etc. The “Book Now” button will open it in a new tab. Leave blank and “Book Now” sends people to your contact form instead.",
      validation: (r) =>
        r.uri({ scheme: ["http", "https"] }).error("Please paste a full link starting with https://"),
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "number",
      group: "basics",
      description: "Maximum number of spots (optional).",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "basics",
      options: { list: ["upcoming", "sold-out", "cancelled"] },
      initialValue: "upcoming",
      description:
        "Mark as “sold-out” or “cancelled” later without deleting the event — the listing updates to match.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "basics",
      description: "A 1–2 sentence summary shown on the Events list and in previews. Keep it short.",
    }),
    defineField({
      name: "body",
      title: "Description",
      type: "array",
      group: "basics",
      of: [richBlock],
      description: "The full event description shown on the event's own page.",
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      group: "basics",
      options: { hotspot: true },
      fields: imageCaptionFields,
      description:
        "Main image for the event card and page. A landscape photo works best. Please add Alt text — it helps accessibility and SEO.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "basics",
      of: [{ type: "image", options: { hotspot: true }, fields: imageCaptionFields }],
      description: "Extra photos shown on the event page (optional).",
    }),

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

    // ─── Retreat · Who It's For ──────────────────────────────
    defineField({ name: "whoHeading", title: "Heading", type: "string", group: "who",
      initialValue: "Who It's For", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whoSubheading", title: "Subheading", type: "string", group: "who",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whoIntro", title: "Intro Paragraph", type: "text", rows: 3, group: "who",
      hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whoBullets", title: "Bullets", type: "array", group: "who",
      of: [bulletBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "whoImage", title: "Who It's For Image", type: "image", group: "who",
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

    // ─── Retreat · What's Included ───────────────────────────
    defineField({ name: "includedHeading", title: "Heading", type: "string", group: "included",
      initialValue: "What's Included", hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "includedItems", title: "Items", type: "array", group: "included",
      of: [bulletBlock], hidden: ({ document }) => document?.type !== "Retreat" }),
    defineField({ name: "includedImage", title: "What's Included Banner Image", type: "image", group: "included",
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

    // ─── FAQ ─────────────────────────────────────────────────
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "faq",
      description: "Common questions shown on the event page (optional).",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "question", title: "Question", type: "string" }),
          defineField({ name: "answer", title: "Answer", type: "text" }),
        ],
      }],
    }),

    ...seoFields.map((f) => ({ ...f, group: "seo" })),
  ],
  preview: {
    select: { title: "title", subtitle: "type", date: "dateStart" },
    prepare: ({ title, subtitle, date }) => ({
      title,
      subtitle: `${subtitle} — ${date ? new Date(date).toLocaleDateString() : "No date"}`,
    }),
  },
});
