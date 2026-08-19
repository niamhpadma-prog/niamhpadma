import { defineField, defineType } from "sanity";
import { seoFields } from "./seoFields";
import { imageCaptionFields, richBlock } from "./_shared";

export const post = defineType({
  name: "post",
  title: "Blog Posts",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: imageCaptionFields,
      description:
        "Either upload an image OR a video below. If both are set, the video is used.",
    }),
    defineField({
      name: "coverVideo",
      title: "Cover Video",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      fields: [
        {
          name: "alt",
          title: "Alt Text / Description",
          type: "string",
          description: "What is shown — used by screen readers.",
        },
      ],
      description:
        "Optional. Upload an .mp4, .webm or .mov. Plays muted on loop in card and article header.",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      // Must stay in sync with the filter chips in app/(site)/journal/BlogListing.tsx.
      // "Poems", "Mindset" and "Retreats" were missing here while being used by
      // real posts, so Niamh could not pick them in the Studio.
      options: {
        list: ["Poems", "Yoga", "Breathwork", "Somatic", "Mindset", "Nutrition", "Wellness", "Retreats", "Lifestyle"],
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        richBlock,
        {
          type: "image",
          options: { hotspot: true },
          fields: imageCaptionFields,
        },
        {
          name: "videoBlock",
          type: "object",
          title: "Video",
          fields: [
            {
              name: "file",
              title: "Video File",
              type: "file",
              options: { accept: "video/mp4,video/webm,video/quicktime" },
            },
            { name: "alt", title: "Alt Text / Description", type: "string" },
            { name: "caption", title: "Caption", type: "string" },
          ],
          preview: {
            select: { caption: "caption", alt: "alt" },
            prepare: ({ caption, alt }) => ({
              title: caption || alt || "Video",
              subtitle: "Inline video",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: "title", date: "publishedAt", media: "coverImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString() : "Draft",
      media,
    }),
  },
});
