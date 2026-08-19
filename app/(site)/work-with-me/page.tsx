import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceTabs } from "@/components/sections/ServiceTabs";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import {
  ServicesBento,
  type BentoService,
} from "@/components/services/ServicesBento";
import { client } from "@/lib/sanity/client";
import { testimonialsQuery, waysToWorkQuery } from "@/lib/sanity/queries";
import {
  WaysToWorkSection,
  type WaysToWorkConfig,
} from "@/components/sections/WaysToWorkSection";

export const revalidate = 60;

interface Testimonial {
  _id: string;
  name: string;
  location?: string;
  quote: string;
  service?: string;
  rating?: number;
}

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "1-1 somatic coaching, group yoga & breathwork classes, workshops, and corporate wellness in Lisbon. Find the right offering for your journey.",
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="font-sans text-sm text-espresso/70 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="text-sage mt-0.5">{"✓"}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Replace these image paths in /public/images/services/ to update the bento imagery.
const services: BentoService[] = [
  {
    id: "coaching-intro",
    category: "1-1 Coaching",
    title: "1-1 Somatic Coaching",
    image: { src: "/images/services/coaching-intro.jpg", alt: "Restful somatic coaching session" },
    summary:
      "Somatic coaching meets you beneath the noise of the mind, working with the body's intelligence. Nervous-system, emotional and embodied work — tailored to how you want to feel.",
    body: (
      <>
        <p>
          Through somatic coaching, we begin where real change happens, beneath the noise of the mind,
          within the intelligence of the body.
        </p>
        <p className="font-medium text-espresso/80">You may find yourself:</p>
        <BulletList
          items={[
            "Feeling more at home in your body",
            "Building emotional resilience",
            "Regulating your nervous system",
            "Healing your relationship with food and movement",
            "Working with your cycle and natural rhythms",
            "Reducing stress and burnout",
            "Improving focus and creativity",
            "Trusting your intuition",
            "Feeling grounded, confident, and clear",
          ]}
        />
        <div className="space-y-1 text-espresso/80">
          <p>This is not mindset work alone.</p>
          <p>It is nervous system work.</p>
          <p>It is emotional work.</p>
          <p>It is embodied work.</p>
        </div>
      </>
    ),
    ctas: [
      { label: "Book a Free Discovery Call", href: "/discovery-call", variant: "primary" },
    ],
  },
  {
    id: "coaching-3month",
    category: "1-1 Coaching",
    title: "3 Month Programme",
    image: { src: "/images/services/coaching-3-month.jpg", alt: "Personalised yoga practice" },
    body: (
      <>
        <p className="font-sans text-sm uppercase tracking-widest text-sage">What You Receive</p>
        <BulletList
          items={[
            "1:1 Personalised Programme tailored to your needs and goals",
            "6 x 75 minute online sessions (fortnightly)",
            "Weekday email check-ins",
            "Additional resources, tools and practices",
          ]}
        />
        <p className="text-sm text-espresso/50">Monthly payment plans available</p>
      </>
    ),
    pricing: "611 EUR",
    ctas: [
      { label: "Book a Free Discovery Call", href: "/discovery-call", variant: "primary" },
    ],
  },
  {
    id: "coaching-6month",
    category: "1-1 Coaching",
    title: "6 Month Programme",
    image: { src: "/images/services/coaching-6-month.jpg", alt: "Yoga nidra restoration" },
    body: (
      <>
        <p className="font-sans text-sm uppercase tracking-widest text-sage">What You Receive</p>
        <BulletList
          items={[
            "1:1 Personalised Programme tailored to your needs and goals",
            "12 x 75 minute online sessions (fortnightly)",
            "Weekday email check-ins",
            "Additional resources, tools and practices",
          ]}
        />
      </>
    ),
    pricing: "1,111 EUR",
    ctas: [
      { label: "Book a Free Discovery Call", href: "/discovery-call", variant: "primary" },
    ],
  },
  {
    id: "group-weekly",
    category: "Group Classes",
    title: "Weekly Group Classes",
    image: { src: "/images/services/group-weekly.jpg", alt: "Group yoga class in Lisbon" },
    body: (
      <p>
        Join our community for weekly somatic yoga and breathwork classes in beautiful Lisbon studios.
        All levels welcome — from complete beginners to experienced practitioners.
      </p>
    ),
    pricing: "€15/class or €50/month",
    ctas: [
      {
        label: "Book Now",
        href: "/contact?subject=Booking%3A%20Weekly%20Group%20Classes",
        variant: "primary",
      },
    ],
  },
  {
    id: "group-monthly",
    category: "Group Classes",
    title: "Monthly Group Practices",
    image: { src: "/images/services/group-monthly.jpg", alt: "Monthly somatic practice gathering" },
    body: (
      <>
        <div className="space-y-3">
          <p className="font-medium text-espresso">
            The Women{"’"}s Gathering and Somatic Journey
          </p>
          <Button
            href="/contact?subject=Booking%3A%20The%20Women%E2%80%99s%20Gathering%20and%20Somatic%20Journey"
            variant="outline"
            size="sm"
          >
            Book Now
          </Button>
        </div>
        <div className="space-y-3 pt-2">
          <p className="font-medium text-espresso">Online Somatic Rest and Reset</p>
          <Button
            href="/contact?subject=Booking%3A%20Online%20Somatic%20Rest%20and%20Reset"
            variant="outline"
            size="sm"
          >
            Book Now
          </Button>
        </div>
      </>
    ),
  },
  {
    id: "corporate-intro",
    category: "Corporate",
    title: "Nervous System–Informed Wellbeing",
    image: { src: "/images/services/corporate-intro.jpg", alt: "Corporate wellbeing workshop" },
    summary:
      "Practical, nervous-system-informed wellbeing programmes for organisations navigating pressure, growth and change — helping teams stay clear, resilient and effective.",
    body: (
      <>
        <p>
          Padma Collective design and deliver practical, nervous system{"–"}informed wellbeing
          programmes for organisations looking to support their people through pressure, growth, and
          change. The focus is on building sustainable capacity at work, helping employees stay
          clear-headed, resilient, and effective in demanding environments.
        </p>
        <p className="font-medium text-espresso/80">Programmes are designed to support:</p>
        <BulletList
          items={[
            "Stress resilience and burnout prevention",
            "Focus, clarity, and sustainable productivity",
            "Emotional intelligence and effective communication",
            "Creativity, adaptability, and decision-making",
            "Nervous system regulation in everyday working life",
          ]}
        />
        <p className="font-medium text-espresso/80">
          Programmes combine evidence-informed practices adapted for modern workplaces, including:
        </p>
        <BulletList
          items={[
            "Breathing practices for focus, regulation, and energy management",
            "Accessible movement practices suitable for desk-based or remote work",
            "Stress regulation and resilience workshops",
            "Mindful approaches to eating, energy, and recovery",
            "Emotional resilience and self-regulation training",
            "Team connection and culture-building sessions",
          ]}
        />
        <p>
          With a background in international communications strategy, public speaking, and
          facilitation, sessions are designed to meet your team in the now with grounded, inclusive,
          and empowering sessions.
        </p>
        <p>
          No prior experience is required, and all practices are practical, accessible, and
          immediately applicable to real working moments such as meetings, presentations, deadlines,
          and challenging conversations. Programmes are available both in person and online.
        </p>
      </>
    ),
    ctas: [
      { label: "Book a Free Discovery Call", href: "/discovery-call", variant: "primary" },
    ],
  },
  {
    id: "corporate-foundations",
    category: "Corporate",
    title: "Foundations Programme",
    image: { src: "/images/services/corporate-foundations.jpg", alt: "Workplace wellbeing session" },
    body: (
      <>
        <p className="text-sm text-terracotta">Ongoing wellbeing support for modern workplaces.</p>
        <p>
          A structured programme designed to support both new starters and existing employees through
          periods of growth and change.
        </p>
        <p>
          Weekly live sessions introduce practical tools for managing stress, focus, and energy, while
          encouraging habit formation through repetition and simple real-world application.
        </p>
        <p>
          Delivered online, with recordings available for a short period and regular feedback loops
          to ensure sessions remain relevant to employee needs.
        </p>
      </>
    ),
    ctas: [
      { label: "Book a Free Discovery Call", href: "/discovery-call", variant: "primary" },
    ],
  },
  {
    id: "corporate-6month",
    category: "Corporate",
    title: "6 Month Programme",
    image: { src: "/images/services/corporate-6-month.jpg", alt: "Breathwork for teams" },
    body: (
      <>
        <p className="text-sm text-terracotta">Focused sessions for teams needing greater depth.</p>
        <p>
          Extended sessions designed for smaller teams, leadership groups, or high-pressure
          environments.
        </p>
        <p>
          These sessions offer a deeper exploration of nervous system regulation, with a stronger
          emphasis on breathwork, reflection, and integration.
        </p>
        <p>Available online, in person, or as a blended experience.</p>
      </>
    ),
    ctas: [
      { label: "Book a Free Discovery Call", href: "/discovery-call", variant: "primary" },
    ],
  },
  {
    id: "corporate-onsite",
    category: "Corporate",
    title: "On-Site Wellbeing Day",
    image: { src: "/images/services/corporate-onsite.jpg", alt: "On-site team wellbeing day" },
    body: (
      <>
        <p className="text-sm text-terracotta">Immersive experiences to support teams through change.</p>
        <p>
          In-person wellbeing days designed to support teams at key moments, such as the start or
          completion of a project. These half-day experiences combine education, physiological reset,
          supportive movement, and integration, helping teams restore focus, energy, and connection.
        </p>
        <p>
          Often used as onboarding intensives, quarterly resets, or preparation for demanding project
          phases.
        </p>
      </>
    ),
    ctas: [
      { label: "Book a Free Discovery Call", href: "/discovery-call", variant: "primary" },
    ],
  },
];

