import { defineField, defineType } from "sanity";
import { seoFields } from "./seoFields";
import { richBlock } from "./_shared";

export const locationPage = defineType({
  name: "locationPage",
  title: "Location Pages",
  type: "document",
  fields: [
    defineField({ name: "city", title: "City", type: "string", validation: (r) => r.required() }),
    defineField({ name: "service", title: "Service", type: "string", validation: (r) => r.required() }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "array", of: [richBlock] }),
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
    defineField({
      name: "relatedServices",
      title: "Related Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    ...seoFields,
  ],
  preview: {
    select: { city: "city", service: "service" },
    prepare: ({ city, service }) => ({ title: `${service} in ${city}` }),
  },
});
