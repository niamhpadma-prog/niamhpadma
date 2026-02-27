"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useRef } from "react";

interface Testimonial {
  _id?: string;
  name: string;
  location?: string;
  quote: string;
  service?: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  heading?: string;
  items: Testimonial[];
  background?: "cream" | "white" | "sage" | "espresso";
}

export function TestimonialsSection({
  heading = "Kind Words",
  items,
  background = "cream",
}: TestimonialsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items?.length) return null;

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
      </Container>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-[clamp(1.5rem,4vw,4rem)] pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item._id || i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex-shrink-0 w-[85vw] md:w-[400px] snap-center"
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 h-full flex flex-col">
              {item.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <span key={j} className="text-terracotta text-sm">★</span>
                  ))}
                </div>
              )}
              <blockquote className="font-serif text-lg md:text-xl leading-relaxed text-espresso/80 flex-1 mb-6">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div>
                <p className="font-sans text-sm font-semibold text-espresso">
                  {item.name}
                </p>
                {item.location && (
                  <p className="font-sans text-xs text-espresso/50 mt-0.5">
                    {item.location}
                  </p>
                )}
                {item.service && (
                  <p className="font-sans text-xs text-sage mt-1">
                    {item.service}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
