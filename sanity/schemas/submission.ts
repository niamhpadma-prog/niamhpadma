import { defineField, defineType } from "sanity";

export const submission = defineType({
  name: "submission",
  title: "Submissions",
  type: "document",
  fields: [
    defineField({ name: "serviceType", title: "Service Type", type: "string" }),
    defineField({ name: "title", title: "Form Title", type: "string" }),
    defineField({
      name: "answers",
      title: "Answers",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
      ],
      options: { collapsible: true },
    }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
  ],
  preview: {
    select: { title: "answers.name", subtitle: "serviceType", date: "submittedAt" },
    prepare: ({ title, subtitle, date }) => ({
      title: title || "Anonymous",
      subtitle: `${subtitle} — ${date ? new Date(date).toLocaleDateString() : ""}`,
    }),
  },
});
