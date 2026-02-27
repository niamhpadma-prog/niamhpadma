import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { HomeHero } from "@/components/sections/HomeHero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { OfferingsGrid } from "@/components/sections/OfferingsGrid";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { JsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
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
            <div className="aspect-[3/4] bg-sand/30 rounded-3xl" />
            <div>
              <p className="font-sans text-sm uppercase tracking-widest text-sage mb-4">
                Meet Niamh
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-[1.1] mb-6">
                A Journey of Healing & Transformation
              </h2>
              <p className="font-sans text-base leading-relaxed text-espresso/70 mb-8">
                From studying ancient practices across Central and South America to
                facilitating retreats across Europe, my path has always led back to one
                truth — wellness is a return to who you already are.
              </p>
              <Button href="/about" variant="outline">
                Read My Story
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Offerings */}
      <OfferingsGrid
        heading="How We Can Work Together"
        subheading="From private sessions to group experiences — find the practice that fits your life."
        items={[
          { _id: "h1", title: "1-1 Coaching", type: "Private", description: "Personalised yoga, breathwork & somatic sessions tailored to your unique needs.", pricing: "From €80" },
          { _id: "h2", title: "Group Classes", type: "Weekly", description: "Community yoga and breathwork classes in Lisbon. All levels welcome.", pricing: "€15/class" },
          { _id: "h3", title: "Workshops", type: "Deep Dive", description: "Half-day and full-day immersions into breathwork, somatic release, and more.", pricing: "From €45" },
          { _id: "h4", title: "Retreats", type: "Multi-day", description: "Transformative retreat experiences across Portugal and Europe.", pricing: "From €350" },
        ]}
        background="cream"
      />

      {/* Featured event placeholder */}
      <Section background="espresso">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-sans text-xs uppercase tracking-widest text-cream/40 mb-4">
              Upcoming
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-cream mb-4">
              Next Retreat Coming Soon
            </h2>
            <p className="font-sans text-base text-cream/60 mb-8">
              Sign up to be the first to know about upcoming retreats and events.
            </p>
            <Button href="/events" variant="outline" className="border-cream/40 text-cream hover:bg-cream hover:text-espresso">
              View All Events
            </Button>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <TestimonialsSection
        heading="Kind Words"
        items={[
          { name: "Sarah M.", location: "Lisbon", quote: "Niamh has this incredible ability to hold space while gently guiding you deeper into your practice. Every session feels like coming home.", service: "1-1 Coaching", rating: 5 },
          { name: "Marco R.", location: "Porto", quote: "The breathwork workshop completely changed my relationship with stress. I use the techniques daily now.", service: "Workshops", rating: 5 },
          { name: "Elena K.", location: "Berlin", quote: "Working with Niamh online has been just as powerful as in-person sessions. She creates a safe, transformative container.", service: "1-1 Coaching", rating: 5 },
          { name: "Ana L.", location: "Lisbon", quote: "The retreat in the Algarve was life-changing. Niamh creates magic with her combination of yoga, breathwork, and somatic work.", service: "Retreat", rating: 5 },
        ]}
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
              { title: "Complete Guide to Breathwork", category: "Breathwork" },
              { title: "Finding the Right Yoga Practice", category: "Yoga" },
              { title: "What is Somatic Therapy?", category: "Somatic" },
            ].map((post) => (
              <div key={post.title} className="group">
                <div className="aspect-[4/3] bg-sand/30 rounded-2xl mb-4 overflow-hidden" />
                <p className="font-sans text-xs uppercase tracking-widest text-sage mb-2">
                  {post.category}
                </p>
                <h3 className="font-serif text-xl group-hover:text-terracotta transition-colors">
                  {post.title}
                </h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button href="/blog" variant="outline">
              Read the Journal
            </Button>
          </div>
        </Container>
      </Section>

      <NewsletterSection
        heading="Join the Community"
        body="Receive weekly insights on breathwork, yoga, somatic practices, and holistic nutrition — plus early access to retreats and events."
      />
    </>
  );
}
