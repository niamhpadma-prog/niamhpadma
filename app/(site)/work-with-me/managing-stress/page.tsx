import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Managing Stress Before It Arrives",
  description:
    "A 90-minute, movement-based stress management workshop for teams, with simple breath, movement and desk practices your people can use in under two minutes.",
};

const DISCOVERY_CALL = "/discovery-call";

const takeaways = [
  {
    title: "Understand stress",
    text: "A clear, jargon-free picture of the stress response, the nervous system and the gut–brain connection, and why chronic stress affects focus, sleep and immunity.",
  },
  {
    title: "Notice it early",
    text: "Body awareness to recognise where stress is held, before it builds into overwhelm.",
  },
  {
    title: "Reset in under two minutes",
    text: "At least three regulation tools (a breath, a movement and a desk practice) to use between meetings or before a presentation.",
  },
  {
    title: "Build a recovery habit",
    text: "A personal plan: one practice, one time and one day, booked into the calendar before they leave.",
  },
];

const flow = [
  {
    title: "Arrive and check in.",
    text: "Introductions and a private “right now” stress rating, so everyone can see the change by the end.",
  },
  { title: "Grounding body scan.", text: "Landing in the body and noticing where stress is held." },
  {
    title: "The science of stress.",
    text: "A conversational look at the stress response, the nervous system, allostatic load and the gut–brain axis.",
  },
  {
    title: "A somatic journey.",
    text: "Moving through the body’s systems, from muscles to fascia, breath and the nervous system, releasing the tension of desk-bound days.",
  },
  {
    title: "Breathwork tools.",
    text: "The physiological sigh, box breathing and coherent breathing: quick resets for a busy day.",
  },
  { title: "Weaving it into the workday.", text: "Desk practices and a personal plan to make it stick." },
  { title: "Close and re-check.", text: "A second stress rating, reflection and questions." },
];

const formats = [
  {
    title: "A standalone workshop:",
    text: "90 minutes on site, perfect for a lunch-and-learn slot or end of the working week.",
  },
  {
    title: "Part of a wellbeing day or offsite:",
    text: "paired with other sessions in a half-day experience.",
  },
  {
    title: "An ongoing series:",
    text: "monthly or seasonal sessions that build resilience across the year.",
  },
];

const faqs = [
  {
    question: "Do participants need any experience?",
    answer: "No. The workshop is designed for complete beginners, and every practice can be adapted or done seated.",
  },
  {
    question: "What should people wear?",
    answer: "Comfortable clothing they can move in. We need some open floor space and chairs.",
  },
  {
    question: "Can the workshop be tailored to our team?",
    answer: "Yes. The content, length and focus can be shaped around your team’s pressures, goals and wellbeing strategy.",
  },
  {
    question: "Is it confidential?",
    answer: "Yes. Stress ratings are private and optional, and what’s shared in the room stays in the room.",
  },
  {
    question: "What if someone has an injury or health condition?",
    answer:
      "Let me know beforehand, through your wellbeing or HR lead, and I’ll offer alternatives so everyone can take part safely.",
  },
  {
    question: "Can this be part of a longer wellbeing programme?",
    answer:
      "Yes. Many organisations follow the workshop with monthly or seasonal sessions, using the Perceived Stress Scale to track progress through the year.",
  },
];

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-6">{children}</h2>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="font-sans text-base md:text-lg text-espresso/75 leading-relaxed space-y-4">{children}</div>;
}

