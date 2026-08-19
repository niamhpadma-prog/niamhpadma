// Seed script — scaffolds testimonials / events / services for a FRESH dataset.
//
// ⚠️  THIS SCRIPT MUST NEVER OVERWRITE WRITING THAT NIAMH HAS DONE IN THE STUDIO.
//
// History: on 2026-03-23 an earlier version of this script ran against production
// with `createOrReplace` and seeded 24 `post` documents whose body was a single
// AI-written sentence *about* each poem, published under Niamh's real poem titles.
// That is why her journal appeared to contain "AI interpretations" of her poems.
// See docs/content-safety.md.
//
// Three rules now enforced below:
//   1. It never seeds `post` documents. Journal/poem content is authored by Niamh
//      only — no generated prose is ever written into her journal by a script.
//   2. It uses `createIfNotExists`, never `createOrReplace`, so a re-run can only
//      ever add missing scaffolding and can never clobber an edited document.
//   3. It is a dry run by default, and refuses to touch `production` unless you
//      pass BOTH --apply and --i-am-sure-production.
//
// Usage:
//   npx tsx scripts/seed-sanity.ts                                  # dry run
//   npx tsx scripts/seed-sanity.ts --apply                          # write (non-prod dataset)
//   npx tsx scripts/seed-sanity.ts --apply --i-am-sure-production   # write to production
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

const APPLY = process.argv.includes('--apply');
const PROD_OK = process.argv.includes('--i-am-sure-production');

if (dataset === 'production' && APPLY && !PROD_OK) {
  console.error(
    `\nRefusing to write to the production dataset.\n` +
      `Production holds Niamh's real writing. Re-run with --i-am-sure-production ` +
      `only if you have just taken an export (see docs/content-safety.md).\n`
  );
  process.exit(1);
}

async function mutate(mutations: Record<string, unknown>[]) {
  // Belt-and-braces: this script may only ever create-if-absent. If a future edit
  // reintroduces a destructive mutation, fail loudly rather than eat someone's work.
  const destructive = mutations.filter(
    (m) => !Object.prototype.hasOwnProperty.call(m, 'createIfNotExists')
  );
  if (destructive.length > 0) {
    throw new Error(
      `Blocked ${destructive.length} non-createIfNotExists mutation(s). ` +
        `This script is not allowed to replace, patch or delete existing documents.`
    );
  }

  if (!APPLY) {
    for (const m of mutations) {
      const doc = (m as { createIfNotExists: { _id: string; _type: string } }).createIfNotExists;
      console.log(`  [dry run] would create if absent: ${doc._type} ${doc._id}`);
    }
    return { dryRun: true };
  }

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

// ============ BLOG POSTS / JOURNAL ============
// Deliberately empty, and must stay that way.
//
// Journal posts and poems are Niamh's own writing. This script previously seeded
// 24 `post` documents whose body was a one-line AI-written summary of each poem,
// published under her real titles — which is exactly the bug this file now guards
// against. Never generate journal or poem prose here. Niamh writes it in the Studio.

async function seed() {
  console.log(
    APPLY
      ? `Seeding dataset "${dataset}" (create-if-absent only)...\n`
      : `DRY RUN against dataset "${dataset}" — no writes. Pass --apply to write.\n`
  );

  console.log('Testimonials...');
  await mutate(testimonials.map((t) => ({ createIfNotExists: t })));
  console.log(`  ✓ ${testimonials.length} testimonials`);

  console.log('Events...');
  await mutate(events.map((e) => ({ createIfNotExists: e })));
  console.log(`  ✓ ${events.length} events`);

  console.log('Services...');
  await mutate(services.map((s) => ({ createIfNotExists: s })));
  console.log(`  ✓ ${services.length} services`);

  console.log('\nJournal posts: skipped by design — Niamh authors those in the Studio.');
  console.log(APPLY ? '\nDone. No existing document was modified.' : '\nDry run complete.');
}

seed().catch(console.error);
