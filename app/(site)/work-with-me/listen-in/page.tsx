import type { Metadata } from "next";
import Image from "next/image";
import { FAQSection } from "@/components/sections/FAQSection";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Listen In: 12-Week Somatic Programme",
  description:
    "A 12-week one-to-one somatic programme that puts your body first, drawing on breathwork, yoga nidra, movement, nutrition, mindful eating, energy work and coaching.",
};

const DISCOVERY_CALL = "/discovery-call";

const forYou = [
  "You’re high-functioning but running on empty, and “tired” has become your default setting",
  "You notice tension, shallow breathing or poor sleep, but keep pushing through",
  "You want to understand why you have certain patterns, not just manage the symptoms",
  "You’re ready to build a deeper connection with your body and emotions",
  "You’re recovering from a stressful period, burnout or a big life transition",
  "You want practical tools for stress and overwhelm that you can use for life",
];

const notForYou = [
  "You’re looking for a quick fix. Change happens through consistency, and this programme asks for a small amount of practice between sessions.",
  "You need urgent medical or mental health support. Listen In works alongside, not instead of, care from your GP or a mental health professional.",
];

const weeks = [
  {
    title: "Listen Here",
    text: "We begin where you are right now. We explore your values and goals, notice how your body responds when you say them out loud, and take an honest baseline of your sleep, energy and stress.",
  },
  {
    title: "Listen Down",
    text: "The nervous system and down-regulation. We look at the stress response, allostatic load and what happens when stress becomes the bassline. You’ll be introduced to Non Sleep Deep Rest (yoga nidra) as your anchor practice.",
  },
  {
    title: "Listen Through",
    text: "The breath. We uncover your breathing style and how it shifts under pressure, then follow the breath as it moves through the body. Coherent breathing becomes your daily reset.",
  },
  {
    title: "Listen Beneath",
    text: "The holding patterns under the surface. We explore the musculoskeletal system and Sensory Motor Amnesia: the rounded spine, the clenched jaw, the tension that now feels normal. We discover your somatic archetype and use gentle somatic movement to restore feeling and ease.",
  },
  {
    title: "Listen Within",
    text: "The gut. Through nutrition and mindful eating, we look at how stress changes digestion and appetite, and how it feels to slow down enough to taste, chew and notice when you’re full.",
  },
  {
    title: "Listen For",
    text: "The signals you’ve learned to override. We explore the endocrine system, cortisol rhythms and sleep, question the idea that tiredness is “just who I am”, and practise catching early signs before they get loud.",
  },
  {
    title: "Listen Closer",
    text: "Rhythm and vibration. Through heart rate variability, coherence and sound healing, we explore how the body, and its cells, respond to the rhythms around them.",
  },
  {
    title: "Listen Deeper",
    text: "The cellular level. We look at the immune system, inflammation and oxidative stress: what stress is meant to do, what happens when it never switches off, and how food, rest and movement support your antioxidant defences.",
  },
  {
    title: "Listen With",
    text: "Listening with your hands, your skin and another person. Through Reiki, yin yoga and co-regulation, this week is about letting yourself be supported rather than holding everything up alone.",
  },
  {
    title: "Listen Between",
    text: "Reading between the lines. We explore your communication habits: your inner voice, how you speak to yourself and others, and what goes unsaid, drawing on coaching and philosophy.",
  },
  {
    title: "Listen Back",
    text: "Patterns that echo. We trace the habits built over a lifetime, as well as your daily, monthly and seasonal rhythms, and look back on the journey so far to see how it all connects.",
  },
  {
    title: "Listen On",
    text: "Integration. You move from reacting to responding. Together, we build your personal ongoing practice so the listening continues long after our final session.",
  },
];

const included = [
  "12 one-to-one sessions of 60 minutes, online, with the option to meet in person in Lisbon or for me to travel to you (travel costs quoted separately)",
  "An initial intake covering your health history, values, goals and current stress patterns",
  "Guided practices to keep, including yoga nidra and breathwork recordings, for use between sessions",
  "A simple weekly practice plan with gentle reflection prompts",
  "Email support between sessions",
  "A personal practice plan to take with you at the end of the programme",
];

const details = [
  { label: "Length", value: "12 weeks, one 60-minute session per week" },
  { label: "Format", value: "Online, with in-person sessions in Lisbon or travel to you available" },
  { label: "Support", value: "By email between sessions" },
  {
    label: "Investment",
    value: "€1,452",
  },
];

