import { defineField, defineType } from "sanity";

export const courseModule = defineType({
  name: "courseModule",
  title: "Course Modules",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Module position within the course (1, 2, 3...)",
      validation: (r) => r.integer().positive(),
    }),
    defineField({
      name: "lessons",
      title: "Lessons",
      type: "array",
      of: [{ type: "reference", to: [{ type: "courseLesson" }] }],
    }),
  ],
  preview: {
    select: { title: "title", order: "order", lessons: "lessons" },
    prepare: ({ title, order, lessons }) => ({
      title: `${order ? `${order}. ` : ""}${title}`,
      subtitle: `${lessons?.length || 0} lessons`,
    }),
  },
});
