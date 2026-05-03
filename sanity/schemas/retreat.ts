import { defineField, defineType } from "sanity";
import { seoFields } from "./seoFields";

export const retreat = defineType({
  name: "retreat",
  title: "Retreats",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "concept", title: "Concept" },
    { name: "who", title: "Who It’s For" },
    { name: "experience", title: "Experience & Schedule" },
    { name: "venue", title: "Venue" },
    { name: "included", title: "What’s Included" },
    { name: "guide", title: "Guide" },
    { name: "whatIs", title: "What Is…" },
    { name: "pricing", title: "Pricing & CTAs" },
    { name: "faq", title: "FAQ" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ─── Hero ──────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "hero",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "hero",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
      description: "When duplicating: change this so the new retreat has its own URL.",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "hero",
      description: "e.g., 5-Day Work and Wellness Immersion",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "hero",
      description: "e.g., For people who want focus without burnout.",
    }),
    defineField({
      name: "secondaryTagline",
      title: "Secondary Tagline",
      type: "string",
      group: "hero",
      description: "e.g., Work that moves. Rest that restores.",
    }),
    defineField({
      name: "partnership",
      title: "Partnership Line",
      type: "string",
      group: "hero",
      description: "e.g., Sensinity Retreats × The Rebello, Porto",
    }),
    defineField({
      name: "dateStart",
      title: "Start Date",
      type: "datetime",
      group: "hero",
    }),
    defineField({
      name: "dateEnd",
      title: "End Date",
      type: "datetime",
      group: "hero",
    }),
    defineField({
      name: "locationLine",
      title: "Location Line",
      type: "string",
      group: "hero",
      description: "Display string e.g., Porto · The Rebello · 13–17 September",
    }),
    defineField({
      name: "location",
      title: "Location (Structured)",
      type: "object",
      group: "hero",
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
      name: "status",
      title: "Status",
      type: "string",
      group: "hero",
      options: { list: ["upcoming", "sold-out", "cancelled"] },
      initialValue: "upcoming",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),

    // ─── Concept ──────────────────────────────────────────────
    defineField({
      name: "conceptHeading",
      title: "Concept Heading",
      type: "string",
      group: "concept",
      initialValue: "The Concept",
    }),
    defineField({
      name: "conceptBody",
      title: "Concept Body",
      type: "array",
      group: "concept",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "conceptImage",
      title: "Concept Image",
      type: "image",
      group: "concept",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),

    // ─── Who It's For ──────────────────────────────────────────
    defineField({
      name: "whoHeading",
      title: "Heading",
      type: "string",
      group: "who",
      initialValue: "Who It’s For",
    }),
    defineField({
      name: "whoSubheading",
      title: "Subheading",
      type: "string",
      group: "who",
      description: "e.g., For People Who Don’t Want To Split Their Lives In Two",
    }),
    defineField({
      name: "whoIntro",
      title: "Intro Paragraph",
      type: "text",
      rows: 3,
      group: "who",
    }),
    defineField({
      name: "whoBullets",
      title: "Bullets",
      type: "array",
      group: "who",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "whoImage",
      title: "Who It’s For Image",
      type: "image",
      group: "who",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),

    // ─── Experience & Schedule ────────────────────────────────
    defineField({
      name: "experienceHeading",
      title: "Heading",
      type: "string",
      group: "experience",
      initialValue: "The Experience",
    }),
    defineField({
      name: "experienceSubheading",
      title: "Subheading",
      type: "string",
      group: "experience",
      description: "e.g., A Rhythm That Works",
    }),
    defineField({
      name: "experienceBody",
      title: "Body",
      type: "array",
      group: "experience",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "experienceImage",
      title: "Experience Image",
      type: "image",
      group: "experience",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "scheduleHeading",
      title: "Schedule Heading",
      type: "string",
      group: "experience",
      initialValue: "A day in the life on retreat",
    }),
    defineField({
      name: "schedule",
      title: "Daily Schedule",
      type: "array",
      group: "experience",
      of: [
        {
          type: "object",
          name: "scheduleItem",
          fields: [
            defineField({ name: "time", title: "Time", type: "string", description: "e.g., 6:45 AM" }),
            defineField({ name: "activity", title: "Activity", type: "string" }),
            defineField({
              name: "sectionLabel",
              title: "Section Divider (optional)",
              type: "string",
              description: "Use to break the schedule, e.g., 'Mornings in digital detox' or 'Digital detox begins'",
            }),
          ],
          preview: {
            select: { time: "time", activity: "activity", section: "sectionLabel" },
            prepare: ({ time, activity, section }) => ({
              title: section || `${time || ""} ${activity || ""}`.trim(),
              subtitle: section ? `${time || ""} ${activity || ""}`.trim() : undefined,
            }),
          },
        },
      ],
    }),

    // ─── Venue ────────────────────────────────────────────────
    defineField({
      name: "venueHeading",
      title: "Heading",
      type: "string",
      group: "venue",
      initialValue: "The Venue",
    }),
    defineField({
      name: "venueSubheading",
      title: "Subheading",
      type: "string",
      group: "venue",
      description: "e.g., A New Hotel With An Old Soul",
    }),
    defineField({
      name: "venueBody",
      title: "Body",
      type: "array",
      group: "venue",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "venueBullets",
      title: "Highlights / Between Sessions",
      type: "array",
      group: "venue",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "venueImage",
      title: "Venue Image",
      type: "image",
      group: "venue",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "venue",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Alt Text", type: "string" },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
      ],
    }),

    // ─── What's Included ──────────────────────────────────────
    defineField({
      name: "includedHeading",
      title: "Heading",
      type: "string",
      group: "included",
      initialValue: "What’s Included",
    }),
    defineField({
      name: "includedItems",
      title: "Items",
      type: "array",
      group: "included",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "includedImage",
      title: "What’s Included Banner Image",
      type: "image",
      group: "included",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),

    // ─── Guide ────────────────────────────────────────────────
    defineField({
      name: "guideHeading",
      title: "Heading",
      type: "string",
      group: "guide",
      initialValue: "Meet Your Guide",
    }),
    defineField({
      name: "guideName",
      title: "Guide Name",
      type: "string",
      group: "guide",
      initialValue: "Niamh Byron",
    }),
    defineField({
      name: "guideRoles",
      title: "Guide Roles",
      type: "array",
      group: "guide",
      of: [{ type: "string" }],
      description: "e.g., Yoga teacher · Breathwork facilitator · Somatic coach",
    }),
    defineField({
      name: "guideBio",
      title: "Guide Bio",
      type: "array",
      group: "guide",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "guideImage",
      title: "Guide Image",
      type: "image",
      group: "guide",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),

    // ─── What Is… ────────────────────────────────────────────
    defineField({
      name: "whatIsHeading",
      title: "Heading",
      type: "string",
      group: "whatIs",
    }),
    defineField({
      name: "whatIsBody",
      title: "Body",
      type: "array",
      group: "whatIs",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "whatIsImage",
      title: "What Is… Image",
      type: "image",
      group: "whatIs",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),

    // ─── Pricing & CTAs ───────────────────────────────────────
    defineField({
      name: "finalHeadline",
      title: "Final Section Headline",
      type: "string",
      group: "pricing",
      description: "Above pricing — e.g., Ready to find your Recovery Advantage flow?",
    }),
    defineField({
      name: "limitedSpotsCopy",
      title: "Limited Spots Copy",
      type: "string",
      group: "pricing",
      initialValue: "Limited spots. Kept intentionally small.",
    }),
    defineField({
      name: "pricingTiers",
      title: "Pricing Tiers",
      type: "array",
      group: "pricing",
      of: [
        {
          type: "object",
          name: "pricingTier",
          fields: [
            defineField({
              name: "label",
              title: "Tier Label",
              type: "string",
              description: "e.g., Early access — limited availability",
            }),
            defineField({
              name: "options",
              title: "Options",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "type", title: "Suite Type", type: "string" }),
                    defineField({ name: "price", title: "Price", type: "string" }),
                  ],
                  preview: {
                    select: { title: "type", subtitle: "price" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "label" },
          },
        },
      ],
    }),
    defineField({
      name: "secureCtaLabel",
      title: "Primary CTA Label",
      type: "string",
      group: "pricing",
      initialValue: "Secure Your Spot",
    }),
    defineField({
      name: "bookCallUrl",
      title: "Book a Call URL (Calendly)",
      type: "url",
      group: "pricing",
      initialValue: "https://calendly.com/hello-somatictherapyinlisbon/30min",
    }),
    defineField({
      name: "enquiryRecipient",
      title: "Enquiry Recipient Email (override)",
      type: "string",
      group: "pricing",
      description: "Leave blank to use the default site email.",
    }),

    // ─── FAQ ──────────────────────────────────────────────────
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "faq",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text" }),
          ],
        },
      ],
    }),

    // ─── SEO ──────────────────────────────────────────────────
    ...seoFields.map((f) => ({ ...f, group: "seo" })),
  ],
  preview: {
    select: { title: "title", subtitle: "locationLine", date: "dateStart", media: "heroImage" },
    prepare: ({ title, subtitle, date, media }) => ({
      title,
      subtitle: subtitle || (date ? new Date(date).toLocaleDateString() : "Retreat"),
      media,
    }),
  },
});
