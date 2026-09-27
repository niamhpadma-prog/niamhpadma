"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FilterBar } from "@/components/sections/FilterBar";
import { EventCard } from "@/components/cards/EventCard";

interface Event {
  _id: string;
  title: string;
  slug: string;
  type?: string;
  dateStart?: string;
  dateEnd?: string;
  location?: { name?: string; city?: string; country?: string };
  price?: string;
  status?: string;
  bookingUrl?: string;
  paidOnline?: boolean;
  image?: { asset?: { url?: string }; alt?: string };
  excerpt?: string;
}

// Bubble label -> stored `type` value, in canonical fallback order.
const CATEGORIES = [
  { label: "Retreats", type: "Retreat" },
  { label: "Workshops", type: "Workshop" },
  { label: "Classes", type: "Class" },
  { label: "Online", type: "Online" },
];

// "Live/active" = not cancelled and not sold out (the dataset is already
// filtered to upcoming dates upstream).
const isActive = (e: Event) => e.status !== "cancelled" && e.status !== "sold-out";

const earliest = (evts: Event[]) =>
  Math.min(
    ...evts.map((e) => (e.dateStart ? new Date(e.dateStart).getTime() : Infinity)),
  );

export function EventsListing({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState("All");

  // Only surface a bubble for a category that actually has events here, and
  // order categories so the ones with live/active events (soonest first) lead.
  const eventFilters = useMemo(() => {
    const present = CATEGORIES.filter((c) =>
      events.some((e) => e.type === c.type),
    ).sort((a, b) => {
      const aEvents = events.filter((e) => e.type === a.type);
      const bEvents = events.filter((e) => e.type === b.type);
      const aActive = aEvents.some(isActive);
      const bActive = bEvents.some(isActive);
      if (aActive !== bActive) return aActive ? -1 : 1;
      return earliest(aEvents) - earliest(bEvents);
    });
    return ["All", ...present.map((c) => c.label)];
  }, [events]);

  const typeForLabel = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.label, c.type])),
    [],
  );

  // Guard against a previously-selected filter no longer being present.
  const activeFilter = eventFilters.includes(filter) ? filter : "All";

  const filtered =
    activeFilter === "All"
      ? events
      : events.filter((e) => e.type === typeForLabel[activeFilter]);

  return (
    <Section background="cream">
      <Container>
        <FilterBar filters={eventFilters} active={activeFilter} onChange={setFilter} />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((event, i) => (
              <EventCard key={event._id} {...event} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-serif text-2xl text-espresso/40 mb-2">No events found</p>
            <p className="font-sans text-sm text-espresso/30">
              Check back soon for upcoming {activeFilter.toLowerCase()}.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}
