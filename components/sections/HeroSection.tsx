"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface HeroCTA {
  label: string;
  href: string;
  style: "primary" | "secondary" | "outline";
}

interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  ctas?: HeroCTA[];
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "center" | "top" | "top-20";
  sticky?: boolean;
}

export function HeroSection({ headline, subheadline, ctas, imageSrc, imageAlt, imagePosition = "center", sticky = false }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${
        sticky ? "sticky top-0 z-0" : ""
      }`}
    >
      {/* Background */}
      {imageSrc ? (
        <motion.div
          style={{ y: imageY, scale }}
          className="absolute inset-0"
        >
          <Image
            src={imageSrc}
            alt={imageAlt || ""}
            fill
            className={`object-cover ${imagePosition === "top" ? "object-top" : imagePosition === "top-20" ? "object-[center_20%]" : ""}`}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-espresso/30" />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-sand/20 via-cream-dark to-cream" />
      )}

      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className={`font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.1] mb-6 ${
            imageSrc ? "text-cream" : "text-espresso"
          }`}
        >
          {headline}
        </motion.h1>

        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={`font-sans text-lg md:text-xl max-w-2xl mx-auto mb-10 whitespace-pre-line ${
              imageSrc ? "text-cream/80" : "text-espresso/60"
            }`}
          >
            {subheadline}
          </motion.p>
        )}

        {ctas && ctas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap justify-center gap-4"
          >
            {ctas.map((cta) => (
              <Button key={cta.href} href={cta.href} variant={cta.style} size="lg">
                {cta.label}
              </Button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5 ${
            imageSrc ? "border-cream/40" : "border-espresso/20"
          }`}
        >
          <div className={`w-1 h-1.5 rounded-full ${imageSrc ? "bg-cream/60" : "bg-espresso/30"}`} />
        </motion.div>
      </motion.div>
    </section>
  );
}
