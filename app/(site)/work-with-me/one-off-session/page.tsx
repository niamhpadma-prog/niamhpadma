import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FAQSection } from "@/components/sections/FAQSection";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "One-Off Somatic Coaching Session",
  description:
    "A single, person-centred 90-minute session bringing together breathwork, movement, nutrition, mindful eating, energy work, coaching and yoga therapy.",
};

const CONSULTATION = "/discovery-call";

const steps = [
  {
    title: "",
    text: "A free introductory call to get to know each other, followed by an intake form so I understand your needs before we meet.",
  },
  { title: "", text: "We start where you are right now. No assumptions, no fixed script." },
  {
    title: "",
    text: "A multidimensional lens, bringing together holistic health and nutrition, mindful eating, breathwork, energy work (Reiki), coaching, philosophy and yoga therapy.",
  },
  {
    title: "Mind first, then body.",
    text: "We explore your values and goals, and notice how your body responds as they come to the surface. We might then uncover your breathing style, your somatic archetype and your communication habits, revealing how patterns built over a lifetime are playing out in your daily life.",
  },
  {
    title: "Practices you can take home.",
    text: "We may introduce breathing or movement practices that support change in your body in real time. We practise them together so you can continue in your own time.",
  },
];

const forYou = [
  "Build a deeper connection with your body and emotions",
  "Understand why you have certain patterns",
  "Reset your body and mind",
  "Recover after a stressful time",
  "Learn tools to help you manage stress and overwhelm",
];

const notForYou = [
  "You’re looking for a quick fix. Yes, it’s 90 minutes, but real change starts with consistency.",
  "You need urgent medical or mental health support. This work complements, but doesn’t replace, care from your GP or a mental health professional.",
];

const details = [
  { label: "Length", value: "90 minutes" },
  {
    label: "Format",
    value: "Online, with in-person sessions in Lisbon or travel to you available (travel costs quoted separately)",
  },
  { label: "Before we meet", value: "A free 20-minute consultation and an intake form" },
  {
    label: "Investment",
    value:
      "€130\nPayment plans and other pricing options available. Please get in touch if this work calls you but the price does not work right now and we can talk.",
  },
  { label: "Booking", value: "Whenever suits you" },
];

const faqs = [
  {
    question: "Do I need any experience with yoga, breathwork or meditation?",
    answer: "No. Everything is introduced gently and adapted to you, wherever you’re starting from.",
  },
  {
    question: "Can we meet in person?",
    answer:
      "Yes. Sessions are online by default, but we can also meet in person in Lisbon, or I can travel to you. Get in touch to talk through the options.",
  },
  {
    question: "What should I wear?",
    answer: "Something comfortable you can move and breathe easily in.",
  },
  {
    question: "Is this therapy?",
    answer:
      "Somatic coaching is not medical treatment or psychotherapy. It complements, but doesn’t replace, care from your doctor or a mental health professional.",
  },
  {
    question: "What if I want to go deeper?",
    answer: (
      <>
        Many people use a one-off session as a starting point. If you&rsquo;d like ongoing support,{" "}
        <Link href="/work-with-me/listen-in" className="underline underline-offset-4 hover:text-terracotta">
          Listen In
        </Link>{" "}
        is a 12-week, one-to-one programme that builds on this work, week by week.
      </>
    ),
  },
];

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-6">{children}</h2>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="font-sans text-base md:text-lg text-espresso/75 leading-relaxed space-y-4">{children}</div>;
}