const faqItems = [
  {
    question: "Do I need experience to work with you?",
    answer:
      "Not at all. My sessions are designed to meet you exactly where you are. Whether you've never done yoga before or have years of practice, we'll find the right approach for you.",
  },
  {
    question: "What should I wear / bring?",
    answer:
      "Comfortable clothing you can move in. I provide all mats, props, and equipment for in-studio sessions. For online sessions, a yoga mat and quiet space is all you need.",
  },
  {
    question: "Do you offer online sessions?",
    answer:
      "Yes! 1-1 coaching and select group classes are available online via Zoom. The experience is just as transformative — many of my clients work with me remotely from across Europe.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "I ask for 24 hours notice for cancellations. Late cancellations are charged at 50% of the session fee. I understand life happens — just communicate with me and we'll find a solution.",
  },
  {
    question: "How do I know which service is right for me?",
    answer:
      "Take the questionnaire! It takes 2 minutes and helps me understand your needs so I can recommend the perfect starting point for your journey.",
  },
  {
    question: "How are 1:1 Sessions Structured?",
    answer:
      "We begin by exploring what you are seeking support with, how you want to feel and what’s possible in our time together. We co-create a programme that supports your future self and revisit your intentions as you evolve. Every session begins with a somatic check-in to settle into your body and the present moment. We explore what’s been present for you, what’s felt supportive or challenging, what your body is communicating, and coaching around your current relationship towards nutrition and your body. Sessions flow intuitively while remaining anchored in your long-term goals and intentions.",
  },
  {
    question: "What can I expect physically?",
    answer:
      "Somatics is a body-led approach. We work with your nervous system, current sensations that arise, breath and movement. Sessions include accessible movement designed to release tension, enhance focus and creativity, improve body awareness, and reconnect you with your relationship to rest. Your body may express emotion through movement, breath or sensation. We allow this expression to move gently and safely.",
  },
  {
    question: "What can I expect emotionally & mentally?",
    answer:
      "1:1 sessions can be grounding, supportive and compassionate, while being inspiring, creative, open and driven. You may experience emotional release, clarity and insight, energy and motivation. We build your capacity to feel and process emotions rather than suppress them. You are always in choice.",
  },
  {
    question: "What can I expect between sessions?",
    answer:
      "You’ll receive weekday email check-ins, additional practices and resources, and a programme structure designed for reflection and integration between sessions.",
  },
  {
    question: "What does Somatic mean?",
    answer:
      "The word ‘Somatic’ comes from the Greek word ‘Soma’ which refers to your living, breathing, sensing body. Intentional somatic practices, such as Yoga, Tai Chi, dancing, making art, going for a walk, nourishing yourself through food and even breathing, aim to guide you towards being more aware, present and understanding of your inner experience. The more you become aware of your somatic or bodily experience, the more likely you are to recognise your emotional needs and learn how to manage or cope with the range of human experiences. Rather than thinking “I need to be calm all the time”, it reminds you that you are human with a wide range of emotional needs that all need to be expressed and validated. This helps you grow your capacity and learn to respond or adapt to life in a healthy and non-harming way. It encourages you to connect with the natural rhythms and cycles of being human — rather than forcing yourself into ‘machine mode’.",
  },
];

