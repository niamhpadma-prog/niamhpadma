import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { PhotoSlideshow, type SlideshowPhoto } from "@/components/sections/PhotoSlideshow";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Previous Experiences",
  description: "Photos from past retreats, workshops and group classes with Niamh Padma.",
};

// To add a photo: put it in /public/images/previous-experiences/ and add a line here.
const photos: SlideshowPhoto[] = [
  { src: "/images/previous-experiences/experience-01.jpg", alt: "Retreat guests journaling" },
  { src: "/images/previous-experiences/experience-02.jpg", alt: "A group standing with hands at heart in a wooden studio" },
  { src: "/images/previous-experiences/experience-03.jpg", alt: "Niamh leading a sharing circle" },
  { src: "/images/previous-experiences/experience-04.jpg", alt: "Retreat group on a mountain hike" },
  { src: "/images/previous-experiences/experience-05.jpg", alt: "Niamh with workshop participants holding carnations" },
  { src: "/images/previous-experiences/experience-06.jpg", alt: "A shared retreat meal outdoors" },
  { src: "/images/previous-experiences/experience-07.jpg", alt: "A large group under palm trees at sunset" },
  { src: "/images/previous-experiences/experience-08.jpg", alt: "Niamh with a class in a candlelit studio" },
  { src: "/images/previous-experiences/experience-09.jpg", alt: "Niamh teaching a seated group class" },
  { src: "/images/previous-experiences/experience-10.jpg", alt: "A group standing in a circle under a tree" },
  { src: "/images/previous-experiences/experience-11.jpg", alt: "Homemade energy balls and chocolate orange slices" },
  { src: "/images/previous-experiences/experience-12.jpg", alt: "A shared meal around a farmhouse kitchen table" },
  { src: "/images/previous-experiences/experience-13.jpg", alt: "A retreat group outdoors under a cloudy sky" },
  { src: "/images/previous-experiences/experience-14.jpg", alt: "A sunlit attic practice space with an altar rug" },
  { src: "/images/previous-experiences/experience-15.jpg", alt: "A violinist playing outdoors" },
  { src: "/images/previous-experiences/experience-16.jpg", alt: "Guests gathering on the lawn among palm trees" },
  { src: "/images/previous-experiences/experience-17.jpg", alt: "Mats and blankets laid out under palm trees" },
  { src: "/images/previous-experiences/experience-18.jpg", alt: "Linen curtains and an altar in a stone studio" },
  { src: "/images/previous-experiences/experience-19.jpg", alt: "A participant laughing with arms outstretched" },
  { src: "/images/previous-experiences/experience-20.jpg", alt: "Niamh teaching a rooftop class" },
  { src: "/images/previous-experiences/experience-21.jpg", alt: "Niamh guiding students on a rooftop" },
  { src: "/images/previous-experiences/experience-22.jpg", alt: "A rooftop class group in matching pink" },
  { src: "/images/previous-experiences/experience-23.jpg", alt: "A studio class in a lunge" },
  { src: "/images/previous-experiences/experience-24.jpg", alt: "Bottles of fresh juice on ice" },
  { src: "/images/previous-experiences/experience-25.jpg", alt: "A large class group in a studio" },
  { src: "/images/previous-experiences/experience-26.jpg", alt: "Participants chatting on their mats after class" },
  { src: "/images/previous-experiences/experience-27.jpg", alt: "Niamh teaching a studio class" },
  { src: "/images/previous-experiences/experience-28.jpg", alt: "A group resting on the grass under a tree" },
  { src: "/images/previous-experiences/experience-29.jpg", alt: "A group balancing on one leg under a tree" },
];

export default function PreviousExperiencesPage() {
  return (
    <>
      <HeroSection
        headline="Previous Experiences"
        imageSrc="/images/previous-experiences/experience-09.jpg"
        imageAlt="Niamh teaching a seated group class"
        imagePosition="top-20"
      />

      <Section background="cream">
        <Container>
          <PhotoSlideshow photos={photos} />
          <div className="mt-12 text-center">
            <Button href="/events" variant="primary" size="md">
              See upcoming events
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
