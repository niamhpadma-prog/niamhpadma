import type { Metadata } from "next";
import { BlogListing } from "./BlogListing";
import { HeroSection } from "@/components/sections/HeroSection";
import { client } from "@/lib/sanity/client";
import { postsQuery } from "@/lib/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Insights on yoga, breathwork, somatic practices, and holistic nutrition from Niamh Padma. Guides, tips, and stories from Lisbon.",
};

interface PostListItem {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: { asset?: { url?: string }; alt?: string };
  coverVideo?: { asset?: { url?: string; mimeType?: string }; alt?: string };
  categories?: string[];
  publishedAt?: string;
  readingTime?: number;
}

async function getPosts() {
  return client
    .fetch<PostListItem[]>(postsQuery, { start: 0, end: 200 })
    .catch(() => [] as PostListItem[]);
}

export default async function BlogPage() {
  const posts = await getPosts();

  const mappedPosts = posts
    .filter((p) => p.slug?.current)
    .map((p) => ({ ...p, slug: p.slug!.current! }));

  return (
    <>
      <HeroSection
        headline="The Journal"
        subheadline="Insights on breathwork, yoga, somatic practices and holistic living."
        imageSrc="/images/journal.jpg"
        imageAlt="Niamh smiling"
      />

      <BlogListing posts={mappedPosts} />
    </>
  );
}
