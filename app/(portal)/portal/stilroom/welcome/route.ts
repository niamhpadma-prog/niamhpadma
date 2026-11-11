import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { syncSubscription } from "@/lib/portal/membership";

// Stripe sends new members here after paying. Saving the membership now means
// STILroom opens straight away instead of waiting for Stripe's webhook.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (sessionId && user) {
    try {
      const session = await stripe().checkout.sessions.retrieve(sessionId);
      if (
        session.status === "complete" &&
        session.metadata?.user_id === user.id &&
        session.subscription
      ) {
        const sub = session.subscription;
        await syncSubscription(typeof sub === "string" ? sub : sub.id);
      }
    } catch (err) {
      // The webhook will still catch up; the member may just need a refresh.
      console.error("[stilroom] welcome sync failed:", err);
    }
  }

  return NextResponse.redirect(new URL("/portal/stilroom?welcome=1", url.origin));
}
