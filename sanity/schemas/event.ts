import { defineField, defineType } from "sanity";
import { seoFields } from "./seoFields";

export const event = defineType({
  name: "event",
  title: "Events",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: ["Retreat", "Workshop", "Class", "Online"] },
    }),
    defineField({ name: "dateStart", title: "Start Date", type: "datetime" }),
    defineField({ name: "dateEnd", title: "End Date", type: "datetime" }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Venue Name", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" }),
        defineField({
          name: "geo",
          title: "Coordinates",
          type: "object",
          fields: [
            defineField({ name: "lat", title: "Latitude", type: "number" }),
            defineField({ name: "lng", title: "Longitude", type: "number" }),
          ],
        }),
      ],
    }),
    defineField({ name: "price", title: "Price", type: "string" }),
    defineField({ name: "capacity", title: "Capacity", type: "number" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["upcoming", "sold-out", "cancelled"] },
      initialValue: "upcoming",
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "image", title: "Cover Image", type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt Text", type: "string" }] }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt Text", type: "string" }, { name: "caption", title: "Caption", type: "string" }] }],
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
    ...seoFields,
  ],
  preview: {
    select: { title: "title", subtitle: "type", date: "dateStart" },
    prepare: ({ title, subtitle, date }) => ({
      title,
      subtitle: `${subtitle} — ${date ? new Date(date).toLocaleDateString() : "No date"}`,
    }),
  },
});
