"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface PullQuoteProps {
  quote: string;
  attribution?: string;
  background?: "cream" | "white" | "sage" | "espresso";
}

export function PullQuote({
  quote,
  attribution,
  background = "sage",
}: PullQuoteProps) {
  return (
    <Section background={background}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-snug italic">
            &ldquo;{quote}&rdquo;
          </blockquote>
          {attribution && (
            <p className="font-sans text-sm uppercase tracking-widest text-espresso/40 mt-8">
              — {attribution}
            </p>
          )}
        </motion.div>
      </Container>
    </Section>
  );
}
