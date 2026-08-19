import { defineField, defineType } from "sanity";

// A short video or audio introduction to Niamh and her work, shown on My Story.
// Hosted on YouTube or Vimeo — she pastes the link and it embeds, so there is
// no file to upload and no size limit to worry about.
export const introMedia = defineType({
  name: "introMedia",
  title: "Intro Video",
  type: "document",
  fields: [
    defineField({
      name: "enabled",
      title: "Show on My Story",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Meet Niamh",
    }),
    defineField({
      name: "body",
      title: "Intro Text",
      description: "Optional — a line or two above the video.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mediaUrl",
      title: "YouTube or Vimeo Link",
      description:
        "Paste the normal link from the address bar, e.g. https://www.youtube.com/watch?v=… or https://vimeo.com/…",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).custom((value) => {
          if (!value) return true;
          return /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(value)
            ? true
            : "Please paste a YouTube or Vimeo link.";
        }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      description: "Optional — shown beneath the video.",
      type: "string",
    }),
  ],
  preview: { prepare: () => ({ title: "Intro Video" }) },
});
