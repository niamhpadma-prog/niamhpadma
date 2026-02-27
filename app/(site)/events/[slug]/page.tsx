import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FAQSection } from "@/components/sections/FAQSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { JsonLd } from "@/components/seo/JsonLd";

// TODO: Fetch from Sanity + generateStaticParams
const placeholderEvents: Record<string, {
  title: string;
  type: string;
  dateStart: string;
  dateEnd?: string;
  location?: { name?: string; city?: string; country?: string; geo?: { lat: number; lng: number } };
  price?: string;
  capacity?: number;
  status: string;
  excerpt?: string;
  description: string;
  faq?: { question: string; answer: string }[];
}> = {
  "spring-breathwork-retreat": {
    title: "Spring Breathwork Retreat",
    type: "Retreat",
    dateStart: "2026-04-15T10:00:00Z",
    dateEnd: "2026-04-18T16:00:00Z",
    location: { name: "Casa da Luz", city: "Sintra", country: "Portugal", geo: { lat: 38.7979, lng: -9.3907 } },
    price: "€450",
    capacity: 16,
    status: "upcoming",
    excerpt: "A 4-day immersion into breathwork, somatic release and deep rest.",
    description: "Join us for four transformative days in the magical hills of Sintra. This intimate retreat weaves together breathwork, somatic practices, yoga, and nourishing plant-based meals to guide you into deep rest and renewal.\n\nEach day follows a gentle rhythm — morning breathwork and movement, afternoon integration and nature walks, evening sound healing and yoga nidra. Limited to 16 participants for deep, personalised guidance.",
    faq: [
      { question: "What's included in the price?", answer: "Accommodation, all meals (plant-based), all sessions and workshops, materials, and airport transfer from Lisbon." },
      { question: "Do I need previous experience?", answer: "No experience necessary. The retreat is designed for all levels, from complete beginners to experienced practitioners." },
      { question: "What should I bring?", answer: "Comfortable clothing, a journal, and an open heart. All yoga mats, props, and materials are provided." },
    ],
  },
  "yoga-nidra-sound-bath": {
    title: "Yoga Nidra & Sound Bath",
    type: "Workshop",
    dateStart: "2026-03-22T18:00:00Z",
    location: { name: "Estúdio Alma", city: "Lisbon", country: "Portugal" },
    price: "€35",
    status: "upcoming",
    description: "An evening of deep relaxation combining yoga nidra with crystal bowl sound healing. You'll be guided through a progressive relaxation into the hypnagogic state — the threshold between waking and sleeping — where deep healing and integration happen naturally.",
  },
  "weekly-vinyasa-flow": {
    title: "Weekly Vinyasa Flow",
    type: "Class",
    dateStart: "2026-03-10T09:00:00Z",
    location: { name: "Jardim Studio", city: "Lisbon", country: "Portugal" },
    price: "€15",
    status: "upcoming",
    description: "A dynamic vinyasa flow class connecting breath and movement. Each class is thoughtfully sequenced to build strength, flexibility, and presence. All levels welcome — modifications offered throughout.",
  },
  "online-breathwork-circle": {
    title: "Online Breathwork Circle",
    type: "Online",
    dateStart: "2026-03-15T19:00:00Z",
    price: "€10",
    status: "upcoming",
    description: "Join from anywhere for a guided breathwork session followed by a community sharing circle. We'll practise conscious connected breathing together, followed by space for integration and connection.",
  },
};

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const event = placeholderEvents[slug];
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.excerpt || event.description.slice(0, 160),
  };
}

export function generateStaticParams() {
  return Object.keys(placeholderEvents).map((slug) => ({ slug }));
}

export default async function EventDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const event = placeholderEvents[slug];
  if (!event) notFound();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          startDate: event.dateStart,
          ...(event.dateEnd && { endDate: event.dateEnd }),
          eventAttendanceMode: event.type === "Online"
            ? "https://schema.org/OnlineEventAttendanceMode"
            : "https://schema.org/OfflineEventAttendanceMode",
          location: event.location
            ? {
                "@type": "Place",
                name: event.location.name,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: event.location.city,
                  addressCountry: event.location.country,
                },
                ...(event.location.geo && {
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: event.location.geo.lat,
                    longitude: event.location.geo.lng,
                  },
                }),
              }
            : undefined,
          organizer: {
            "@type": "Person",
            name: "Niamh Padma",
            url: "https://niamhpadma.com",
          },
          ...(event.price && {
            offers: {
              "@type": "Offer",
              price: event.price.replace(/[^0-9]/g, ""),
              priceCurrency: "EUR",
              availability: event.status === "sold-out"
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="relative bg-cream-dark pt-12 pb-0">
        <Container>
          <div className="max-w-3xl mx-auto text-center pt-8 pb-16">
            <span className="font-sans text-xs uppercase tracking-widest text-sage mb-4 block">
              {event.type}
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              {event.title}
            </h1>
          </div>
        </Container>
      </section>

      {/* Info strip */}
      <section className="bg-espresso text-cream py-5">
        <Container>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-center">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Date</p>
              <p className="font-sans text-sm">{formatDate(event.dateStart)}</p>
            </div>
            {event.location?.city && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Location</p>
                <p className="font-sans text-sm">
                  {[event.location.name, event.location.city].filter(Boolean).join(", ")}
                </p>
              </div>
            )}
            {event.price && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Price</p>
                <p className="font-sans text-sm">{event.price}</p>
              </div>
            )}
            {!event.dateEnd && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Time</p>
                <p className="font-sans text-sm">{formatTime(event.dateStart)}</p>
              </div>
            )}
            {event.dateEnd && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Duration</p>
                <p className="font-sans text-sm">
                  {Math.ceil((new Date(event.dateEnd).getTime() - new Date(event.dateStart).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            )}
            {event.capacity && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Capacity</p>
                <p className="font-sans text-sm">{event.capacity} spots</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Description */}
      <Section background="white">
        <Container>
          <div className="max-w-2xl mx-auto">
            {event.description.split("\n\n").map((p, i) => (
              <p key={i} className="font-sans text-base leading-relaxed text-espresso/75 mb-4">
                {p}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      <GallerySection heading="Gallery" images={[]} />

      {event.faq && event.faq.length > 0 && (
        <FAQSection heading="Questions" items={event.faq} />
      )}

      {/* Sticky booking CTA */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-sand/20 py-4">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-lg">{event.title}</p>
              <p className="font-sans text-sm text-espresso/50">
                {formatDate(event.dateStart)} {event.price && `· ${event.price}`}
              </p>
            </div>
            <Button
              href="/contact"
              variant={event.status === "sold-out" ? "outline" : "primary"}
              size="md"
            >
              {event.status === "sold-out" ? "Join Waitlist" : "Book Now"}
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}
