"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export type ServiceCategory = "1-1 Coaching" | "Group Classes" | "Corporate";

export type ServiceCTA = {
  label: string;
  href: string;
  variant?: "primary" | "outline";
};

export interface BentoService {
  id: string;
  category: ServiceCategory;
  title: string;
  image: { src: string; alt: string };
  /** Short description shown on the card. When omitted, `body` is rendered inline on the card. */
  summary?: string;
  /** Full description shown in the "Read more" modal (or inline when summary is absent). */
  body: ReactNode;
  pricing?: string;
  ctas?: ServiceCTA[];
}

function BentoCard({
  service,
  onExpand,
}: {
  service: BentoService;
  onExpand: (s: BentoService) => void;
}) {
  const hasSummary = Boolean(service.summary);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-cream">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/30">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-8 md:p-10">
        <p className="font-sans text-xs uppercase tracking-widest text-sage mb-3">
          {service.category}
        </p>
        <h3 className="font-serif text-3xl mb-4">{service.title}</h3>

        {hasSummary ? (
          <p className="font-sans text-base text-espresso/70 leading-relaxed mb-6">
            {service.summary}
          </p>
        ) : (
          <div className="font-sans text-base text-espresso/70 leading-relaxed space-y-4 mb-6">
            {service.body}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
          {service.pricing && (
            <span className="font-sans text-lg font-semibold text-terracotta">
              {service.pricing}
            </span>
          )}
          {hasSummary && (
            <Button
              onClick={() => onExpand(service)}
              variant="outline"
              size="md"
            >
              Read more
            </Button>
          )}
          {service.ctas?.map((cta) => (
            <Button
              key={cta.href + cta.label}
              href={cta.href}
              variant={cta.variant || "primary"}
              size="md"
            >
              {cta.label}
            </Button>
          ))}
        </div>
      </div>
    </article>
  );
}

function ServiceModal({
  service,
  onClose,
}: {
  service: BentoService | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!service) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-stretch md:items-center justify-center bg-espresso/60 backdrop-blur-sm px-0 md:px-6 py-0 md:py-10"
          onClick={onClose}
          data-lenis-prevent
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative bg-cream w-full md:max-w-5xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-screen md:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`service-modal-title-${service.id}`}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 rounded-full bg-cream/90 backdrop-blur w-10 h-10 flex items-center justify-center text-espresso hover:bg-cream transition-colors"
            >
              <span aria-hidden className="text-lg leading-none">×</span>
            </button>

            <div className="relative aspect-[16/9] md:aspect-auto w-full md:w-2/5 md:self-stretch shrink-0 bg-sand/30">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 410px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 md:px-10 py-8 md:py-12">
              <p className="font-sans text-xs uppercase tracking-widest text-sage mb-3">
                {service.category}
              </p>
              <h3
                id={`service-modal-title-${service.id}`}
                className="font-serif text-3xl md:text-4xl mb-6"
              >
                {service.title}
              </h3>

              <div className="font-sans text-base text-espresso/75 leading-relaxed space-y-4">
                {service.body}
              </div>

              {(service.pricing || service.ctas?.length) && (
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {service.pricing && (
                    <span className="font-sans text-lg font-semibold text-terracotta">
                      {service.pricing}
                    </span>
                  )}
                  {service.ctas?.map((cta) => (
                    <Button
                      key={cta.href + cta.label}
                      href={cta.href}
                      variant={cta.variant || "primary"}
                      size="md"
                    >
                      {cta.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ServicesBento({
  services,
  filter,
}: {
  services: BentoService[];
  filter: "All" | ServiceCategory;
}) {
  const [expanded, setExpanded] = useState<BentoService | null>(null);
  const visible =
    filter === "All" ? services : services.filter((s) => s.category === filter);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {visible.map((service) => (
          <BentoCard
            key={service.id}
            service={service}
            onExpand={setExpanded}
          />
        ))}
      </div>
      <ServiceModal service={expanded} onClose={() => setExpanded(null)} />
    </>
  );
}
