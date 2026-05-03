import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { courseLearnQuery, courseLessonQuery } from "@/lib/sanity/queries";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { LessonContent } from "@/components/courses/LessonContent";
import { CourseProgressHeader } from "./CourseProgressHeader";

type Params = { slug: string; lessonSlug: string };

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
  duration?: string;
  order?: number;
  isFreePreview?: boolean;
  videoUrl?: string;
  resources?: { asset?: { url?: string; originalFilename?: string } }[];
  body?: unknown[];
}

interface Module {
  _id: string;
  title: string;
  order?: number;
  lessons?: Lesson[];
}

interface CourseData {
  _id: string;
  title: string;
  slug: { current: string };
  modules?: Module[];
}

interface LessonData {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  videoUrl?: string;
  duration?: string;
  body?: unknown[];
  isFreePreview?: boolean;
  resources?: { asset?: { url?: string; originalFilename?: string } }[];
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { lessonSlug } = await params;
  const lesson = await client.fetch<LessonData>(courseLessonQuery, { lessonSlug });
  if (!lesson) return { title: "Lesson Not Found" };
  return { title: lesson.title };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, lessonSlug } = await params;

  const [course, lesson] = await Promise.all([
    client.fetch<CourseData>(courseLearnQuery, { slug }),
    client.fetch<LessonData>(courseLessonQuery, { lessonSlug }),
  ]);

  if (!course || !lesson) notFound();

  // Build flat lesson list for prev/next navigation
  const allLessons: { slug: string; title: string }[] = [];
  course.modules?.forEach((mod) => {
    mod.lessons?.forEach((l) => {
      allLessons.push({ slug: l.slug.current, title: l.title });
    });
  });

  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <>
      {/* Sidebar */}
      <CourseSidebar
        courseSlug={slug}
        modules={course.modules || []}
        currentLessonSlug={lessonSlug}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
          {/* Progress */}
          <CourseProgressHeader
            courseSlug={slug}
            totalLessons={allLessons.length}
          />

          {/* Lesson title */}
          <h1 className="font-serif text-3xl md:text-4xl mb-6">
            {lesson.title}
          </h1>

          {/* Video */}
          {lesson.videoUrl && (
            <div className="mb-6">
              <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
            </div>
          )}

          {/* Lesson content */}
          <LessonContent
            lessonId={lesson._id}
            courseSlug={slug}
            body={lesson.body}
            resources={lesson.resources}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
          />
        </div>
      </main>
    </>
  );
}