function Bullets({ items, mark = "•" }: { items: string[]; mark?: string }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="text-sage mt-0.5 flex-none" aria-hidden>
            {mark}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function OneOffSessionPage() {
  return (
    <>
      {/* Hero: words on the left, photo on the right so the title never covers Niamh's face. */}
      <section className="bg-espresso text-cream pt-28 md:pt-32 pb-16 md:pb-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-sans text-xs md:text-sm uppercase tracking-widest text-cream/70 mb-5">
                1-1 Coaching
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-semibold leading-[1.05] mb-8">
                One-Off Somatic Coaching Session
              </h1>
              <div className="font-sans text-base md:text-lg text-cream/80 leading-relaxed space-y-4 mb-10">
                <p>
                  A single, person-centred online session (you first!) that brings together breathwork, movement,
                  nutrition, mindful eating, energy work, coaching and yoga therapy to help you understand your patterns
                  and reset your body and mind.
                </p>
                <p>
                  Prefer to meet face to face? Sessions are also available in person in Lisbon, or I can travel to you.
                </p>
              </div>
              <Button href={CONSULTATION} variant="secondary" size="lg">
                Book a free 20-minute consultation
              </Button>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image
                src="/images/shoot-2026/niamh-laughing-pen.jpg"
                alt="Niamh laughing with her hand at her face"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* What is somatics? + Beneath the noise */}
      <Section background="cream">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading>What is somatics?</Heading>
            <Prose>
              <p>
                The philosopher and movement educator Thomas Hanna coined the term &ldquo;somatics&rdquo; in the 1970s,
                after years of exploring self-awareness and self-improvement through movement. He described it as the
                study of the body as perceived from within: the first-person experience of being in a body.
              </p>
              <p>
                I love this definition because it takes the human experience away from a third-person, outside lens and
                brings the power back to the self.
              </p>
              <p>Today, somatics is often described more simply as a way of improving how it feels to live in your body.</p>
              <p>
                At Padma Coaching, we draw on these studies and lenses. Sharing somatics in this way invites you to
                remember the wisdom and strength you already have when you turn within.
              </p>
              <p>
                And it&rsquo;s never too late. Neuroplasticity shows that the brain and nervous system can form new
                connections throughout life, which means somatic coaching is an opportunity to reshape the patterns
                built over a lifetime.
              </p>
            </Prose>

            <div className="mt-16">
              <Heading>Beneath the noise</Heading>
              <Prose>
                <p>
                  Somatic coaching meets you beneath the noise of the mind, working with the body&rsquo;s own
                  intelligence. The body is made up of 11 major systems, all in constant communication with one
                  another. That&rsquo;s why we never start with just one system, and why rest and reset sit at the heart
                  of this approach.
                </p>
                <p>
                  In a one-off session, the nervous system is where much of the information arises, and where we
                  respond from. It is embodied work, tailored to you in the moment.
                </p>
              </Prose>
            </div>
          </div>
        </Container>
      </Section>

      {/* What to expect */}
      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading>What to expect</Heading>
            <Prose>
              <p>
                Every session is different, because I work from a person-centred approach. In this 90-minute session,
                you might expect:
              </p>
            </Prose>
            <ol className="mt-10 space-y-6">
              {steps.map((step, i) => (
                <li key={step.text} className="flex gap-5">
                  <span className="flex-none w-10 h-10 rounded-full bg-sage/20 text-espresso font-serif text-xl flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="font-sans text-base md:text-lg text-espresso/75 leading-relaxed pt-1.5">
                    {step.title && <b className="font-medium text-espresso">{step.title}</b>} {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* Is this session for you? */}
      <Section background="cream">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <Heading>Is this session for you?</Heading>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-8">
                <h3 className="font-serif text-2xl mb-5">Book this session if you want to:</h3>
                <div className="font-sans text-base text-espresso/75 leading-relaxed">
                  <Bullets items={forYou} mark="✓" />
                </div>
              </div>
              <div className="rounded-3xl bg-white p-8">
                <h3 className="font-serif text-2xl mb-5">This session isn&rsquo;t for you if:</h3>
                <div className="font-sans text-base text-espresso/75 leading-relaxed">
                  <Bullets items={notForYou} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* The details */}
      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading>The details</Heading>
            <dl className="divide-y divide-sand/50 border-y border-sand/50">
              {details.map((d) => (
                <div key={d.label} className="py-4 grid grid-cols-[8.5rem_1fr] gap-4">
                  <dt className="font-sans text-xs uppercase tracking-widest text-sage pt-1">{d.label}</dt>
                  <dd className="font-sans text-base text-espresso/80 leading-relaxed whitespace-pre-line">{d.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <Button href={CONSULTATION} variant="primary" size="md">
                Book a free 20-minute consultation
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <FAQSection heading="Frequently asked questions" items={faqs} background="cream" />

      {/* Curious? */}
      <Section background="sage">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <Heading>Curious?</Heading>
            <p className="font-sans text-base md:text-lg text-espresso/70 leading-relaxed mb-8">
              If something here resonates, I invite you to book a free 20-minute consultation. We&rsquo;ll talk about
              where you are and whether this session is the right fit.
            </p>
            <Button href={CONSULTATION} variant="primary" size="lg">
              Book a free 20-minute consultation
            </Button>
            <p className="font-sans text-xs text-espresso/55 leading-relaxed mt-12">
              Please note: somatic coaching is not a substitute for medical advice, diagnosis or treatment. If you have
              a medical condition, are pregnant or are taking medication, please speak to your GP before starting any
              new breathwork or movement practice.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
