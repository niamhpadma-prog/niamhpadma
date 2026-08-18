import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export interface WaysToWorkOffering {
  _key: string;
  title: string;
  duration?: string;
  description?: string;
  price?: string;
  onlineUrl?: string;
  inPersonUrl?: string;
}

export interface WaysToWorkConfig {
  enabled?: boolean;
  eyebrow?: string;
  eyebrowItalic?: string;
  heading?: string;
  intro?: string;
  pdfLabel?: string;
  pdfUrl?: string;
  pdfFileUrl?: string;
  offerings?: WaysToWorkOffering[];
}

// A booking pill. Deliberately quiet — the card is the object with presence,
// and two loud buttons on every card would fight it.
function BookingLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center min-w-[9rem] rounded-full border border-cream/70 bg-cream/95 px-7 py-2.5 font-serif text-lg lowercase text-espresso underline decoration-terracotta/60 underline-offset-4 transition-colors duration-300 hover:bg-cream hover:decoration-terracotta"
    >
      {label}
    </a>
  );
}

export function WaysToWorkSection({ config }: { config: WaysToWorkConfig | null }) {
  const offerings = config?.offerings?.filter((o) => o?.title) ?? [];
  // Nothing renders until Niamh has actually filled this in — an empty
  // "Ways to work together" heading over no cards is worse than no section.
  if (!config?.enabled || offerings.length === 0) return null;

  const pdfHref = config.pdfFileUrl || config.pdfUrl;

  return (
    <Section background="cream">
      <Container>
        <div className="mx-auto max-w-3xl">
          <header className="mb-12 md:mb-16">
            {config.eyebrow && (
              <p className="font-serif text-3xl md:text-4xl text-terracotta leading-tight">
                {config.eyebrow}
              </p>
            )}
            {config.eyebrowItalic && (
              <p className="font-serif italic text-2xl md:text-3xl text-terracotta/70 leading-tight">
                {config.eyebrowItalic}
              </p>
            )}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-espresso leading-tight mt-1">
              {config.heading}
            </h2>
            {config.intro && (
              <p className="font-sans text-base text-espresso/60 leading-relaxed mt-6 max-w-xl">
                {config.intro}
              </p>
            )}
          </header>

          <ol className="space-y-6 md:space-y-8">
            {offerings.map((offering, i) => (
              <li
                key={offering._key}
                className="rounded-[2rem] bg-sage/90 p-2.5 md:p-3"
              >
                {/* The inner dashed rule is the whole motif — one card, two edges. */}
                <div className="rounded-[1.6rem] border border-dashed border-cream/50 px-6 py-7 md:px-10 md:py-9">
                  <h3 className="font-serif text-3xl md:text-4xl text-cream leading-tight">
                    <span className="tabular-nums">{i + 1}.</span> {offering.title}
                  </h3>

                  {offering.duration && (
                    <p className="font-serif italic font-semibold text-lg text-espresso/80 mt-1.5">
                      {offering.duration}
                    </p>
                  )}

                  {offering.description && (
                    // Niamh's line breaks are part of how she writes these, so
                    // they survive to the page rather than being reflowed away.
                    <p className="font-serif text-lg md:text-xl text-espresso/90 leading-relaxed whitespace-pre-line mt-4">
                      {offering.description}
                    </p>
                  )}

                  {offering.price && (
                    <p className="font-sans text-sm tracking-wide text-cream/90 mt-4">
                      {offering.price}
                    </p>
                  )}

                  {(offering.onlineUrl || offering.inPersonUrl) && (
                    <div className="flex flex-wrap gap-3 md:gap-4 mt-7">
                      {offering.onlineUrl && (
                        <BookingLink href={offering.onlineUrl} label="online" />
                      )}
                      {offering.inPersonUrl && (
                        <BookingLink href={offering.inPersonUrl} label="in person" />
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {pdfHref && (
            <div className="mt-10 md:mt-12">
              <a
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-espresso/25 px-10 py-4 font-serif text-xl uppercase tracking-[0.12em] text-espresso underline decoration-terracotta/60 underline-offset-4 transition-colors duration-300 hover:border-espresso/50 hover:decoration-terracotta"
              >
                {config.pdfLabel || "Read full PDF"}
              </a>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
