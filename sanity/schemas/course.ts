import { defineField, defineType } from "sanity";
import { seoFields } from "./seoFields";

export const course = defineType({
  name: "course",
  title: "Courses",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short one-liner shown on course cards",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Full course description for the sales page",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Numeric price (e.g. 69)",
      validation: (r) => r.positive(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: { list: ["GBP", "EUR", "USD"] },
      initialValue: "GBP",
    }),
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      description: "The Stripe Price ID for checkout (e.g. price_xxx)",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt Text", type: "string" }],
    }),
    defineField({
      name: "previewVideoUrl",
      title: "Preview Video URL",
      type: "url",
      description: "Optional Vimeo or YouTube URL for a free preview on the sales page",
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "string",
      options: { list: ["Beginner", "Intermediate", "All Levels"] },
      initialValue: "All Levels",
    }),
    defineField({
      name: "totalDuration",
      title: "Total Duration",
      type: "string",
      description: 'e.g. "4.5 hours"',
    }),
    defineField({
      name: "whatYoullLearn",
      title: "What You'll Learn",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullet points for the sales page",
    }),
    defineField({
      name: "modules",
      title: "Modules",
      type: "array",
      of: [{ type: "reference", to: [{ type: "courseModule" }] }],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
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
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "published", "archived"] },
      initialValue: "draft",
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: "title", subtitle: "status", price: "price", currency: "currency" },
    prepare: ({ title, subtitle, price, currency }) => ({
      title,
      subtitle: `${subtitle} — ${currency || "GBP"} ${price || "No price"}`,
    }),
  },
});
