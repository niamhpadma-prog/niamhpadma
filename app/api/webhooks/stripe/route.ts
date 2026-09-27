import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sanityMutate } from "@/lib/sanity/writeClient";

const NIAMH_EMAIL = "hello@somatictherapyinlisbon.com";

function formatAmount(session: Stripe.Checkout.Session) {
  if (typeof session.amount_total !== "number") return "";
  const currency = (session.currency || "eur").toUpperCase();
  return `${(session.amount_total / 100).toFixed(2)} ${currency}`;
}

async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Niamh Padma <noreply@niamhpadma.com>",
    to: options.to,
    subject: options.subject,
    text: options.text,
    replyTo: options.replyTo,
  });
}

async function handleEventBooking(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const name = session.customer_details?.name || "";
  const eventSlug = session.metadata?.eventSlug;
  const eventId = session.metadata?.eventId;
  const eventTitle = session.metadata?.eventTitle || "your event";

  if (!email || !eventSlug || !eventId) {
    console.error("[stripe] event booking missing details", session.id);
    return;
  }

  const amount = formatAmount(session);

  // Stripe retries webhooks, so the booking id is derived from the session id:
  // a retry then re-creates the same document instead of adding a second place
  // and eating another spot of capacity.
  await sanityMutate([
    {
      createIfNotExists: {
        _id: `eventBooking-${session.id}`,
        _type: "eventBooking",
        name,
        email,
        event: { _type: "reference", _ref: eventId },
        amountPaid: amount,
        stripeSessionId: session.id,
        stripeCustomerId: (session.customer as string) || undefined,
        bookedAt: new Date().toISOString(),
        status: "active",
      },
    },
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://niamhpadma.com";

  await sendEmail({
    to: email,
    replyTo: NIAMH_EMAIL,
    subject: `You're booked in — ${eventTitle}`,
    text: [
      `Thank you for booking ${eventTitle}.`,
      "",
      "Your place is confirmed. Stripe has emailed your receipt separately.",
      "",
      `Event details: ${siteUrl}/events/${eventSlug}`,
      "",
      `If anything changes or you have questions, just reply to this email.`,
      "",
      "With love,",
      "Niamh",
    ].join("\n"),
  });

  // Niamh needs to know a place has gone without checking Stripe.
  await sendEmail({
    to: NIAMH_EMAIL,
    replyTo: email,
    subject: `[Booking] ${eventTitle} — ${name || email}`,
    text: [
      `A place has been booked and paid for.`,
      "",
      `Event: ${eventTitle}`,
      `Name: ${name || "(not given)"}`,
      `Email: ${email}`,
      `Paid: ${amount || "(see Stripe)"}`,
      "",
      `Stripe session: ${session.id}`,
      `Bookings list: ${siteUrl}/studio/structure/eventBooking`,
    ].join("\n"),
  });
}

async function handleCourseEnrollment(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const courseSlug = session.metadata?.courseSlug;

  if (!email || !courseSlug) {
    console.error("[stripe] course enrollment missing details", session.id);
    return;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const courseQuery = encodeURIComponent(
    `*[_type == "course" && slug.current == "${courseSlug}"][0]._id`
  );
  const courseRes = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${courseQuery}`,
    { headers: { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` } }
  );
  const courseData = await courseRes.json();
  const courseId = courseData.result;

  if (courseId) {
    await sanityMutate([
      {
        createIfNotExists: {
          _id: `courseEnrollment-${session.id}`,
          _type: "courseEnrollment",
          email,
          course: { _type: "reference", _ref: courseId },
          stripeSessionId: session.id,
          stripeCustomerId: (session.customer as string) || undefined,
          purchasedAt: new Date().toISOString(),
          status: "active",
        },
      },
    ]);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://niamhpadma.com";
  await sendEmail({
    to: email,
    replyTo: NIAMH_EMAIL,
    subject: "Welcome to your course!",
    text: `Thank you for your purchase!\n\nYou can access your course here:\n${siteUrl}/courses/${courseSlug}/learn\n\nIf you ever need to regain access, just visit the course page and click "I already purchased" to receive a magic link.\n\nWith love,\nNiamh`,
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      if (session.metadata?.eventSlug) {
        await handleEventBooking(session);
      } else if (session.metadata?.courseSlug) {
        await handleCourseEnrollment(session);
      }
    } catch (err) {
      // Never 500 here: Stripe would retry, and the money is already taken.
      // The payment itself is safe in Stripe either way.
      console.error("Error processing completed checkout:", err);
    }
  }

  return NextResponse.json({ received: true });
}
