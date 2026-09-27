import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { JsonLd } from "@/components/seo/JsonLd";
import { EventEnquiryForm } from "@/components/forms/EventEnquiryForm";
import { EventCheckoutButton } from "@/components/events/EventCheckoutButton";
import { client } from "@/lib/sanity/client";
import { eventQuery, eventsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { portableTextComponents } from "@/lib/sanity/portableText";

export const revalidate = 60;

type Params = { slug: string };

interface SanityImage {
  asset?: { url?: string };
  alt?: string;
  caption?: string;
  creditUrl?: string;
  captionPosition?: "above" | "below" | "overlay";
}

interface EventDoc {
  _id: string;
  title: string;
  slug: { current: string };
  type?: string;
  dateStart?: string;
  dateEnd?: string;
  location?: { name?: string; city?: string; country?: string };
  price?: string;
  capacity?: number;
  status?: string;
  bookingUrl?: string;
  acceptsPayment?: boolean;
  stripePriceId?: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  image?: SanityImage;
  gallery?: SanityImage[];
  faq?: { question: string; answer: string }[];
  enquiryRecipient?: string;
  bookCallUrl?: string;
  seo?: { metaTitle?: string; metaDescription?: string; noIndex?: boolean };
}

export async function generateStaticParams() {
  const events = await client
    .fetch<{ slug: string }[]>(eventsQuery)
    .catch(() => [] as { slug: string }[]);
  return events.filter((e) => e.slug).map((e) => ({ slug: e.slug }));
}

async function getEvent(slug: string) {
  return client.fetch<EventDoc | null>(eventQuery, { slug }).catch(() => null);
}

function formatDateRange(start?: string, end?: string) {
  if (!start) return "";
  const s = new Date(start);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (!end) return s.toLocaleDateString("en-GB", opts);
  return `${s.toLocaleDateString("en-GB", opts)} – ${new Date(end).toLocaleDateString("en-GB", opts)}`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.seo?.metaTitle || event.title,
    description: event.seo?.metaDescription || event.excerpt,
    alternates: { canonical: `/events/${slug}` },
    robots: event.seo?.noIndex ? { index: false } : undefined,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const heroSrc = event.image?.asset
    ? urlFor(event.image).width(1600).height(900).fit("crop").url()
    : "/images/events-hero.jpg";
  const dateStr = formatDateRange(event.dateStart, event.dateEnd);
  const locationStr = [event.location?.name, event.location?.city, event.location?.country]
    .filter(Boolean)
    .join(", ");

  const gallery = (event.gallery || [])
    .filter((g) => g.asset)
    .map((g) => ({
      src: urlFor(g).width(1600).url(),
      alt: g.alt || event.title,
      caption: g.caption || g.alt,
      captionPosition: g.captionPosition,
      creditUrl: g.creditUrl,
    }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          startDate: event.dateStart,
          ...(event.dateEnd && { endDate: event.dateEnd }),
          eventAttendanceMode:
            event.type === "Online"
              ? "https://schema.org/OnlineEventAttendanceMode"
              : "https://schema.org/OfflineEventAttendanceMode",
          eventStatus:
            event.status === "cancelled"
              ? "https://schema.org/EventCancelled"
              : "https://schema.org/EventScheduled",
          location: locationStr ? { "@type": "Place", name: locationStr } : undefined,
          description: event.excerpt,
          organizer: {
            "@type": "Person",
            name: "Niamh Padma",
            url: "https://niamhpadma.com",
          },
        }}
      />

      <Section background="cream">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            {event.type && (
              <p className="font-sans text-xs uppercase tracking-widest text-sage mb-3">{event.type}</p>
            )}
            <h1 className="font-serif text-4xl md:text-6xl font-semibold mb-4">{event.title}</h1>
            <p className="font-sans text-base text-espresso/60">
              {[dateStr, locationStr].filter(Boolean).join(" · ")}
            </p>
            {event.price && (
              <p className="font-sans text-base text-espresso/80 mt-2">{event.price}</p>
            )}
            {event.status !== "cancelled" && (
              <div className="mt-6">
                {event.acceptsPayment &&
                event.stripePriceId &&
                event.status !== "sold-out" ? (
                  <EventCheckoutButton eventSlug={slug} />
                ) : event.bookingUrl && event.status !== "sold-out" ? (
                  <a
                    href={event.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-300 bg-espresso text-cream hover:bg-espresso-light px-7 py-3.5 text-base"
                  >
                    Book Now
                  </a>
                ) : (
                  <a
                    href="#enquire"
                    className="inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-300 bg-espresso text-cream hover:bg-espresso-light px-7 py-3.5 text-base"
                  >
                    {event.status === "sold-out" ? "Join Waitlist" : "Book Now"}
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="relative aspect-[16/9] max-w-4xl mx-auto rounded-3xl overflow-hidden mt-10">
            <Image
              src={heroSrc}
              alt={event.image?.alt || event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        </Container>
      </Section>

      {event.body && event.body.length > 0 && (
        <Section background="white">
          <Container>
            <div className="prose prose-lg max-w-2xl mx-auto font-sans text-espresso/80">
              <PortableText value={event.body} components={portableTextComponents} />
            </div>
          </Container>
        </Section>
      )}

      {gallery.length > 0 && <GallerySection heading="Gallery" images={gallery} />}

      {event.faq && event.faq.length > 0 && (
        <FAQSection heading="Questions" items={event.faq} />
      )}

      <Section background="cream">
        <Container>
          <div id="enquire" className="scroll-mt-28 max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">
                {event.status === "sold-out" ? "Join the waitlist" : "Enquire about this event"}
              </h2>
            </div>
            <EventEnquiryForm
              retreatTitle={event.title}
              retreatSlug={event.slug.current}
              recipientEmail={event.enquiryRecipient}
              bookCallUrl={event.bookCallUrl}
              primaryLabel={event.status === "sold-out" ? "Join Waitlist" : "Enquire"}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
