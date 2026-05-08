import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "./image";

const captionClasses =
  "font-sans text-xs text-espresso/50 text-center";

function CaptionInner({ text, href, linkClass }: { text: string; href?: string; linkClass: string }) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} underline underline-offset-2 transition-colors`}
      >
        {text}
      </a>
    );
  }
  return <>{text}</>;
}

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const position = value.captionPosition || "below";
      const captionText: string | undefined = value.caption || value.alt;
      const captionHref: string | undefined = value.creditUrl;
      const caption = captionText ? (
        <figcaption className={captionClasses}>
          <CaptionInner
            text={captionText}
            href={captionHref}
            linkClass="text-espresso/70 hover:text-terracotta"
          />
        </figcaption>
      ) : null;
      return (
        <figure className="my-8">
          {position === "above" && caption && <div className="mb-3">{caption}</div>}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
            {position === "overlay" && captionText && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/60 to-transparent p-3 text-cream/90">
                <div className="text-xs text-center">
                  <CaptionInner
                    text={captionText}
                    href={captionHref}
                    linkClass="text-cream hover:text-cream"
                  />
                </div>
              </div>
            )}
          </div>
          {position === "below" && caption && <div className="mt-3">{caption}</div>}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-serif text-3xl md:text-4xl mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-2xl md:text-3xl mt-10 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-serif text-xl mt-8 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="font-sans text-base leading-relaxed text-espresso/75 mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-sage pl-6 my-8 font-serif text-xl italic text-espresso/60">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "";
      const external = /^https?:\/\//i.test(href);
      const openNewTab = value?.blank ?? external;
      return (
        <a
          href={href}
          target={openNewTab ? "_blank" : undefined}
          rel={openNewTab ? "noopener noreferrer" : undefined}
          className="text-terracotta underline underline-offset-2 hover:text-terracotta-dark transition-colors"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-semibold text-espresso">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="font-sans text-base text-espresso/75 space-y-2 mb-4 ml-4 list-disc">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="font-sans text-base text-espresso/75 space-y-2 mb-4 ml-4 list-decimal">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};

// Inline variant for short, single-line bullets where a wrapping <p> would
// break the surrounding <li> layout. Reuses the same link/strong/em marks
// so hyperlinks Niamh adds in Studio still render.
export const inlinePortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <>{children}</>,
  },
  marks: portableTextComponents.marks,
};
