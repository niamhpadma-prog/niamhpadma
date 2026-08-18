import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { BlogCard } from "@/components/cards/BlogCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { client } from "@/lib/sanity/client";
import { postQuery, postSlugsQuery, recentPostsQuery } from "@/lib/sanity/queries";
import { journalPortableTextComponents } from "@/lib/sanity/portableText";

// Every word on this page comes from Sanity. Post text is NEVER hardcoded here —
// this file previously held a hardcoded copy of the journal whose bodies had
// been machine-written under Niamh's titles. See docs/content-safety.md.
export const revalidate = 60;

// Cover art only — presentation, not content. Used when a post has no cover
// image set in the Studio.
const fallbackImages: Record<string, { src: string; alt: string; orientation?: "vertical" | "landscape" }> = {
  "making-yoga-a-practice-of-self-compassion": { src: "/images/yoga-practice.jpg", alt: "Yoga practice", orientation: "vertical" },
};

type RelatedPost = {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  publishedAt?: string;
  coverImage?: { asset?: { url?: string }; alt?: string };
  coverVideo?: { asset?: { url?: string; mimeType?: string }; alt?: string };
  readingTime?: number;
};

type Post = {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  categories?: string[];
  publishedAt?: string;
  readingTime?: number;
  body?: PortableTextBlock[];
  coverImage?: { asset?: { url?: string }; alt?: string };
  coverVideo?: { asset?: { url?: string; mimeType?: string }; alt?: string };
  relatedPosts?: RelatedPost[];
};

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(postQuery, { slug });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(postSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(postQuery, { slug });
  if (!post) notFound();

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const related = post.relatedPosts?.length
    ? post.relatedPosts
    : await client.fetch<RelatedPost[]>(recentPostsQuery, { slug });

  const relatedPosts = related
    .filter((p) => p.slug?.current)
    .map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug!.current!,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      coverVideo: p.coverVideo,
      publishedAt: p.publishedAt,
      readingTime: p.readingTime,
    }));

  const coverUrl = post.coverImage?.asset?.url;
  const coverVideoUrl = post.coverVideo?.asset?.url;
  const fallback = fallbackImages[slug];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: {
            "@type": "Person",
            name: "Niamh Padma",
            url: "https://niamhpadma.com/my-story",
          },
          publisher: {
            "@type": "Organization",
            name: "Niamh Padma",
            url: "https://niamhpadma.com",
          },
        }}
      />

      {/* Hero */}
      <section className="bg-cream-dark pt-20 pb-12">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {post.categories?.[0] && (
                <span className="font-sans text-xs uppercase tracking-widest text-sage">
                  {post.categories[0]}
                </span>
              )}
              {post.readingTime ? (
                <span className="font-sans text-xs text-espresso/30">
                  {post.readingTime} min read
                </span>
              ) : null}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
                <Image
                  src="/images/niamh-profile-pic.png"
                  alt="Niamh Padma"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="text-left">
                <p className="font-sans text-sm font-medium">Niamh Padma</p>
                <p className="font-sans text-xs text-espresso/40">
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Cover media */}
      <Container>
        <div className="pt-8 mb-12">
          {coverVideoUrl ? (
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden">
              <video
                src={coverVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ) : coverUrl ? (
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden">
              <Image
                src={coverUrl}
                alt={post.coverImage?.alt || post.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ) : fallback ? (
            <div
              className={`relative rounded-3xl overflow-hidden ${
                fallback.orientation === "vertical"
                  ? "aspect-[3/4] max-w-2xl mx-auto"
                  : "aspect-[21/9]"
              }`}
            >
              <Image
                src={fallback.src}
                alt={fallback.alt}
                fill
                className="object-cover"
                sizes={fallback.orientation === "vertical" ? "(max-width: 768px) 100vw, 672px" : "100vw"}
              />
            </div>
          ) : (
            <div className="relative aspect-[21/9] bg-sand/20 rounded-3xl" />
          )}
        </div>
      </Container>

      {/* Article body */}
      <Section background="white">
        <Container>
          <article className="max-w-2xl mx-auto">
            <PortableText value={post.body || []} components={journalPortableTextComponents} />
          </article>
        </Container>
      </Section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <Section background="cream">
          <Container>
            <h2 className="font-serif text-3xl text-center mb-10">
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedPosts.map((rp, i) => (
                <BlogCard key={rp._id} {...rp} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <NewsletterSection
        heading="Enjoyed this article?"
        body="Get weekly insights on breathwork, yoga, and holistic wellness delivered to your inbox."
      />
    </>
  );
}
