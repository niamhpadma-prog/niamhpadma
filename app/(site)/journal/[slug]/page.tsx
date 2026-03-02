import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { BlogCard } from "@/components/cards/BlogCard";
import { JsonLd } from "@/components/seo/JsonLd";

const postImages: Record<string, { src: string; alt: string }> = {
  "finding-right-yoga-practice": { src: "/images/yoga-practice.jpg", alt: "Niamh practicing yoga" },
};

// TODO: Fetch from Sanity + ISR
const placeholderPosts: Record<string, {
  title: string;
  excerpt: string;
  categories: string[];
  publishedAt: string;
  readingTime: number;
  body: string;
  relatedSlugs?: string[];
}> = {
  "complete-guide-breathwork": {
    title: "The Complete Guide to Breathwork",
    excerpt: "Everything you need to know about breathwork — from the science behind it to practical techniques you can start using today.",
    categories: ["Breathwork"],
    publishedAt: "2026-02-15T10:00:00Z",
    readingTime: 8,
    body: `Breathwork is the conscious practice of controlling your breath to influence your mental, emotional, and physical state. While breathing is something we do automatically 20,000+ times a day, learning to breathe with intention can unlock profound shifts in your wellbeing.

## Why Breathwork Works

The science is clear: how you breathe directly affects your nervous system. Slow, deep breathing activates the parasympathetic nervous system — your body's built-in relaxation response. Fast, rhythmic breathing can energise, release stored emotions, and alter your state of consciousness.

Research from Stanford University has shown that just 5 minutes of cyclic sighing (extended exhales) reduces stress more effectively than mindfulness meditation.

## Types of Breathwork

There are many traditions and modern approaches to breathwork. Here are the most common:

**Box Breathing** — Equal inhale, hold, exhale, hold (4-4-4-4). Used by Navy SEALs for stress management. Perfect for anxiety and focus.

**4-7-8 Breathing** — Inhale for 4, hold for 7, exhale for 8. Developed by Dr. Andrew Weil for sleep and relaxation.

**Conscious Connected Breathing** — Continuous circular breaths with no pause between inhale and exhale. Used in Holotropic and Rebirthing traditions for emotional release.

**Wim Hof Method** — 30 power breaths followed by a retention hold. Combines breathwork with cold exposure for resilience.

## How to Start

Begin with just 5 minutes a day. Find a quiet space, sit comfortably, and try this simple practice:

1. Close your eyes and notice your natural breath
2. Begin to lengthen your exhale — inhale for 4 counts, exhale for 6
3. Continue for 5 minutes
4. Notice how you feel afterward

The key is consistency over intensity. A daily 5-minute practice will create more lasting change than an occasional hour-long session.

## Breathwork in Lisbon

If you're in Lisbon and want to explore breathwork with guidance, I offer weekly group classes and private sessions. Whether you're dealing with anxiety, seeking deeper self-connection, or simply curious — there's a breathwork practice for you.`,
    relatedSlugs: ["breathwork-for-anxiety", "finding-right-yoga-practice"],
  },
  "finding-right-yoga-practice": {
    title: "Finding the Right Yoga Practice for You",
    excerpt: "Hatha, Vinyasa, Yin, Nidra — with so many styles, how do you find the one that fits?",
    categories: ["Yoga"],
    publishedAt: "2026-02-08T10:00:00Z",
    readingTime: 6,
    body: `With dozens of yoga styles available, choosing the right one can feel overwhelming. The truth is, the best yoga practice is the one that meets you where you are — in your body, your energy, and your life right now.

## The Main Styles

**Hatha Yoga** — The foundation. Slower-paced, holding poses for several breaths. Perfect for beginners and anyone wanting to build a strong base.

**Vinyasa Flow** — Dynamic, linking breath to movement. Great if you enjoy variety and a more athletic practice. Each class is different.

**Yin Yoga** — Passive, long-held poses (3-5 minutes) targeting deep connective tissue. Ideal for flexibility, stress relief, and slowing down.

**Yoga Nidra** — "Yogic sleep." You lie down and are guided through a systematic relaxation. Profoundly restorative — one session can feel like hours of sleep.

**Restorative** — Supported poses using props for total comfort. About surrender, not stretch. Perfect for burnout recovery.

## How to Choose

Ask yourself: What do I need right now?

- **Stressed and wired?** → Yin or Restorative
- **Low energy, need motivation?** → Vinyasa Flow
- **Sleep issues?** → Yoga Nidra
- **New to yoga?** → Hatha
- **Want a physical challenge?** → Ashtanga or Power Yoga

The beauty of yoga is that your practice can evolve. Many people start with vinyasa and gradually incorporate yin. Others begin with gentle styles and build toward more dynamic practices. There's no wrong door.`,
    relatedSlugs: ["yoga-nidra-sleep", "complete-guide-breathwork"],
  },
  "what-is-somatic-therapy": {
    title: "What is Somatic Therapy?",
    excerpt: "Your body keeps the score. Learn how somatic therapy works with the body's wisdom to release stored tension and trauma.",
    categories: ["Somatic"],
    publishedAt: "2026-02-01T10:00:00Z",
    readingTime: 7,
    body: `Somatic therapy is a body-centred approach to healing that recognises a fundamental truth: our bodies store our experiences. Every moment of stress, every unresolved emotion, every trauma — it all lives in the body as tension, restriction, and holding patterns.

## The Body Keeps the Score

Dr. Bessel van der Kolk's groundbreaking research demonstrated that trauma isn't just stored in the mind — it's held in the body. This is why talk therapy alone sometimes isn't enough. You can understand your patterns intellectually while your body continues to react as though the threat is still present.

Somatic therapy bridges this gap by working directly with the body's nervous system.

## How It Works

In a somatic session, we slow down. Way down. Instead of analysing your story, we tune into your body's signals — sensation, movement impulses, breath patterns, tension, and expansion.

Common techniques include:

- **Body scanning** — Systematically noticing sensations throughout the body
- **Pendulation** — Gently moving attention between areas of comfort and discomfort
- **Titration** — Processing difficult material in small, manageable doses
- **Discharge** — Allowing the body to release stored survival energy through natural movements
- **Grounding** — Practices that reconnect you with the present moment through physical sensation

## What to Expect

A somatic session is unlike anything you've experienced in traditional therapy. You might be invited to notice a tightness in your chest and stay with it. You might find your body wants to move — perhaps a gentle tremor or a deep breath. These spontaneous movements are your nervous system completing stress responses that were interrupted.

Many people describe somatic work as "coming home to their body" — rediscovering a sense of safety and aliveness they didn't know they'd lost.`,
    relatedSlugs: ["complete-guide-breathwork", "finding-right-yoga-practice"],
  },
  "holistic-nutrition-basics": {
    title: "Holistic Nutrition Basics",
    excerpt: "Nourishment goes beyond macros. An introduction to holistic nutrition and how it supports your entire wellbeing.",
    categories: ["Nutrition"],
    publishedAt: "2026-01-25T10:00:00Z",
    readingTime: 5,
    body: `Holistic nutrition sees food as more than fuel. It's medicine, it's information, and it's deeply connected to your emotional and spiritual wellbeing. Rather than counting calories or eliminating food groups, holistic nutrition asks: what does my body actually need to thrive?

## Beyond the Plate

Holistic nutrition considers the whole picture:

- **What** you eat — whole, unprocessed, nutrient-dense foods
- **How** you eat — slowly, mindfully, without distraction
- **When** you eat — aligned with your body's natural rhythms
- **Why** you eat — physical hunger vs. emotional hunger
- **Your relationship** with food — joy, guilt, freedom, restriction

## Core Principles

**Eat whole foods.** If it grew from the earth or had a mother, it's real food. Minimise things that come in packages with long ingredient lists.

**Listen to your body.** Your body is constantly communicating. Cravings, energy levels, digestion — all are feedback. Learn to listen rather than override.

**Nourish, don't restrict.** Instead of taking foods away, focus on adding nourishing ones. More vegetables, more healthy fats, more variety.

**Eat the rainbow.** Different-coloured foods provide different phytonutrients. Aim for variety across the colour spectrum.

**Hydrate.** Most people are chronically dehydrated. Start your day with water before coffee. Aim for 2-3 litres daily.

## Getting Started

Start simple. Choose one meal a day to make more mindful. Sit down, put your phone away, chew slowly, and notice how the food makes you feel. This single practice can transform your relationship with eating.`,
    relatedSlugs: ["what-is-somatic-therapy"],
  },
  "breathwork-for-anxiety": {
    title: "Breathwork for Anxiety: A Practical Guide",
    excerpt: "Simple breathing techniques that calm your nervous system in minutes.",
    categories: ["Breathwork"],
    publishedAt: "2026-01-18T10:00:00Z",
    readingTime: 6,
    body: `If you've ever felt anxiety rising — the racing heart, the shallow breathing, the spiralling thoughts — you already know that anxiety lives in the body. The good news? Your breath is the fastest, most accessible tool to shift your nervous system from fight-or-flight back to calm.

## The Science

When you're anxious, your sympathetic nervous system is activated. Your breathing becomes shallow and fast, which perpetuates the anxiety cycle. By consciously slowing and deepening your breath, you activate the vagus nerve, which signals your parasympathetic nervous system to kick in — your body's natural calming response.

## 3 Techniques for Anxiety

**1. Extended Exhale Breathing**
The simplest and most effective. Inhale for 4 counts, exhale for 8. The longer exhale directly activates your vagus nerve. Do this for 2-3 minutes when anxiety strikes.

**2. Box Breathing**
Inhale 4 counts → Hold 4 → Exhale 4 → Hold 4. Repeat. The structured rhythm gives your mind something to focus on while calming your nervous system.

**3. Physiological Sigh**
Discovered by Stanford neuroscientist Andrew Huberman. Take a double inhale through the nose (one full breath, then a quick top-up sip of air), followed by a long exhale through the mouth. Just 1-3 of these sighs can reduce anxiety in real-time.

## Building a Daily Practice

Don't wait for anxiety to hit. Build a daily prevention practice: 5 minutes of extended exhale breathing every morning. Over time, this trains your nervous system to default to calm rather than stress. Think of it as strength training for your vagus nerve.`,
    relatedSlugs: ["complete-guide-breathwork"],
  },
  "yoga-nidra-sleep": {
    title: "Yoga Nidra for Better Sleep",
    excerpt: "The ancient practice of yogic sleep that's helping modern people find deep rest.",
    categories: ["Yoga"],
    publishedAt: "2026-01-11T10:00:00Z",
    readingTime: 5,
    body: `In our overstimulated world, quality sleep has become a luxury. Enter yoga nidra — an ancient practice that translates to "yogic sleep" and offers a powerful solution for modern insomnia and restlessness.

## What is Yoga Nidra?

Yoga nidra is a guided meditation practised lying down. You're led through a systematic relaxation of your body and mind, hovering in the state between waking and sleeping — the hypnagogic state. You remain conscious while your body enters the deepest levels of rest.

One 30-minute session is said to be equivalent to 2-4 hours of conventional sleep in terms of nervous system restoration.

## How It Helps Sleep

Yoga nidra works on multiple levels:

- **Activates the parasympathetic nervous system** — shifting you out of the stress response
- **Reduces cortisol** — the stress hormone that keeps you wired at night
- **Trains your body to relax** — creating a "relaxation reflex" you can access at bedtime
- **Quiets the mind** — the systematic technique gives your thoughts something to follow instead of spiral

## A Simple Practice for Tonight

Try this 10-minute version before bed:

1. Lie on your back, arms by your sides, eyes closed
2. Set a simple intention: "I am going to rest deeply"
3. Scan your body slowly from toes to crown, noticing each area without changing anything
4. Count your breaths backward from 27 to 1
5. Rest in the stillness for a few minutes
6. Gently return to awareness

If you fall asleep during the practice — that's perfectly fine. Your body is getting exactly what it needs.`,
    relatedSlugs: ["finding-right-yoga-practice", "breathwork-for-anxiety"],
  },
};

