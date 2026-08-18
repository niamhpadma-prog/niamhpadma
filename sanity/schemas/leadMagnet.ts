import { defineField, defineType } from "sanity";

// The free-download pop-up (currently the mindful nutrition ebook). Niamh
// controls everything here — the copy, the file, and whether it shows at all.
// Turning "Show the pop-up" off takes it off the site immediately; no deploy.
export const leadMagnet = defineType({
  name: "leadMagnet",
  title: "Free Download Pop-Up",
  type: "document",
  fields: [
    defineField({
      name: "enabled",
      title: "Show the pop-up",
      description: "Turn this off to hide the pop-up across the whole site.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "A free guide to mindful nutrition",
    }),
    defineField({
      name: "body",
      title: "Body",
      description: "One or two lines on what they get and why it's worth their email.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "buttonLabel",
      title: "Button Label",
      type: "string",
      initialValue: "Send me the guide",
    }),
    defineField({
      name: "file",
      title: "The Download (PDF)",
      description: "Upload the ebook here. Swap this file any time and the link updates itself.",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      description: "Optional — the ebook cover, shown beside the form.",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "successMessage",
      title: "Message After They Sign Up",
      type: "string",
      initialValue: "Check your inbox — and grab your copy below.",
    }),
    defineField({
      name: "delaySeconds",
      title: "Seconds Before It Appears",
      description:
        "It also appears once someone scrolls halfway down a page, whichever happens first. It only ever shows once per visitor.",
      type: "number",
      initialValue: 20,
      validation: (Rule) => Rule.min(0).max(120),
    }),
  ],
  preview: { prepare: () => ({ title: "Free Download Pop-Up" }) },
});
