# Image caption link + alt-fallback

## Problem

Niamh wants the photographer credit (e.g. "Francisco Nogueira") to appear visibly under/over each image on the live site, with an optional clickable link to the photographer or hotel. Today she filled the **Alt Text** field expecting it to render visibly — but only the **Caption** field renders, and it has no link support.

## Goals

1. Niamh can add an optional URL to any image so the visible caption becomes a working link to a photographer's site or a hotel page.
2. Existing content where the credit lives in **Alt Text** (because **Caption** is empty) renders visibly without Niamh having to refill anything.
3. Caption position (above / below / overlay) continues to work for all variants.
4. No content migration required.

## Non-goals

- Adding link support to alt text. Alt text is read by screen readers and shouldn't carry a hyperlink.
- Renaming or removing the existing `caption` / `captionPosition` schema fields. Existing documents stay valid.
- Changing the rendering of any image that has neither caption nor alt text.

## Schema change

`sanity/schemas/_shared.ts` — extend `imageCaptionFields`:

```ts
defineField({
  name: "creditUrl",
  title: "Caption Link (optional)",
  type: "url",
  description:
    "Optional. Makes the caption clickable — e.g. the photographer's website or the hotel page. Leave blank for plain text.",
  validation: (r) =>
    r.uri({
      allowRelative: false,
      scheme: ["http", "https"],
    }),
}),
```

Field order in Studio: `alt` → `caption` → `creditUrl` → `captionPosition`. Tighten the `caption` field description to make clear it's the visible label on the page.

## Query change

`lib/sanity/queries.ts` — every image projection that already lists `caption, captionPosition` adds `creditUrl`. Affects ~20 projections across retreat, post, course, event, location-page, page-builder, service, course-lesson queries.

## Render change

Three render sites, all share the same rules:

- **Caption text** = `image.caption || image.alt`. Empty if both are empty.
- **Caption link** = `image.creditUrl`. When set, wrap caption text in `<a href={creditUrl} target="_blank" rel="noopener noreferrer">`.
- **Position** continues to use `image.captionPosition` (above / below / overlay), already wired.
- **Alt attribute** on `<img>` still uses `image.alt` directly — alt-fallback only affects the *visible* caption.

### Sites

1. `app/(site)/retreats/[slug]/page.tsx`
   - Extend `SanityImage` type with `creditUrl?: string`.
   - `ImageCaption` accepts an optional `href`. When present, renders text inside `<a>` with subtle underline + hover (terracotta default, cream/90 on overlay).
   - `CaptionedSectionImage` reads `image.creditUrl` and `image.caption || image.alt`, forwards to `ImageCaption` and the overlay variant.
   - Hero block (line ~363) and whatIs block (line ~739) get the same alt-fallback + optional anchor.
   - Gallery `.map()` (line ~297) passes `creditUrl` and the resolved caption text through to `GallerySection`.

2. `components/sections/GallerySection.tsx`
   - Add `creditUrl?: string` to image type.
   - Replace the three caption `<p>` renders with one helper that renders `<a>` when URL is set, plain text otherwise.
   - Apply alt-fallback.

3. `lib/sanity/portableText.tsx`
   - Image type renderer reads `value.creditUrl` and `value.caption || value.alt`.
   - `<figcaption>` and the overlay div both wrap in `<a>` when URL is set.

### Link styling

- Default position (above/below): inherits the small/muted caption font, adds an underline on the link, terracotta color on hover (matches existing `marks.link` style in the same file).
- Overlay position: uses `text-cream/90` with underline so it's legible on the dark gradient.

### Safety

- `target="_blank"` always paired with `rel="noopener noreferrer"`.
- URL field validated by Sanity at write-time to require `http` or `https`.

## Files touched

| Path | Change |
|------|--------|
| `sanity/schemas/_shared.ts` | Add `creditUrl` field to `imageCaptionFields`, tighten `caption` description |
| `lib/sanity/queries.ts` | Add `creditUrl` to every image projection |
| `lib/sanity/portableText.tsx` | Alt-fallback + optional anchor in figcaption and overlay |
| `app/(site)/retreats/[slug]/page.tsx` | Extend type + ImageCaption + CaptionedSectionImage + hero/whatIs/gallery passthrough |
| `components/sections/GallerySection.tsx` | Caption link helper + alt-fallback |

## Verification

1. `pnpm tsc --noEmit` (or equivalent) passes.
2. Dev server: open an existing retreat where `conceptImage.alt = "Francisco Nogueira"` and `caption` is empty — confirm "Francisco Nogueira" now appears as a caption.
3. In Studio, set `creditUrl` on the same image to a real URL — confirm caption renders as a working link, opens in a new tab, has the styled underline.
4. Try each `captionPosition` (above/below/overlay) with link present — link works in all three.
5. Verify gallery and any blog/post inline image renders the same way.