const allPostsList = Object.entries(placeholderPosts).map(([slug, post]) => ({
  _id: slug,
  title: post.title,
  slug,
  excerpt: post.excerpt,
  categories: post.categories,
  publishedAt: post.publishedAt,
  readingTime: post.readingTime,
}));

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = placeholderPosts[slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return Object.keys(placeholderPosts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = placeholderPosts[slug];
  if (!post) notFound();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const relatedPosts = (post.relatedSlugs || [])
    .map((s) => allPostsList.find((p) => p.slug === s))
    .filter(Boolean) as typeof allPostsList;

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
              <span className="font-sans text-xs text-espresso/30">
                {post.readingTime} min read
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sand/50" />
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

      {/* Cover image */}
      <Container>
        <div className="relative aspect-[21/9] bg-sand/20 rounded-3xl overflow-hidden mb-12">
          {postImages[slug] && (
            <Image
              src={postImages[slug].src}
              alt={postImages[slug].alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
        </div>
      </Container>

      {/* Article body */}
      <Section background="white">
        <Container>
          <article className="max-w-2xl mx-auto">
            {post.body.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-serif text-3xl md:text-4xl mt-12 mb-4">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("**") && block.includes("**\n")) {
                return (
                  <p key={i} className="font-sans text-base leading-relaxed text-espresso/75 mb-4">
                    {block}
                  </p>
                );
              }
              if (block.startsWith("1. ") || block.startsWith("- ")) {
                const items = block.split("\n");
                const isOrdered = block.startsWith("1. ");
                const Tag = isOrdered ? "ol" : "ul";
                return (
                  <Tag
                    key={i}
                    className={`font-sans text-base text-espresso/75 space-y-2 mb-4 ml-4 ${
                      isOrdered ? "list-decimal" : "list-disc"
                    }`}
                  >
                    {items.map((item, j) => (
                      <li key={j} className="leading-relaxed">
                        {item.replace(/^\d+\.\s|^-\s/, "")}
                      </li>
                    ))}
                  </Tag>
                );
              }
              // Bold text rendering
              const parts = block.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="font-sans text-base leading-relaxed text-espresso/75 mb-4">
                  {parts.map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={j} className="font-semibold text-espresso">
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </p>
              );
            })}
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
