import { defineField, defineType } from "sanity";
import { richBlock } from "./_shared";

export const courseLesson = defineType({
  name: "courseLesson",
  title: "Course Lessons",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Vimeo or YouTube video URL",
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: 'e.g. "8:30"',
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lesson position within the module (1, 2, 3...)",
      validation: (r) => r.integer().positive(),
    }),
    defineField({
      name: "isFreePreview",
      title: "Free Preview",
      type: "boolean",
      description: "Allow non-purchasers to access this lesson",
      initialValue: false,
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [{ type: "file" }],
      description: "Downloadable files (PDFs, worksheets, etc.)",
    }),
    defineField({
      name: "body",
      title: "Lesson Notes",
      type: "array",
      of: [richBlock],
      description: "Optional text content below the video",
    }),
  ],
  preview: {
    select: { title: "title", order: "order", duration: "duration", isFreePreview: "isFreePreview" },
    prepare: ({ title, order, duration, isFreePreview }) => ({
      title: `${order ? `${order}. ` : ""}${title}`,
      subtitle: [duration, isFreePreview && "Free Preview"].filter(Boolean).join(" · "),
    }),
  },
});
