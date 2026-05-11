import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { urlFor } from "@/lib/sanity/image";

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
  heroImage?: { asset?: { url?: string; _ref?: string }; alt?: string } | null;
}

function formatDateRange(start?: string, end?: string) {
  if (!start) return null;
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  const sameMonth =
    endDate &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();
  const sameYear = endDate && startDate.getFullYear() === endDate.getFullYear();

  const dayMonth = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  const dayMonthYear = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  if (!endDate) return dayMonthYear(startDate);
  if (sameMonth)
    return `${startDate.getDate()}–${endDate.getDate()} ${endDate.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    })}`;
  if (sameYear)
    return `${dayMonth(startDate)} – ${dayMonthYear(endDate)}`;
  return `${dayMonthYear(startDate)} – ${dayMonthYear(endDate)}`;
}

function resolveImage(img: UpcomingRetreat["heroImage"]) {
  if (!img) return null;
  if (img.asset?._ref) return urlFor(img).width(1600).height(900).fit("crop").url();
  if (img.asset?.url) return img.asset.url;
  return null;
}

export function UpcomingRetreats({ retreats }: { retreats: UpcomingRetreat[] }) {
  if (!retreats?.length) {
    return (
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
            <Button
              href="/events"
              variant="outline"
              className="border-cream/40 text-cream hover:bg-cream hover:text-espresso"
            >
              View All Events
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const isFeatured = retreats.length === 1;

  return (
    <Section background="espresso">
      <Container>
        <div className="text-center mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-cream/40 mb-4">
            Upcoming
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-cream">
            {isFeatured ? "Next Retreat" : "Upcoming Retreats"}
          </h2>
        </div>

        <div
          className={
            isFeatured
              ? "max-w-5xl mx-auto"
              : "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          }
        >
          {retreats.map((retreat) => {
            const dateLabel = formatDateRange(retreat.dateStart, retreat.dateEnd);
            const imageUrl = resolveImage(retreat.heroImage);
            return (
              <Link
                key={retreat._id}
                href={`/retreats/${retreat.slug.current}`}
                className="group block"
              >
                <article
                  className={
                    isFeatured
                      ? "grid grid-cols-1 md:grid-cols-2 gap-0 bg-cream/5 rounded-3xl overflow-hidden border border-cream/10 hover:border-cream/30 transition-colors"
                      : "flex flex-col bg-cream/5 rounded-3xl overflow-hidden border border-cream/10 hover:border-cream/30 transition-colors h-full"
                  }
                >
                  <div
                    className={
                      isFeatured
                        ? "relative aspect-[4/3] md:aspect-auto md:min-h-[360px] bg-espresso/40"
                        : "relative aspect-[16/10] bg-espresso/40"
                    }
                  >
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={retreat.heroImage?.alt || retreat.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={
                          isFeatured
                            ? "(max-width: 768px) 100vw, 50vw"
                            : "(max-width: 768px) 100vw, 50vw"
                        }
                      />
                    )}
                  </div>
                  <div
                    className={
                      isFeatured
                        ? "p-8 md:p-12 flex flex-col justify-center"
                        : "p-6 md:p-8 flex flex-col flex-1"
                    }
                  >
                    {dateLabel && (
                      <p className="font-sans text-xs uppercase tracking-widest text-cream/50 mb-3">
                        {dateLabel}
                      </p>
                    )}
                    <h3
                      className={
                        isFeatured
                          ? "font-serif text-3xl md:text-4xl text-cream mb-3 group-hover:text-terracotta transition-colors"
                          : "font-serif text-2xl md:text-3xl text-cream mb-2 group-hover:text-terracotta transition-colors"
                      }
                    >
                      {retreat.title}
                    </h3>
                    {retreat.subtitle && (
                      <p className="font-sans text-sm text-cream/60 mb-3">
                        {retreat.subtitle}
                      </p>
                    )}
                    {retreat.tagline && (
                      <p className="font-serif text-lg text-cream/80 leading-relaxed mb-4">
                        {retreat.tagline}
                      </p>
                    )}
                    {retreat.locationLine && (
                      <p className="font-sans text-sm text-cream/50 mb-6">
                        {retreat.locationLine}
                      </p>
                    )}
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-2 font-sans text-sm text-cream group-hover:text-terracotta transition-colors">
                        Learn more
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            href="/events"
            variant="outline"
            className="border-cream/40 text-cream hover:bg-cream hover:text-espresso"
          >
            View All Events
          </Button>
        </div>
      </Container>
    </Section>
  );
}
