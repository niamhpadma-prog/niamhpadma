import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "quote", title: "Quote", type: "text", validation: (r) => r.required() }),
    defineField({
      name: "service",
      title: "Service",
      type: "string",
      options: { list: ["1-1 Coaching", "Group Classes", "Workshops", "Corporate", "Retreat"] },
    }),
    defineField({ name: "rating", title: "Rating", type: "number", validation: (r) => r.min(1).max(5) }),
    defineField({ name: "isFeatured", title: "Featured", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "service" } },
});
