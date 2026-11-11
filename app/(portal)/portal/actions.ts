"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/corner";
import { isTimezone } from "@/lib/portal/reminders";

const NOTIFY_EMAIL = process.env.PORTAL_NOTIFY_EMAIL || "hello@somatictherapyinlisbon.com";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

export async function toggleTask(taskId: string, done: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ done_at: done ? new Date().toISOString() : null })
    .eq("id", taskId);
  if (error) throw new Error("Couldn't save that tick. Please try again.");
  revalidatePath("/portal", "layout");
}

export async function saveNoteReply(noteId: string, body: string) {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer) redirect("/portal/login");

  const text = body.trim();
  const { data: existing } = await supabase
    .from("journal_entries")
    .select("id")
    .eq("user_id", viewer.id)
    .eq("weekly_note_id", noteId)
    .eq("kind", "note")
    .maybeSingle();

  const { error } = existing
    ? text
      ? await supabase
          .from("journal_entries")
          .update({ body: text, updated_at: new Date().toISOString() })
          .eq("id", existing.id)
      : await supabase.from("journal_entries").delete().eq("id", existing.id)
    : text
      ? await supabase
          .from("journal_entries")
          .insert({ weekly_note_id: noteId, kind: "note", body: text })
      : { error: null };

  if (error) throw new Error("Couldn't save your note. Please try again.");
  revalidatePath("/portal", "layout");
}

export async function sendMessage(clientId: string, body: string) {
  const text = body.trim();
  if (!text) return;

  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer) redirect("/portal/login");

  const { error } = await supabase
    .from("messages")
    .insert({ client_id: clientId, body: text });
  if (error) throw new Error("Couldn't send your message. Please try again.");

  // Let Niamh know a client has written. The email deliberately leaves out the
  // message itself; she reads it in the portal.
  if (!viewer.isAdmin && process.env.RESEND_API_KEY) {
    try {
      const h = await headers();
      const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Niamh Padma Portal <noreply@niamhpadma.com>",
        to: NOTIFY_EMAIL,
        subject: `New message from ${viewer.fullName || "a client"}`,
        text: `${viewer.fullName || viewer.email} has sent you a message in the client portal.\n\nRead and reply: ${origin}/portal/clients/${clientId}`,
      });
    } catch (err) {
      console.error("[portal] message notification failed", err);
    }
  }

  revalidatePath("/portal", "layout");
}

// Practice days ---------------------------------------------------------------
// Clients edit their own; Niamh can edit anyone's (the database checks this).

export async function savePracticePlan(
  clientId: string,
  plan: { id?: string; title: string; days: number[]; reminder_on: boolean },
  timezone?: string
): Promise<string> {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer) redirect("/portal/login");

  const fields = {
    title: plan.title.trim(),
    days: [...new Set(plan.days)].filter((d) => d >= 1 && d <= 7).sort(),
    reminder_on: plan.reminder_on,
  };
  if (!fields.title) throw new Error("Give your practice a name.");

  // Remember the client's own time zone so reminders arrive on their morning.
  if (viewer.id === clientId && timezone && isTimezone(timezone)) {
    await supabase.from("profiles").update({ timezone }).eq("id", clientId);
  }

  let id = plan.id;
  if (id) {
    const { error } = await supabase.from("practice_plans").update(fields).eq("id", id);
    if (error) throw new Error("Couldn't save that. Please try again.");
  } else {
    const { data, error } = await supabase
      .from("practice_plans")
      .insert({ ...fields, user_id: clientId })
      .select("id")
      .single();
    if (error || !data) throw new Error("Couldn't add that. Please try again.");
    id = data.id as string;
  }
  revalidatePath("/portal", "layout");
  return id;
}

export async function deletePracticePlan(planId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("practice_plans").delete().eq("id", planId);
  if (error) throw new Error("Couldn't remove that. Please try again.");
  revalidatePath("/portal", "layout");
}
