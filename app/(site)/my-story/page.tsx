import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Niamh",
  description:
    "Somatic Coach, Breathwork Facilitator & Yoga Teacher based in Lisbon. Guiding busy professionals through reconnection with grounded education, embodied practices and personalised somatic coaching.",
};

const qualifications = [
  "200hr Yoga Teacher Training \u2013 Sacred Paths Yoga",
  "50hr Yoga Nidra Training \u2013 Sacred Paths Yoga & Sam Bianchini",
  "Alignment, Posture & Yoga \u2013 Jenni Rawlings",
  "Continuous Conscious Connected Breathwork \u2013 Mela Mariposa",
  "BreathHoldWork Training \u2013 NatMove with Erwan Le Corre",
  "Accredited Holistic Health & Functional Nutrition Coach \u2013 MindBodyFood Institute",
  "Level 2 Reiki Facilitator",
  "Extended Myofascial Release Training",
  "20hr Cueing & Adjustments Training",
  "Degree in Marketing & Public Relations",
  "Yoga Therapist in Training with The Minded Institute",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Niamh Padma",
          jobTitle: "Somatic Coach, Breathwork Facilitator & Yoga Teacher",
          url: "https://niamhpadma.com/my-story",
          knowsAbout: [
            "Somatic Coaching",
            "Breathwork",
            "Yoga",
            "Yoga Nidra",
            "Holistic Nutrition",
            "Reiki",
            "Nervous System Regulation",
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
        imagePosition="top-20"
      />

      {/* Opening story with image */}
      <Section background="white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-sand/30">
              <img
                src="/images/rest.jpg"
                alt="Niamh"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="max-w-md">
              <div className="font-sans text-base leading-[1.85] text-espresso/70 space-y-6">
                <p>
                  My passion for discovering new cultures, movement and food began at a young age with an
                  urge to travel, explore and experience life fully. But for much of my teens and early twenties, I
                  was deeply disconnected from my body.
                </p>
                <p>
                  I lived fast. I pushed hard. I numbed myself with alcohol, late nights, overworking and
                  overtraining. I ignored my intuition and suppressed my emotions because I didn&rsquo;t yet have the
                  language, safety or support to listen to what my body was asking for.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* The turning point */}
      <Section background="cream">
        <Container>
          <div className="max-w-xl mx-auto">
            <p className="font-serif text-3xl md:text-4xl font-semibold leading-snug mb-10">
              In 2018, everything caught up with me.
            </p>
            <div className="font-sans text-base leading-[1.85] text-espresso/70 space-y-6">
              <p>
                I was rushed to hospital and spent days undergoing scans and tests while my body shut down
                in ways no one could explain. I was eventually discharged without answers, only fear and
                exhaustion. I later developed IBS from chronic stress, had no period for six years, and was told
                this was &ldquo;normal.&rdquo; Deep down, I knew it wasn&rsquo;t.
              </p>
              <p>
                That moment became the beginning of a very different relationship with myself.
              </p>
              <p>
                I began researching how to heal from within. I changed my lifestyle. I changed the way I ate. I
                started eliminating what was harming me and nourishing what was missing. I found yoga in the
                most unexpected place, my local bar, and for the first time truly understood what mind&ndash;body
                connection meant.
              </p>
              <p>
                As I learned to listen to my body, my symptoms softened. My relationship with food, rest and
                movement transformed. I began to understand how deeply psychosomatic I am, how sensitive
                my nervous system is, and how powerfully my body responds when I live in alignment with my
                natural rhythms.
              </p>
              <p>
                I&rsquo;ve lived at both ends of the wellness spectrum. From obsessive clean eating and overtraining
                fuelled by health anxiety, to overindulgence and burnout. From complete disconnection to deep
                embodiment. From numbing everything to feeling everything.
              </p>
              <p>
                And through it all, I learned that healing is not a one-time fix. It&rsquo;s a relationship and a rhythm that
                needs watering and nurturing.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Current work with image */}
      <Section background="white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="max-w-md">
              <div className="font-sans text-base leading-[1.85] text-espresso/70 space-y-6">
                <p>
                  Now, as a Somatic Coach, Breathwork Facilitator and Yoga Teacher, I guide busy, working
                  professionals through the same reconnection that changed my life. The wellness world can be
                  confusing, it doesn&rsquo;t have to be. With grounded education, embodied practices and deeply
                  personalised somatic coaching, you can feel clear and connected.
                </p>
                <p>
                  If you choose to walk this path together, we use breathwork, movement, energy work and
                  mindful nutrition, to increase vitality, regulate the nervous system, release stored stress and
                  emotion, connect to intuition and build a relationship with the self rooted in softness,
                  nourishment, creativity and self-trust.
                </p>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-sand/30">
              <img
                src="/images/my-story.jpg"
                alt="Niamh in Lisbon"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Closing section */}
      <Section background="sage">
        <Container>
          <div className="max-w-2xl mx-auto text-center py-8 md:py-12">
            <div className="space-y-6 mb-16">
              <p className="font-serif text-2xl md:text-3xl leading-snug">
                I know how it feels to live in constant stress.
              </p>
              <p className="font-serif text-2xl md:text-3xl leading-snug">
                I know what it&rsquo;s like to feel disconnected from your body.
              </p>
              <p className="font-serif text-2xl md:text-3xl leading-snug">
                I know what it&rsquo;s like to ignore your intuition because life feels too busy to listen.
              </p>
            </div>

            <p className="font-serif text-2xl md:text-3xl leading-snug mb-16">
              And I also know what&rsquo;s possible when you finally come home to yourself.
            </p>

            <div className="space-y-3">
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                Your body already holds the wisdom.
              </p>
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                I&rsquo;m here to help you listen.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Training & Qualifications */}
      <Section background="white">
        <Container>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-center mb-12">
            Training & Qualifications
          </h2>
          <div className="max-w-lg mx-auto">
            <ul className="space-y-3">
              {qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-3 font-sans text-base leading-relaxed text-espresso/70">
                  <span className="text-sage mt-1 flex-shrink-0">&bull;</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Instagram link */}
      <Section background="cream">
        <Container>
          <div className="text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
              Follow the Journey
            </h2>
            <p className="font-sans text-base text-espresso/60 mb-8 max-w-md mx-auto">
              For daily practices, behind-the-scenes moments and community connection.
            </p>
            <Button
              href="https://instagram.com/niamhpadma"
              variant="outline"
            >
              Follow on Instagram
            </Button>
          </div>
        </Container>
      </Section>

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
