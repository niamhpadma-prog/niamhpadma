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
import { hasFinished, FINISHED_RETREAT_MESSAGE } from "@/lib/booking";
import { portableTextComponents, inlinePortableTextComponents } from "@/lib/sanity/portableText";

// Re-render at most every 60s so Sanity edits appear without a redeploy.
export const revalidate = 86400;

type Params = { slug: string };

type CaptionPosition = "above" | "below" | "overlay";

interface SanityImage {
  asset?: { url?: string };
  alt?: string;
  caption?: string;
  creditUrl?: string;
  captionPosition?: CaptionPosition;
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
  conceptImage?: SanityImage;

  whoHeading?: string;
  whoSubheading?: string;
  whoIntro?: string;
  whoBullets?: (string | PortableTextBlock)[];
  whoImage?: SanityImage;

  experienceHeading?: string;
  experienceSubheading?: string;
  experienceBody?: PortableTextBlock[];
  experienceImage?: SanityImage;
  scheduleHeading?: string;
  schedule?: ScheduleItem[];

  venueHeading?: string;
  venueSubheading?: string;
  venueBody?: PortableTextBlock[];
  venueBullets?: (string | PortableTextBlock)[];
  venueImage?: SanityImage;
  gallery?: SanityImage[];

  includedHeading?: string;
  includedItems?: (string | PortableTextBlock)[];
  includedImage?: SanityImage;

  guideHeading?: string;
  guideName?: string;
  guideRoles?: string[];
  guideBio?: PortableTextBlock[];
  guideImage?: SanityImage;

  whatIsHeading?: string;
  whatIsBody?: PortableTextBlock[];
  whatIsImage?: SanityImage;

  finalHeadline?: string;
  limitedSpotsCopy?: string;
  pricingTiers?: PricingTier[];
  secureCtaLabel?: string;
  bookCallUrl?: string;
  enquiryRecipient?: string;

  faq?: { question: string; answer: string }[];
  seo?: { metaTitle?: string; metaDescription?: string; noIndex?: boolean };
}

// Static placeholders so a freshly-seeded retreat looks complete before
// Niamh has uploaded her own imagery in Studio.
const PLACEHOLDERS = {
  hero: "/images/retreats-hero.jpg",
  concept: "/images/retreats/retreat-002.jpg",
  who: "/images/retreats/retreat-003.jpg",
  experience: "/images/retreats/retreat-004.jpg",
  venue: "/images/retreats/retreat-005.jpg",
  included: "/images/retreats/retreat-006.jpg",
  guide: "/images/retreats-niamh.webp",
  whatIs: "/images/retreats/retreat-008.jpg",
};

function imageOrPlaceholder(
  img: SanityImage | undefined,
  placeholder: string,
  width = 1600,
  height?: number
): string {
  if (img?.asset) {
    const builder = urlFor(img).width(width);
    return height ? builder.height(height).fit("crop").url() : builder.url();
  }
  return placeholder;
}

function ImageCaption({
  text,
  href,
  tone = "default",
  className = "",
}: {
  text?: string;
  href?: string;
  tone?: "default" | "light";
  className?: string;
}) {
  if (!text) return null;
  const colour = tone === "light" ? "text-cream/70" : "text-espresso/55";
  const linkColour =
    tone === "light"
      ? "text-cream/90 hover:text-cream"
      : "text-espresso/70 hover:text-terracotta";
  const inner = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline underline-offset-2 transition-colors ${linkColour}`}
    >
      {text}
    </a>
  ) : (
    text
  );
  return (
    <p className={`font-sans text-xs ${colour} ${className}`}>{inner}</p>
  );
}

// Wrapper that renders a section image with optional caption above, below,
// or overlaid on the image itself, based on Niamh's choice in Studio.
function CaptionedSectionImage({
  src,
  alt,
  image,
  className,
  imageClassName,
  sizes,
  priority,
  tone = "default",
}: {
  src: string;
  alt: string;
  image?: SanityImage;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "default" | "light";
}) {
  const caption = image?.caption || image?.alt;
  const href = image?.creditUrl;
  const position = (image?.captionPosition as CaptionPosition) || "below";
  return (
    <figure className={className}>
      {position === "above" && caption && (
        <ImageCaption text={caption} href={href} tone={tone} className="mb-2 text-center" />
      )}
      <div className={`relative overflow-hidden ${imageClassName || ""}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
        {position === "overlay" && caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/65 to-transparent p-3">
            <ImageCaption text={caption} href={href} tone="light" className="text-center" />
          </div>
        )}
      </div>
      {position === "below" && caption && (
        <ImageCaption text={caption} href={href} tone={tone} className="mt-2 text-center" />
      )}
    </figure>
  );
}

