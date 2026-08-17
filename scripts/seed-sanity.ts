// Seed script — run with: npx tsx scripts/seed-sanity.ts
//
// SAFETY: this script used to run every mutation as `createOrReplace`, keyed on
// fixed _ids like `post-turn-on`. Running it against the production dataset
// therefore replaced whatever was in Studio with the fixture text below —
// including replacing real post bodies with their one-line excerpt. That is
// exactly what happened on 2026-03-23.
//
// It now defaults to `createIfNotExists`, so existing documents are left
// untouched and only genuinely missing ones get created. Destructive
// re-seeding is still possible but has to be asked for explicitly:
//
//   npx tsx scripts/seed-sanity.ts --replace   (plus SEED_CONFIRM, see below)
//
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually (don't override existing env vars)
const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    if (!process.env[key]) {
      process.env[key] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN!;

// `createIfNotExists` never destroys content. `--replace` restores the old
// destructive behaviour, but only alongside the confirmation env var, so it
// can't happen by reflex or from a stale shell command.
const REPLACE = process.argv.includes('--replace');
const CONFIRM_PHRASE = 'yes-overwrite-studio-content';

if (REPLACE && process.env.SEED_CONFIRM !== CONFIRM_PHRASE) {
  console.error(
    `Refusing to run with --replace.\n\n` +
      `This overwrites documents that exist in Studio, discarding anything\n` +
      `written there — post bodies included. If that is genuinely what you\n` +
      `want, re-run with:\n\n` +
      `  SEED_CONFIRM=${CONFIRM_PHRASE} npx tsx scripts/seed-sanity.ts --replace\n`
  );
  process.exit(1);
}

const operation = REPLACE ? 'createOrReplace' : 'createIfNotExists';

function upsert(doc: Record<string, unknown>) {
  return { [operation]: doc };
}

async function mutate(mutations: Record<string, unknown>[]) {
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sanity mutation failed: ${err}`);
  }
  return res.json();
}

// ============ TESTIMONIALS ============
const testimonials = [
  {
    _id: 'testimonial-sarah',
    _type: 'testimonial',
    name: 'Sarah M.',
    location: 'Lisbon',
    quote: "Niamh has this incredible ability to hold space while gently guiding you deeper into your own awareness. Each session felt like coming home to myself.",
    service: '1-1 Coaching',
    rating: 5,
    isFeatured: true,
  },
  {
    _id: 'testimonial-marco',
    _type: 'testimonial',
    name: 'Marco R.',
    location: 'Porto',
    quote: "The breathwork workshop was transformative. I came in stressed and left feeling like I'd released years of tension. Niamh's presence is so calming and authentic.",
    service: 'Workshops',
    rating: 5,
    isFeatured: true,
  },
  {
    _id: 'testimonial-elena',
    _type: 'testimonial',
    name: 'Elena K.',
    location: 'Berlin',
    quote: "Working with Niamh online has been just as powerful as in-person sessions. She has a gift for reading energy and knowing exactly what you need.",
    service: '1-1 Coaching',
    rating: 5,
    isFeatured: true,
  },
  {
    _id: 'testimonial-ana',
    _type: 'testimonial',
    name: 'Ana L.',
    location: 'Lisbon',
    quote: "The retreat in the Algarve changed my life. The combination of breathwork, movement, and Niamh's nourishing meals created the most beautiful container for healing.",
    service: 'Retreat',
    rating: 5,
    isFeatured: true,
  },
];

// ============ EVENTS ============
const events = [
  {
    _id: 'event-spring-breathwork',
    _type: 'event',
    title: 'Spring Breathwork Retreat',
    slug: { _type: 'slug', current: 'spring-breathwork-retreat' },
    type: 'Retreat',
    dateStart: '2026-04-15T10:00:00Z',
    dateEnd: '2026-04-18T16:00:00Z',
    location: {
      name: 'Casa da Luz',
      city: 'Sintra',
      country: 'Portugal',
      geo: { lat: 38.7979, lng: -9.3907 },
    },
    price: '€450',
    capacity: 16,
    status: 'upcoming',
    excerpt: 'A 4-day immersion into breathwork, somatic release and deep rest.',
    body: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        children: [{ _type: 'span', _key: 's1', text: "Join us for four transformative days in the magical hills of Sintra. This intimate retreat weaves together breathwork, somatic practices, yoga, and nourishing plant-based meals to guide you into deep rest and renewal." }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'b2',
        style: 'normal',
        children: [{ _type: 'span', _key: 's2', text: "Each day follows a gentle rhythm — morning breathwork and movement, afternoon integration and nature walks, evening sound healing and yoga nidra. Limited to 16 participants for deep, personalised guidance." }],
        markDefs: [],
      },
    ],
    faq: [
      { _key: 'f1', question: "What's included in the price?", answer: "Accommodation, all meals (plant-based), all sessions and workshops, materials, and airport transfer from Lisbon." },
      { _key: 'f2', question: "Do I need previous experience?", answer: "No experience necessary. The retreat is designed for all levels, from complete beginners to experienced practitioners." },
      { _key: 'f3', question: "What should I bring?", answer: "Comfortable clothing, a journal, and an open heart. All yoga mats, props, and materials are provided." },
    ],
  },
  {
    _id: 'event-yoga-nidra-sound-bath',
    _type: 'event',
    title: 'Yoga Nidra & Sound Bath',
    slug: { _type: 'slug', current: 'yoga-nidra-sound-bath' },
    type: 'Workshop',
    dateStart: '2026-03-22T18:00:00Z',
    location: { name: 'Estúdio Alma', city: 'Lisbon', country: 'Portugal' },
    price: '€35',
    status: 'upcoming',
    body: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        children: [{ _type: 'span', _key: 's1', text: "An evening of deep relaxation combining yoga nidra with crystal bowl sound healing. You'll be guided through a progressive relaxation into the hypnagogic state — the threshold between waking and sleeping — where deep healing and integration happen naturally." }],
        markDefs: [],
      },
    ],
  },
  {
    _id: 'event-weekly-vinyasa',
    _type: 'event',
    title: 'Weekly Vinyasa Flow',
    slug: { _type: 'slug', current: 'weekly-vinyasa-flow' },
    type: 'Class',
    dateStart: '2026-03-10T09:00:00Z',
    location: { name: 'Jardim Studio', city: 'Lisbon', country: 'Portugal' },
    price: '€15',
    status: 'upcoming',
    body: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        children: [{ _type: 'span', _key: 's1', text: "A dynamic vinyasa flow class connecting breath and movement. Each class is thoughtfully sequenced to build strength, flexibility, and presence. All levels welcome — modifications offered throughout." }],
        markDefs: [],
      },
    ],
  },
  {
    _id: 'event-online-breathwork',
    _type: 'event',
    title: 'Online Breathwork Circle',
    slug: { _type: 'slug', current: 'online-breathwork-circle' },
    type: 'Online',
    dateStart: '2026-03-15T19:00:00Z',
    price: '€10',
    status: 'upcoming',
    body: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        children: [{ _type: 'span', _key: 's1', text: "Join from anywhere for a guided breathwork session followed by a community sharing circle. We'll practise conscious connected breathing together, followed by space for integration and connection." }],
        markDefs: [],
      },
    ],
  },
];

// ============ SERVICES ============
const services = [
  {
    _id: 'service-coaching',
    _type: 'service',
    title: '1-1 Somatic Coaching',
    type: 'Private',
    description: "Through somatic coaching, we begin where real change happens — in the body. Together, we'll explore the patterns held in your nervous system, gently releasing what no longer serves you and building capacity for more presence, ease, and aliveness.",
    pricing: 'From €80/session',
    bookingUrl: '/questionnaires/coaching',
    questionnaireType: 'coaching',
    faq: [
      { _key: 'f1', question: 'Do I need experience to work with you?', answer: "Not at all. Whether you're brand new to somatic work or have years of practice, sessions are tailored entirely to where you are right now. There's no expectation — just an invitation to explore." },
      { _key: 'f2', question: 'Do you offer online sessions?', answer: "Yes! I work with clients both in-person in Lisbon and online worldwide. Online sessions are just as effective — your nervous system doesn't need to be in the same room as mine to feel held and supported." },
      { _key: 'f3', question: "What's your cancellation policy?", answer: 'Sessions can be rescheduled up to 24 hours in advance. Cancellations within 24 hours are charged at full rate.' },
      { _key: 'f4', question: 'How do I know which service is right for me?', answer: "If you're unsure, fill out the questionnaire and I'll personally recommend the best path for you. You can also book a free 15-minute discovery call." },
      { _key: 'f5', question: 'How are 1:1 Sessions Structured?', answer: "Each session begins with a check-in to understand where you are that day. We then move into somatic practices — which may include breathwork, gentle movement, body awareness exercises, or nervous system regulation techniques. Sessions end with integration time." },
      { _key: 'f6', question: 'What can I expect physically?', answer: "You might experience tingling, warmth, gentle trembling, or deep relaxation. These are all normal signs of your nervous system releasing stored tension. Everything happens at your pace." },
      { _key: 'f7', question: 'What can I expect emotionally & mentally?', answer: "It's common to feel a range of emotions — from deep calm to unexpected tears or laughter. This is your body's natural way of processing. You may also notice increased clarity and a sense of lightness." },
      { _key: 'f8', question: 'What can I expect between sessions?', answer: "You'll receive personalised practices to continue your work between sessions. Many clients notice shifts in their sleep, stress levels, and relationships within the first few weeks." },
      { _key: 'f9', question: 'What does Somatic mean?', answer: "Somatic comes from the Greek word 'soma', meaning 'the living body'. Somatic practices work with the body as a gateway to healing — recognising that our experiences, emotions, and traumas are stored not just in our minds, but in our tissues, muscles, and nervous system." },
    ],
  },
  {
    _id: 'service-group',
    _type: 'service',
    title: 'Group Classes',
    type: 'Weekly',
    description: "Join our community for weekly somatic yoga and breathwork classes in Lisbon. Each class is thoughtfully designed to help you reconnect with your body, regulate your nervous system, and find more ease in your daily life.",
    pricing: '€15/class or €50/month',
    bookingUrl: '/questionnaires/yoga',
    questionnaireType: 'yoga',
  },
  {
    _id: 'service-workshops',
    _type: 'service',
    title: 'Workshops',
    type: 'Deep Dive',
    description: "Immersive half-day and full-day workshops exploring specific themes — from breathwork foundations to somatic release, sound healing, and mindful nutrition.",
    pricing: 'From €45',
    bookingUrl: '/questionnaires/breathwork',
    questionnaireType: 'breathwork',
  },
  {
    _id: 'service-retreats',
    _type: 'service',
    title: 'Retreats',
    type: 'Multi-day',
    description: "Multi-day immersions across Europe. Retreats weave together breathwork, yoga, somatic practices, nature, and nourishing plant-based meals for deep rest and transformation.",
    pricing: 'From €350',
    bookingUrl: '/events',
  },
  {
    _id: 'service-corporate',
    _type: 'service',
    title: 'Corporate Wellbeing',
    type: 'Corporate',
    description: "Nervous system-informed wellbeing programmes for teams and organisations. Through Padma Collective, I deliver workshops, ongoing programmes, and on-site wellbeing days that help teams build resilience, reduce stress, and foster genuine connection.",
    pricing: 'Custom pricing',
    bookingUrl: '/questionnaires/corporate',
    questionnaireType: 'corporate',
  },
];

// ============ BLOG POSTS ============
const posts = [
  { _id: 'post-turn-on', title: 'Turn On.', slug: 'turn-on', categories: ['Poems'], publishedAt: '2024-12-15', excerpt: 'A poem about awakening to sensation, presence, and the courage to feel fully alive.' },
  { _id: 'post-what-if', title: 'What If..', slug: 'what-if', categories: ['Poems'], publishedAt: '2024-11-28', excerpt: 'Exploring the questions that open doors we didn\'t know existed.' },
  { _id: 'post-poems-shavasanah', title: 'Poems for Shavasanah', slug: 'poems-for-shavasanah', categories: ['Poems'], publishedAt: '2024-11-10', excerpt: 'Words to carry you into stillness at the end of practice.' },
  { _id: 'post-ireland-retreat', title: 'Awaken Your Senses — Ireland Retreat', slug: 'awaken-your-senses-ireland-retreat', categories: ['Retreats'], publishedAt: '2024-10-20', excerpt: 'A reflection on our transformative retreat along the Wild Atlantic Way.' },
  { _id: 'post-argentina-retreat', title: 'Awaken Your Senses — Argentina Retreat', slug: 'awaken-your-senses-argentina-retreat', categories: ['Retreats'], publishedAt: '2024-09-15', excerpt: 'Stories and lessons from our retreat in the mountains of Córdoba.' },
  { _id: 'post-alcohol-chai', title: 'Swapping Alcohol for Chai Lattes', slug: 'swapping-alcohol-for-chai-lattes', categories: ['Wellness'], publishedAt: '2024-08-22', excerpt: 'What happened when I chose presence over numbing — and discovered a whole new way to socialise.' },
  { _id: 'post-poems-heart', title: 'Poems and Inspiration from the Heart', slug: 'poems-and-inspiration-from-the-heart', categories: ['Poems'], publishedAt: '2024-08-05', excerpt: 'A collection of words that found me during quiet moments of reflection.' },
  { _id: 'post-fear-others', title: 'How to Overcome Fear of What Others Think', slug: 'how-to-overcome-fear-of-what-others-think', categories: ['Mindset'], publishedAt: '2024-07-18', excerpt: 'The practice of choosing your own truth over the noise of external expectations.' },
  { _id: 'post-yoga-self-compassion', title: 'Making Yoga a Practice of Self-Compassion', slug: 'making-yoga-a-practice-of-self-compassion', categories: ['Yoga'], publishedAt: '2024-07-01', excerpt: 'How shifting from performance to presence transformed my relationship with yoga — and myself.' },
  { _id: 'post-chameleon', title: 'Why Being a Chameleon is a SuperPower', slug: 'why-being-a-chameleon-is-a-superpower', categories: ['Mindset'], publishedAt: '2024-06-12', excerpt: 'Reframing adaptability as a strength rather than a loss of identity.' },
  { _id: 'post-architect-brain', title: 'Be the Architect of Your Brain', slug: 'be-the-architect-of-your-brain', categories: ['Mindset'], publishedAt: '2024-05-28', excerpt: 'Neuroplasticity in action — how your daily choices literally reshape your mind.' },
  { _id: 'post-words', title: 'Words', slug: 'words', categories: ['Poems'], publishedAt: '2024-05-10', excerpt: 'The power of language to heal, to harm, and to transform.' },
  { _id: 'post-desk-france', title: 'Why Eating at Your Desk is Illegal in France', slug: 'why-eating-at-your-desk-is-illegal-in-france', categories: ['Nutrition'], publishedAt: '2024-04-22', excerpt: 'What France understands about the relationship between food, rest, and productivity.' },
  { _id: 'post-food-restrictions', title: 'Food Restrictions..', slug: 'food-restrictions', categories: ['Nutrition'], publishedAt: '2024-04-05', excerpt: 'When healing your relationship with food means letting go of the rules.' },
  { _id: 'post-eating-mind', title: 'Eating for Your Mind..', slug: 'eating-for-your-mind', categories: ['Nutrition'], publishedAt: '2024-03-18', excerpt: 'The gut-brain connection and how what you eat shapes how you feel.' },
  { _id: 'post-new-moon', title: 'Setting New Moon Intentions', slug: 'setting-new-moon-intentions', categories: ['Wellness'], publishedAt: '2024-03-01', excerpt: 'A simple ritual for aligning with lunar cycles and planting seeds of intention.' },
  { _id: 'post-growing-fear', title: 'Growing Through Fear..', slug: 'growing-through-fear', categories: ['Mindset'], publishedAt: '2024-02-14', excerpt: 'Fear as a compass — how our edges show us exactly where growth lives.' },
  { _id: 'post-morning-routine', title: 'Power of Morning Routine', slug: 'power-of-morning-routine', categories: ['Wellness'], publishedAt: '2024-01-28', excerpt: 'How the first hour of your day sets the tone for everything that follows.' },
  { _id: 'post-equinox', title: 'Equinox Thoughts..', slug: 'equinox-thoughts', categories: ['Wellness'], publishedAt: '2024-01-10', excerpt: 'Reflections on balance, transition, and the wisdom of seasonal living.' },
  { _id: 'post-little-things', title: 'Appreciating the Little Things..', slug: 'appreciating-the-little-things', categories: ['Mindset'], publishedAt: '2023-12-20', excerpt: 'A reminder that the extraordinary lives inside the ordinary moments.' },
  { _id: 'post-inner-critic', title: 'The Inner Critic', slug: 'the-inner-critic', categories: ['Mindset'], publishedAt: '2023-12-05', excerpt: 'Learning to meet your harshest voice with curiosity instead of war.' },
  { _id: 'post-finding-love', title: "Finding Love in the 'Being'", slug: 'finding-love-in-the-being', categories: ['Mindset'], publishedAt: '2023-11-18', excerpt: 'What happens when you stop searching and simply arrive.' },
  { _id: 'post-success-inside', title: 'Success is an Inside Job', slug: 'success-is-an-inside-job', categories: ['Mindset'], publishedAt: '2023-11-01', excerpt: 'Redefining achievement through the lens of inner fulfilment.' },
  { _id: 'post-overnight-fasting', title: 'Overnight Fasting..', slug: 'overnight-fasting', categories: ['Nutrition'], publishedAt: '2023-10-15', excerpt: 'The science and simplicity of giving your digestive system a nightly rest.' },
].map((p) => ({
  ...p,
  _type: 'post',
  slug: { _type: 'slug', current: p.slug },
  body: [
    {
      _type: 'block',
      _key: 'b1',
      style: 'normal',
      children: [{ _type: 'span', _key: 's1', text: p.excerpt }],
      markDefs: [],
    },
  ],
}));

async function seed() {
  console.log(
    `Mode: ${operation}` +
      (REPLACE ? '  — EXISTING DOCUMENTS WILL BE OVERWRITTEN' : '  (existing documents left untouched)')
  );

  console.log('Seeding testimonials...');
  await mutate(testimonials.map(upsert));
  console.log(`  ✓ ${testimonials.length} testimonials`);

  console.log('Seeding events...');
  await mutate(events.map(upsert));
  console.log(`  ✓ ${events.length} events`);

  console.log('Seeding services...');
  await mutate(services.map(upsert));
  console.log(`  ✓ ${services.length} services`);

  console.log('Seeding blog posts...');
  // Batch in groups of 10
  for (let i = 0; i < posts.length; i += 10) {
    const batch = posts.slice(i, i + 10);
    await mutate(batch.map(upsert));
  }
  console.log(`  ✓ ${posts.length} blog posts`);

  console.log('\nDone! All content seeded into Sanity.');
}

seed().catch(console.error);
