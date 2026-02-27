"use client";

import { useState } from "react";
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
  image?: { asset?: { url?: string }; alt?: string };
  excerpt?: string;
}

const eventFilters = ["All", "Retreats", "Workshops", "Classes", "Online"];

export function EventsListing({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? events
      : events.filter((e) => {
          const typeMap: Record<string, string> = {
            Retreats: "Retreat",
            Workshops: "Workshop",
            Classes: "Class",
            Online: "Online",
          };
          return e.type === typeMap[filter];
        });

  return (
    <Section background="cream">
      <Container>
        <FilterBar filters={eventFilters} active={filter} onChange={setFilter} />

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
              Check back soon for upcoming {filter.toLowerCase()}.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}