// Bullets started life as plain strings in Sanity. Niamh's schema now stores
// them as portable text so she can hyperlink inline (e.g. the hotel name).
// Existing documents may still contain raw strings, so render either shape.
function BulletContent({ value }: { value: string | PortableTextBlock }) {
  if (typeof value === "string") return <>{value}</>;
  return (
    <PortableText value={[value]} components={inlinePortableTextComponents} />
  );
}

function bulletKey(value: string | PortableTextBlock, fallback: number) {
  if (typeof value === "string") return value;
  return value._key || fallback;
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

  const heroSrc = imageOrPlaceholder(retreat.heroImage, PLACEHOLDERS.hero, 2400);
  const conceptSrc = imageOrPlaceholder(retreat.conceptImage, PLACEHOLDERS.concept, 1400);
  const whoSrc = imageOrPlaceholder(retreat.whoImage, PLACEHOLDERS.who, 1400);
  const experienceSrc = imageOrPlaceholder(retreat.experienceImage, PLACEHOLDERS.experience, 1400);
  const venueSrc = imageOrPlaceholder(retreat.venueImage, PLACEHOLDERS.venue, 1400);
  const includedSrc = imageOrPlaceholder(retreat.includedImage, PLACEHOLDERS.included, 2000, 900);
  const guideSrc = imageOrPlaceholder(retreat.guideImage, PLACEHOLDERS.guide, 1200);
  const whatIsSrc = imageOrPlaceholder(retreat.whatIsImage, PLACEHOLDERS.whatIs, 2000, 1100);
  const gallery = (retreat.gallery || [])
    .filter((g) => g.asset)
    .map((g) => ({
      src: urlFor(g).width(1600).url(),
      alt: g.alt || retreat.title,
      caption: g.caption || g.alt,
      captionPosition: g.captionPosition,
      creditUrl: g.creditUrl,
    }));

  const locationDisplay =
    retreat.locationLine ||
    [retreat.location?.city, retreat.location?.name]
      .filter(Boolean)
      .join(" · ");
  const dateDisplay = dateRange(retreat.dateStart, retreat.dateEnd);
  const finished = hasFinished(retreat.dateStart, retreat.dateEnd);

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
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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

      {/* HERO — full-screen with bg image, white text */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden text-cream">
        <div className="absolute inset-0 -z-10">
          <Image
            src={heroSrc}
            alt={retreat.heroImage?.alt || retreat.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/55 via-espresso/45 to-espresso/70" />
        </div>
        {(retreat.heroImage?.caption || retreat.heroImage?.alt) && (
          <div className="absolute bottom-4 right-5 z-10">
            <ImageCaption
              text={retreat.heroImage?.caption || retreat.heroImage?.alt}
              href={retreat.heroImage?.creditUrl}
              tone="light"
              className="tracking-wide"
            />
          </div>
        )}

        <Container>
          <div className="text-center max-w-4xl mx-auto py-28 md:py-36">
            {retreat.subtitle && (
              <p className="font-sans text-xs md:text-sm uppercase tracking-[0.25em] text-cream/70 mb-6">
                {retreat.subtitle}
              </p>
            )}
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] leading-[0.95] mb-8 text-cream">
              {retreat.title}
            </h1>
            {retreat.tagline && (
              <p className="font-serif italic text-2xl md:text-3xl text-cream/90 mb-8 max-w-2xl mx-auto">
                {retreat.tagline}
              </p>
            )}
            {retreat.partnership && (
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-cream/55 mb-3">
                {retreat.partnership}
              </p>
            )}
            {(locationDisplay || dateDisplay) && (
              <p className="font-sans text-base text-cream/80 mb-10">
                {[locationDisplay, dateDisplay].filter(Boolean).join(" · ")}
              </p>
            )}
            {finished && (
              <p className="font-sans text-base text-cream/90 bg-espresso/40 border border-cream/25 rounded-2xl px-6 py-4 mb-8 max-w-xl mx-auto leading-relaxed">
                {FINISHED_RETREAT_MESSAGE}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="#enquiry"
                className="inline-flex items-center justify-center font-sans font-medium rounded-full px-9 py-4.5 text-lg bg-cream text-espresso hover:bg-white transition-colors"
              >
                {finished
                  ? "Join the Waitlist"
                  : retreat.secureCtaLabel || "Secure Your Spot"}
              </Link>
              {retreat.bookCallUrl && (
                <a
                  href={retreat.bookCallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-sans font-medium rounded-full px-9 py-4.5 text-lg border-2 border-cream/70 text-cream hover:bg-cream hover:text-espresso transition-colors"
                >
                  Book a Call
                </a>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* CONCEPT — split, secondaryTagline as headline */}
      {(retreat.conceptBody?.length || retreat.secondaryTagline) && (
        <Section background="white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <CaptionedSectionImage
                src={conceptSrc}
                alt={retreat.conceptImage?.alt || "The concept"}
                image={retreat.conceptImage}
                className="order-last lg:order-first"
                imageClassName="aspect-[4/5] rounded-3xl"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <div>
                {retreat.conceptHeading && (
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-sage mb-5">
                    {retreat.conceptHeading}
                  </p>
                )}
                {retreat.secondaryTagline && (
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-8">
                    {retreat.secondaryTagline}
                  </h2>
                )}
                {retreat.conceptBody && (
                  <div>
                    <PortableText
                      value={retreat.conceptBody}
                      components={portableTextComponents}
                    />
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* WHO IT'S FOR — split */}
      {(retreat.whoSubheading || retreat.whoIntro || retreat.whoBullets?.length) && (
        <Section background="cream">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                {retreat.whoHeading && (
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-sage mb-5">
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
                      Expect
                    </p>
                    <ul className="space-y-3">
                      {retreat.whoBullets.map((b, i) => (
                        <li
                          key={bulletKey(b, i)}
                          className="flex items-start gap-3 font-sans text-base text-espresso/80"
                        >
                          <span className="text-terracotta mt-1.5 leading-none">•</span>
                          <span>
                            <BulletContent value={b} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <CaptionedSectionImage
                src={whoSrc}
                alt={retreat.whoImage?.alt || retreat.whoSubheading || "Who it's for"}
                image={retreat.whoImage}
                imageClassName="aspect-[4/5] rounded-3xl"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>
          </Container>
        </Section>
      )}

      {/* EXPERIENCE — split with image, schedule below full-width */}
      {(retreat.experienceBody || retreat.schedule?.length) && (
        <Section background="white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
              <CaptionedSectionImage
                src={experienceSrc}
                alt={retreat.experienceImage?.alt || retreat.experienceSubheading || "The experience"}
                image={retreat.experienceImage}
                className="order-last lg:order-first"
                imageClassName="aspect-[4/5] rounded-3xl"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <div>
                {retreat.experienceHeading && (
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-sage mb-5">
                    {retreat.experienceHeading}
                  </p>
                )}
                {retreat.experienceSubheading && (
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
                    {retreat.experienceSubheading}
                  </h2>
                )}
                {retreat.experienceBody && (
                  <PortableText
                    value={retreat.experienceBody}
                    components={portableTextComponents}
                  />
                )}
              </div>
            </div>

            {retreat.schedule && retreat.schedule.length > 0 && (
              <div className="bg-cream rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
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
          </Container>
        </Section>
      )}

      {/* VENUE — split */}
      {(retreat.venueBody || retreat.venueBullets?.length) && (
        <Section background="cream">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                {retreat.venueHeading && (
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-sage mb-5">
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
                      {retreat.venueBullets.map((b, i) => (
                        <li
                          key={bulletKey(b, i)}
                          className="flex items-start gap-3 font-sans text-base text-espresso/80"
                        >
                          <span className="text-terracotta mt-1.5 leading-none">•</span>
                          <span>
                            <BulletContent value={b} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <CaptionedSectionImage
                src={venueSrc}
                alt={retreat.venueImage?.alt || retreat.venueSubheading || "Venue"}
                image={retreat.venueImage}
                imageClassName="aspect-[4/5] rounded-3xl"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>
          </Container>
        </Section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && <GallerySection heading="Gallery" images={gallery} />}

      {/* WHAT'S INCLUDED — banner image above + grid */}
      {retreat.includedItems && retreat.includedItems.length > 0 && (
        <Section background="white">
          <Container>
            <div className="max-w-5xl mx-auto">
              <CaptionedSectionImage
                src={includedSrc}
                alt={retreat.includedImage?.alt || "Everything you need"}
                image={retreat.includedImage}
                className="mb-12"
                imageClassName="aspect-[16/7] rounded-3xl"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="text-center mb-10">
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-sage mb-4">
                  {retreat.includedHeading || "What’s Included"}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
                  Everything you need
                </h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 max-w-3xl mx-auto">
                {retreat.includedItems.map((item, i) => (
                  <li
                    key={bulletKey(item, i)}
                    className="flex items-start gap-3 font-sans text-base text-espresso/80"
                  >
                    <span className="text-sage mt-1 leading-none">✓</span>
                    <span>
                      <BulletContent value={item} />
                    </span>
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

      {/* GUIDE — split */}
      {(retreat.guideBio || retreat.guideName) && (
        <Section background="cream">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
              <CaptionedSectionImage
                src={guideSrc}
                alt={retreat.guideImage?.alt || retreat.guideName || "Guide"}
                image={retreat.guideImage}
                className="lg:col-span-2"
                imageClassName="aspect-[4/5] rounded-3xl"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
              <div className="lg:col-span-3">
                {retreat.guideHeading && (
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-sage mb-5">
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

      {/* WHAT IS — image + text on dark background */}
      {retreat.whatIsBody && retreat.whatIsBody.length > 0 && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src={whatIsSrc}
              alt={retreat.whatIsImage?.alt || "What it is"}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-espresso/75" />
          </div>
          {(retreat.whatIsImage?.caption || retreat.whatIsImage?.alt) && (
            <div className="absolute bottom-3 right-5 z-10">
              <ImageCaption
                text={retreat.whatIsImage?.caption || retreat.whatIsImage?.alt}
                href={retreat.whatIsImage?.creditUrl}
                tone="light"
                className="tracking-wide"
              />
            </div>
          )}
          <Container>
            <div className="max-w-3xl mx-auto text-center py-[clamp(5rem,10vw,9rem)]">
              {retreat.whatIsHeading && (
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-8 text-cream">
                  {retreat.whatIsHeading}
                </h2>
              )}
              <div className="text-cream/85 [&_p]:!text-cream/85 [&_p]:font-sans [&_p]:text-base [&_p]:md:text-lg [&_p]:leading-relaxed [&_p]:mb-4">
                <PortableText
                  value={retreat.whatIsBody}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* PRICING */}
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
                  {finished
                    ? "Join the Waitlist"
                    : retreat.secureCtaLabel || "Secure Your Spot"}
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

      {/* CLOSING TAGLINE */}
      {retreat.secondaryTagline && (
        <section className="bg-cream py-[clamp(4rem,8vw,7rem)]">
          <Container>
            <p className="font-serif italic text-center text-3xl md:text-5xl lg:text-6xl text-espresso/85 leading-tight max-w-3xl mx-auto">
              {retreat.secondaryTagline}
            </p>
          </Container>
        </section>
      )}

      {/* ENQUIRY */}
      <Section background="white" id="enquiry">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-sage mb-4">
                {finished ? "Waitlist" : "Reserve Your Spot"}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
                {finished
                  ? "Join the Waitlist"
                  : retreat.secureCtaLabel || "Secure Your Spot"}
              </h2>
              <p className="font-sans text-base text-espresso/60">
                {finished
                  ? "This retreat has finished. Leave your details and you'll be the first to hear when the next one is announced."
                  : "Leave your details and Niamh will be in touch with full information and next steps."}
              </p>
            </div>
            <EventEnquiryForm
              retreatTitle={retreat.title}
              retreatSlug={retreat.slug.current}
              recipientEmail={retreat.enquiryRecipient}
              bookCallUrl={retreat.bookCallUrl}
              primaryLabel={
                finished ? "Join the Waitlist" : retreat.secureCtaLabel || "Reserve Your Spot"
              }
            />
          </div>
        </Container>
      </Section>

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-sand/20 py-4">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p
                className={`font-serif text-base md:text-lg truncate ${
                  finished ? "line-through text-espresso/50" : ""
                }`}
              >
                {retreat.title}
              </p>
              <p className="font-sans text-xs md:text-sm text-espresso/50 truncate">
                {[locationDisplay, dateDisplay].filter(Boolean).join(" · ")}
              </p>
            </div>
            <Link
              href="#enquiry"
              className={`shrink-0 inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-300 px-7 py-3.5 text-base ${
                finished || retreat.status === "sold-out"
                  ? "border-2 border-espresso text-espresso hover:bg-espresso hover:text-cream"
                  : "bg-espresso text-cream hover:bg-espresso-light"
              }`}
            >
              {finished || retreat.status === "sold-out"
                ? "Join Waitlist"
                : retreat.secureCtaLabel || "Secure Your Spot"}
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
