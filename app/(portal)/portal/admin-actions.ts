"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/corner";
import { MEDIA_BUCKET } from "@/lib/supabase/media";
import { renderReminder } from "@/lib/portal/reminders";

// Everything here is Niamh editing a client's corner. The database rules only
// let an admin make these changes; the check below just gives a clear error.
async function adminClient() {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer?.isAdmin) throw new Error("Only Niamh can edit corners.");
  return supabase;
}

function done(clientId: string, error: { message: string } | null) {
  if (error) throw new Error(error.message);
  revalidatePath(`/portal/clients/${clientId}`);
  revalidatePath("/portal");
}

const CORNER_FIELDS = ["title", "intro", "checklist_intro", "resources_intro"] as const;
export type CornerField = (typeof CORNER_FIELDS)[number];

export async function updateCornerField(clientId: string, field: CornerField, value: string) {
  if (!CORNER_FIELDS.includes(field)) throw new Error("Unknown field");
  const supabase = await adminClient();
  const text = value.trim();
  if (field === "title" && !text) throw new Error("The corner needs a title.");
  const { error } = await supabase
    .from("corners")
    .update({ [field]: text || null, updated_at: new Date().toISOString() })
    .eq("user_id", clientId);
  done(clientId, error);
}

// Tasks ---------------------------------------------------------------------

