import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer, loadCorner } from "@/lib/portal/corner";
import { CornerView } from "@/components/portal/CornerView";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { ClientToggle } from "@/components/portal/edit/ClientToggle";
import { ReminderSettings } from "@/components/portal/edit/ReminderSettings";

export const dynamic = "force-dynamic";

// Where everyone lands after signing in:
//   Niamh → her people list · 1:1 clients → their corner
//   STILroom members → STILroom · everyone else → the join page
export default async function PortalHome() {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer) redirect("/portal/login");

  if (viewer.isAdmin) return <AdminHome name={viewer.fullName} />;
  if (!viewer.isClient) redirect(viewer.hasStilroom ? "/portal/stilroom" : "/portal/join");

  const corner = await loadCorner(supabase, viewer.id);

  return (
    <>
      <PortalHeader name={viewer.fullName} isAdmin={false} isClient hasStilroom={viewer.hasStilroom} current="corner" />
      <main className="max-w-[960px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="text-[11px] tracking-[0.18em] uppercase text-sage-dark font-semibold mb-5">
          Your personal dashboard
        </div>
        {corner ? (
          <CornerView data={corner} viewerId={viewer.id} asAdmin={false} />
        ) : (
          <p className="text-espresso-light">Niamh is preparing your space. Please check back soon.</p>
        )}
      </main>
    </>
  );
}

const memberFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

async function AdminHome({ name }: { name: string | null }) {
  const supabase = await createClient();
  const [{ data: people }, { data: unread }, { data: memberships }, { data: reminder }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, created_at, is_client, corners(title)")
      .eq("is_admin", false)
      .order("created_at", { ascending: false }),
    supabase.from("messages").select("client_id, sender_id").is("read_at", null),
    supabase.from("memberships").select("user_id, status, current_period_end, cancel_at_period_end"),
    supabase.from("portal_texts").select("body").eq("key", "practice_reminder").maybeSingle(),
  ]);

  const unreadByClient = new Map<string, number>();
  for (const m of unread ?? []) {
    if (m.sender_id === m.client_id) {
      unreadByClient.set(m.client_id, (unreadByClient.get(m.client_id) ?? 0) + 1);
    }
  }
  const membershipBy = new Map((memberships ?? []).map((m) => [m.user_id, m]));

  return (
    <>
      <PortalHeader name={name} isAdmin current="people" />
      <main className="max-w-[960px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="text-[11px] tracking-[0.18em] uppercase text-sage-dark font-semibold">Admin</div>
        <h1 className="font-serif text-[clamp(32px,5vw,44px)] mt-1.5">People</h1>
        <p className="text-espresso-light">
          Everyone with an account. Switch on <b>1:1 client</b> to give someone their own corner and free STILroom access.
          Open a client to edit their corner and reply to messages.
        </p>
        <ul className="bg-white rounded-2xl border border-cream-dark mt-7 divide-y divide-cream-dark">
          {(people ?? []).length === 0 && (
            <li className="px-6 py-5 text-espresso-light">No one yet. Invite a client from Supabase → Authentication → Users.</li>
          )}
          {(people ?? []).map((p) => {
            const count = unreadByClient.get(p.id) ?? 0;
            const m = membershipBy.get(p.id);
            const paying = m && ["active", "trialing", "past_due"].includes(m.status);
            const label = p.full_name || p.email;
            const avatar = (
              <div className="w-9 h-9 rounded-full bg-sage text-white grid place-items-center text-[13px] font-semibold flex-none">
                {(label || "?").slice(0, 2).toUpperCase()}
              </div>
            );
            const details = (
              <div className="flex-1 min-w-0">
                <div className="font-medium">{label}</div>
                <div className="text-[13px] text-espresso-light truncate">
                  {p.email}
                  {paying &&
                    ` · STILroom member${m.cancel_at_period_end && m.current_period_end ? `, ends ${memberFmt.format(new Date(m.current_period_end))}` : ""}${m.status === "past_due" ? " (payment failing)" : ""}`}
                  {!paying && !p.is_client && " · not a member"}
                </div>
              </div>
            );
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                {p.is_client ? (
                  <Link href={`/portal/clients/${p.id}`} className="flex items-center gap-4 flex-1 min-w-[220px] hover:opacity-80">
                    {avatar}
                    {details}
                  </Link>
                ) : (
                  <div className="flex items-center gap-4 flex-1 min-w-[220px]">
                    {avatar}
                    {details}
                  </div>
                )}
                {count > 0 && (
                  <span className="text-[11px] tracking-[0.08em] uppercase font-semibold px-2.5 py-1 rounded-full bg-[#F6E6DD] text-terracotta-dark">
                    {count} new {count === 1 ? "message" : "messages"}
                  </span>
                )}
                <ClientToggle userId={p.id} isClient={p.is_client} />
              </li>
            );
          })}
        </ul>
        <ReminderSettings message={reminder?.body ?? null} />
      </main>
    </>
  );
}
