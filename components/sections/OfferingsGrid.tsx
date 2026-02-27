"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

interface Offering {
  _id?: string;
  title: string;
  type?: string;
  description?: string;
  image?: { asset?: { url?: string }; alt?: string };
  pricing?: string;
  bookingUrl?: string;
}

interface OfferingsGridProps {
  heading?: string;
  subheading?: string;
  items: Offering[];
  background?: "cream" | "white" | "sage" | "espresso";
}

export function OfferingsGrid({
  heading,
  subheading,
  items,
  background = "white",
}: OfferingsGridProps) {
  if (!items?.length) return null;

  return (
    <Section background={background}>
      <Container>
        {heading && (
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl md:text-5xl mb-4"
            >
              {heading}
            </motion.h2>
            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-sans text-base text-espresso/60 max-w-2xl mx-auto"
              >
                {subheading}
              </motion.p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-cream rounded-3xl overflow-hidden"
            >
              <div className="relative aspect-[16/9] bg-sand/30 overflow-hidden">
                {item.image?.asset?.url && (
                  <Image
                    src={item.image.asset.url}
                    alt={item.image.alt || item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
              <div className="p-8">
                {item.type && (
                  <p className="font-sans text-xs uppercase tracking-widest text-sage mb-2">
                    {item.type}
                  </p>
                )}
                <h3 className="font-serif text-2xl mb-3">{item.title}</h3>
                {item.description && (
                  <p className="font-sans text-sm text-espresso/60 leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {item.pricing && (
                    <p className="font-sans text-sm font-semibold text-terracotta">
                      {item.pricing}
                    </p>
                  )}
                  {item.bookingUrl && (
                    <Button href={item.bookingUrl} variant="outline" size="sm">
                      Book Now
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
