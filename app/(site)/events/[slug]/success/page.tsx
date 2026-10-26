import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { client } from "@/lib/sanity/client";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false, follow: false },
};

type Params = { slug: string };

export default async function EventSuccessPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const event = await client.fetch<{
    title: string;
    dateStart?: string;
    location?: { name?: string; city?: string; country?: string };
  } | null>(
    `*[_type == "event" && slug.current == $slug][0]{ title, dateStart, location }`,
    { slug }
  );

  if (!event) notFound();

  const dateStr = event.dateStart
    ? new Date(event.dateStart).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const locationStr = [event.location?.name, event.location?.city]
    .filter(Boolean)
    .join(", ");

  return (
    <Section background="cream">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <p className="font-sans text-sm uppercase tracking-widest text-sage mb-4">
            Booking confirmed
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            You&rsquo;re booked in
          </h1>
          <p className="font-sans text-base text-espresso/70 leading-relaxed mb-8">
            Thank you — your place at{" "}
            <span className="text-espresso font-medium">{event.title}</span> is
            confirmed. A confirmation email is on its way, and your receipt comes
            separately from Stripe.
          </p>

          {(dateStr || locationStr) && (
            <div className="bg-white rounded-3xl border border-sand/40 px-6 py-5 mb-10 text-left inline-block">
              {dateStr && (
                <p className="font-sans text-sm text-espresso/70">
                  <span className="text-espresso/40">When · </span>
                  {dateStr}
                </p>
              )}
              {locationStr && (
                <p className="font-sans text-sm text-espresso/70 mt-1">
                  <span className="text-espresso/40">Where · </span>
                  {locationStr}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/events" variant="primary" size="md">
              See other events
            </Button>
            <Button href="/contact" variant="outline" size="md">
              Get in touch
            </Button>
          </div>

          <p className="font-sans text-xs text-espresso/40 mt-10">
            Didn&rsquo;t get an email? Check your spam folder, or{" "}
            <Link href="/contact" className="underline underline-offset-2">
              let Niamh know
            </Link>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
