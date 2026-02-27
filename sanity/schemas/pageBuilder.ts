import { defineArrayMember, defineField } from "sanity";

export const pageBuilderBlocks = [
  defineArrayMember({
    name: "hero",
    title: "Hero",
    type: "object",
    fields: [
      defineField({ name: "headline", title: "Headline", type: "string" }),
      defineField({ name: "subheadline", title: "Subheadline", type: "text", rows: 2 }),
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt Text", type: "string" }] }),
      defineField({
        name: "ctas",
        title: "CTAs",
        type: "array",
        of: [{
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string" }),
            defineField({ name: "style", title: "Style", type: "string", options: { list: ["primary", "secondary", "outline"] }, initialValue: "primary" }),
          ],
        }],
      }),
    ],
    preview: { select: { title: "headline" }, prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Hero Section" }) },
  }),
  defineArrayMember({
    name: "imageText",
    title: "Image + Text",
    type: "object",
    fields: [
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt Text", type: "string" }] }),
      defineField({ name: "imagePosition", title: "Image Position", type: "string", options: { list: ["left", "right"] }, initialValue: "right" }),
      defineField({ name: "cta", title: "CTA", type: "object", fields: [{ name: "label", title: "Label", type: "string" }, { name: "href", title: "Link", type: "string" }] }),
    ],
    preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Image + Text", subtitle: "Image + Text Section" }) },
  }),
  defineArrayMember({
    name: "testimonials",
    title: "Testimonials",
    type: "object",
    fields: [
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({ name: "items", title: "Testimonials", type: "array", of: [{ type: "reference", to: [{ type: "testimonial" }] }] }),
    ],
    preview: { prepare: () => ({ title: "Testimonials" }) },
  }),
  defineArrayMember({
    name: "offerings",
    title: "Offerings Grid",
    type: "object",
    fields: [
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({ name: "subheading", title: "Subheading", type: "string" }),
      defineField({ name: "items", title: "Services", type: "array", of: [{ type: "reference", to: [{ type: "service" }] }] }),
    ],
    preview: { prepare: () => ({ title: "Offerings Grid" }) },
  }),
  defineArrayMember({
    name: "stats",
    title: "Stats Strip",
    type: "object",
    fields: [
      defineField({
        name: "items",
        title: "Stats",
        type: "array",
        of: [{
          type: "object",
          fields: [
            defineField({ name: "number", title: "Number", type: "string" }),
            defineField({ name: "label", title: "Label", type: "string" }),
          ],
        }],
      }),
    ],
    preview: { prepare: () => ({ title: "Stats Strip" }) },
  }),
  defineArrayMember({
    name: "faq",
    title: "FAQ",
    type: "object",
    fields: [
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({
        name: "items",
        title: "Questions",
        type: "array",
        of: [{
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text" }),
          ],
        }],
      }),
    ],
    preview: { prepare: () => ({ title: "FAQ Section" }) },
  }),
  defineArrayMember({
    name: "newsletter",
    title: "Newsletter CTA",
    type: "object",
    fields: [
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
      defineField({ name: "buttonLabel", title: "Button Label", type: "string", initialValue: "Subscribe" }),
      defineField({ name: "resourceUrl", title: "Free Resource URL", type: "url" }),
    ],
    preview: { prepare: () => ({ title: "Newsletter CTA" }) },
  }),
  defineArrayMember({
    name: "richText",
    title: "Rich Text",
    type: "object",
    fields: [
      defineField({ name: "content", title: "Content", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt Text", type: "string" }, { name: "caption", title: "Caption", type: "string" }] }] }),
    ],
    preview: { prepare: () => ({ title: "Rich Text Block" }) },
  }),
  defineArrayMember({
    name: "gallery",
    title: "Gallery",
    type: "object",
    fields: [
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt Text", type: "string" }, { name: "caption", title: "Caption", type: "string" }] }],
      }),
    ],
    preview: { prepare: () => ({ title: "Gallery" }) },
  }),
  defineArrayMember({
    name: "cta",
    title: "CTA Section",
    type: "object",
    fields: [
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
      defineField({
        name: "ctas",
        title: "CTAs",
        type: "array",
        of: [{
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string" }),
            defineField({ name: "style", title: "Style", type: "string", options: { list: ["primary", "secondary", "outline"] }, initialValue: "primary" }),
          ],
        }],
      }),
    ],
    preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "CTA Section" }) },
  }),
];
