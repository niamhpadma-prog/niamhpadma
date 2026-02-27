"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

interface Stat {
  number: string;
  label: string;
}

export function StatsStrip({ items }: { items: Stat[] }) {
  return (
    <section className="bg-espresso text-cream py-8">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-3xl md:text-4xl font-light mb-1">
                {item.number}
              </p>
              <p className="font-sans text-xs uppercase tracking-widest text-cream/60">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
