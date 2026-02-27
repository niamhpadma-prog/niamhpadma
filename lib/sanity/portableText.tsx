import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "./image";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {value.caption && (
            <figcaption className="font-sans text-xs text-espresso/40 text-center mt-3">
              {value.caption}
            </figcaption>
          )}
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
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-terracotta underline underline-offset-2 hover:text-terracotta-dark transition-colors"
      >
        {children}
      </a>
    ),
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
