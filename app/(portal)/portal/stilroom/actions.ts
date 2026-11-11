"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/corner";

async function origin() {
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
}

// "Join STILroom": send the signed-in person to Stripe to start their monthly
// membership.
export async function startMembership() {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer) redirect("/portal/login");
  if (viewer.hasStilroom) redirect("/portal/stilroom");

  const price = process.env.STRIPE_STILROOM_PRICE_ID;
  if (!price) throw new Error("STRIPE_STILROOM_PRICE_ID is not set");

  // Someone re-joining keeps their Stripe customer record and card details.
  const { data: membership } = await supabase
    .from("memberships")
    .select("stripe_customer_id")
    .eq("user_id", viewer.id)
    .maybeSingle();

  const base = await origin();
  const tags = { user_id: viewer.id, product: "stilroom" };
  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    client_reference_id: viewer.id,
    ...(membership?.stripe_customer_id
      ? { customer: membership.stripe_customer_id }
      : { customer_email: viewer.email }),
    metadata: tags,
    subscription_data: { metadata: tags },
    allow_promotion_codes: true,
    success_url: `${base}/portal/stilroom/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/portal/join`,
  });

  redirect(session.url!);
}

// "Manage my membership": Stripe's own page for changing card, viewing
// receipts or cancelling.
export async function manageMembership() {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer) redirect("/portal/login");

  const { data: membership } = await supabase
    .from("memberships")
    .select("stripe_customer_id")
    .eq("user_id", viewer.id)
    .maybeSingle();
  if (!membership?.stripe_customer_id) redirect("/portal/stilroom");

  const portal = await stripe().billingPortal.sessions.create({
    customer: membership.stripe_customer_id,
    return_url: `${await origin()}/portal/stilroom`,
  });
  redirect(portal.url);
}
