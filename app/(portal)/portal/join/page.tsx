import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/corner";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { Markdown } from "@/components/portal/Markdown";
import { EditablePortalText } from "@/components/portal/edit/EditablePortalText";
import { startMembership } from "../stilroom/actions";

export const dynamic = "force-dynamic";

const PRICE_LABEL = "€24.99 a month";

// What signed-in non-members see: an invitation to join STILroom.
export default async function JoinPage() {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer) redirect("/portal/login");
  if (viewer.hasStilroom && !viewer.isAdmin) redirect("/portal/stilroom");

  const { data: text } = await supabase.from("portal_texts").select("body").eq("key", "stilroom_join").maybeSingle();
  const body = text?.body ? <Markdown className="mt-5 text-left">{text.body}</Markdown> : null;

  return (
    <>
      <PortalHeader name={viewer.fullName} isAdmin={viewer.isAdmin} isClient={viewer.isClient} hasStilroom={viewer.hasStilroom} />
      <main className="max-w-[720px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {viewer.isAdmin && (
          <p className="text-[13px] text-espresso-light mb-4">
            This is the page people see after creating an account, before they join.
          </p>
        )}
        <article className="bg-white rounded-[20px] border border-cream-dark px-6 py-10 sm:px-14 sm:py-14 text-center">
          <div className="text-[11px] tracking-[0.18em] uppercase text-sage-dark font-semibold">Membership</div>
          <h1 className="font-serif text-[clamp(44px,8vw,64px)] leading-none mt-2">STILroom</h1>
          {viewer.isAdmin ? (
            <div className="text-left mt-5">
              <EditablePortalText textKey="stilroom_join" label="Join page text" value={text?.body ?? null}>
                {body}
              </EditablePortalText>
            </div>
          ) : (
            body ?? (
              <p className="text-espresso-light mt-5">
                A monthly membership with videos, audio recordings and PDFs from Niamh.
              </p>
            )
          )}
          <div className="font-serif text-3xl mt-8">{PRICE_LABEL}</div>
          <p className="text-[13px] text-espresso-light mt-1">Cancel any time.</p>
          <form action={startMembership}>
            <button
              disabled={viewer.isAdmin}
              className="mt-6 bg-terracotta hover:bg-terracotta-dark text-white rounded-full px-8 py-3.5 font-medium transition-colors disabled:opacity-50"
            >
              Join STILroom
            </button>
          </form>
          <p className="text-[12px] text-espresso-light mt-4">Secure payment by Stripe.</p>
        </article>
      </main>
    </>
  );
}
