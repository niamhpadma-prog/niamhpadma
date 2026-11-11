import { defineArrayMember, defineField, defineType } from "sanity";

// Turns a title into a safe web address. Sanity's default "Generate" keeps
// characters that break URLs — a slug containing spaces produces a link that
// 404s even though the document is published correctly.
export function toUrlSafeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents: "Niamh's Café" -> "niamhs-cafe"
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}


// Shared field set added to every image so Niamh can credit the photographer
// and choose where the caption appears relative to the image.
export const imageCaptionFields = [
  defineField({
    name: "alt",
    title: "Alt Text",
    type: "string",
    description: "Describe what's in the photo (used by screen readers and SEO).",
  }),
  defineField({
    name: "caption",
    title: "Caption / Photo Credit",
    type: "string",
    description:
      "Visible label shown on the page (above, below, or overlaid). E.g. 'Photo by Jane Doe' or 'Image courtesy of The Rebello'. If left blank, Alt Text is shown instead.",
  }),
  defineField({
    name: "creditUrl",
    title: "Caption Link (optional)",
    type: "url",
    description:
      "Optional. Makes the caption clickable — e.g. the photographer's website or the hotel page. Leave blank for plain text. Opens in a new tab.",
    validation: (r) =>
      r.uri({
        allowRelative: false,
        scheme: ["http", "https"],
      }),
  }),
  defineField({
    name: "captionPosition",
    title: "Caption Position",
    type: "string",
    options: {
      list: [
        { title: "Below image", value: "below" },
        { title: "Above image", value: "above" },
        { title: "Overlay on image (bottom)", value: "overlay" },
      ],
      layout: "radio",
    },
    initialValue: "below",
    description: "Where the caption sits. Only takes effect if a caption is set.",
  }),
];

// A reusable annotation that gives Niamh a real link button (with URL
// validation + open-in-new-tab) inside any portable-text field.
export const linkAnnotation = {
  name: "link",
  type: "object",
  title: "Link",
  fields: [
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (r) =>
        r.uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "blank",
      title: "Open in new tab",
      type: "boolean",
      initialValue: true,
    }),
  ],
};

// Block definition with explicit link annotation. Used by every rich-text
// field on the site so the link button is consistently available.
export const richBlock = {
  type: "block" as const,
  marks: {
    annotations: [linkAnnotation],
  },
};

// Lightweight portable text used for short single-line bullets where Niamh
// only needs basic formatting + a hyperlink (no headings, lists, images).
export const bulletBlock = {
  type: "block" as const,
  styles: [{ title: "Normal", value: "normal" }],
  lists: [],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
    ],
    annotations: [linkAnnotation],
  },
};

// Reusable inline image (used inside portable text bodies and as a
// document-level image type).
export const captionedImage = defineType({
  name: "captionedImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: imageCaptionFields,
});

// Inline image array member — the same as captionedImage but wrapped for use
// inside portable-text arrays (e.g. blog post body).
export const inlineImageMember = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  fields: imageCaptionFields,
});
