import type { Metadata } from "next";
import "./portal.css";

export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-sans text-[15px] leading-relaxed text-espresso min-h-screen bg-cream">{children}</div>;
}
