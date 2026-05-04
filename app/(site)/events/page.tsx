import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { client } from "@/lib/sanity/client";
import { retreatsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Events & Retreats",
  description:
    "Upcoming yoga retreats, breathwork workshops, and wellness events in Lisbon and across Europe with Niamh Padma.",
};

// Re-render at most every 60s so Sanity edits appear without a redeploy.
export const revalidate = 60;

interface RetreatCard {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  tagline?: string;
  locationLine?: string;
  dateStart?: string;
  dateEnd?: string;
  status?: "upcoming" | "sold-out" | "cancelled";
  heroImage?: { asset?: { url?: string }; alt?: string };
}

function formatDateRange(start?: string, end?: string) {
  if (!start) return "";
  const s = new Date(start);
  if (!end) {
    return s.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
  const e = new Date(end);
  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();
  const startStr = s.toLocaleDateString("en-GB", {
    day: "numeric",
    month: sameMonth ? undefined : "long",
    year: sameYear ? undefined : "numeric",
  });
  const endStr = e.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startStr}–${endStr}`;
}

export default async function EventsPage() {
  const retreats = await client
    .fetch<RetreatCard[]>(retreatsQuery)
    .catch(() => [] as RetreatCard[]);

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
        imageSrc="/images/events-hero.jpg"
        imageAlt="Downward dog yoga practice in a warm terracotta studio"
      />

      {/* Retreats */}
      <Section background="white">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">Retreats</h2>
            <p className="font-sans text-base text-espresso/60">
              Multi-day immersions weaving movement, breathwork and deep work into a
              rhythm that actually restores you.
            </p>
          </div>

          {retreats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {retreats.map((r) => {
                const img = r.heroImage?.asset
                  ? urlFor(r.heroImage).width(1200).height(800).fit("crop").url()
                  : "/images/retreats-hero.jpg";
                const dateStr = formatDateRange(r.dateStart, r.dateEnd);
                return (
                  <Link
                    key={r._id}
                    href={`/retreats/${r.slug.current}`}
                    className="group block rounded-3xl overflow-hidden bg-cream"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={img}
                        alt={r.heroImage?.alt || r.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                      {r.status === "sold-out" && (
                        <span className="absolute top-4 left-4 bg-espresso text-cream font-sans text-xs uppercase tracking-widest px-3 py-1.5 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <div className="p-8">
                      {r.subtitle && (
                        <p className="font-sans text-xs uppercase tracking-widest text-sage mb-2">
                          {r.subtitle}
                        </p>
                      )}
                      <h3 className="font-serif text-3xl mb-3 group-hover:text-terracotta transition-colors">
                        {r.title}
                      </h3>
                      {r.tagline && (
                        <p className="font-sans text-base text-espresso/65 mb-4 leading-relaxed">
                          {r.tagline}
                        </p>
                      )}
                      <p className="font-sans text-sm text-espresso/50">
                        {[r.locationLine, dateStr].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-sans text-base text-espresso/70 mb-2">
                New retreats are being announced soon.
              </p>
              <p className="font-sans text-base text-espresso/70 mb-10">
                Be the first to know by signing up to the newsletter below.
              </p>
              <div className="relative aspect-[16/9] max-w-4xl mx-auto rounded-3xl overflow-hidden">
                <Image
                  src="/images/retreats-hero.jpg"
                  alt="Group breathwork session at an evening retreat"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            </div>
          )}
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
              <Button
                href="/contact?subject=Booking%3A%20The%20Women%E2%80%99s%20Gathering%20and%20Somatic%20Journey"
                variant="primary"
                size="md"
              >
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
                <Button
                  href="/contact?subject=Booking%3A%20Online%20Rest%20and%20Reset"
                  variant="primary"
                  size="md"
                >
                  Book Now
                </Button>
              </div>
              <div className="bg-cream rounded-3xl p-8 md:p-12">
                <h3 className="font-serif text-2xl mb-4">Weekly Yoganidr{"\u0101"}</h3>
                <p className="font-sans text-base text-espresso/70 leading-relaxed mb-6">
                  A weekly online yoga nidra session for deep relaxation and restoration.
                </p>
                <Button
                  href="/contact?subject=Booking%3A%20Weekly%20Yoganidr%C4%81"
                  variant="primary"
                  size="md"
                >
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
