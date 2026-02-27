"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

interface Stat {
  number: string;
  label: string;
}

export function StatsStrip({ items }: { items: Stat[] }) {
  return (
    <section className="bg-espresso text-cream py-10 md:py-12">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-4xl md:text-5xl font-light mb-1.5">
                {item.number}
              </p>
              <p className="font-sans text-sm md:text-base uppercase tracking-widest text-cream/60">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
