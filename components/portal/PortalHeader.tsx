import Link from "next/link";
import { signOut } from "@/app/(portal)/portal/actions";

type Tab = { href: string; label: string; key: string };

export function PortalHeader({
  name,
  isAdmin,
  isClient = false,
  hasStilroom = false,
  current,
}: {
  name: string | null;
  isAdmin: boolean;
  isClient?: boolean;
  hasStilroom?: boolean;
  current?: "corner" | "people" | "stilroom";
}) {
  const tabs: Tab[] = [];
  if (isAdmin) tabs.push({ href: "/portal", label: "People", key: "people" });
  else if (isClient) tabs.push({ href: "/portal", label: "My corner", key: "corner" });
  if (isAdmin || hasStilroom || isClient) tabs.push({ href: "/portal/stilroom", label: "STILroom", key: "stilroom" });

  return (
    <header className="bg-white border-b border-cream-dark">
      <div className="max-w-[960px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/portal" className="leading-none">
          <span className="font-serif text-2xl">Niamh Padma</span>
          <span className="block text-[10px] tracking-[0.2em] uppercase text-sage-dark mt-1">
            {isAdmin ? "Admin" : "Client Portal"}
          </span>
        </Link>
        <div className="flex items-center gap-4 text-[13px] text-espresso-light">
          {name && <span className="hidden md:inline">{name}</span>}
          <form action={signOut}>
            <button className="underline underline-offset-2 hover:text-espresso">Sign out</button>
          </form>
        </div>
      </div>
      {tabs.length > 1 && (
        <nav className="max-w-[960px] mx-auto px-4 sm:px-8 flex gap-1 -mb-px">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
                current === t.key
                  ? "border-terracotta text-espresso font-medium"
                  : "border-transparent text-espresso-light hover:text-espresso"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