export async function saveTask(
  clientId: string,
  task: { id?: string; section: string; body: string; detail: string }
) {
  const supabase = await adminClient();
  const fields = {
    section: task.section.trim() || "To Begin",
    body: task.body.trim(),
    detail: task.detail.trim() || null,
  };
  if (!fields.body) throw new Error("A task needs some text.");

  if (task.id) {
    const { error } = await supabase.from("tasks").update(fields).eq("id", task.id);
    return done(clientId, error);
  }

  // New tasks go to the end of their section.
  const { data: last } = await supabase
    .from("tasks")
    .select("sort")
    .eq("user_id", clientId)
    .order("sort", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase
    .from("tasks")
    .insert({ ...fields, user_id: clientId, sort: (last?.sort ?? 0) + 1 });
  done(clientId, error);
}

export async function deleteTask(clientId: string, taskId: string) {
  const supabase = await adminClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  done(clientId, error);
}

export async function moveTask(clientId: string, taskId: string, direction: "up" | "down") {
  const supabase = await adminClient();
  const { data: task } = await supabase
    .from("tasks")
    .select("id, section, sort")
    .eq("id", taskId)
    .single();
  if (!task) return;

  const { data: siblings } = await supabase
    .from("tasks")
    .select("id, sort")
    .eq("user_id", clientId)
    .eq("section", task.section)
    .order("sort")
    .order("created_at");
  const list = siblings ?? [];
  const i = list.findIndex((t) => t.id === taskId);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return;

  // Renumber the section so the swap is always clean.
  [list[i], list[j]] = [list[j], list[i]];
  for (const [index, t] of list.entries()) {
    await supabase.from("tasks").update({ sort: index + 1 }).eq("id", t.id);
  }
  done(clientId, null);
}

// Weekly notes ----------------------------------------------------------------

export async function saveWeeklyNote(
  clientId: string,
  note: { id?: string; title: string; note_date: string; body: string }
) {
  const supabase = await adminClient();
  const fields = {
    title: note.title.trim(),
    note_date: note.note_date || null,
    body: note.body.trim() || null,
  };
  if (!fields.title) throw new Error("A weekly note needs a title, e.g. “Week 3”.");

  const { error } = note.id
    ? await supabase.from("weekly_notes").update(fields).eq("id", note.id)
    : await supabase.from("weekly_notes").insert({ ...fields, user_id: clientId });
  done(clientId, error);
}

export async function deleteWeeklyNote(clientId: string, noteId: string) {
  const supabase = await adminClient();
  // Recordings attached to the note move back to Resources rather than vanish.
  const { error } = await supabase.from("weekly_notes").delete().eq("id", noteId);
  done(clientId, error);
}

// Recordings and files ------------------------------------------------------

export async function saveResource(
  clientId: string,
  resource: { id: string; title: string; description: string; weekly_note_id: string }
) {
  const supabase = await adminClient();
  const title = resource.title.trim();
  if (!title) throw new Error("A recording needs a title.");
  const { error } = await supabase
    .from("resources")
    .update({
      title,
      description: resource.description.trim() || null,
      weekly_note_id: resource.weekly_note_id || null,
    })
    .eq("id", resource.id);
  done(clientId, error);
}

export async function deleteResource(clientId: string, resourceId: string) {
  const supabase = await adminClient();
  const { data: resource } = await supabase
    .from("resources")
    .select("storage_path")
    .eq("id", resourceId)
    .single();
  const { error } = await supabase.from("resources").delete().eq("id", resourceId);
  if (!error && resource?.storage_path) {
    await supabase.storage.from(MEDIA_BUCKET).remove([resource.storage_path]);
  }
  done(clientId, error);
}

// Clients and members ---------------------------------------------------------

export async function setIsClient(userId: string, isClient: boolean) {
  const supabase = await adminClient();
  const { error } = await supabase.from("profiles").update({ is_client: isClient }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/portal");
}

// Editable wording on STILroom pages ------------------------------------------

const PORTAL_TEXT_KEYS = ["stilroom_welcome", "stilroom_join", "practice_reminder"] as const;
export type PortalTextKey = (typeof PORTAL_TEXT_KEYS)[number];

export async function updatePortalText(key: PortalTextKey, body: string) {
  if (!PORTAL_TEXT_KEYS.includes(key)) throw new Error("Unknown text");
  const supabase = await adminClient();
  const { error } = await supabase
    .from("portal_texts")
    .upsert({ key, body: body.trim() || null, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  revalidatePath("/portal", "layout");
}

// STILroom collections and items ----------------------------------------------

function stilroomDone(error: { message: string } | null) {
  if (error) throw new Error(error.message);
  revalidatePath("/portal/stilroom");
}

export async function saveCollection(collection: { id?: string; title: string; description: string }) {
  const supabase = await adminClient();
  const fields = { title: collection.title.trim(), description: collection.description.trim() || null };
  if (!fields.title) throw new Error("A collection needs a title.");
  if (collection.id) {
    const { error } = await supabase.from("stilroom_collections").update(fields).eq("id", collection.id);
    return stilroomDone(error);
  }
  const { data: last } = await supabase
    .from("stilroom_collections")
    .select("sort")
    .order("sort", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase
    .from("stilroom_collections")
    .insert({ ...fields, sort: (last?.sort ?? 0) + 1 });
  stilroomDone(error);
}

export async function deleteCollection(id: string) {
  const supabase = await adminClient();
  // Items in it stay in STILroom, under "More to explore".
  const { error } = await supabase.from("stilroom_collections").delete().eq("id", id);
  stilroomDone(error);
}

export async function saveStilroomItem(item: {
  id: string;
  title: string;
  description: string;
  collection_id: string;
}) {
  const supabase = await adminClient();
  const title = item.title.trim();
  if (!title) throw new Error("It needs a title.");
  const { error } = await supabase
    .from("stilroom_items")
    .update({
      title,
      description: item.description.trim() || null,
      collection_id: item.collection_id || null,
    })
    .eq("id", item.id);
  stilroomDone(error);
}

export async function deleteStilroomItem(id: string) {
  const supabase = await adminClient();
  const { data: item } = await supabase.from("stilroom_items").select("storage_path").eq("id", id).single();
  const { error } = await supabase.from("stilroom_items").delete().eq("id", id);
  if (!error && item?.storage_path) {
    await supabase.storage.from(MEDIA_BUCKET).remove([item.storage_path]);
  }
  stilroomDone(error);
}

// Practice reminders ------------------------------------------------------------

// Sends Niamh's reminder message to Niamh herself, filled in with an example,
// so she can see exactly what clients receive.
export async function sendTestReminder(): Promise<string> {
  const supabase = await adminClient();
  const viewer = await getViewer(supabase);
  const { data } = await supabase.from("portal_texts").select("body").eq("key", "practice_reminder").maybeSingle();
  if (!data?.body) throw new Error("Write your message first, then send a test.");
  if (!process.env.RESEND_API_KEY) throw new Error("Email isn't set up here (RESEND_API_KEY is missing).");

  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://niamhpadma.com";
  const email = renderReminder(data.body, {
    fullName: viewer?.fullName ?? null,
    practices: ["10-minute body scan"],
    portalUrl: `${site}/portal`,
  });
  const { Resend } = await import("resend");
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "Niamh Padma <noreply@niamhpadma.com>",
    to: viewer!.email,
    subject: `[Test] ${email.subject}`,
    text: email.text,
    html: email.html,
  });
  if (error) throw new Error(`The email didn't send: ${error.message}`);
  return viewer!.email;
}
