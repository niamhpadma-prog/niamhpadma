import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CourseCard } from "@/components/courses/CourseCard";
import { FAQSection } from "@/components/sections/FAQSection";
import { client } from "@/lib/sanity/client";
import { coursesQuery } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Online Courses",
  description:
    "Learn yoga, breathwork, and somatic practices at your own pace with Niamh Padma's online courses.",
};

interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  tagline?: string;
  thumbnail?: { asset?: { url?: string }; alt?: string };
  price?: number;
  currency?: string;
  level?: string;
  totalDuration?: string;
  moduleCount?: number;
  lessonCount?: number;
}

const courseFaq = [
  {
    question: "How do I access the course after purchasing?",
    answer:
      "After purchase, you'll receive an email with an access link. You can also return anytime by clicking 'I already purchased' on the course page and entering your email to receive a new access link.",
  },
  {
    question: "How long do I have access?",
    answer:
      "You have lifetime access to the course. Watch at your own pace, revisit lessons as often as you like.",
  },
  {
    question: "Can I watch on mobile?",
    answer:
      "Yes! The course player is fully responsive and works on phones, tablets, and desktops.",
  },
  {
    question: "What if I need help?",
    answer:
      "Feel free to reach out via the contact page. I'm here to support your practice and answer any questions about the course material.",
  },
];

export default async function CoursesPage() {
  const courses = await client.fetch<Course[]>(coursesQuery);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-cream-dark pt-12 pb-0">
        <Container>
          <div className="max-w-3xl mx-auto text-center pt-8 pb-16">
            <span className="font-sans text-xs uppercase tracking-widest text-sage mb-4 block">
              Learn at Your Own Pace
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Online Courses
            </h1>
            <p className="font-sans text-base text-espresso/60 leading-relaxed max-w-xl mx-auto">
              Deepen your practice with guided video courses in yoga, breathwork,
              and somatic wellness. Watch anywhere, anytime.
            </p>
          </div>
        </Container>
      </section>

      {/* Course grid */}
      <Section background="white">
        <Container>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, i) => (
                <CourseCard
                  key={course._id}
                  title={course.title}
                  slug={course.slug.current}
                  tagline={course.tagline}
                  thumbnail={course.thumbnail}
                  price={course.price}
                  currency={course.currency}
                  level={course.level}
                  totalDuration={course.totalDuration}
                  moduleCount={course.moduleCount}
                  lessonCount={course.lessonCount}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-serif text-2xl text-espresso/40 mb-2">
                Coming Soon
              </p>
              <p className="font-sans text-sm text-espresso/40">
                New courses are being created. Sign up for the newsletter to be
                the first to know.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <FAQSection heading="Course FAQ" items={courseFaq} />
    </>
  );
}
