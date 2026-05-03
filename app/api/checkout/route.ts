import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { client } from "@/lib/sanity/client";

export async function POST(request: Request) {
  try {
    const { courseSlug } = await request.json();

    if (!courseSlug) {
      return NextResponse.json({ error: "Course slug is required" }, { status: 400 });
    }

    // Look up course in Sanity to get the Stripe price ID
    const course = await client.fetch<{
      title: string;
      stripePriceId: string;
      slug: { current: string };
    }>(
      `*[_type == "course" && slug.current == $slug && status == "published"][0]{
        title, stripePriceId, slug
      }`,
      { slug: courseSlug }
    );

    if (!course || !course.stripePriceId) {
      return NextResponse.json({ error: "Course not found or not available" }, { status: 404 });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";

    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: course.stripePriceId, quantity: 1 }],
      success_url: `${origin}/courses/${courseSlug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/courses/${courseSlug}`,
      customer_email: undefined, // Stripe will collect email
      metadata: { courseSlug },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
