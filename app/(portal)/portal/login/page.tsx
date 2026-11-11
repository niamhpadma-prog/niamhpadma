import type { Metadata } from "next";
import { AuthForms } from "@/components/portal/AuthForms";

export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen grid place-items-center px-4 py-12 bg-gradient-to-b from-cream to-cream-dark">
      <div className="w-full max-w-[400px] bg-white rounded-[20px] px-8 py-10 shadow-[0_20px_60px_-30px_rgba(60,47,47,0.35)] text-center">
        <div className="font-serif text-[28px] tracking-wide">Niamh Padma</div>
        <div className="font-sans text-[11px] tracking-[0.2em] uppercase text-sage-dark mt-1">
          Client Portal
        </div>
        {error && (
          <p className="font-sans text-sm text-terracotta-dark mt-6">
            That link has expired or was already used. Please sign in, or ask Niamh for a new invite.
          </p>
        )}
        <AuthForms />
      </div>
    </div>
  );
}
