"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PortableText, PortableTextBlock } from "@portabletext/react";

interface ImageTextSectionProps {
  heading: string;
  body?: PortableTextBlock[] | string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  cta?: { label: string; href: string };
  background?: "cream" | "white" | "sage" | "espresso";
}

export function ImageTextSection({
  heading,
  body,
  imageSrc,
  imageAlt = "",
  imagePosition = "right",
  cta,
  background = "cream",
}: ImageTextSectionProps) {
  const textContent = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
        {heading}
      </h2>
      {body && (
        <div className="font-sans text-base leading-relaxed text-espresso/70 mb-8 prose prose-lg max-w-none">
          {typeof body === "string" ? (
            <p>{body}</p>
          ) : (
            <PortableText value={body} />
          )}
        </div>
      )}
      {cta && (
        <Button href={cta.href} variant="outline">
          {cta.label}
        </Button>
      )}
    </motion.div>
  );

  const imageContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-sand/30"
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
    </motion.div>
  );

  return (
    <Section background={background}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {imagePosition === "left" ? (
            <>
              {imageContent}
              {textContent}
            </>
          ) : (
            <>
              {textContent}
              {imageContent}
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}
