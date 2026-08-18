import { SiteWrapper } from "@/components/layout/SiteWrapper";
import { EbookPopup, type LeadMagnet } from "@/components/sections/EbookPopup";
import { client } from "@/lib/sanity/client";
import { leadMagnetQuery } from "@/lib/sanity/queries";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The free-download pop-up is configured in Sanity ("Free Download Pop-Up").
  // It renders nothing at all unless Niamh has switched it on.
  const leadMagnet = await client
    .fetch<LeadMagnet | null>(leadMagnetQuery)
    .catch(() => null);

  return (
    <SiteWrapper>
      {children}
      <EbookPopup config={leadMagnet} />
    </SiteWrapper>
  );
}
