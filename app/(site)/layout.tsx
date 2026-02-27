import { SiteWrapper } from "@/components/layout/SiteWrapper";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteWrapper>{children}</SiteWrapper>;
}
