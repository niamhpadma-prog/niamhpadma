import { defineArrayMember, defineField, defineType } from "sanity";

// "Ways to Work Together" — the numbered offerings block on Work With Me.
//
// One document holds the whole section: the headings, the numbered list, and
// the full-details PDF. Everything is edited here so Niamh can add, reorder or
// retire an offering without a deploy. Drag the rows to reorder; the numbers
// are drawn from position, so she never has to renumber anything by hand.
export const waysToWork = defineType({
  name: "waysToWork",
  title: "Ways to Work Together",
  type: "document",
  fields: [
    defineField({
      name: "enabled",
      title: "Show this section",
      description: "Turn off to hide the whole block from the Work With Me page.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "eyebrow",
      title: "Small Heading Above",
      description: 'The line in terracotta, e.g. "Somatic Coaching".',
      type: "string",
    }),
    defineField({
      name: "eyebrowItalic",
      title: "Second Small Heading (italic)",
      description: 'The italic line under it, e.g. "Private mentorship".',
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Ways to work together",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      description: "Optional line under the heading.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "offerings",
      title: "The Offerings",
      description:
        "Each one becomes a numbered card. Drag to reorder — the numbers follow.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "offering",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              description: 'Without a number — e.g. "Single session".',
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "duration",
              title: "Format",
              description: 'The italic line, e.g. "1 session of 90 minutes."',
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              description:
                "Line breaks are kept exactly as you type them, so you can break lines where you want them.",
              type: "text",
              rows: 5,
            }),
            defineField({
              name: "price",
              title: "Price",
              description: 'Optional — e.g. "611 EUR". Leave blank to hide.',
              type: "string",
            }),
            defineField({
              name: "onlineUrl",
              title: "“online” Button Link",
              description:
                "Where the online booking button goes — usually a Calendly link. Leave blank to hide the button.",
              type: "url",
              validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto"] }),
            }),
            defineField({
              name: "inPersonUrl",
              title: "“in person” Button Link",
              description:
                "Where the in-person booking button goes. Leave blank to hide the button.",
              type: "url",
              validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto"] }),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "duration" },
          },
        }),
      ],
    }),
    defineField({
      name: "pdfLabel",
      title: "PDF Button Label",
      type: "string",
      initialValue: "Read full PDF",
    }),
    defineField({
      name: "pdfFile",
      title: "Full Details (PDF)",
      description:
        "Upload the offerings PDF. If you'd rather link somewhere else, use the field below instead.",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "pdfUrl",
      title: "Or Link Instead of a PDF",
      description: "Used only when no PDF is uploaded above.",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: { prepare: () => ({ title: "Ways to Work Together" }) },
});
