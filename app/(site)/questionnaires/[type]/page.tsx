import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { QuestionnaireForm } from "@/components/forms/QuestionnaireForm";
import { JsonLd } from "@/components/seo/JsonLd";

// TODO: Fetch from Sanity in production
const questionnaires: Record<string, {
  title: string;
  serviceType: string;
  intro: string;
  fields: {
    _key: string;
    label: string;
    name: string;
    type: "text" | "email" | "select" | "textarea" | "radio" | "checkbox";
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }[];
  submitLabel: string;
  successMessage: string;
}> = {
  coaching: {
    title: "Wellness Coaching Questionnaire",
    serviceType: "coaching",
    intro: "This short questionnaire helps me understand where you are in your wellness journey so I can recommend the best path forward. It takes about 2 minutes.",
    fields: [
      { _key: "name", label: "What's your name?", name: "name", type: "text", placeholder: "Your name", required: true },
      { _key: "email", label: "What's your email?", name: "email", type: "email", placeholder: "your@email.com", required: true },
      { _key: "experience", label: "What's your experience with wellness practices?", name: "experience", type: "radio", required: true, options: ["Complete beginner", "Some experience", "Regular practitioner", "Advanced / Teacher"] },
      { _key: "interests", label: "What areas interest you most?", name: "interests", type: "checkbox", required: true, options: ["Yoga", "Breathwork", "Somatic Therapy", "Nutrition", "Meditation", "Retreats"] },
      { _key: "goals", label: "What are your main wellness goals?", name: "goals", type: "checkbox", options: ["Stress & anxiety relief", "Better sleep", "Physical flexibility & strength", "Emotional healing", "Spiritual growth", "General wellbeing"] },
      { _key: "availability", label: "How would you prefer to work together?", name: "availability", type: "radio", options: ["In-person in Lisbon", "Online", "Either works"] },
      { _key: "frequency", label: "How often would you like sessions?", name: "frequency", type: "select", options: ["Weekly", "Bi-weekly", "Monthly", "Not sure yet"] },
      { _key: "message", label: "Anything else you'd like me to know?", name: "message", type: "textarea", placeholder: "Share anything that feels relevant — your journey, challenges, hopes..." },
    ],
    submitLabel: "Send My Answers",
    successMessage: "Thank you for sharing! I'll review your answers and get back to you within 48 hours with a personalised recommendation.",
  },
  breathwork: {
    title: "Breathwork Readiness Questionnaire",
    serviceType: "breathwork",
    intro: "Breathwork can be deeply transformative. These questions help me understand your background so I can guide you safely and effectively.",
    fields: [
      { _key: "name", label: "What's your name?", name: "name", type: "text", placeholder: "Your name", required: true },
      { _key: "email", label: "What's your email?", name: "email", type: "email", required: true },
      { _key: "experience", label: "Have you done breathwork before?", name: "experience", type: "radio", required: true, options: ["Never", "A few times", "Regular practice", "Trained facilitator"] },
      { _key: "interest", label: "What draws you to breathwork?", name: "interest", type: "checkbox", options: ["Stress relief", "Anxiety management", "Emotional release", "Spiritual exploration", "Physical health", "Curiosity"] },
      { _key: "health", label: "Do you have any health conditions I should be aware of?", name: "health", type: "textarea", placeholder: "E.g., asthma, heart conditions, pregnancy, epilepsy, mental health conditions... (or 'None')" },
      { _key: "format", label: "What format interests you?", name: "format", type: "radio", options: ["Private session", "Group class", "Workshop", "Online session"] },
      { _key: "message", label: "Any questions for me?", name: "message", type: "textarea", placeholder: "Anything you'd like to know or share..." },
    ],
    submitLabel: "Submit",
    successMessage: "Thank you! I'll be in touch within 48 hours to discuss the best breathwork path for you.",
  },
  yoga: {
    title: "Yoga Practice Questionnaire",
    serviceType: "yoga",
    intro: "Let me learn about your body, your experience, and what you're looking for so I can recommend the right practice for you.",
    fields: [
      { _key: "name", label: "What's your name?", name: "name", type: "text", placeholder: "Your name", required: true },
      { _key: "email", label: "What's your email?", name: "email", type: "email", required: true },
      { _key: "experience", label: "What's your yoga experience?", name: "experience", type: "radio", required: true, options: ["Never tried yoga", "Beginner (< 1 year)", "Intermediate (1-3 years)", "Advanced (3+ years)"] },
      { _key: "styles", label: "Which styles interest you?", name: "styles", type: "checkbox", options: ["Hatha (gentle, foundational)", "Vinyasa (dynamic, flowing)", "Yin (slow, deep stretches)", "Yoga Nidra (guided relaxation)", "Restorative (supported rest)"] },
      { _key: "goals", label: "What do you hope to gain from yoga?", name: "goals", type: "checkbox", options: ["Flexibility", "Strength", "Stress relief", "Better sleep", "Mind-body connection", "Injury recovery"] },
      { _key: "injuries", label: "Any injuries or physical limitations?", name: "injuries", type: "textarea", placeholder: "E.g., lower back pain, knee issues, shoulder injury... (or 'None')" },
      { _key: "format", label: "Preferred format?", name: "format", type: "radio", options: ["Private session", "Group class", "Online", "No preference"] },
      { _key: "message", label: "Anything else?", name: "message", type: "textarea", placeholder: "Share anything that might help me guide you..." },
    ],
    submitLabel: "Find My Practice",
    successMessage: "Wonderful! I'll review your answers and recommend the perfect yoga practice for you within 48 hours.",
  },
  somatic: {
    title: "Somatic Therapy Intake Questionnaire",
    serviceType: "somatic",
    intro: "Somatic work is deeply personal. These questions help me understand your needs so we can work together safely and effectively. Everything you share is confidential.",
    fields: [
      { _key: "name", label: "What's your name?", name: "name", type: "text", placeholder: "Your name", required: true },
      { _key: "email", label: "What's your email?", name: "email", type: "email", required: true },
      { _key: "familiarity", label: "How familiar are you with somatic therapy?", name: "familiarity", type: "radio", required: true, options: ["Not familiar at all", "I've read about it", "I've tried it before", "I have an ongoing practice"] },
      { _key: "seeking", label: "What are you seeking support with?", name: "seeking", type: "checkbox", options: ["Stored tension or chronic pain", "Emotional processing", "Trauma healing", "Nervous system regulation", "Stress & burnout", "General body awareness"] },
      { _key: "therapy", label: "Are you currently working with a therapist or counsellor?", name: "therapy", type: "radio", options: ["Yes", "No", "Previously, not currently"] },
      { _key: "comfort", label: "How comfortable are you with body-focused practices?", name: "comfort", type: "radio", options: ["Very comfortable", "Somewhat comfortable", "A bit nervous but open", "Unsure — I have questions"] },
      { _key: "message", label: "Is there anything you'd like me to know before we connect?", name: "message", type: "textarea", placeholder: "This is a safe space. Share whatever feels right..." },
    ],
    submitLabel: "Submit Intake Form",
    successMessage: "Thank you for trusting me with this. I'll reach out within 48 hours to schedule a free 15-minute discovery call.",
  },
  corporate: {
    title: "Corporate Wellness Enquiry",
    serviceType: "corporate",
    intro: "Bring wellness into your workplace. Tell me about your team and goals, and I'll put together a tailored programme proposal.",
    fields: [
      { _key: "name", label: "Your name", name: "name", type: "text", placeholder: "Your name", required: true },
      { _key: "email", label: "Work email", name: "email", type: "email", required: true },
      { _key: "company", label: "Company name", name: "company", type: "text", placeholder: "Your company", required: true },
      { _key: "role", label: "Your role", name: "role", type: "text", placeholder: "E.g., HR Manager, Founder, Office Manager" },
      { _key: "size", label: "Team size", name: "size", type: "select", required: true, options: ["5-15 people", "15-30 people", "30-50 people", "50-100 people", "100+ people"] },
      { _key: "interests", label: "What wellness offerings interest you?", name: "interests", type: "checkbox", required: true, options: ["Yoga sessions", "Breathwork workshops", "Meditation / mindfulness", "Nutrition talks", "Full wellness day", "Ongoing weekly programme"] },
      { _key: "format", label: "Preferred format?", name: "format", type: "radio", options: ["On-site at your office", "External venue", "Online / hybrid", "Flexible"] },
      { _key: "budget", label: "Approximate budget range?", name: "budget", type: "select", options: ["Under €500", "€500 - €1,000", "€1,000 - €2,500", "€2,500+", "Not sure yet"] },
      { _key: "message", label: "Tell me about your team and goals", name: "message", type: "textarea", placeholder: "What challenges is your team facing? What would a successful programme look like?" },
    ],
    submitLabel: "Request a Proposal",
    successMessage: "Thank you! I'll put together a tailored wellness proposal and send it to you within 3 business days.",
  },
};