function Bullets({ items }: { items: { title?: string; text: string }[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-3">
          <span className="text-sage mt-1" aria-hidden>
            {"•"}
          </span>
          <span>
            {item.title && <b className="font-medium text-espresso">{item.title}</b>} {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ManagingStressPage() {
  return (
    <>
      <HeroSection
        eyebrow="Corporate wellbeing workshop"
        headline="Managing Stress Before It Arrives"
        subheadline="A stress management workshop for teams that works with the body, not just the mind. In 90 minutes, your people learn what stress does to the nervous system and practise tools to reset, refocus and recover, even on the busiest days."
        ctas={[
          { label: "Book a Free Discovery Call", href: DISCOVERY_CALL, style: "secondary" },
          { label: "See the programme", href: "#programme", style: "primary" },
        ]}
        imageSrc="/images/shoot-2026/niamh-speaking-mic.jpg"
        imageAlt="Niamh speaking at a microphone"
        align="left"
      />

      {/* Why it matters */}
      <Section background="cream">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading>Stress isn’t the problem. Staying stuck in it is.</Heading>
            <Prose>
              <p>
                Short bursts of stress help us rise to a deadline or a big presentation. The trouble begins when the
                body never gets the signal that it’s safe to come down again.
              </p>
              <p>
                Over time, chronic workplace stress shows up as brain fog, lower focus, poor sleep, irritability and a
                sense of overwhelm. Left unchecked, it becomes burnout.
              </p>
              <p>
                Most wellbeing initiatives talk about stress. This workshop helps your team feel it, understand it and
                shift it, building the nervous system resilience that supports both performance and wellbeing.
              </p>
            </Prose>
          </div>
        </Container>
      </Section>

      {/* What your team will leave with */}
      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Heading>What your team will leave with</Heading>
            <Prose>
              <p>
                The intention is simple: for your people to leave feeling empowered, present and focused, with tools to
                take into the next stressful moment.
              </p>
            </Prose>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 max-w-5xl mx-auto">
            {takeaways.map((t) => (
              <div key={t.title} className="rounded-3xl bg-cream p-8">
                <h3 className="font-serif text-2xl mb-3">{t.title}</h3>
                <p className="font-sans text-base text-espresso/70 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How the session flows */}
      <Section background="cream" id="programme" className="scroll-mt-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading>90 minutes, from body to plan</Heading>
            <Prose>
              <p>Experiential and movement-based, with the science woven through. No experience needed.</p>
            </Prose>
            <ol className="mt-10 space-y-6">
              {flow.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="flex-none w-10 h-10 rounded-full bg-sage/20 text-espresso font-serif text-xl flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="font-sans text-base md:text-lg text-espresso/75 leading-relaxed pt-1.5">
                    <b className="font-medium text-espresso">{step.title}</b> {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* Who it's for and formats */}
      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading>Designed for high-pressure teams</Heading>
            <Prose>
              <p>
                Ideal for consulting, professional services, finance, tech and any team working at pace. It suits HR
                and people teams, wellness communities and employee networks, and leaders looking for a team wellbeing
                session with real substance.
              </p>
              <p className="font-medium text-espresso">Ways to bring it in:</p>
              <Bullets items={formats} />
              <p>
                <b className="font-medium text-espresso">Practical details:</b> On site at your offices or venue in
                Lisbon or London, at your office anywhere in the world on request, or online. No maximum group size.
                Comfortable clothing, open floor space and chairs. No experience or equipment needed.
              </p>
            </Prose>
          </div>
        </Container>
      </Section>

      {/* Measuring the impact */}
      <Section background="sage">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading>See the change, in the room and over time</Heading>
            <Prose>
              <p>Every workshop includes two simple, private measures:</p>
              <Bullets
                items={[
                  {
                    text: "A “right now” stress rating (0–10) at the start and close, so participants feel the immediate effect of the practice.",
                  },
                  {
                    text: "The Perceived Stress Scale, a recognised self-assessment your team can repeat each season to track longer-term change.",
                  },
                ]}
              />
              <p>
                Participants also receive a one-page practice toolkit and a short audio recording, so the tools are
                there when they need them most.
              </p>
              <p className="text-sm text-espresso/60">
                Scores are private and optional. Nothing is shared unless a participant chooses to.
              </p>
            </Prose>
          </div>
        </Container>
      </Section>

      {/* About Niamh */}
      <Section background="cream">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading>Your facilitator</Heading>
            <Prose>
              <p>
                I’m Niamh, a somatic coach, breathwork and movement coach, yoga teacher and retreat facilitator,
                currently training as a yoga therapist.
              </p>
              <p>
                Before this work, I spent around nine years in international brand and communications, so I know the
                pace, pressure and always-on culture of corporate life from the inside. My workshops bring nervous
                system science and somatic practice together in a way that feels grounded, practical and accessible to
                everyone, whatever their starting point.
              </p>
            </Prose>
          </div>
        </Container>
      </Section>

      <FAQSection heading="Common questions" items={faqs} background="white" />

      {/* Enquire */}
      <Section background="sage">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <Heading>Bring this workshop to your team</Heading>
            <p className="font-sans text-base md:text-lg text-espresso/70 leading-relaxed mb-8">
              Whether you’re planning a wellbeing week, a team offsite or a year-long programme, let’s talk about what
              your people need. Book a free discovery call, or email me at{" "}
              <a href="mailto:niamhpadma@gmail.com" className="underline underline-offset-4 hover:text-terracotta">
                niamhpadma@gmail.com
              </a>
              .
            </p>
            <Button href={DISCOVERY_CALL} variant="primary" size="lg">
              Book a Free Discovery Call
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
