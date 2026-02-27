"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
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
            className="font-serif text-4xl md:text-5xl text-center mb-12"
          >
            {heading}
          </motion.h2>
        )}

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((image, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="break-inside-avoid rounded-2xl overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt || ""}
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {image.caption && (
                <p className="font-sans text-xs text-espresso/50 mt-2 px-1">
                  {image.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
