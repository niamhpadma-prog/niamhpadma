import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Niamh Padma. Based in Lisbon, available worldwide for yoga, breathwork, somatic therapy and holistic nutrition coaching.",
};

export default function ContactPage() {
  return (
    <>
      <Section background="cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info side */}
            <div>
              <p className="font-sans text-sm uppercase tracking-widest text-sage mb-4">
                Get in Touch
              </p>
              <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6">
                Let&apos;s Connect
              </h1>
              <p className="font-sans text-base text-espresso/60 leading-relaxed mb-10">
                Whether you have a question about services, want to discuss a
                collaboration, or are ready to start your wellness journey —
                I&apos;d love to hear from you.
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
                  </div>
                </div>
              </div>
            </div>

            {/* Form side */}
            <div>
              <ContactForm />
            </div>
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
