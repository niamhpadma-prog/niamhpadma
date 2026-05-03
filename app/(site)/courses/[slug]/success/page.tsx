import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { generateAccessToken, setAccessCookie } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

type Params = { slug: string };

export default async function CourseSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { slug } = await params;
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect(`/courses/${slug}`);
  }

  // Verify the Stripe session and set access cookie
  try {
    const session = await stripe().checkout.sessions.retrieve(session_id);
    const email = session.customer_details?.email;

    if (email && session.payment_status === "paid") {
      const token = await generateAccessToken(email, slug);
      await setAccessCookie(token);
    }
  } catch (error) {
    console.error("Error verifying session:", error);
  }

  return (
    <Section background="white">
      <Container>
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Welcome!
          </h1>
          <p className="font-sans text-base text-espresso/60 leading-relaxed mb-8">
            Thank you for your purchase. You now have full access to the course.
            Check your email for a confirmation and access link you can use anytime.
          </p>

          <Button href={`/courses/${slug}/learn`} variant="primary" size="lg">
            Start Learning
          </Button>
        </div>
      </Container>
    </Section>
  );
}
