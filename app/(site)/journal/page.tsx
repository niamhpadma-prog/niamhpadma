import type { Metadata } from "next";
import { BlogListing } from "./BlogListing";
import { HeroSection } from "@/components/sections/HeroSection";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Insights on yoga, breathwork, somatic practices, and holistic nutrition from Niamh Padma. Guides, tips, and stories from Lisbon.",
};

// TODO: Fetch from Sanity in production
const placeholderPosts = [
  {
    _id: "p1",
    title: "The Complete Guide to Breathwork",
    slug: { current: "complete-guide-breathwork" },
    excerpt: "Everything you need to know about breathwork — from the science behind it to practical techniques you can start using today.",
    categories: ["Breathwork"],
    publishedAt: "2026-02-15T10:00:00Z",
    readingTime: 8,
  },
  {
    _id: "p2",
    title: "Finding the Right Yoga Practice for You",
    slug: { current: "finding-right-yoga-practice" },
    excerpt: "Hatha, Vinyasa, Yin, Nidra — with so many styles, how do you find the one that fits? A guide to choosing your path.",
    categories: ["Yoga"],
    publishedAt: "2026-02-08T10:00:00Z",
    readingTime: 6,
  },
  {
    _id: "p3",
    title: "What is Somatic Therapy?",
    slug: { current: "what-is-somatic-therapy" },
    excerpt: "Your body keeps the score. Learn how somatic therapy works with the body's wisdom to release stored tension and trauma.",
    categories: ["Somatic"],
    publishedAt: "2026-02-01T10:00:00Z",
    readingTime: 7,
  },
  {
    _id: "p4",
    title: "Holistic Nutrition Basics",
    slug: { current: "holistic-nutrition-basics" },
    excerpt: "Nourishment goes beyond macros. An introduction to holistic nutrition and how it supports your entire wellbeing.",
    categories: ["Nutrition"],
    publishedAt: "2026-01-25T10:00:00Z",
    readingTime: 5,
  },
  {
    _id: "p5",
    title: "Breathwork for Anxiety: A Practical Guide",
    slug: { current: "breathwork-for-anxiety" },
    excerpt: "Simple breathing techniques that calm your nervous system in minutes. Science-backed methods you can use anywhere.",
    categories: ["Breathwork"],
    publishedAt: "2026-01-18T10:00:00Z",
    readingTime: 6,
  },
  {
    _id: "p6",
    title: "Yoga Nidra for Better Sleep",
    slug: { current: "yoga-nidra-sleep" },
    excerpt: "The ancient practice of yogic sleep that's helping modern people find deep rest. How to start your practice tonight.",
    categories: ["Yoga"],
    publishedAt: "2026-01-11T10:00:00Z",
    readingTime: 5,
  },
];

export default function BlogPage() {
  const posts = placeholderPosts.map((p) => ({
    ...p,
    slug: p.slug.current,
  }));

  return (
    <>
      <HeroSection
        headline="The Journal"
        subheadline="Insights on breathwork, yoga, somatic practices and holistic living."
        imageSrc="/images/journal.jpg"
        imageAlt="Niamh smiling"
      />

      <BlogListing posts={posts} />
    </>
  );
}
