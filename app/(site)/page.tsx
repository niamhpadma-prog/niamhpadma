import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { HomeHero } from "@/components/sections/HomeHero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { OfferingsGrid } from "@/components/sections/OfferingsGrid";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { SubstackSection } from "@/components/sections/SubstackSection";
import { UpcomingRetreats } from "@/components/sections/UpcomingRetreats";
import { UpcomingEvents } from "@/components/sections/UpcomingEvents";
import { JsonLd } from "@/components/seo/JsonLd";
import { client } from "@/lib/sanity/client";
import { testimonialsQuery, upcomingRetreatsQuery, upcomingEventsQuery } from "@/lib/sanity/queries";

interface HomeTestimonial {
  _id: string;
  name: string;
  location?: string;
  quote: string;
  service?: string;
  rating?: number;
}

interface UpcomingRetreat {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  tagline?: string;
  locationLine?: string;
  dateStart?: string;
  dateEnd?: string;
  status?: string;
  cardImage?: { asset?: { url?: string; _ref?: string }; alt?: string } | null;
}

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

// Pick up Sanity edits within ~60s without redeploying.
export const revalidate = 86400;

export default async function HomePage() {
  const [testimonials, upcomingRetreats, upcomingEvents] = await Promise.all([
    client.fetch<HomeTestimonial[]>(testimonialsQuery),
    client.fetch<UpcomingRetreat[]>(upcomingRetreatsQuery),
    client.fetch<UpcomingEvent[]>(upcomingEventsQuery).catch(() => [] as UpcomingEvent[]),
  ]);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
          name: "Niamh Padma",
          description:
            "Yoga, breathwork, somatic therapy and holistic nutrition coaching in Lisbon.",
          url: "https://niamhpadma.com",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lisbon",
            addressCountry: "PT",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 38.7223,
            longitude: -9.1393,
          },
          knowsAbout: [
            "Yoga",
            "Breathwork",
            "Somatic Therapy",
            "Holistic Nutrition",
          ],
        }}
      />

      <HomeHero />

      <StatsStrip
        items={[
          { number: "100+", label: "Coaching Hours" },
          { number: "6+", label: "Modalities" },
          { number: "5+", label: "Countries" },
          { number: "50+", label: "Retreat Graduates" },
        ]}
      />

      {/* About teaser */}
      <Section background="white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
              <img
                src="/images/niamh-my-story.jpg"
                alt="Niamh Padma"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <p className="font-sans text-sm uppercase tracking-widest text-sage mb-4">
                Meet Niamh
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-[1.1] mb-6">
                A Journey of Remembering
              </h2>
              <p className="font-sans text-base leading-relaxed text-espresso/70 mb-8">
                From the fast-paced, corporate media world, to studying ancient practices across Central and
                South America, to somatic coaching in Lisbon and online, my path has always led back to one
                truth — wellness is a remembering.
              </p>
              <Button href="/my-story" variant="outline">
                Read My Story
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Quote section */}
      <Section background="sage">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="font-serif text-lg md:text-xl leading-relaxed mb-6">
              In Timeless Healing, Dr. Herbert Benson suggests that our bodies are not merely biochemical
              machines, but responsive, meaning-making systems. Affirming beliefs, especially those rooted
              in a sense of connection to something greater, are not abstract comforts. They shape
              physiology. They influence healing. They matter.
            </p>
            <p className="font-serif text-lg md:text-xl leading-relaxed mb-6">
              At the heart of his work is a concept he calls remembered wellness — the idea that health is not
              something we construct from scratch, but something we return to. A state already encoded
              within us, waiting to be reawakened.
            </p>
            <p className="font-serif text-lg md:text-xl leading-relaxed mb-6">
              In this sense, the body is not broken. It is fluent in wholeness. It simply needs the right
              conditions to remember.
            </p>
            <p className="font-serif text-2xl md:text-3xl font-semibold leading-snug mt-10 mb-2">
              Wellness is not an achievement.
            </p>
            <p className="font-serif text-2xl md:text-3xl font-semibold leading-snug mb-10">
              It is a remembering.
            </p>
            <Button href="/my-story" variant="outline">
              Read My Story
            </Button>
          </div>
        </Container>
      </Section>

      {/* Offerings */}
      <OfferingsGrid
        heading="How We Can Work Together"
        subheading="From private sessions to group experiences — find the practice that fits your life."
        items={[
          { _id: "h1", title: "1-1 Coaching", type: "Private", description: "Personalised yoga, breathwork & somatic sessions tailored to your unique needs.", pricing: "From €80", image: { asset: { url: "/images/rest.jpg" }, alt: "One-on-one coaching session", position: "object-top" }, href: "/work-with-me" },
          { _id: "h2", title: "Group Classes", type: "Weekly", description: "Community yoga and breathwork classes in Lisbon. All levels welcome.", pricing: "€15/class", image: { asset: { url: "/images/group-classes.avif" }, alt: "Group yoga class" }, href: "/work-with-me" },
          { _id: "h3", title: "Workshops", type: "Deep Dive", description: "Half-day and full-day immersions into breathwork, somatic release, and more.", pricing: "From €45", image: { asset: { url: "/images/workshops.jpg" }, alt: "Workshop session" }, href: "/events" },
          { _id: "h4", title: "Retreats", type: "Multi-day", description: "Transformative retreat experiences across Portugal and Europe.", pricing: "From €350", image: { asset: { url: "/images/retreats.jpg" }, alt: "Retreat in nature" }, href: "/events" },
        ]}
        background="cream"
      />

      <UpcomingRetreats retreats={upcomingRetreats} />

      <UpcomingEvents events={upcomingEvents} />

      {/* Testimonials — pulled from Sanity (any testimonial flagged "Featured") */}
      <TestimonialsSection
        heading="Kind Words"
        items={testimonials}
        background="white"
      />

      {/* Blog teaser */}
      <Section background="cream">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">From the Journal</h2>
            <p className="font-sans text-base text-espresso/60">
              Insights on breathwork, yoga, somatic practices and holistic living.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Turn On.", category: "Poems", slug: "turn-on" },
              { title: "Making Yoga a Practice of Self-Compassion", category: "Yoga", slug: "making-yoga-a-practice-of-self-compassion", image: "/images/yoga-practice.jpg" },
              { title: "Awaken Your Senses — Ireland Retreat", category: "Retreats", slug: "awaken-your-senses-ireland-retreat" },
            ].map((post) => (
              <a key={post.title} href={`/journal/${post.slug}`} className="group">
                <div className="relative aspect-[4/3] bg-sand/30 rounded-2xl mb-4 overflow-hidden">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="font-sans text-xs uppercase tracking-widest text-sage mb-2">
                  {post.category}
                </p>
                <h3 className="font-serif text-xl group-hover:text-terracotta transition-colors">
                  {post.title}
                </h3>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button href="/journal" variant="outline">
              Read the Journal
            </Button>
          </div>
        </Container>
      </Section>

      <SubstackSection />

      <NewsletterSection
        heading="Join the Community"
        body="Receive weekly insights on breathwork, yoga, somatic practices, and holistic nutrition — plus early access to retreats and events."
      />
    </>
  );
}
