import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string" }),
    defineField({
      name: "navigation",
      title: "Navigation",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "label", title: "Label", type: "string" }),
          defineField({ name: "href", title: "Link", type: "string" }),
          defineField({
            name: "children",
            title: "Dropdown Items",
            type: "array",
            of: [{
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "href", title: "Link", type: "string" }),
              ],
            }],
          }),
        ],
      }],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        defineField({ name: "tagline", title: "Tagline", type: "string" }),
        defineField({
          name: "links",
          title: "Footer Links",
          type: "array",
          of: [{ type: "object", fields: [{ name: "label", title: "Label", type: "string" }, { name: "href", title: "Link", type: "string" }] }],
        }),
        defineField({
          name: "socialLinks",
          title: "Social Links",
          type: "array",
          of: [{ type: "object", fields: [{ name: "platform", title: "Platform", type: "string", options: { list: ["instagram", "youtube", "tiktok", "linkedin", "spotify"] } }, { name: "url", title: "URL", type: "url" }] }],
        }),
      ],
    }),
    defineField({
      name: "contactInfo",
      title: "Contact Info",
      type: "object",
      fields: [
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "address", title: "Address", type: "text", rows: 2 }),
        defineField({
          name: "coordinates",
          title: "Coordinates",
          type: "object",
          fields: [
            defineField({ name: "lat", title: "Latitude", type: "number" }),
            defineField({ name: "lng", title: "Longitude", type: "number" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
