"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
  creditUrl?: string;
  captionPosition?: "above" | "below" | "overlay";
}

function CaptionText({
  text,
  href,
  className,
}: {
  text: string;
  href?: string;
  className: string;
}) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} underline underline-offset-2 transition-colors hover:text-terracotta`}
      >
        {text}
      </a>
    );
  }
  return <span className={className}>{text}</span>;
}

interface GallerySectionProps {
  heading?: string;
  images: GalleryImage[];
  background?: "cream" | "white" | "sage" | "espresso";
}

export function GallerySection({
  heading,
  images,
  background = "cream",
}: GallerySectionProps) {
  if (!images?.length) return null;

  return (
    <Section background={background}>
      <Container>
        {heading && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl font-semibold text-center mb-12"
          >
            {heading}
          </motion.h2>
        )}

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((image, i) => {
            const position = image.captionPosition || "below";
            const captionText = image.caption || image.alt;
            const captionEl = captionText ? (
              <p className="px-1">
                <CaptionText
                  text={captionText}
                  href={image.creditUrl}
                  className="font-sans text-xs text-espresso/50"
                />
              </p>
            ) : null;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="break-inside-avoid"
              >
                {position === "above" && captionEl && <div className="mb-2">{captionEl}</div>}
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt || ""}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {position === "overlay" && captionText && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/65 to-transparent p-3">
                      <p>
                        <CaptionText
                          text={captionText}
                          href={image.creditUrl}
                          className="font-sans text-xs text-cream/90"
                        />
                      </p>
                    </div>
                  )}
                </div>
                {position === "below" && captionEl && <div className="mt-2">{captionEl}</div>}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
