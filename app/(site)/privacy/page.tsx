import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Niamh Padma — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <Section background="cream">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-[1.1] mb-4">
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-espresso/40 mb-12">
            Last updated: March 2026
          </p>

          <div className="space-y-10 font-sans text-base leading-relaxed text-espresso/75">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Who I Am</h2>
              <p>
                This website is operated by Niamh Padma, a yoga, breathwork, somatic therapy and holistic nutrition practitioner based in Lisbon, Portugal. When this policy refers to &ldquo;I&rdquo;, &ldquo;me&rdquo; or &ldquo;my&rdquo;, it means Niamh Padma.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">What Information I Collect</h2>
              <p className="mb-3">I may collect the following information when you interact with this website:</p>
              <ul className="list-disc ml-5 space-y-2">
                <li><strong className="text-espresso">Contact information</strong> — your name and email address when you fill out a contact form, questionnaire, or subscribe to the newsletter.</li>
                <li><strong className="text-espresso">Questionnaire responses</strong> — information about your wellness goals, experience level, health conditions, and preferences that you voluntarily share through intake forms.</li>
                <li><strong className="text-espresso">Payment information</strong> — when you book a session, retreat, or workshop, payment is processed securely through a third-party provider. I do not store your card details.</li>
                <li><strong className="text-espresso">Usage data</strong> — anonymous analytics data such as pages visited, time on site, and device type, collected via cookies to help improve the website experience.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">How I Use Your Information</h2>
              <ul className="list-disc ml-5 space-y-2">
                <li>To respond to your enquiries and provide personalised wellness recommendations.</li>
                <li>To process bookings and payments for sessions, workshops, and retreats.</li>
                <li>To send you the newsletter, if you&apos;ve subscribed — you can unsubscribe at any time.</li>
                <li>To improve the website and understand how visitors use it.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Health & Wellness Information</h2>
              <p>
                Some questionnaires ask about your physical and mental health. This information is treated with the utmost care and confidentiality. It is used solely to provide safe, appropriate guidance for your wellness journey. I will never share your health information with third parties without your explicit consent, except where required by law.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Third-Party Services</h2>
              <p className="mb-3">This website uses the following third-party services:</p>
              <ul className="list-disc ml-5 space-y-2">
                <li><strong className="text-espresso">Vercel</strong> — website hosting.</li>
                <li><strong className="text-espresso">Sanity</strong> — content management.</li>
                <li><strong className="text-espresso">Google Analytics</strong> — anonymous usage analytics (if enabled).</li>
                <li><strong className="text-espresso">Resend</strong> — transactional email delivery.</li>
                <li><strong className="text-espresso">Payment processors</strong> — secure payment handling for bookings (details provided at checkout).</li>
              </ul>
              <p className="mt-3">Each of these services has their own privacy policies governing how they handle your data.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Cookies</h2>
              <p>
                This website uses essential cookies to ensure it functions correctly, and optional analytics cookies to understand how the site is used. You can disable cookies in your browser settings at any time.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Your Rights</h2>
              <p className="mb-3">Under GDPR and applicable data protection laws, you have the right to:</p>
              <ul className="list-disc ml-5 space-y-2">
                <li>Access the personal data I hold about you.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Withdraw consent for newsletter communications at any time.</li>
                <li>Request a copy of your data in a portable format.</li>
                <li>Lodge a complaint with a data protection authority.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Data Retention</h2>
              <p>
                I retain your personal information only for as long as necessary to provide the services you&apos;ve requested or as required by law. Questionnaire responses are kept for the duration of our working relationship. You can request deletion at any time.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Contact</h2>
              <p>
                If you have any questions about this privacy policy or how your data is handled, please contact me at{" "}
                <a href="mailto:hello@somatictherapyinlisbon.com" className="text-terracotta hover:underline">
                  hello@somatictherapyinlisbon.com
                </a>.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