const faqs = [
  {
    question: "Do I need any experience with yoga, breathwork or meditation?",
    answer: "No. Everything is introduced gently and adapted to you, wherever you’re starting from.",
  },
  {
    question: "How much time will I need between sessions?",
    answer: "Around 10 to 20 minutes a day is enough. Consistency matters far more than duration.",
  },
  {
    question: "Can we work together in person?",
    answer:
      "Yes. The programme is designed to be online, but sessions can also take place in person in Lisbon, or I can travel to you to support you through the programme. Get in touch to talk through the options.",
  },
  {
    question: "Is this therapy?",
    answer:
      "Listen In is a somatic coaching programme, not medical treatment or psychotherapy. It complements, but doesn’t replace, care from your doctor or a mental health professional.",
  },
  {
    question: "What if I’m not sure it’s right for me?",
    answer:
      "Book a free discovery call and we’ll talk it through. Not ready for 12 weeks? A one-off 90-minute session is a good place to start.",
  },
];

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-6">{children}</h2>;
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-serif text-2xl md:text-3xl text-espresso pt-6">{children}</h3>;
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

export default function ListenInPage() {
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
              <h1 className="font-serif text-5xl md:text-7xl font-semibold leading-[1.05] mb-5">Listen In</h1>
              <p className="font-serif italic text-2xl md:text-3xl text-cream/90 mb-8">
                A 12-week somatic programme that puts your body first.
              </p>
              <div className="font-sans text-base md:text-lg text-cream/80 leading-relaxed space-y-4 mb-10">
                <p>
                  For so long, we&rsquo;ve been listening outwards: to emails, notifications, deadlines and everyone
                  else&rsquo;s needs. Listen In turns the volume down on the outside world so you can hear what your
                  body has been trying to tell you.
                </p>
                <p>
                  Over 12 one-to-one online sessions, we work with your nervous system and the systems that respond to
                  stress, drawing on breathwork, Non Sleep Deep Rest (yoga nidra), movement, nutrition, mindful eating,
                  energy work and coaching.
                </p>
                <p>
                  Prefer to meet face to face? The programme is also available in person in Lisbon, or I can travel to
                  you to support you through the programme.
                </p>
              </div>
              <Button href={DISCOVERY_CALL} variant="secondary" size="lg">
                Book a discovery call
              </Button>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image
                src="/images/shoot-2026/niamh-hands-on-heart.jpg"
                alt="Niamh with her eyes closed and hands resting on her heart"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Why Listen In? */}
      <Section background="cream">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading>Why Listen In?</Heading>
            <Prose>
              <p>This programme was born from a desire to move through a framework that isn&rsquo;t siloed into one system.</p>
              <p>
                Listening is a skill we develop over a lifetime. But in the age of information and technology, we&rsquo;ve
                become so used to listening to our external environment that the signals from our internal environment
                have grown quieter. We keep moving when our body is asking for rest. We push on when brain fog sets in.
                We tell ourselves that tiredness is &ldquo;just who I am&rdquo;.
              </p>
              <p>
                Listen In puts your body, and its 11 systems, first. Not behind your to-do list, your accolades or your
                career, but at the top of the list. The nervous system sits at the core of this 12-session programme,
                which, over time, helps the body find its way out of patterns of stress it has learned to live with.
              </p>

              <SubHeading>When stress becomes the bassline</SubHeading>
              <p>
                We need stress, of course. It helps us fight off infection, respond to injury and make decisions. But
                what happens when the stress response becomes the lens through which we meet every situation? That
                email? That WhatsApp message?
              </p>
              <p>
                When stress becomes the bassline, the body carries what&rsquo;s called allostatic load: the cumulative
                wear and tear of being &ldquo;on&rdquo; for too long. Over time, stress can feel sooo familiar that we
                stop noticing it at all.
              </p>
              <p>
                We see something similar in Sensory Motor Amnesia, the phenomenon Thomas Hanna described as the loss of
                both feeling and motor control in areas that have become chronically tight. The body becomes so used to
                a holding pattern that it no longer registers it. Think of a rounded posture while working, eating or
                driving: eventually, the spine accepts this shape as part of everyday life.
              </p>
              <p>
                Sleep is another example. Months or years of only five or six hours a night can start to feel normal.
                Yet research shows that chronic short sleep impairs attention and decision-making, and the people
                affected often don&rsquo;t realise it, because their body has grown used to less time zzzzzzing in bed.
              </p>

              <SubHeading>How your cells listen</SubHeading>
              <p>So what happens when our cells start to receive a different kind of signal?</p>
              <p>
                Cells &ldquo;listen&rdquo; in two main ways: chemically, through signalling molecules and receptors,
                and mechanically, by sensing physical forces such as pressure, stretch and vibration. A cell
                doesn&rsquo;t hear the way an ear or brain does. Instead, it detects signals in its environment and
                converts them into biological responses.
              </p>
              <p>
                When we quieten the external noise, the information we feed our cells changes, and that information is
                worth listening to, beyond the ears.
              </p>

              <SubHeading>What the programme does</SubHeading>
              <p>
                Over 12 weeks, we gradually move through a series of practices that support each layer of the system in
                managing stress, including oxidative stress. Oxidative stress happens when the load of free radicals
                outweighs what your antioxidant defences can handle, which can wear down cells, proteins and DNA over
                time.
              </p>
              <p>
                Through somatic practices such as Non Sleep Deep Rest (yoga nidra), meditation, breathwork, movement,
                mindful eating and awareness, Listen In works with the systems that carry and respond to this load.
              </p>
            </Prose>
          </div>
        </Container>
      </Section>

      {/* Is Listen In for you? */}
      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <Heading>Is Listen In for you?</Heading>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-cream p-8">
                <h3 className="font-serif text-2xl mb-5">This programme is for you if:</h3>
                <div className="font-sans text-base text-espresso/75 leading-relaxed">
                  <Bullets items={forYou} mark="✓" />
                </div>
              </div>
              <div className="rounded-3xl bg-cream p-8">
                <h3 className="font-serif text-2xl mb-5">This programme isn&rsquo;t for you if:</h3>
                <div className="font-sans text-base text-espresso/75 leading-relaxed">
                  <Bullets items={notForYou} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* The 12 weeks */}
      <Section background="cream">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Heading>The 12 weeks</Heading>
            <Prose>
              <p>Each week is a different way of listening. Here&rsquo;s what you can expect.</p>
            </Prose>
          </div>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {weeks.map((w, i) => (
              <li key={w.title} className="rounded-3xl bg-white p-7">
                <p className="font-sans text-xs uppercase tracking-widest text-sage mb-2">Week {i + 1}</p>
                <h3 className="font-serif text-2xl mb-3">{w.title}</h3>
                <p className="font-sans text-base text-espresso/70 leading-relaxed">{w.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* What's included + detail */}
      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto grid gap-12 md:grid-cols-2">
            <div>
              <Heading>What&rsquo;s included</Heading>
              <div className="font-sans text-base md:text-lg text-espresso/75 leading-relaxed">
                <Bullets items={included} mark="✓" />
              </div>
            </div>
            <div>
              <Heading>Detail</Heading>
              <dl className="divide-y divide-sand/50 border-y border-sand/50">
                {details.map((d) => (
                  <div key={d.label} className="py-4 grid grid-cols-[7rem_1fr] gap-4">
                    <dt className="font-sans text-xs uppercase tracking-widest text-sage pt-1">{d.label}</dt>
                    <dd className="font-sans text-base text-espresso/80 leading-relaxed">{d.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <Button href={DISCOVERY_CALL} variant="primary" size="md">
                  Book a discovery call
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <FAQSection heading="Frequently asked questions" items={faqs} background="cream" />

      {/* Ready to listen in? */}
      <Section background="sage">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <Heading>Ready to listen in?</Heading>
            <p className="font-sans text-base md:text-lg text-espresso/70 leading-relaxed mb-8">
              Your body has been speaking all along. This is your invitation to start listening.
            </p>
            <Button href={DISCOVERY_CALL} variant="primary" size="lg">
              Book a discovery call
            </Button>
            <p className="font-sans text-xs text-espresso/55 leading-relaxed mt-12">
              Please note: Listen In is not a substitute for medical advice, diagnosis or treatment. If you have a
              medical condition, are pregnant or are taking medication, please speak to your GP before starting any new
              breathwork or movement practice.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
