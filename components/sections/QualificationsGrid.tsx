"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface Qualification {
  title: string;
  description?: string;
}

interface QualificationsGridProps {
  heading?: string;
  items: Qualification[];
  background?: "cream" | "white" | "sage" | "espresso";
}

export function QualificationsGrid({
  heading = "Training & Qualifications",
  items,
  background = "white",
}: QualificationsGridProps) {
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-cream rounded-2xl p-6 text-center"
            >
              <h3 className="font-serif text-xl mb-2">{item.title}</h3>
              {item.description && (
                <p className="font-sans text-xs text-espresso/50 leading-relaxed">
                  {item.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
