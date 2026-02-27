"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

const heroImages = [
  { src: "/images/hero-left.jpg", alt: "Niamh in meditation", position: "object-center" },
  { src: "/images/hero-center.jpg", alt: "Niamh practicing yoga", position: "object-top" },
  { src: "/images/hero-right.jpg", alt: "Niamh in a yoga pose", position: "object-center" },
];

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Mobile slideshow state
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Only run slideshow check on mount — CSS handles visibility
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] md:min-h-screen overflow-hidden"
    >
      {/* Desktop: Three images side by side */}
      <div className="absolute inset-0 hidden md:grid grid-cols-3">
        {heroImages.map((img) => (
          <div key={img.src} className="relative overflow-hidden">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className={`object-cover ${img.position}`}
              sizes="33vw"
              priority
            />
          </div>
        ))}
      </div>

      {/* Mobile: Crossfade slideshow with slow zoom */}
      <div className="absolute inset-0 md:hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: [1, 1.06] }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale: { duration: 5, ease: "easeOut" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentImage].src}
              alt={heroImages[currentImage].alt}
              fill
              className={`object-cover ${heroImages[currentImage].position}`}
              sizes="100vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-espresso/20" />

      {/* Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] md:min-h-screen text-center px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-6 text-cream"
        >
          Come Home to Yourself
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-sans text-lg md:text-xl max-w-2xl mx-auto mb-10 text-cream/80"
        >
          Yoga, breathwork & somatic wellness in Lisbon. Retreats across Europe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button href="/work-with-me" variant="primary" size="lg">
            Explore Services
          </Button>
          <Button href="/questionnaires/coaching" variant="secondary" size="lg">
            Book a Session
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-cream/40 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-cream/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
