import type { Metadata } from "next";
import { EventsListing } from "./EventsListing";
import { HeroSection } from "@/components/sections/HeroSection";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Events & Retreats",
  description:
    "Upcoming yoga retreats, breathwork workshops, and wellness events in Lisbon and across Europe with Niamh Padma.",
};

// TODO: Fetch from Sanity in production
const placeholderEvents = [
  {
    _id: "e1",
    title: "Spring Breathwork Retreat",
    slug: { current: "spring-breathwork-retreat" },
    type: "Retreat",
    dateStart: "2026-04-15T10:00:00Z",
    dateEnd: "2026-04-18T16:00:00Z",
    location: { name: "Casa da Luz", city: "Sintra", country: "Portugal" },
    price: "€450",
    status: "upcoming",
    excerpt: "A 4-day immersion into breathwork, somatic release and deep rest in the magical hills of Sintra.",
  },
  {
    _id: "e2",
    title: "Yoga Nidra & Sound Bath",
    slug: { current: "yoga-nidra-sound-bath" },
    type: "Workshop",
    dateStart: "2026-03-22T18:00:00Z",
    location: { name: "Estúdio Alma", city: "Lisbon", country: "Portugal" },
    price: "€35",
    status: "upcoming",
    excerpt: "An evening of deep relaxation combining yoga nidra with crystal bowl sound healing.",
  },
  {
    _id: "e3",
    title: "Weekly Vinyasa Flow",
    slug: { current: "weekly-vinyasa-flow" },
    type: "Class",
    dateStart: "2026-03-10T09:00:00Z",
    location: { name: "Jardim Studio", city: "Lisbon", country: "Portugal" },
    price: "€15",
    status: "upcoming",
    excerpt: "Dynamic vinyasa flow connecting breath and movement. All levels welcome.",
  },
  {
    _id: "e4",
    title: "Online Breathwork Circle",
    slug: { current: "online-breathwork-circle" },
    type: "Online",
    dateStart: "2026-03-15T19:00:00Z",
    price: "€10",
    status: "upcoming",
    excerpt: "Join from anywhere for a guided breathwork session and community sharing circle.",
  },
];

export default function EventsPage() {
  const events = placeholderEvents.map((e) => ({
    ...e,
    slug: e.slug.current,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Events & Retreats by Niamh Padma",
          itemListElement: placeholderEvents.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Event",
              name: e.title,
              startDate: e.dateStart,
              ...(e.dateEnd && { endDate: e.dateEnd }),
              location: e.location
                ? {
                    "@type": "Place",
                    name: e.location.name,
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: e.location.city,
                      addressCountry: e.location.country,
                    },
                  }
                : undefined,
              offers: e.price
                ? { "@type": "Offer", price: e.price.replace(/[^0-9]/g, ""), priceCurrency: "EUR" }
                : undefined,
            },
          })),
        }}
      />

      <HeroSection
        headline="Events & Retreats"
        subheadline="Workshops, classes, and transformative retreat experiences in Lisbon and across Europe."
      />

      <EventsListing events={events} />
    </>
  );
}
