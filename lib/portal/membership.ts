import "server-only";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const STILROOM = "STILroom";

// Copies a Stripe subscription onto the member's account. Called both when a
// member returns from checkout (so access is instant) and from Stripe's
// webhook (renewals, cancellations, failed payments).
export async function syncSubscription(sub: Stripe.Subscription | string) {
  const subscription =
    typeof sub === "string" ? await stripe().subscriptions.retrieve(sub) : sub;

  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error("[stilroom] subscription has no user_id:", subscription.id);
    return;
  }

  // Newer Stripe API versions keep the period end on the subscription item.
  const periodEnd =
    subscription.items?.data?.[0]?.current_period_end ??
    (subscription as unknown as { current_period_end?: number }).current_period_end;

  const { error } = await createAdminClient()
    .from("memberships")
    .upsert({
      user_id: userId,
      status: subscription.status,
      stripe_customer_id:
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
      stripe_subscription_id: subscription.id,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error(`Couldn't save membership: ${error.message}`);
}

export function isStilroomSubscription(sub: Stripe.Subscription) {
  return sub.metadata?.product === "stilroom";
}
