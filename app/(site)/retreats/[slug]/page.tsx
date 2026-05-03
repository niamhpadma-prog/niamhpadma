import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FAQSection } from "@/components/sections/FAQSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { JsonLd } from "@/components/seo/JsonLd";
import { EventEnquiryForm } from "@/components/forms/EventEnquiryForm";
import { client } from "@/lib/sanity/client";
import { retreatQuery, retreatSlugsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { portableTextComponents } from "@/lib/sanity/portableText";

type Params = { slug: string };

interface SanityImage {
  asset?: { url?: string };
  alt?: string;
  caption?: string;
}

interface ScheduleItem {
  time?: string;
  activity?: string;
  sectionLabel?: string;
}

interface PricingOption {
  type?: string;
  price?: string;
}

interface PricingTier {
  label?: string;
  options?: PricingOption[];
}

interface Retreat {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  tagline?: string;
  secondaryTagline?: string;
  partnership?: string;
  dateStart?: string;
  dateEnd?: string;
  locationLine?: string;
  location?: {
    name?: string;
    city?: string;
    country?: string;
    geo?: { lat: number; lng: number };
  };
  status?: "upcoming" | "sold-out" | "cancelled";
  heroImage?: SanityImage;

  conceptHeading?: string;
  conceptBody?: PortableTextBlock[];

  whoHeading?: string;
  whoSubheading?: string;
  whoIntro?: string;
  whoBullets?: string[];

  experienceHeading?: string;
  experienceSubheading?: string;
  experienceBody?: PortableTextBlock[];
  scheduleHeading?: string;
  schedule?: ScheduleItem[];

  venueHeading?: string;
  venueSubheading?: string;
  venueBody?: PortableTextBlock[];
  venueBullets?: string[];
  venueImage?: SanityImage;
  gallery?: SanityImage[];

  includedHeading?: string;
  includedItems?: string[];

  guideHeading?: string;
  guideName?: string;
  guideRoles?: string[];
  guideBio?: PortableTextBlock[];
  guideImage?: SanityImage;

  whatIsHeading?: string;
  whatIsBody?: PortableTextBlock[];

  finalHeadline?: string;
  limitedSpotsCopy?: string;
  pricingTiers?: PricingTier[];
  secureCtaLabel?: string;
  bookCallUrl?: string;
  enquiryRecipient?: string;

  faq?: { question: string; answer: string }[];
  seo?: { metaTitle?: string; metaDescription?: string; noIndex?: boolean };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(retreatSlugsQuery);
  return (slugs || []).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const retreat = await client.fetch<Retreat | null>(retreatQuery, { slug });
  if (!retreat) return { title: "Retreat Not Found" };
  const title = retreat.seo?.metaTitle || retreat.title;
  const description =
    retreat.seo?.metaDescription || retreat.subtitle || retreat.tagline || "";
  return {
    title,
    description,
    alternates: { canonical: `/retreats/${slug}` },
    robots: retreat.seo?.noIndex ? { index: false } : undefined,
  };
}

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function dateRange(start?: string, end?: string) {
  if (!start) return "";
  const startDate = new Date(start);
  if (!end) return formatDate(start);
  const endDate = new Date(end);
  const sameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const startStr = startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: sameMonth ? undefined : "long",
    year: sameYear ? undefined : "numeric",
  });
  const endStr = endDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startStr}–${endStr}`;
}

export default async function RetreatPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const retreat = await client.fetch<Retreat | null>(retreatQuery, { slug });
  if (!retreat) notFound();

  const heroSrc = retreat.heroImage?.asset
    ? urlFor(retreat.heroImage).width(2000).height(1200).fit("crop").url()
    : null;
  const venueSrc = retreat.venueImage?.asset
    ? urlFor(retreat.venueImage).width(1600).url()
    : null;
  const guideSrc = retreat.guideImage?.asset
    ? urlFor(retreat.guideImage).width(900).url()
    : null;
  const gallery = (retreat.gallery || [])
    .filter((g) => g.asset)
    .map((g) => ({
      src: urlFor(g).width(1600).url(),
      alt: g.alt || retreat.title,
    }));

  const locationDisplay =
    retreat.locationLine ||
    [retreat.location?.city, retreat.location?.name]
      .filter(Boolean)
      .join(" · ");
  const dateDisplay = dateRange(retreat.dateStart, retreat.dateEnd);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: retreat.title,
          description: retreat.tagline || retreat.subtitle || "",
          startDate: retreat.dateStart,
          ...(retreat.dateEnd && { endDate: retreat.dateEnd }),
          eventAttendanceMode:
            "https://schema.org/OfflineEventAttendanceMode",
          location: retreat.location
            ? {
                "@type": "Place",
                name: retreat.location.name,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: retreat.location.city,
                  addressCountry: retreat.location.country,
                },
                ...(retreat.location.geo && {
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: retreat.location.geo.lat,
                    longitude: retreat.location.geo.lng,
                  },
                }),
              }
            : undefined,
          organizer: {
            "@type": "Person",
            name: retreat.guideName || "Niamh Padma",
            url: "https://niamhpadma.com",
          },
        }}
      />

      {/* Hero */}
      <section className="relative bg-cream-dark pt-12 pb-0">
        <Container>
          <div className="max-w-4xl mx-auto text-center pt-8 pb-12">
            {retreat.subtitle && (
              <span className="font-sans text-xs uppercase tracking-widest text-sage mb-4 block">
                {retreat.subtitle}
              </span>
            )}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
              {retreat.title}
            </h1>
            {retreat.tagline && (
              <p className="font-sans text-lg md:text-xl text-espresso/70 leading-relaxed mb-2">
                {retreat.tagline}
              </p>
            )}
            {retreat.secondaryTagline && (
              <p className="font-serif text-2xl md:text-3xl text-espresso/80 mb-6">
                {retreat.secondaryTagline}
              </p>
            )}
            {retreat.partnership && (
              <p className="font-sans text-sm uppercase tracking-widest text-espresso/40 mb-8">
                {retreat.partnership}
              </p>
            )}
            {(locationDisplay || dateDisplay) && (
              <p className="font-sans text-base text-espresso/60 mb-8">
                {[locationDisplay, dateDisplay].filter(Boolean).join(" · ")}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="#enquiry" variant="primary" size="lg">
                {retreat.secureCtaLabel || "Secure Your Spot"}
              </Button>
              {retreat.bookCallUrl && (
                <Button href={retreat.bookCallUrl} variant="outline" size="lg">
                  Book a Call
                </Button>
              )}
            </div>
          </div>
          {heroSrc && (
            <div className="relative aspect-[16/9] max-w-5xl mx-auto rounded-3xl overflow-hidden">
              <Image
                src={heroSrc}
                alt={retreat.heroImage?.alt || retreat.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
              />
            </div>
          )}
        </Container>
      </section>

      {/* Concept */}
      {retreat.conceptBody && retreat.conceptBody.length > 0 && (
        <Section background="white">
          <Container>
            <div className="max-w-3xl mx-auto">
              {retreat.conceptHeading && (
                <p className="font-sans text-xs uppercase tracking-widest text-sage mb-4">
                  {retreat.conceptHeading}
                </p>
              )}
              <div className="prose-retreat">
                <PortableText
                  value={retreat.conceptBody}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Who It's For */}
      {(retreat.whoSubheading || retreat.whoIntro || (retreat.whoBullets && retreat.whoBullets.length)) && (
        <Section background="cream">
          <Container>
            <div className="max-w-3xl mx-auto">
              {retreat.whoHeading && (
                <p className="font-sans text-xs uppercase tracking-widest text-sage mb-4">
                  {retreat.whoHeading}
                </p>
              )}
              {retreat.whoSubheading && (
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
                  {retreat.whoSubheading}
                </h2>
              )}
              {retreat.whoIntro && (
                <p className="font-sans text-base md:text-lg text-espresso/70 leading-relaxed mb-8 whitespace-pre-line">
                  {retreat.whoIntro}
                </p>
              )}
              {retreat.whoBullets && retreat.whoBullets.length > 0 && (
                <>
                  <p className="font-sans text-sm uppercase tracking-widest text-espresso/50 mb-4">
                    Expect:
                  </p>
                  <ul className="space-y-3">
                    {retreat.whoBullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 font-sans text-base text-espresso/80"
                      >
                        <span className="text-terracotta mt-1.5 leading-none">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Experience & Schedule */}
      {(retreat.experienceBody || retreat.schedule?.length) && (
        <Section background="white">
          <Container>
            <div className="max-w-4xl mx-auto">
              {retreat.experienceHeading && (
                <p className="font-sans text-xs uppercase tracking-widest text-sage mb-4">
                  {retreat.experienceHeading}
                </p>
              )}
              {retreat.experienceSubheading && (
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
                  {retreat.experienceSubheading}
                </h2>
              )}
              {retreat.experienceBody && (
                <div className="max-w-3xl mb-12">
                  <PortableText
                    value={retreat.experienceBody}
                    components={portableTextComponents}
                  />
                </div>
              )}

              {retreat.schedule && retreat.schedule.length > 0 && (
                <div className="bg-cream rounded-3xl p-8 md:p-12">
                  {retreat.scheduleHeading && (
                    <h3 className="font-serif text-2xl md:text-3xl mb-6">
                      {retreat.scheduleHeading}
                    </h3>
                  )}
                  <ul className="divide-y divide-sand/40">
                    {retreat.schedule.map((item, idx) =>
                      item.sectionLabel ? (
                        <li
                          key={idx}
                          className="font-sans text-xs uppercase tracking-widest text-terracotta py-3 mt-2"
                        >
                          {item.sectionLabel}
                        </li>
                      ) : (
                        <li
                          key={idx}
                          className="grid grid-cols-[5.5rem_1fr] md:grid-cols-[7rem_1fr] gap-4 py-3"
                        >
                          <span className="font-sans text-sm font-medium text-espresso/80 tabular-nums">
                            {item.time}
                          </span>
                          <span className="font-sans text-sm md:text-base text-espresso/80">
                            {item.activity}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                  <div className="pt-8 mt-2 flex flex-wrap gap-3">
                    <Button href="#enquiry" variant="outline" size="md">
                      See more details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Venue */}
      {(retreat.venueBody || venueSrc || retreat.venueBullets?.length) && (
        <Section background="cream">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div>
                {retreat.venueHeading && (
                  <p className="font-sans text-xs uppercase tracking-widest text-sage mb-4">
                    {retreat.venueHeading}
                  </p>
                )}
                {retreat.venueSubheading && (
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
                    {retreat.venueSubheading}
                  </h2>
                )}
                {retreat.venueBody && (
                  <PortableText
                    value={retreat.venueBody}
                    components={portableTextComponents}
                  />
                )}
                {retreat.venueBullets && retreat.venueBullets.length > 0 && (
                  <>
                    <p className="font-sans text-sm uppercase tracking-widest text-espresso/50 mt-8 mb-4">
                      Between sessions
                    </p>
                    <ul className="space-y-3">
                      {retreat.venueBullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-3 font-sans text-base text-espresso/80"
                        >
                          <span className="text-terracotta mt-1.5 leading-none">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              {venueSrc && (
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                  <Image
                    src={venueSrc}
                    alt={retreat.venueImage?.alt || retreat.venueSubheading || "Venue"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && <GallerySection heading="Gallery" images={gallery} />}

      {/* What's Included */}
      {retreat.includedItems && retreat.includedItems.length > 0 && (
        <Section background="white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <p className="font-sans text-xs uppercase tracking-widest text-sage mb-4 text-center">
                {retreat.includedHeading || "What’s Included"}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-center mb-10">
                Everything you need
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                {retreat.includedItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-sans text-base text-espresso/80"
                  >
                    <span className="text-sage mt-1 leading-none">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-center mt-10">
                <Button href="#enquiry" variant="outline" size="md">
                  See more details
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Guide */}
      {(retreat.guideBio || retreat.guideName) && (
        <Section background="cream">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {guideSrc && (
                <div className="lg:col-span-2">
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                    <Image
                      src={guideSrc}
                      alt={retreat.guideImage?.alt || retreat.guideName || "Guide"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 480px"
                    />
                  </div>
                </div>
              )}
              <div className={guideSrc ? "lg:col-span-3" : "lg:col-span-5 max-w-3xl"}>
                {retreat.guideHeading && (
                  <p className="font-sans text-xs uppercase tracking-widest text-sage mb-4">
                    {retreat.guideHeading}
                  </p>
                )}
                {retreat.guideName && (
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-3">
                    {retreat.guideName}
                  </h2>
                )}
                {retreat.guideRoles && retreat.guideRoles.length > 0 && (
                  <p className="font-sans text-base text-terracotta mb-6">
                    {retreat.guideRoles.join(" · ")}
                  </p>
                )}
                {retreat.guideBio && (
                  <PortableText
                    value={retreat.guideBio}
                    components={portableTextComponents}
                  />
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* What Is */}
      {retreat.whatIsBody && retreat.whatIsBody.length > 0 && (
        <Section background="espresso">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              {retreat.whatIsHeading && (
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6 text-cream">
                  {retreat.whatIsHeading}
                </h2>
              )}
              <div className="text-cream/80 [&_p]:!text-cream/80 [&_p]:font-sans [&_p]:text-base [&_p]:md:text-lg [&_p]:leading-relaxed">
                <PortableText
                  value={retreat.whatIsBody}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Pricing */}
      {retreat.pricingTiers && retreat.pricingTiers.length > 0 && (
        <Section background="white">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              {retreat.finalHeadline && (
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-3">
                  {retreat.finalHeadline}
                </h2>
              )}
              {retreat.limitedSpotsCopy && (
                <p className="font-sans text-base text-espresso/60 mb-12">
                  {retreat.limitedSpotsCopy}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {retreat.pricingTiers.map((tier, i) => (
                  <div
                    key={i}
                    className={`rounded-3xl p-8 md:p-10 text-left ${
                      i === 0 ? "bg-cream border-2 border-terracotta" : "bg-cream"
                    }`}
                  >
                    {tier.label && (
                      <p className="font-sans text-xs uppercase tracking-widest text-terracotta mb-6">
                        {tier.label}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {tier.options?.map((opt, j) => (
                        <li
                          key={j}
                          className="flex items-baseline justify-between border-b border-sand/40 last:border-0 pb-3 last:pb-0"
                        >
                          <span className="font-sans text-base text-espresso/80">
                            {opt.type}
                          </span>
                          <span className="font-serif text-2xl text-espresso">
                            {opt.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button href="#enquiry" variant="primary" size="lg">
                  {retreat.secureCtaLabel || "Secure Your Spot"}
                </Button>
                {retreat.bookCallUrl && (
                  <Button href={retreat.bookCallUrl} variant="outline" size="lg">
                    Book a Call
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* FAQ */}
      {retreat.faq && retreat.faq.length > 0 && (
        <FAQSection heading="Questions" items={retreat.faq} />
      )}

      {/* Enquiry */}
      <Section background="cream" id="enquiry">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="font-sans text-xs uppercase tracking-widest text-sage mb-4">
                Reserve Your Spot
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
                {retreat.secureCtaLabel || "Secure Your Spot"}
              </h2>
              <p className="font-sans text-base text-espresso/60">
                Leave your details and Niamh will be in touch with full information
                and next steps.
              </p>
            </div>
            <EventEnquiryForm
              retreatTitle={retreat.title}
              retreatSlug={retreat.slug.current}
              recipientEmail={retreat.enquiryRecipient}
              bookCallUrl={retreat.bookCallUrl}
              primaryLabel={retreat.secureCtaLabel || "Reserve Your Spot"}
            />
          </div>
        </Container>
      </Section>

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-sand/20 py-4">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-serif text-base md:text-lg truncate">{retreat.title}</p>
              <p className="font-sans text-xs md:text-sm text-espresso/50 truncate">
                {[locationDisplay, dateDisplay].filter(Boolean).join(" · ")}
              </p>
            </div>
            <Link
              href="#enquiry"
              className={`shrink-0 inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-300 px-7 py-3.5 text-base ${
                retreat.status === "sold-out"
                  ? "border-2 border-espresso text-espresso hover:bg-espresso hover:text-cream"
                  : "bg-espresso text-cream hover:bg-espresso-light"
              }`}
            >
              {retreat.status === "sold-out"
                ? "Join Waitlist"
                : retreat.secureCtaLabel || "Secure Your Spot"}
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
