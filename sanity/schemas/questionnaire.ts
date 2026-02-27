import { defineField, defineType } from "sanity";

export const questionnaire = defineType({
  name: "questionnaire",
  title: "Questionnaires",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "serviceType",
      title: "Service Type",
      type: "string",
      options: { list: ["breathwork", "yoga", "somatic", "coaching", "corporate"] },
    }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
    defineField({
      name: "fields",
      title: "Form Fields",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "label", title: "Label", type: "string" }),
          defineField({ name: "name", title: "Field Name", type: "string" }),
          defineField({
            name: "type",
            title: "Field Type",
            type: "string",
            options: { list: ["text", "email", "select", "textarea", "radio", "checkbox"] },
          }),
          defineField({ name: "placeholder", title: "Placeholder", type: "string" }),
          defineField({ name: "required", title: "Required", type: "boolean", initialValue: false }),
          defineField({
            name: "options",
            title: "Options (for select/radio/checkbox)",
            type: "array",
            of: [{ type: "string" }],
            hidden: ({ parent }) => !["select", "radio", "checkbox"].includes(parent?.type),
          }),
        ],
        preview: { select: { title: "label", subtitle: "type" } },
      }],
    }),
    defineField({ name: "submitLabel", title: "Submit Button Label", type: "string", initialValue: "Submit" }),
    defineField({ name: "successMessage", title: "Success Message", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "serviceType" } },
});
