import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Events & Retreats",
  description:
    "Upcoming yoga retreats, breathwork workshops, and wellness events in Lisbon and across Europe with Niamh Padma.",
};

export default function EventsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Events & Retreats by Niamh Padma",
          itemListElement: [],
        }}
      />

      <HeroSection
        headline="Events & Retreats"
        subheadline="Workshops, classes, and transformative retreat experiences in Lisbon and across Europe."
        imageSrc="/images/retreats.jpg"
        imageAlt="Retreat in nature"
      />

      {/* Retreats */}
      <Section background="white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">Retreats</h2>
            <p className="font-sans text-base text-espresso/70 mb-2">
              Details coming soon.
            </p>
            <p className="font-sans text-base text-espresso/70 mb-8">
              Be the first to know by signing up to the newsletter below.
            </p>
          </div>
        </Container>
      </Section>

      {/* In-Person */}
      <Section background="cream">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-center mb-10">In-Person</h2>
            <div className="bg-white rounded-3xl p-8 md:p-12">
              <h3 className="font-serif text-2xl mb-4">The Women{"\u2019"}s Gathering and Somatic Journey</h3>
              <p className="font-sans text-base text-espresso/70 leading-relaxed mb-6">
                A monthly in-person gathering in Lisbon for women seeking connection, rest, and embodied practice.
              </p>
              <Button href="#" variant="primary" size="md">
                Book Now
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Online */}
      <Section background="white">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-center mb-10">Online</h2>
            <div className="space-y-6">
              <div className="bg-cream rounded-3xl p-8 md:p-12">
                <h3 className="font-serif text-2xl mb-4">Online Rest and Reset</h3>
                <p className="font-sans text-base text-espresso/70 leading-relaxed mb-6">
                  A monthly online somatic rest and reset session. Join from anywhere.
                </p>
                <Button href="#" variant="primary" size="md">
                  Book Now
                </Button>
              </div>
              <div className="bg-cream rounded-3xl p-8 md:p-12">
                <h3 className="font-serif text-2xl mb-4">Weekly Yoganidr{"\u0101"}</h3>
                <p className="font-sans text-base text-espresso/70 leading-relaxed mb-6">
                  A weekly online yoga nidra session for deep relaxation and restoration.
                </p>
                <Button href="#" variant="primary" size="md">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <NewsletterSection
        heading="Be the First to Know"
        body="Sign up to receive early access to retreats, events, and community offerings."
      />
    </>
  );
}
