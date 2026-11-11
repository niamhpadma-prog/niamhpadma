import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { WaitlistForm } from "@/components/forms/WaitlistForm";

export const metadata: Metadata = {
  title: "Retreat Waitlist",
  description: "Join the waitlist for Niamh Padma's upcoming retreats.",
};

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ retreat?: string }>;
}) {
  const { retreat } = await searchParams;

  return (
    <Section background="cream">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-sage mb-4">
              Waitlist
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">
              Join the Waitlist
            </h1>
          </div>
          <WaitlistForm retreat={retreat} />
        </div>
      </Container>
    </Section>
  );
}
