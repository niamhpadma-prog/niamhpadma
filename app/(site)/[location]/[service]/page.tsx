import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SlideUp } from "@/components/animations/SlideUp";
import { getLocationPage, getAllLocationParams } from "@/lib/seo/locationPages";

type Params = { location: string; service: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { location, service } = await params;
  const page = getLocationPage(location, service);
  if (!page) return { title: "Not Found" };
  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

// This route's pattern is /<anything>/<anything>, so it catches every
// two-segment URL that no more specific route claims — including the random
// paths vulnerability scanners probe all day (/wp-admin/setup, /.env/backup).
// With the default (true), each distinct URL was rendered on demand and cached
// before 404ing, so an unbounded set of junk URLs could each cost a cache
// write.
//
// The full list of real pages comes from locationPages.ts in code, not the
// CMS, so it is known at build time and nothing legitimate can be missing.
// Anything not on that list now 404s immediately without rendering.
//
// Deliberately NOT applied to /journal/[slug], /events/[slug] or
// /retreats/[slug]: those lists come from Sanity, and locking them down would
// make anything Niamh publishes 404 until the next deploy.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLocationParams();
}

export default async function LocationServicePage({ params }: { params: Promise<Params> }) {
  const { location, service } = await params;
  const page = getLocationPage(location, service);
  if (!page) notFound();

  const faqSchema = page.faq.length > 0
    ? {
        "@context": "https://schema.org" as const,
        "@type": "FAQPage" as const,
        mainEntity: page.faq.map((item) => ({
          "@type": "Question" as const,
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer" as const,
            text: item.answer,
          },
        })),
      }
    : null;

  const howToSchema = page.howTo
    ? {
        "@context": "https://schema.org" as const,
        "@type": "HowTo" as const,
        name: page.howTo.name,
        step: page.howTo.steps.map((step, i) => ({
          "@type": "HowToStep" as const,
          position: i + 1,
          name: step.name,
          text: step.text,
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    itemListElement: [
      { "@type": "ListItem" as const, position: 1, name: "Home", item: "https://niamhpadma.com" },
      { "@type": "ListItem" as const, position: 2, name: page.location, item: `https://niamhpadma.com/${page.locationSlug}` },
      { "@type": "ListItem" as const, position: 3, name: page.service },
    ],
  };

  return (
    <>
      {faqSchema && <JsonLd data={faqSchema} />}
      {howToSchema && <JsonLd data={howToSchema} />}
      <JsonLd data={breadcrumbSchema} />

      {/* Hero */}
      <section className="bg-cream-dark pt-20 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="font-sans text-xs text-espresso/40 mb-6">
              <Link href="/" className="hover:text-espresso/60 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="capitalize">{page.location}</span>
              <span className="mx-2">/</span>
              <span>{page.service}</span>
            </nav>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              {page.headline}
            </h1>
            <Button href={page.cta.href} variant="primary" size="lg">
              {page.cta.label}
            </Button>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <Section background="white">
        <Container>
          <div className="max-w-2xl mx-auto">
            {page.intro.map((p, i) => (
              <SlideUp key={i} delay={i * 0.1}>
                <p className="font-sans text-base leading-relaxed text-espresso/75 mb-4">
                  {p}
                </p>
              </SlideUp>
            ))}
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section background="cream">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-10">
              Benefits of {page.service} in {page.location}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {page.benefits.map((benefit, i) => (
                <SlideUp key={i} delay={i * 0.05}>
                  <div className="flex items-start gap-3 bg-white rounded-2xl p-5">
                    <span className="text-sage flex-shrink-0 mt-0.5">✓</span>
                    <p className="font-sans text-sm text-espresso/70">{benefit}</p>
                  </div>
                </SlideUp>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* What to expect */}
      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-10">
              What to Expect
            </h2>
            <div className="space-y-3">
              {page.whatToExpect.map((item, i) => (
                <SlideUp key={i} delay={i * 0.05}>
                  <div className="flex items-start gap-3 bg-cream rounded-2xl p-5">
                    <span className="font-sans text-sm font-semibold text-sage w-6 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-sans text-sm text-espresso/70">{item}</p>
                  </div>
                </SlideUp>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* HowTo */}
      {page.howTo && (
        <Section background="sage">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl text-center mb-10">
                {page.howTo.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {page.howTo.steps.map((step, i) => (
                  <SlideUp key={i} delay={i * 0.1}>
                    <div className="bg-white rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center font-sans text-sm font-semibold text-sage">
                          {i + 1}
                        </span>
                        <h3 className="font-serif text-lg">{step.name}</h3>
                      </div>
                      <p className="font-sans text-sm text-espresso/60 leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </SlideUp>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* FAQ */}
      <FAQSection items={page.faq} />

      {/* Related pages */}
      <Section background="cream">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl text-center mb-8">
              Related Services
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {page.relatedPages.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm px-5 py-2.5 rounded-full bg-white text-espresso/60 hover:text-espresso hover:bg-cream-dark transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <CTASection
        heading={`Ready to Start ${page.service}?`}
        body={`Take the first step toward ${page.service.toLowerCase()} in ${page.location}. I'll personally guide you to the right starting point.`}
        ctas={[{ label: page.cta.label, href: page.cta.href, style: "primary" }]}
        background="espresso"
      />
    </>
  );
}
