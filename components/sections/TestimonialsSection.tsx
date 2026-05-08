"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useEffect, useMemo, useRef, useState } from "react";

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

// Order requested by Niamh: retreats first, then 1-1, then group classes.
const SERVICE_TABS: { label: string; value: string }[] = [
  { label: "Retreats", value: "Retreat" },
  { label: "1-1 Coaching", value: "1-1 Coaching" },
  { label: "Group Classes", value: "Group Classes" },
];

export function TestimonialsSection({
  heading = "Kind Words",
  items,
  background = "cream",
}: TestimonialsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<string>(SERVICE_TABS[0].value);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(
    () => items.filter((t) => t.service === activeService),
    [items, activeService]
  );

  // Reset scroll + index when the user switches tabs so we always start at card 1.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
    setActiveIndex(0);
  }, [activeService]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || filtered.length === 0) return;
    const cardWidth = el.scrollWidth / filtered.length;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(filtered.length - 1, Math.max(0, idx)));
  };

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el || filtered.length === 0) return;
    const cardWidth = el.scrollWidth / filtered.length;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  if (!items?.length) return null;

  const total = filtered.length;
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < total - 1;

  return (
    <Section background={background}>
      <Container>
        {heading && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl font-semibold text-center mb-8"
          >
            {heading}
          </motion.h2>
        )}

        {/* Service filter pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {SERVICE_TABS.map((tab) => {
            const active = tab.value === activeService;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveService(tab.value)}
                aria-pressed={active}
                className={
                  "font-sans text-sm px-4 py-2 rounded-full border transition-colors duration-200 " +
                  (active
                    ? "bg-espresso text-cream border-espresso"
                    : "bg-transparent text-espresso/70 border-espresso/20 hover:border-espresso/50 hover:text-espresso")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </Container>

      {total === 0 ? (
        <Container>
          <p className="text-center font-sans text-sm text-espresso/50 py-8">
            More kind words coming soon.
          </p>
        </Container>
      ) : (
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-start gap-6 overflow-x-auto px-[clamp(1.5rem,4vw,4rem)] pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item._id || `${activeService}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex-shrink-0 w-[85vw] md:w-[400px] snap-center"
              >
                <div className="bg-white rounded-3xl p-7 md:p-10">
                  {item.rating && (
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: item.rating }).map((_, j) => (
                        <span key={j} className="text-terracotta text-sm">★</span>
                      ))}
                    </div>
                  )}
                  <blockquote className="font-serif text-lg md:text-xl leading-relaxed text-espresso/80 mb-4">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="pt-3 border-t border-espresso/10">
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

          {/* Carousel controls */}
          <Container>
            <div className="flex items-center justify-center gap-5 mt-6">
              <button
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full border border-espresso/20 text-espresso/70 hover:border-espresso/50 hover:text-espresso disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <span className="font-sans text-xs text-espresso/50 tabular-nums min-w-[3.5rem] text-center">
                {activeIndex + 1} / {total}
              </span>
              <button
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full border border-espresso/20 text-espresso/70 hover:border-espresso/50 hover:text-espresso disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </Container>
        </>
      )}
    </Section>
  );
}
