import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { courseLearnQuery } from "@/lib/sanity/queries";

type Params = { slug: string };

interface CourseLearnData {
  modules?: {
    lessons?: {
      slug: { current: string };
      order?: number;
    }[];
    order?: number;
  }[];
}

export default async function CourseLearnPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const course = await client.fetch<CourseLearnData>(courseLearnQuery, { slug });

  // Redirect to the first lesson
  const firstModule = course?.modules?.[0];
  const firstLesson = firstModule?.lessons?.[0];

  if (firstLesson?.slug?.current) {
    redirect(`/courses/${slug}/learn/${firstLesson.slug.current}`);
  }

  redirect(`/courses/${slug}`);
}
