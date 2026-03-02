import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the Niamh Padma website and booking wellness services.",
};

export default function TermsPage() {
  return (
    <Section background="cream">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-[1.1] mb-4">
            Terms & Conditions
          </h1>
          <p className="font-sans text-sm text-espresso/40 mb-12">
            Last updated: March 2026
          </p>

          <div className="space-y-10 font-sans text-base leading-relaxed text-espresso/75">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Overview</h2>
              <p>
                By using this website and booking services with Niamh Padma, you agree to the following terms. Please read them carefully. If you have any questions, contact me at{" "}
                <a href="mailto:hello@niamhpadma.com" className="text-terracotta hover:underline">
                  hello@niamhpadma.com
                </a>.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Services</h2>
              <p>
                I offer yoga instruction, breathwork facilitation, somatic therapy sessions, holistic nutrition coaching, group classes, workshops, and retreats. These services are intended to support your general wellbeing and are not a substitute for medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Health Disclaimer</h2>
              <p className="mb-3">
                Participation in yoga, breathwork, and somatic practices involves physical and emotional activity. By booking a session or attending a class, workshop, or retreat, you acknowledge that:
              </p>
              <ul className="list-disc ml-5 space-y-2">
                <li>You are participating voluntarily and at your own risk.</li>
                <li>You will inform me of any health conditions, injuries, or medications that may affect your practice.</li>
                <li>You will listen to your body and modify or stop any practice that causes pain or discomfort.</li>
                <li>These services are complementary wellness practices and do not replace professional medical or psychological treatment.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Bookings & Payments</h2>
              <ul className="list-disc ml-5 space-y-2">
                <li>All bookings are confirmed upon receipt of payment.</li>
                <li>Prices are listed in euros (€) and include applicable taxes unless otherwise stated.</li>
                <li>Payment is processed securely through third-party payment providers. I do not store your payment card details.</li>
                <li>Packages and bundles must be used within the timeframe specified at purchase.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Cancellation & Refunds</h2>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-espresso/50 mb-2">Private Sessions & Classes</h3>
              <ul className="list-disc ml-5 space-y-2 mb-4">
                <li>Cancellations made more than 24 hours before the scheduled session will receive a full refund or credit.</li>
                <li>Cancellations within 24 hours are non-refundable but may be rescheduled once, subject to availability.</li>
                <li>No-shows are non-refundable.</li>
              </ul>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-espresso/50 mb-2">Workshops & Events</h3>
              <ul className="list-disc ml-5 space-y-2 mb-4">
                <li>Cancellations more than 7 days before the event receive a full refund.</li>
                <li>Cancellations within 7 days receive a 50% refund or full credit toward a future event.</li>
                <li>Cancellations within 48 hours are non-refundable.</li>
              </ul>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-espresso/50 mb-2">Retreats</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>A non-refundable deposit is required to secure your place.</li>
                <li>Full payment is due 30 days before the retreat start date.</li>
                <li>Cancellations more than 30 days before receive a refund minus the deposit.</li>
                <li>Cancellations within 30 days are non-refundable but may be transferable to another person.</li>
                <li>If I need to cancel a retreat, you will receive a full refund including the deposit.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Confidentiality</h2>
              <p>
                Everything shared during private sessions, questionnaires, and consultations is treated as confidential. I will not share your personal information or session details with anyone without your explicit consent, except where required by law or where there is a risk of harm to yourself or others.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Intellectual Property</h2>
              <p>
                All content on this website — including text, images, designs, and branding — is the property of Niamh Padma unless otherwise credited. You may not reproduce, distribute, or use this content without written permission.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Online Sessions</h2>
              <p>
                For online sessions, you are responsible for ensuring a stable internet connection and a quiet, private space. Sessions will not be extended due to technical issues on your end. If I experience technical difficulties, we will reschedule at no additional cost.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Liability</h2>
              <p>
                I hold professional liability insurance for all services offered. However, I am not liable for any injury, loss, or damage arising from your participation in classes, sessions, workshops, or retreats beyond the scope of this insurance. By participating, you accept responsibility for your own wellbeing during and after sessions.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Changes to These Terms</h2>
              <p>
                I may update these terms from time to time. Changes will be posted on this page with an updated date. Continued use of the website or services after changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Governing Law</h2>
              <p>
                These terms are governed by the laws of Portugal. Any disputes will be resolved in the courts of Lisbon, Portugal.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso mb-3">Contact</h2>
              <p>
                Questions about these terms? Reach out at{" "}
                <a href="mailto:hello@niamhpadma.com" className="text-terracotta hover:underline">
                  hello@niamhpadma.com
                </a>.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