type Params = { type: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { type } = await params;
  const q = questionnaires[type];
  if (!q) return { title: "Questionnaire Not Found" };
  return {
    title: q.title,
    description: q.intro,
  };
}

export function generateStaticParams() {
  return Object.keys(questionnaires).map((type) => ({ type }));
}

export default async function QuestionnairePage({ params }: { params: Promise<Params> }) {
  const { type } = await params;
  const q = questionnaires[type];
  if (!q) notFound();

  const benefitHeadlines: Record<string, { headline: string; sub: string }> = {
    coaching: { headline: "Let's Find Your Path", sub: "2 minutes to a personalised wellness recommendation" },
    breathwork: { headline: "Begin Your Breathwork Journey", sub: "A few questions to ensure a safe and transformative experience" },
    yoga: { headline: "Discover Your Practice", sub: "Let me match you with the perfect yoga style" },
    somatic: { headline: "Start Your Healing Journey", sub: "A confidential intake to prepare for your first session" },
    corporate: { headline: "Wellness for Your Team", sub: "Tell us about your team and we'll design a programme" },
  };

  const { headline, sub } = benefitHeadlines[type] || { headline: q.title, sub: q.intro };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: q.title,
          description: q.intro,
          isPartOf: {
            "@type": "WebSite",
            name: "Niamh Padma",
            url: "https://niamhpadma.com",
          },
        }}
      />

      <Section background="cream">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Benefit headline */}
            <div className="text-center mb-10">
              <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-3">
                {headline}
              </h1>
              <p className="font-sans text-base text-espresso/50">{sub}</p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
              <QuestionnaireForm {...q} />
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-center">
              <div className="flex items-center gap-2">
                <span className="text-sage text-sm">🔒</span>
                <span className="font-sans text-xs text-espresso/40">Your data is private</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sage text-sm">⏱</span>
                <span className="font-sans text-xs text-espresso/40">Takes ~2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sage text-sm">💬</span>
                <span className="font-sans text-xs text-espresso/40">Personal response within 48h</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
