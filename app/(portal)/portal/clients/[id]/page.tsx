import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer, loadCorner } from "@/lib/portal/corner";
import { CornerView } from "@/components/portal/CornerView";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { AddResourceForm } from "@/components/portal/AddResourceForm";

export const dynamic = "force-dynamic";

// Niamh's view of one client's corner.
export default async function ClientCornerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer) redirect("/portal/login");
  if (!viewer.isAdmin) redirect("/portal");

  const corner = await loadCorner(supabase, id);
  if (!corner) notFound();

  // Opening the corner counts as reading the client's messages.
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("client_id", id)
    .eq("sender_id", id)
    .is("read_at", null);

  return (
    <>
      <PortalHeader name={viewer.fullName} isAdmin current="people" />
      <main className="max-w-[960px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <Link href="/portal" className="text-[13px] text-espresso-light underline underline-offset-2">
          ← All clients
        </Link>
        <p className="text-[13px] text-espresso-light mt-3 mb-5">
          You&rsquo;re viewing {corner.clientName || "this client"}&rsquo;s corner as they see it.
        </p>
        <AddResourceForm
          clientId={id}
          notes={corner.notes.map((n) => ({ id: n.id, label: n.title }))}
        />
        <CornerView data={corner} viewerId={viewer.id} asAdmin />
      </main>
    </>
  );
}
