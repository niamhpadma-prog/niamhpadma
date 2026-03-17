import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceTabs } from "@/components/sections/ServiceTabs";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "1-1 coaching, group yoga & breathwork classes, workshops, and corporate wellness in Lisbon. Find the right offering for your journey.",
};

const placeholderServices = [
  {
    _id: "1",
    title: "Private Coaching Sessions",
    type: "1-1 Coaching",
    description:
      "Personalised sessions tailored to your unique needs — weaving together yoga, breathwork, somatic practices, and nutrition guidance. We'll work together to create a practice that fits your life.",
    pricing: "From €80/session",
    bookingUrl: "#",
    questionnaireType: "coaching",
    includes: [
      "60 or 90-minute sessions",
      "Personalised practice plan",
      "Between-session support",
      "Progress tracking",
    ],
  },
  {
    _id: "2",
    title: "Weekly Group Classes",
    type: "Group Classes",
    description:
      "Join our community for weekly yoga and breathwork classes in beautiful Lisbon studios. All levels welcome — from complete beginners to experienced practitioners.",
    pricing: "€15/class or €50/month",
    bookingUrl: "#",
    questionnaireType: "yoga",
  },
  {
    _id: "3",
    title: "Breathwork & Somatic Workshops",
    type: "Workshops",
    description:
      "Deep-dive half-day and full-day workshops exploring specific themes — from breathwork for anxiety to somatic release for stored tension. Limited to 12 participants for intimate guidance.",
    pricing: "From €45/workshop",
    bookingUrl: "#",
    questionnaireType: "breathwork",
  },
  {
    _id: "4",
    title: "Corporate Wellness Programs",
    type: "Corporate",
    description:
      "Bring wellness into your workplace with tailored programs for teams. From lunch-hour breathwork sessions to full wellness days, we'll design a program that serves your team's needs.",
    pricing: "Custom pricing",
    questionnaireType: "corporate",
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
];

export default function WorkWithMePage() {
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
        imageSrc="/images/group-classes.avif"
        imageAlt="Yoga practice"
        ctas={[
          { label: "Take the Questionnaire", href: "/questionnaires/coaching", style: "primary" as const },
        ]}
      />

      <ServiceTabs services={placeholderServices} />

      <TestimonialsSection
        heading="What Clients Say"
        items={[
          {
            name: "Sarah M.",
            location: "Lisbon",
            quote:
              "Niamh has this incredible ability to hold space while gently guiding you deeper into your practice. Every session feels like coming home.",
            service: "1-1 Coaching",
            rating: 5,
          },
          {
            name: "Marco R.",
            location: "Porto",
            quote:
              "The breathwork workshop completely changed my relationship with stress. I use the techniques daily now.",
            service: "Workshops",
            rating: 5,
          },
          {
            name: "Elena K.",
            location: "Berlin",
            quote:
              "Working with Niamh online has been just as powerful as in-person sessions. She creates a safe, transformative container no matter the format.",
            service: "1-1 Coaching",
            rating: 5,
          },
        ]}
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
