import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { BlogCard } from "@/components/cards/BlogCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { PostBody } from "@/components/blog/PostBody";
import { client } from "@/lib/sanity/client";
import { postQuery, postsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 60;

// Cover images that live in the repo rather than in Sanity. Only used when the
// post has no coverImage set in Studio, so adding one there always wins.
const fallbackImages: Record<
  string,
  { src: string; alt: string; orientation?: "vertical" | "landscape" }
> = {
  "making-yoga-a-practice-of-self-compassion": {
    src: "/images/yoga-practice.jpg",
    alt: "Yoga practice",
    orientation: "vertical",
  },
};

interface SanityImage {
  asset?: { url?: string };
  alt?: string;
}

interface RelatedPost {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: SanityImage;
  coverVideo?: { asset?: { url?: string; mimeType?: string }; alt?: string };
  publishedAt?: string;
}

interface PostDoc {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  body?: PortableTextBlock[];
  coverImage?: SanityImage;
  categories?: string[];
  publishedAt?: string;
  readingTime?: number;
  relatedPosts?: RelatedPost[];
}

type Params = { slug: string };

async function getPost(slug: string) {
  return client.fetch<PostDoc | null>(postQuery, { slug }).catch(() => null);
}

export async function generateStaticParams() {
  const posts = await client
    .fetch<{ slug?: { current?: string } }[]>(postsQuery, { start: 0, end: 200 })
    .catch(() => [] as { slug?: { current?: string } }[]);
  return posts
    .map((p) => p.slug?.current)
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const fallback = fallbackImages[slug];
  const sanityCover = post.coverImage?.asset ? post.coverImage : null;

  const relatedPosts = (post.relatedPosts || [])
    .filter((rp) => rp.slug?.current)
    .map((rp) => ({ ...rp, slug: rp.slug!.current! }));

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
                {post.publishedAt && (
                  <p className="font-sans text-xs text-espresso/40">
                    {formatDate(post.publishedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Cover image */}
      <Container>
        <div className="pt-8 mb-12">
          {sanityCover ? (
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden">
              <Image
                src={urlFor(sanityCover).width(1600).url()}
                alt={sanityCover.alt || post.title}
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
                sizes={
                  fallback.orientation === "vertical"
                    ? "(max-width: 768px) 100vw, 672px"
                    : "100vw"
                }
              />
            </div>
          ) : (
            <div className="relative aspect-[21/9] bg-sand/20 rounded-3xl" />
          )}
        </div>
      </Container>

      {/* Article body — rendered from Sanity, preserving Niamh's line breaks */}
      <Section background="white">
        <Container>
          <article className="max-w-2xl mx-auto">
            <PostBody body={post.body} categories={post.categories} />
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