export default async function WorkWithMePage() {
  // Real client testimonials, from Sanity — the same source the homepage uses.
  // This page used to pass a hardcoded array of invented quotes attributed to
  // named people, none of which carried a `service` matching the default
  // "Retreat" tab, which is why the section rendered as empty.
  // Both fetched together so one slow query doesn't hold up the other. The
  // offerings block is Sanity-only on purpose: it is the part Niamh reshapes
  // most, and it must never need a deploy.
  const [testimonials, waysToWork] = await Promise.all([
    client.fetch<Testimonial[]>(testimonialsQuery),
    client.fetch<WaysToWorkConfig | null>(waysToWorkQuery).catch(() => null),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      <HeroSection
        headline="Work With Me"
        subheadline="Find the practice that fits your life. From private sessions to group experiences."
        imageSrc="/images/work-with-me-hero.jpg"
        imageAlt="Two practitioners in prayer pose during a yoga class in Lisbon"
        imagePosition="top"
        ctas={[
          { label: "Take the Questionnaire", href: "/questionnaires/coaching", style: "primary" as const },
        ]}
      />

      <WaysToWorkSection config={waysToWork} />

      <ServiceTabs
        tabs={["All", "1-1 Coaching", "Group Classes", "Corporate"]}
        tabContent={{
          All: <ServicesBento services={services} filter="All" />,
          "1-1 Coaching": <ServicesBento services={services} filter="1-1 Coaching" />,
          "Group Classes": <ServicesBento services={services} filter="Group Classes" />,
          Corporate: <ServicesBento services={services} filter="Corporate" />,
        }}
      />

      <TestimonialsSection
        heading="What Clients Say"
        items={testimonials}
        background="cream"
      />

      <FAQSection heading="Common Questions" items={faqItems} />

      <CTASection
        heading="Not Sure Where to Start?"
        body="Take a 2-minute questionnaire and I'll personally recommend the best path for your wellness journey."
        ctas={[
          { label: "Start the Questionnaire", href: "/questionnaires/coaching", style: "primary" },
        ]}
        background="sage"
      />
    </>
  );
}
