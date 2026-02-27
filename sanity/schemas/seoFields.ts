import { defineField } from "sanity";

export const seoFields = [
  defineField({
    name: "seo",
    title: "SEO",
    type: "object",
    fields: [
      defineField({
        name: "metaTitle",
        title: "Meta Title",
        type: "string",
        validation: (r) => r.max(60).warning("Keep under 60 characters"),
      }),
      defineField({
        name: "metaDescription",
        title: "Meta Description",
        type: "text",
        rows: 3,
        validation: (r) => r.max(160).warning("Keep under 160 characters"),
      }),
      defineField({
        name: "ogImage",
        title: "OG Image",
        type: "image",
      }),
      defineField({
        name: "noIndex",
        title: "No Index",
        type: "boolean",
        initialValue: false,
      }),
    ],
  }),
];
