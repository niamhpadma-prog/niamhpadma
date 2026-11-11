import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signMediaUrls } from "@/lib/supabase/media";
import { getViewer, type Resource } from "@/lib/portal/corner";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { Markdown } from "@/components/portal/Markdown";
import { MediaItem } from "@/components/portal/MediaItem";
import { EditablePortalText } from "@/components/portal/edit/EditablePortalText";
import { StilroomUploadForm } from "@/components/portal/edit/StilroomUploadForm";
import { CollectionAdmin, NewCollection, StilroomItemAdmin } from "@/components/portal/edit/StilroomAdmin";
import { manageMembership } from "./actions";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

type Item = Omit<Resource, "weekly_note_id" | "href"> & { collection_id: string | null; href: string | null };

export default async function StilroomPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer) redirect("/portal/login");
  if (!viewer.hasStilroom) redirect("/portal/join");
  const asAdmin = viewer.isAdmin;

  const [{ data: collections }, { data: rawItems }, { data: text }, { data: membership }] = await Promise.all([
    supabase.from("stilroom_collections").select("id, title, description").order("sort").order("created_at"),
    supabase
      .from("stilroom_items")
      .select("id, kind, title, description, storage_path, url, collection_id, sort")
      .order("sort")
      .order("created_at", { ascending: false }),
    supabase.from("portal_texts").select("body").eq("key", "stilroom_welcome").maybeSingle(),
    supabase
      .from("memberships")
      .select("status, current_period_end, cancel_at_period_end, stripe_customer_id")
      .eq("user_id", viewer.id)
      .maybeSingle(),
  ]);

  const signed = await signMediaUrls(supabase, (rawItems ?? []).map((i) => i.storage_path ?? ""));
  const items: Item[] = (rawItems ?? []).map((i) => ({
    ...i,
    href: i.storage_path ? signed[i.storage_path] ?? null : i.url,
  })) as Item[];
  const collectionList = (collections ?? []).map((c) => ({ id: c.id, title: c.title }));

  const renderItem = (item: Item) => {
    const media = <MediaItem resource={{ ...item, weekly_note_id: null }} />;
    return asAdmin ? (
      <StilroomItemAdmin key={item.id} item={item} collections={collectionList}>
        {media}
      </StilroomItemAdmin>
    ) : (
      <div key={item.id}>{media}</div>
    );
  };

  const loose = items.filter((i) => !i.collection_id);
  const welcomeText = text?.body ? <Markdown>{text.body}</Markdown> : null;

  return (
    <>
      <PortalHeader
        name={viewer.fullName}
        isAdmin={asAdmin}
        isClient={viewer.isClient}
        hasStilroom
        current="stilroom"
      />
      <main className="max-w-[960px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {welcome && (
          <div className="bg-[#E6ECE6] text-sage-dark rounded-xl px-5 py-4 mb-6">
            <b>Welcome to STILroom.</b> Your membership is active. A receipt is on its way to your email.
          </div>
        )}

        {asAdmin && <StilroomUploadForm collections={collectionList} />}

        <article className="bg-white rounded-[20px] border border-cream-dark px-6 py-8 sm:px-14 sm:py-14">
          <div className="text-[11px] tracking-[0.18em] uppercase text-sage-dark font-semibold">Membership</div>
          <h1 className="font-serif text-[clamp(40px,7vw,56px)] leading-tight">STILroom</h1>
          <div className="mt-3">
            {asAdmin ? (
              <EditablePortalText textKey="stilroom_welcome" label="Welcome text" value={text?.body ?? null}>
                {welcomeText}
              </EditablePortalText>
            ) : (
              welcomeText
            )}
          </div>

          {asAdmin && <NewCollection />}

          {(collections ?? []).map((c) => {
            const inside = items.filter((i) => i.collection_id === c.id);
            if (!asAdmin && inside.length === 0) return null;
            const heading = (
              <>
                <h2 className="font-serif text-[28px] mt-9 pt-7 border-t border-cream-dark">{c.title}</h2>
                {c.description && <p className="text-espresso-light">{c.description}</p>}
              </>
            );
            return (
              <section key={c.id}>
                {asAdmin ? <CollectionAdmin collection={c}>{heading}</CollectionAdmin> : heading}
                {inside.map(renderItem)}
                {asAdmin && inside.length === 0 && (
                  <p className="text-[13px] text-espresso-light">Empty. Members won&rsquo;t see this collection until something is in it.</p>
                )}
              </section>
            );
          })}

          {loose.length > 0 && (
            <section>
              <h2 className="font-serif text-[28px] mt-9 pt-7 border-t border-cream-dark">More to explore</h2>
              {loose.map(renderItem)}
            </section>
          )}

          {items.length === 0 && !asAdmin && (
            <p className="text-espresso-light mt-8">New videos, recordings and PDFs are on their way. Check back soon.</p>
          )}
        </article>

        {!asAdmin && (
          <section className="bg-white rounded-2xl border border-cream-dark px-6 py-5 mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
            {membership?.stripe_customer_id && ["active", "trialing", "past_due"].includes(membership.status) ? (
              <>
                <div className="text-espresso-light">
                  {membership.status === "past_due"
                    ? "Your last payment didn't go through. Please update your card to keep your membership."
                    : membership.cancel_at_period_end && membership.current_period_end
                      ? `Your membership ends on ${dateFmt.format(new Date(membership.current_period_end))}.`
                      : membership.current_period_end
                        ? `Your membership renews on ${dateFmt.format(new Date(membership.current_period_end))}.`
                        : "Your membership is active."}
                </div>
                <form action={manageMembership}>
                  <button className="rounded-full border border-sand px-4 py-2 hover:bg-cream-dark">Manage my membership</button>
                </form>
              </>
            ) : (
              <div className="text-espresso-light">STILroom is included with your 1:1 work with Niamh.</div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
