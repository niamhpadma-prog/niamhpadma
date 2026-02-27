import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Services",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: ["1-1 Coaching", "Group Classes", "Workshops", "Corporate"] },
    }),
    defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt Text", type: "string" }] }),
    defineField({ name: "pricing", title: "Pricing", type: "string" }),
    defineField({ name: "bookingUrl", title: "Booking URL", type: "url" }),
    defineField({
      name: "questionnaireType",
      title: "Questionnaire Type",
      type: "string",
      options: { list: ["breathwork", "yoga", "somatic", "coaching", "corporate"] },
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "question", title: "Question", type: "string" }),
          defineField({ name: "answer", title: "Answer", type: "text" }),
        ],
      }],
    }),
    defineField({ name: "orderRank", title: "Order", type: "string", hidden: true }),
  ],
  preview: { select: { title: "title", subtitle: "type" } },
});
