import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FAQSection } from "@/components/sections/FAQSection";
import { CourseModuleAccordion } from "@/components/courses/CourseModuleAccordion";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { AccessGate } from "@/components/courses/AccessGate";
import { CheckoutButton } from "./CheckoutButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { client } from "@/lib/sanity/client";
import { courseQuery } from "@/lib/sanity/queries";

interface Module {
  _id: string;
  title: string;
  description?: string;
  order?: number;
  lessons?: {
    _id: string;
    title: string;
    duration?: string;
    order?: number;
    isFreePreview?: boolean;
  }[];
}

interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  tagline?: string;
  description?: unknown[];
  price?: number;
  currency?: string;
  stripePriceId?: string;
  thumbnail?: { asset?: { url?: string }; alt?: string };
  previewVideoUrl?: string;
  level?: string;
  totalDuration?: string;
  whatYoullLearn?: string[];
  faq?: { question: string; answer: string }[];
  testimonials?: { _id: string; name: string; location?: string; quote: string; rating?: number }[];
  seo?: { metaTitle?: string; metaDescription?: string };
  modules?: Module[];
}

type Params = { slug: string };

const currencySymbol: Record<string, string> = {
  GBP: "\u00a3",
  EUR: "\u20ac",
  USD: "$",
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await client.fetch<Course>(courseQuery, { slug });
  if (!course) return { title: "Course Not Found" };
  return {
    title: course.seo?.metaTitle || course.title,
    description: course.seo?.metaDescription || course.tagline,
  };
}

export default async function CourseSalesPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const course = await client.fetch<Course>(courseQuery, { slug });
  if (!course) notFound();

  const totalLessons = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
  const sym = currencySymbol[course.currency || "GBP"] || course.currency || "";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.title,
          description: course.tagline,
          provider: {
            "@type": "Person",
            name: "Niamh Padma",
            url: "https://niamhpadma.com",
          },
          ...(course.price && {
            offers: {
              "@type": "Offer",
              price: course.price,
              priceCurrency: course.currency || "GBP",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      <Suspense>
        <AccessGate courseSlug={slug} stripePriceId={course.stripePriceId} />
      </Suspense>

      {/* Hero */}
      <section className="relative bg-cream-dark pt-12 pb-0">
        <Container>
          <div className="max-w-3xl mx-auto text-center pt-8 pb-16">
            <span className="font-sans text-xs uppercase tracking-widest text-sage mb-4 block">
              Online Course
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              {course.title}
            </h1>
            {course.tagline && (
              <p className="font-sans text-base text-espresso/60 leading-relaxed max-w-xl mx-auto mb-8">
                {course.tagline}
              </p>
            )}
            <CheckoutButton courseSlug={slug} stripePriceId={course.stripePriceId}>
              Enrol Now {course.price != null && `\u2014 ${sym}${course.price}`}
            </CheckoutButton>
          </div>
        </Container>
      </section>

      {/* Info strip */}
      <section className="bg-espresso text-cream py-5">
        <Container>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-center">
            {course.level && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Level</p>
                <p className="font-sans text-sm">{course.level}</p>
              </div>
            )}
            {course.totalDuration && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Duration</p>
                <p className="font-sans text-sm">{course.totalDuration}</p>
              </div>
            )}
            {course.modules && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Modules</p>
                <p className="font-sans text-sm">{course.modules.length}</p>
              </div>
            )}
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-cream/40">Lessons</p>
              <p className="font-sans text-sm">{totalLessons}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* What You'll Learn */}
      {course.whatYoullLearn && course.whatYoullLearn.length > 0 && (
        <Section background="white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-10">
                What You&apos;ll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYoullLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-sans text-sm text-espresso/75 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Preview video */}
      {course.previewVideoUrl && (
        <Section background="cream">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
                Preview
              </h2>
              <VideoPlayer url={course.previewVideoUrl} title={`${course.title} preview`} />
            </div>
          </Container>
        </Section>
      )}

      {/* Curriculum */}
      {course.modules && course.modules.length > 0 && (
        <Section background="white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-10">
                Curriculum
              </h2>
              <CourseModuleAccordion modules={course.modules} />
            </div>
          </Container>
        </Section>
      )}

      {/* Testimonials */}
      {course.testimonials && course.testimonials.length > 0 && (
        <Section background="sage">
          <Container>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-10">
              What Students Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {course.testimonials.map((t) => (
                <div key={t._id} className="bg-white rounded-2xl p-6">
                  <p className="font-sans text-sm text-espresso/70 leading-relaxed mb-4 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-sans text-sm font-medium text-espresso">{t.name}</p>
                    {t.location && (
                      <p className="font-sans text-xs text-espresso/40">{t.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* FAQ */}
      {course.faq && course.faq.length > 0 && (
        <FAQSection heading="Questions" items={course.faq} />
      )}

      {/* Sticky purchase CTA */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-sand/20 py-4">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-lg">{course.title}</p>
              <p className="font-sans text-sm text-espresso/50">
                {course.totalDuration && `${course.totalDuration} · `}
                {totalLessons} lessons
                {course.price != null && ` · ${sym}${course.price}`}
              </p>
            </div>
            <CheckoutButton courseSlug={slug} stripePriceId={course.stripePriceId} size="md">
              Enrol Now
            </CheckoutButton>
          </div>
        </Container>
      </div>
    </>
  );
}
