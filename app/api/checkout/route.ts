import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { client } from "@/lib/sanity/client";

// Creates a Stripe Checkout session for either a course or an event.
//
// Everything that decides the charge — the price, whether the thing is on sale
// at all, whether there are places left — is read from Sanity here on the
// server. The browser only ever sends a slug, so a visitor cannot choose their
// own price or buy something that isn't for sale.

type EventDoc = {
  _id: string;
  title: string;
  stripePriceId?: string;
  acceptsPayment?: boolean;
  status?: string;
  dateStart?: string;
  capacity?: number;
  type?: string;
};

async function eventCheckout(slug: string, origin: string) {
  const event = await client.fetch<EventDoc | null>(
    `*[_type == "event" && slug.current == $slug][0]{
      _id, title, stripePriceId, acceptsPayment, status, dateStart, capacity, type
    }`,
    { slug }
  );

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  if (!event.acceptsPayment || !event.stripePriceId) {
    return NextResponse.json(
      { error: "This event isn't taking payment on the website" },
      { status: 400 }
    );
  }
  if (event.status === "cancelled") {
    return NextResponse.json({ error: "This event has been cancelled" }, { status: 400 });
  }
  if (event.status === "sold-out") {
    return NextResponse.json({ error: "This event is sold out" }, { status: 409 });
  }
  // Don't sell a place on something that has already happened.
  if (event.dateStart && new Date(event.dateStart).getTime() < Date.now()) {
    return NextResponse.json({ error: "This event has already taken place" }, { status: 400 });
  }

  // Best-effort capacity check. Two people paying at the same instant can still
  // both get through, because Stripe holds no stock for us — Niamh refunds in
  // that rare case. Anything stricter needs a reservation step before payment.
  if (typeof event.capacity === "number" && event.capacity > 0) {
    const booked = await client.fetch<number>(
      `count(*[_type == "eventBooking" && event._ref == $id && status == "active"])`,
      { id: event._id }
    );
    if (booked >= event.capacity) {
      return NextResponse.json({ error: "This event is fully booked" }, { status: 409 });
    }
  }

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: event.stripePriceId, quantity: 1 }],
    success_url: `${origin}/events/${slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/events/${slug}`,
    // Needed so the booking record and confirmation email have a name to use.
    billing_address_collection: "auto",
    phone_number_collection: { enabled: false },
    metadata: { eventSlug: slug, eventId: event._id, eventTitle: event.title },
  });

  return NextResponse.json({ url: session.url });
}

async function courseCheckout(slug: string, origin: string) {
  const course = await client.fetch<{
    title: string;
    stripePriceId: string;
    slug: { current: string };
  } | null>(
    `*[_type == "course" && slug.current == $slug && status == "published"][0]{
      title, stripePriceId, slug
    }`,
    { slug }
  );

  if (!course || !course.stripePriceId) {
    return NextResponse.json({ error: "Course not found or not available" }, { status: 404 });
  }

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: course.stripePriceId, quantity: 1 }],
    success_url: `${origin}/courses/${slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/courses/${slug}`,
    metadata: { courseSlug: slug },
  });

  return NextResponse.json({ url: session.url });
}

export async function POST(request: Request) {
  try {
    const { courseSlug, eventSlug } = await request.json();
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";

    if (typeof eventSlug === "string" && eventSlug) {
      return await eventCheckout(eventSlug, origin);
    }
    if (typeof courseSlug === "string" && courseSlug) {
      return await courseCheckout(courseSlug, origin);
    }

    return NextResponse.json({ error: "Nothing to check out" }, { status: 400 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
