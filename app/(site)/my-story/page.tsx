import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ImageTextSection } from "@/components/sections/ImageTextSection";
import { QualificationsGrid } from "@/components/sections/QualificationsGrid";
import { PullQuote } from "@/components/sections/PullQuote";
import { GallerySection } from "@/components/sections/GallerySection";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About Niamh",
  description:
    "Yoga, breathwork, somatic therapy & nutrition coach based in Lisbon. 100+ coaching hours, trained across Central & South America, facilitating retreats across Europe.",
};

const qualifications = [
  { title: "Hatha Yoga", description: "200hr certified" },
  { title: "Vinyasa Flow", description: "Advanced training" },
  { title: "Yoga Nidra", description: "Sleep & deep relaxation" },
  { title: "Yin Yoga", description: "Restorative practice" },
  { title: "Breathwork", description: "Multiple modalities" },
  { title: "Reiki", description: "Energy healing" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Niamh Padma",
          jobTitle: "Yoga & Breathwork Facilitator, Nutrition Coach",
          url: "https://niamhpadma.com/my-story",
          knowsAbout: [
            "Hatha Yoga",
            "Vinyasa Yoga",
            "Yoga Nidra",
            "Yin Yoga",
            "Breathwork",
            "Reiki",
            "Somatic Therapy",
            "Holistic Nutrition",
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lisbon",
            addressCountry: "PT",
          },
        }}
      />

      <HeroSection
        headline="My Story"
        subheadline={"From wandering to rooted.\nA path through ancient wisdom and modern healing."}
        imageSrc="/images/niamh-my-story.jpg"
        imageAlt="Niamh Padma"
        imagePosition="top"
      />

      <ImageTextSection
        heading="A Journey Across Continents"
        body="My path into wellness wasn't linear — it was a winding journey through Central and South America, studying under traditional healers and immersing myself in ancient practices. From ceremonial breathwork in the mountains of Guatemala to yoga ashrams in India, each experience deepened my understanding that healing is not something we find outside ourselves — it's a return to what was always within."
        imageSrc="/images/rest.jpg"
        imageAlt="Niamh reading"
        imagePosition="left"
        background="white"
      />

      <ImageTextSection
        heading="Rooted in Lisbon"
        body="Today I call Lisbon home, where I facilitate 1-1 coaching sessions, group classes, workshops, and retreats across Europe. My approach weaves together yoga, breathwork, somatic practices, and holistic nutrition — because true wellness lives at the intersection of body, breath, and being."
        imageSrc="/images/my-story.jpg"
        imageAlt="Niamh in Lisbon"
        imagePosition="right"
        background="cream"
      />

      <QualificationsGrid
        heading="Training & Qualifications"
        items={qualifications}
      />

      <PullQuote
        quote="Wellness isn't a destination — it's a remembering. A return to the home you never left."
        attribution="Niamh Padma"
      />

      <GallerySection
        heading="Moments on the Path"
        images={[
          { src: "/images/yoga-discipline.jpg", alt: "Yoga practice" },
          { src: "/images/hero-center.jpg", alt: "Dancer pose outdoors" },
          { src: "/images/breathwork.avif", alt: "Breathwork session" },
          { src: "/images/hero-right.jpg", alt: "Yoga by the pool" },
          { src: "/images/hero-left.jpg", alt: "Meditation portrait" },
          { src: "/images/yoga-practice.jpg", alt: "Yoga backbend" },
        ]}
      />

      <CTASection
        heading="Ready to Begin?"
        body="Whether you're new to wellness or deepening an existing practice, I'd love to walk this path with you."
        ctas={[
          { label: "Work With Me", href: "/work-with-me", style: "primary" },
          { label: "Take the Questionnaire", href: "/questionnaires/coaching", style: "outline" },
        ]}
      />
    </>
  );
}
