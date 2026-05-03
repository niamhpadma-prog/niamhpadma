import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { CTASection } from "@/components/sections/CTASection";
import { CalendlyInlineEmbed } from "@/components/booking/CalendlyInlineEmbed";

const CALENDLY_URL = "https://calendly.com/hello-somatictherapyinlisbon/30min";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Niamh Padma. Based in Lisbon, available worldwide for yoga, breathwork, somatic therapy and holistic nutrition coaching.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  const defaultSubject = subject ?? "";
  const isBookingEnquiry = defaultSubject.toLowerCase().startsWith("booking:");

  return (
    <>
      <Section background="cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info side */}
            <div>
              <p className="font-sans text-sm uppercase tracking-widest text-sage mb-4">
                {isBookingEnquiry ? "Booking Enquiry" : "Get in Touch"}
              </p>
              <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6">
                {isBookingEnquiry ? "Reserve Your Spot" : "Let’s Connect"}
              </h1>
              <p className="font-sans text-base text-espresso/60 leading-relaxed mb-10">
                {isBookingEnquiry
                  ? `Send a quick note and I’ll get back to you within 48 hours to confirm your place${defaultSubject.replace(/^Booking:\s*/i, " in ")}.`
                  : "Whether you have a question about services, want to discuss a collaboration, or are ready to start your wellness journey — I’d love to hear from you."}
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-widest text-espresso/40 mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:hello@niamhpadma.com"
                    className="font-sans text-base text-espresso hover:text-terracotta transition-colors"
                  >
                    hello@niamhpadma.com
                  </a>
                </div>
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-widest text-espresso/40 mb-1">
                    Based in
                  </h3>
                  <p className="font-sans text-base text-espresso">
                    Lisbon, Portugal
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-widest text-espresso/40 mb-1">
                    Connect
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com/niamhpadma"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-espresso/60 hover:text-terracotta transition-colors"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://thelittlemoments.substack.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-espresso/60 hover:text-terracotta transition-colors"
                    >
                      Substack
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form side */}
            <div>
              <ContactForm defaultSubject={defaultSubject} />
            </div>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="font-sans text-sm uppercase tracking-widest text-sage mb-4">
              Or Talk Live
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-4">
              Book a Free Discovery Call
            </h2>
            <p className="font-sans text-base text-espresso/60 leading-relaxed">
              A relaxed 30-minute conversation to explore what you&apos;re
              seeking and feel into whether we&apos;re a fit.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <CalendlyInlineEmbed url={CALENDLY_URL} minHeight={780} />
          </div>
        </Container>
      </Section>

      <CTASection
        heading="Not Sure What You Need?"
        body="Take a 2-minute questionnaire and I'll recommend the best path for your wellness journey."
        ctas={[
          { label: "Take the Questionnaire", href: "/questionnaires/coaching", style: "primary" },
        ]}
        background="sage"
      />
    </>
  );
}
