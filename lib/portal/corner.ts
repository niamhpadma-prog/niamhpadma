import type { SupabaseClient } from "@supabase/supabase-js";
import { signMediaUrls } from "@/lib/supabase/media";

export type Resource = {
  id: string;
  kind: "audio" | "video" | "file" | "link";
  title: string;
  description: string | null;
  storage_path: string | null;
  url: string | null;
  weekly_note_id: string | null;
  sort: number;
  href: string | null; // signed link for stored files, or the external link
};

export type Task = {
  id: string;
  section: string;
  body: string;
  detail: string | null;
  sort: number;
  done_at: string | null;
};

export type WeeklyNote = {
  id: string;
  title: string;
  note_date: string | null;
  body: string | null;
  resources: Resource[];
  reply: { id: string; body: string } | null;
};

export type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type PracticePlan = {
  id: string;
  title: string;
  days: number[]; // 1 = Monday … 7 = Sunday
  reminder_on: boolean;
  sort: number;
};

export type CornerData = {
  clientId: string;
  clientName: string | null;
  title: string;
  intro: string | null;
  checklistIntro: string | null;
  resourcesIntro: string | null;
  tasks: Task[];
  notes: WeeklyNote[];
  resources: Resource[];
  programmes: { id: string; slug: string; title: string; subtitle: string | null }[];
  messages: Message[];
  practicePlans: PracticePlan[];
};

// Everything on one client's corner. The database's access rules make sure a
// client can only ever load their own; Niamh (admin) can load anyone's.
export async function loadCorner(
  supabase: SupabaseClient,
  clientId: string
): Promise<CornerData | null> {
  const [corner, profile, tasks, notes, resources, access, messages, replies, plans] =
    await Promise.all([
      supabase
        .from("corners")
        .select("title, intro, checklist_intro, resources_intro").eq("user_id", clientId).maybeSingle(),
      supabase.from("profiles").select("full_name").eq("id", clientId).maybeSingle(),
      supabase
        .from("tasks")
        .select("id, section, body, detail, sort, done_at")
        .eq("user_id", clientId)
        .order("sort")
        .order("created_at"),
      supabase
        .from("weekly_notes")
        .select("id, title, note_date, body")
        .eq("user_id", clientId)
        .order("note_date", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("resources")
        .select("id, kind, title, description, storage_path, url, weekly_note_id, sort")
        .eq("user_id", clientId)
        .order("sort")
        .order("created_at"),
      supabase
        .from("programme_access")
        .select("programmes(id, slug, title, subtitle)")
        .eq("user_id", clientId),
      supabase
        .from("messages")
        .select("id, sender_id, body, created_at")
        .eq("client_id", clientId)
        .order("created_at"),
      supabase
        .from("journal_entries")
        .select("id, body, weekly_note_id")
        .eq("user_id", clientId)
        .eq("kind", "note"),
      supabase
        .from("practice_plans")
        .select("id, title, days, reminder_on, sort")
        .eq("user_id", clientId)
        .order("sort")
        .order("created_at"),
    ]);

  if (!corner.data) return null;

  const rawResources = (resources.data ?? []) as Omit<Resource, "href">[];
  const signed = await signMediaUrls(
    supabase,
    rawResources.map((r) => r.storage_path ?? "")
  );
  const withLinks: Resource[] = rawResources.map((r) => ({
    ...r,
    href: r.storage_path ? signed[r.storage_path] ?? null : r.url,
  }));

  const replyByNote = new Map(
    (replies.data ?? []).map((j) => [j.weekly_note_id as string, { id: j.id, body: j.body }])
  );

  return {
    clientId,
    clientName: profile.data?.full_name ?? null,
    title: corner.data.title,
    intro: corner.data.intro,
    checklistIntro: corner.data.checklist_intro,
    resourcesIntro: corner.data.resources_intro,
    tasks: (tasks.data ?? []) as Task[],
    notes: (notes.data ?? []).map((n) => ({
      ...n,
      resources: withLinks.filter((r) => r.weekly_note_id === n.id),
      reply: replyByNote.get(n.id) ?? null,
    })),
    resources: withLinks.filter((r) => !r.weekly_note_id),
    programmes: (access.data ?? [])
      .map((a) => a.programmes as unknown as CornerData["programmes"][number] | null)
      .filter((p): p is CornerData["programmes"][number] => Boolean(p)),
    messages: (messages.data ?? []) as Message[],
    practicePlans: (plans.data ?? []) as PracticePlan[],
  };
}

export async function getViewer(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: hasStilroom }] = await Promise.all([
    supabase.from("profiles").select("full_name, is_admin, is_client").eq("id", user.id).single(),
    supabase.rpc("has_stilroom", { uid: user.id }),
  ]);
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? null,
    isAdmin: Boolean(profile?.is_admin),
    isClient: Boolean(profile?.is_client),
    hasStilroom: Boolean(hasStilroom),
  };
}
