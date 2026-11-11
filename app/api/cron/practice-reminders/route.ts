import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderReminder, todayIn } from "@/lib/portal/reminders";

export const dynamic = "force-dynamic";

const REPLY_TO = process.env.PORTAL_NOTIFY_EMAIL || "hello@somatictherapyinlisbon.com";

type Row = {
  id: string;
  user_id: string;
  title: string;
  days: number[];
  last_reminded_on: string | null;
  profiles: { full_name: string | null; email: string | null; timezone: string | null; is_client: boolean } | null;
};

// Runs every morning (see vercel.json). Emails each client who has a reminder
// switched on for a practice planned today, once per day, all of that day's
// practices in one email.
export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}` || !process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 });
  }

  const supabase = createAdminClient();
  const { data: text } = await supabase
    .from("portal_texts")
    .select("body")
    .eq("key", "practice_reminder")
    .maybeSingle();
  if (!text?.body) return NextResponse.json({ sent: 0, skipped: "No reminder message written yet" });

  const { data, error } = await supabase
    .from("practice_plans")
    .select("id, user_id, title, days, last_reminded_on, profiles(full_name, email, timezone, is_client)")
    .eq("reminder_on", true);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group today's practices by person.
  const due = new Map<string, { profile: NonNullable<Row["profiles"]>; date: string; plans: Row[] }>();
  for (const row of (data ?? []) as unknown as Row[]) {
    const profile = row.profiles;
    if (!profile?.email || !profile.is_client) continue;
    const { date, weekday } = todayIn(profile.timezone);
    if (!row.days.includes(weekday) || row.last_reminded_on === date) continue;
    const entry = due.get(row.user_id) ?? { profile, date, plans: [] };
    entry.plans.push(row);
    due.set(row.user_id, entry);
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://niamhpadma.com"}/portal`;
  let sent = 0;
  const failed: string[] = [];

  for (const [userId, { profile, date, plans }] of due) {
    const email = renderReminder(text.body, {
      fullName: profile.full_name,
      practices: plans.map((p) => p.title),
      portalUrl,
    });
    const { error: sendError } = await resend.emails.send({
      from: "Niamh Padma <noreply@niamhpadma.com>",
      to: profile.email!,
      replyTo: REPLY_TO,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    if (sendError) {
      console.error("[reminders] send failed for", userId, sendError.message);
      failed.push(userId);
      continue;
    }
    await supabase
      .from("practice_plans")
      .update({ last_reminded_on: date })
      .in("id", plans.map((p) => p.id));
    sent++;
  }

  return NextResponse.json({ sent, failed: failed.length });
}
