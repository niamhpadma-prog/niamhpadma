"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

interface CTA {
  label: string;
  href: string;
  style?: "primary" | "secondary" | "outline";
}

interface CTASectionProps {
  heading: string;
  body?: string;
  ctas: CTA[];
  background?: "cream" | "white" | "sage" | "espresso";
}

export function CTASection({
  heading,
  body,
  ctas,
  background = "sage",
}: CTASectionProps) {
  return (
    <Section background={background}>
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-5xl font-semibold mb-4"
          >
            {heading}
          </motion.h2>
          {body && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sans text-base text-espresso/60 mb-8"
            >
              {body}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {ctas.map((cta) => (
              <Button
                key={cta.href}
                href={cta.href}
                variant={cta.style || "primary"}
                size="lg"
              >
                {cta.label}
              </Button>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
