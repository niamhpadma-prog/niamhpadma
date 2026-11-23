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
