import { defineField, defineType } from "sanity";
import { seoFields } from "./seoFields";
import { pageBuilderBlocks } from "./pageBuilder";

export const page = defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    ...seoFields,
    defineField({
      name: "pageBuilder",
      title: "Page Builder",
      type: "array",
      of: pageBuilderBlocks,
    }),
  ],
  preview: { select: { title: "title" } },
});
