import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Where email links land after Supabase confirms them (sign-up confirmation,
// password reset): swap the one-time code for a signed-in session.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/portal/login?error=link", url.origin));
}

function safeNext(next: string | null) {
  return next && next.startsWith("/portal") ? next : "/portal";
}
