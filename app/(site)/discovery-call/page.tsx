import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CalendlyInlineEmbed } from "@/components/booking/CalendlyInlineEmbed";

const CALENDLY_URL = "https://calendly.com/hello-somatictherapyinlisbon/30min";

export const metadata: Metadata = {
  title: "Book a Free Discovery Call",
  description:
    "Book a free 30-minute discovery call with Niamh Padma. A relaxed, no-pressure conversation to explore whether somatic coaching, breathwork or yoga is the right next step for you.",
  alternates: { canonical: "/discovery-call" },
};

export default function DiscoveryCallPage() {
  return (
    <>
      <section className="relative bg-cream-dark pt-12 pb-0">
        <Container>
          <div className="max-w-3xl mx-auto text-center pt-8 pb-10">
            <span className="font-sans text-xs uppercase tracking-widest text-sage mb-4 block">
              Free 30 minutes · No pressure
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Book a Discovery Call
            </h1>
            <p className="font-sans text-base text-espresso/60 leading-relaxed max-w-xl mx-auto">
              A relaxed conversation to explore what you&apos;re seeking, share
              how I work, and feel into whether we&apos;re a fit. There&apos;s
              nothing to prepare — come as you are.
            </p>
          </div>
        </Container>
      </section>

      <Section background="white" className="!pt-6">
        <Container>
          <div className="max-w-4xl mx-auto">
            <CalendlyInlineEmbed url={CALENDLY_URL} minHeight={780} />
          </div>
        </Container>
      </Section>

      <Section background="sage">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Prefer to share in writing first?
            </h2>
            <p className="font-sans text-base text-espresso/70 mb-8">
              Take a 2-minute questionnaire and I&apos;ll personally read what
              you share before we speak.
            </p>
            <Button href="/questionnaires/coaching" variant="outline">
              Take the Questionnaire
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
