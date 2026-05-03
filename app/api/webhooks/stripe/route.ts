import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sanityMutate } from "@/lib/sanity/writeClient";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
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
    const session = event.data.object;
    const email = session.customer_details?.email;
    const courseSlug = session.metadata?.courseSlug;

    if (!email || !courseSlug) {
      console.error("Missing email or courseSlug in session:", session.id);
      return NextResponse.json({ received: true });
    }

    // Create enrollment in Sanity
    try {
      // Find the course document ID
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
      const courseQuery = encodeURIComponent(`*[_type == "course" && slug.current == "${courseSlug}"][0]._id`);
      const courseRes = await fetch(
        `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${courseQuery}`,
        {
          headers: { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` },
        }
      );
      const courseData = await courseRes.json();
      const courseId = courseData.result;

      if (courseId) {
        await sanityMutate([
          {
            create: {
              _type: "courseEnrollment",
              email,
              course: { _type: "reference", _ref: courseId },
              stripeSessionId: session.id,
              stripeCustomerId: session.customer as string,
              purchasedAt: new Date().toISOString(),
              status: "active",
            },
          },
        ]);
      }

      // Send welcome email via Resend
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://niamhpadma.com";

        await resend.emails.send({
          from: "Niamh Padma <noreply@niamhpadma.com>",
          to: email,
          subject: "Welcome to your course!",
          text: `Thank you for your purchase!\n\nYou can access your course here:\n${siteUrl}/courses/${courseSlug}/learn\n\nIf you ever need to regain access, just visit the course page and click "I already purchased" to receive a magic link.\n\nWith love,\nNiamh`,
        });
      }
    } catch (err) {
      console.error("Error processing enrollment:", err);
    }
  }

  return NextResponse.json({ received: true });
}
