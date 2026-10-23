import type { Metadata } from "next";
import { BlogListing } from "./BlogListing";
import { HeroSection } from "@/components/sections/HeroSection";
import { client } from "@/lib/sanity/client";
import { postsQuery } from "@/lib/sanity/queries";

// Niamh's journal is edited in the Studio and read from Sanity. Nothing about a
// post — title, excerpt or body — is ever hardcoded here. See
// docs/content-safety.md.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Insights on yoga, breathwork, somatic practices, and holistic nutrition from Niamh Padma. Guides, tips, and stories from Lisbon.",
};

type SanityPost = {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: { asset?: { url?: string }; alt?: string };
  categories?: string[];
  publishedAt?: string;
  readingTime?: number;
};

export default async function BlogPage() {
  const posts = await client.fetch<SanityPost[]>(postsQuery, { start: 0, end: 100 });

  const mappedPosts = posts
    .filter((p) => p.slug?.current)
    .map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug!.current!,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      categories: p.categories,
      publishedAt: p.publishedAt,
      readingTime: p.readingTime,
    }));

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
