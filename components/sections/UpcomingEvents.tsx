import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/cards/EventCard";

interface UpcomingEvent {
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
  image?: { asset?: { url?: string }; alt?: string };
  excerpt?: string;
}

// Homepage teaser for the next few upcoming events. Renders nothing when there
// are no upcoming events so the homepage never shows an empty section.
export function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
  if (!events?.length) return null;

  return (
    <Section background="cream">
      <Container>
        <div className="text-center mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-sage mb-4">
            What{"’"}s On
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold">Upcoming Events</h2>
          <p className="font-sans text-base text-espresso/60 mt-4 max-w-xl mx-auto">
            Workshops, classes and online sessions — reserve your place below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event, i) => (
            <EventCard key={event._id} {...event} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/events" variant="outline">
            View All Events
          </Button>
        </div>
      </Container>
    </Section>
  );
}
