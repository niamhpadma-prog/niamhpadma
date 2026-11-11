import { createClient } from "@/lib/supabase/server";
import { SetPasswordForm } from "@/components/portal/SetPasswordForm";

export default async function SetPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  return (
    <div className="min-h-screen grid place-items-center px-4 py-12 bg-gradient-to-b from-cream to-cream-dark">
      <div className="w-full max-w-[400px] bg-white rounded-[20px] px-8 py-10 shadow-[0_20px_60px_-30px_rgba(60,47,47,0.35)] text-center">
        <div className="font-serif text-[28px] tracking-wide">Welcome</div>
        <p className="font-sans text-sm text-espresso-light mt-3">
          Choose a password so you can come back to your space any time.
        </p>
        <SetPasswordForm askName={!profile?.full_name} />
      </div>
    </div>
  );
}
