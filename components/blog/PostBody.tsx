import {
  PortableText,
  type PortableTextBlock,
  type PortableTextBlockComponent,
  type PortableTextComponents,
} from "@portabletext/react";
import { portableTextComponents } from "@/lib/sanity/portableText";

// Renders a journal post exactly as it is typed in Sanity Studio.
//
// Two things break fidelity with the default renderer, and both matter most
// for poetry:
//
// 1. Newlines *inside* a block. Studio keeps them, but HTML collapses runs of
//    whitespace, so a shift+enter line break silently disappears. Every text
//    block here sets `whitespace-pre-line` to keep them.
// 2. Empty blocks. A blank line between stanzas is a real block with no text.
//    It would render as an empty <p> of zero height, so stanza breaks vanish.
//    We render an explicit spacer instead.
//
// Poems also need tighter spacing than prose: each line of verse is its own
// block, so a paragraph margin between them would space a poem out into
// something unrecognisable. Posts categorised "Poems" get verse spacing —
// lines sit on consecutive lines and blank lines separate stanzas.

const VERSE_CATEGORY = "Poems";

export function isVersePost(categories?: string[]) {
  return Boolean(categories?.includes(VERSE_CATEGORY));
}

function blockIsEmpty(value: unknown): boolean {
  const children = (value as { children?: { text?: string }[] } | undefined)?.children;
  if (!children?.length) return true;
  return children.every((child) => (child.text ?? "").trim() === "");
}

function buildComponents(verse: boolean): PortableTextComponents {
  // In verse, consecutive blocks are consecutive lines, so text blocks carry no
  // bottom margin and the blank-line spacer does all the separating. In prose,
  // paragraphs keep their usual margin.
  const paragraphSpacing = verse ? "" : "mb-4";
  const spacerHeight = verse ? "h-[1.1em]" : "h-4";

  const paragraph: PortableTextBlockComponent = ({ children, value }) => {
    if (blockIsEmpty(value)) {
      return <div className={spacerHeight} aria-hidden="true" />;
    }
    return (
      <p
        className={`font-sans text-base leading-relaxed text-espresso/75 whitespace-pre-line ${paragraphSpacing}`}
      >
        {children}
      </p>
    );
  };

  // `block` is typed as a single component OR a per-style record; the shared
  // config uses the record form, so narrow to that before spreading.
  const sharedBlock = (portableTextComponents.block ?? {}) as Record<
    string,
    PortableTextBlockComponent | undefined
  >;

  return {
    ...portableTextComponents,
    block: {
      ...sharedBlock,
      normal: paragraph,
      // Studio offers h5/h6 but the shared renderer stops at h4, which left
      // those blocks falling through to an unstyled default.
      h5: ({ children }) => (
        <h5 className="font-serif text-lg mt-6 mb-2 whitespace-pre-line">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="font-serif text-base mt-6 mb-2 whitespace-pre-line">{children}</h6>
      ),
    },
  };
}

const verseComponents = buildComponents(true);
const proseComponents = buildComponents(false);

export function PostBody({
  body,
  categories,
}: {
  body?: PortableTextBlock[];
  categories?: string[];
}) {
  if (!body?.length) return null;

  const verse = isVersePost(categories);

  return (
    <div className={verse ? "font-sans" : undefined}>
      <PortableText
        value={body}
        components={verse ? verseComponents : proseComponents}
      />
    </div>
  );
}
