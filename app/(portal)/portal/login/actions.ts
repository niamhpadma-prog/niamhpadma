"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_SITE_URL!;
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: "That email and password don't match. Please try again." };
  redirect("/portal");
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName) return { error: "Please add your name." };
  if (password.length < 8) return { error: "Please choose a password of at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${await siteOrigin()}/portal/auth/callback`,
    },
  });
  if (error) return { error: error.message };

  // Signed in straight away when email confirmation is off.
  if (data.session) redirect("/portal");
  return { message: "Check your email for a link to confirm your account." };
}

export async function sendReset(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(String(formData.get("email") ?? "").trim(), {
    redirectTo: `${await siteOrigin()}/portal/auth/callback?next=/portal/set-password`,
  });
  // Logged for Niamh's server logs only; the visitor sees the same message.
  if (error) console.error("[portal] password reset email failed:", error.message);
  // Same answer either way, so nobody can find out who has an account.
  return { message: "If there's an account for that email, a reset link is on its way." };
}
