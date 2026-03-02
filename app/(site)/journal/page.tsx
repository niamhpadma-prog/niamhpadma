import type { Metadata } from "next";
import { BlogListing } from "./BlogListing";
import { HeroSection } from "@/components/sections/HeroSection";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Insights on yoga, breathwork, somatic practices, and holistic nutrition from Niamh Padma. Guides, tips, and stories from Lisbon.",
};

// TODO: Fetch from Sanity in production
const posts = [
  {
    _id: "turn-on",
    title: "Turn On.",
    slug: { current: "turn-on" },
    excerpt: "Yesterday, laid amongst the beating bodies of my dearest friends, clutching one's finger tip and tracing my nail on one's knee, I suddenly realised.",
    categories: ["Poems"],
    publishedAt: "2025-02-28T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "what-if",
    title: "What If..",
    slug: { current: "what-if" },
    excerpt: "A philosophical meditation on time and presence, posing hypothetical scenarios about what would happen if seconds lasted longer.",
    categories: ["Poems"],
    publishedAt: "2024-03-22T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "poems-for-shavasanah",
    title: "Poems for Shavasanah",
    slug: { current: "poems-for-shavasanah" },
    excerpt: "I wrote these poems from a heart centred space in which I am completely vulnerable. It is only with vulnerability one can share poems.",
    categories: ["Poems"],
    publishedAt: "2024-02-11T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "awaken-your-senses-ireland-retreat",
    title: "Awaken Your Senses — Ireland Retreat",
    slug: { current: "awaken-your-senses-ireland-retreat" },
    excerpt: "Mornings of movement to connect to the physical body. Afternoons of workshops to delve deeper into the mental body. Evenings of feasting, sharing stories and dancing at the fire.",
    categories: ["Retreats"],
    publishedAt: "2023-08-24T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "awaken-your-senses-retreat-loving",
    title: "Awaken Your Senses — Argentina Retreat",
    slug: { current: "awaken-your-senses-retreat-loving" },
    excerpt: "Life is feeling flowier than a waterfall. There are moments in my days where I feel like I am observing myself flowing through life.",
    categories: ["Retreats"],
    publishedAt: "2023-08-24T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "swapping-alcohol-for-chai-lattes",
    title: "Swapping Alcohol for Chai Lattes",
    slug: { current: "swapping-alcohol-for-chai-lattes" },
    excerpt: "You're travelling home after a festival. You're sticky. Probably from the beer and drinks that were poured over you over the weekend.",
    categories: ["Wellness"],
    publishedAt: "2023-07-25T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "poems-and-inspiration-from-the-heart",
    title: "Poems and Inspiration from the Heart",
    slug: { current: "poems-and-inspiration-from-the-heart" },
    excerpt: "The author's daily practice of writing poetry that reflects personal introspection and experiences, shared with yoga students as inspiration.",
    categories: ["Poems"],
    publishedAt: "2023-07-14T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "how-to-overcome-fear-of-what-others-think",
    title: "How to Overcome Fear of What Others Think",
    slug: { current: "how-to-overcome-fear-of-what-others-think" },
    excerpt: "I've always been pretty expressive with my body when it comes to movement. In a way I find it easier to express how I feel through my body than through my words.",
    categories: ["Mindset"],
    publishedAt: "2023-07-14T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "making-yoga-a-practice-of-self-compassion",
    title: "Making Yoga a Practice of Self-Compassion",
    slug: { current: "making-yoga-a-practice-of-self-compassion" },
    excerpt: "I see yoga as a practice of curiosity. Of discovery. Because every time I practice I discover something about myself that I wasn't aware of before.",
    coverImage: { asset: { url: "/images/yoga-practice.jpg" }, alt: "Yoga practice" },
    categories: ["Yoga"],
    publishedAt: "2023-07-11T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "why-being-a-chameleon-is-a-superpower",
    title: "Why Being a Chameleon is a SuperPower",
    slug: { current: "why-being-a-chameleon-is-a-superpower" },
    excerpt: "According to the National Science Foundation, an average person experiences approximately 60,000 thoughts daily. Of these, 95% are repetitions from the previous day.",
    categories: ["Mindset"],
    publishedAt: "2023-07-11T10:00:00Z",
    readingTime: 4,
  },
  {
    _id: "be-the-architect-of-your-brain",
    title: "Be the Architect of Your Brain",
    slug: { current: "be-the-architect-of-your-brain" },
    excerpt: "The author describes themselves as an architect of their own brain, building new walls and bridges every day.",
    categories: ["Mindset"],
    publishedAt: "2023-06-26T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "words",
    title: "Words",
    slug: { current: "words" },
    excerpt: "The popular saying 'Sticks and stones may break my bones but words will never hurt me' has evolved significantly. We now recognize that words can create lasting trauma.",
    categories: ["Poems"],
    publishedAt: "2023-06-18T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "why-eating-at-your-desk-is-illegal-in-france",
    title: "Why Eating at Your Desk is Illegal in France",
    slug: { current: "why-eating-at-your-desk-is-illegal-in-france" },
    excerpt: "I know how easy it is to want to be as 'productive' as possible by quickly grabbing lunch and rushing back to your desk.",
    categories: ["Nutrition"],
    publishedAt: "2022-10-19T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "food-restrictions",
    title: "Food Restrictions..",
    slug: { current: "food-restrictions" },
    excerpt: "The author questions why people should restrict foods they enjoy simply because external sources dictate what should and shouldn't be consumed.",
    categories: ["Nutrition"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "eating-for-your-mind",
    title: "Eating for Your Mind..",
    slug: { current: "eating-for-your-mind" },
    excerpt: "If you are experiencing confusion or disorientation, muscle cramps, weakness, headaches or fatigue it may be time to look at the food on your plate.",
    categories: ["Nutrition"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "setting-new-moon-intentions",
    title: "Setting New Moon Intentions",
    slug: { current: "setting-new-moon-intentions" },
    excerpt: "Each new moon is a time for setting new intention(s) for the 4 weeks ahead. This can be how you want to feel, something you want to do.",
    categories: ["Wellness"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "growing-through-fear",
    title: "Growing Through Fear..",
    slug: { current: "growing-through-fear" },
    excerpt: "The author reflects on how fear — whether of failure, inadequacy, or change — often prevents people from pursuing meaningful experiences.",
    categories: ["Mindset"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "power-of-morning-routine",
    title: "Power of Morning Routine",
    slug: { current: "power-of-morning-routine" },
    excerpt: "When I wake up 'on the wrong side of the bed' in the morning, there are so many voices in my head telling me 'today's going to be a bad day'.",
    categories: ["Wellness"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "equinox-thoughts",
    title: "Equinox Thoughts..",
    slug: { current: "equinox-thoughts" },
    excerpt: "The post explores the significance of equinoxes and their connection to natural cycles and health.",
    categories: ["Wellness"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "appreciating-the-little-things",
    title: "Appreciating the Little Things..",
    slug: { current: "appreciating-the-little-things" },
    excerpt: "When I stop to appreciate the 'fanciful' in everything life every little thing just fills me up with so much joy.",
    categories: ["Mindset"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "the-inner-critic",
    title: "The Inner Critic",
    slug: { current: "the-inner-critic" },
    excerpt: "The inner critic is funny, isn't it? I know mine loves to pop its head up far too often.",
    categories: ["Mindset"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 2,
  },
  {
    _id: "finding-love-in-the-being",
    title: "Finding Love in the 'Being'",
    slug: { current: "finding-love-in-the-being" },
    excerpt: "The author reflects on their tendency to romanticize past moments while failing to appreciate the present.",
    categories: ["Mindset"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "success-is-an-inside-job",
    title: "Success is an Inside Job",
    slug: { current: "success-is-an-inside-job" },
    excerpt: "Success is an inside job. It's not what you do on the outside that will ultimately give you your sense of satisfaction.",
    categories: ["Mindset"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 3,
  },
  {
    _id: "overnight-fasting",
    title: "Overnight Fasting..",
    slug: { current: "overnight-fasting" },
    excerpt: "Studies have shown that leaving 12 hours between dinner and breakfast gives your body time to rest and digest food.",
    categories: ["Nutrition"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 2,
  },
];

export default function BlogPage() {
  const mappedPosts = posts.map((p) => ({
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

      <BlogListing posts={mappedPosts} />
    </>
  );
}
