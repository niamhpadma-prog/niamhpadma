export interface LocationPageData {
  location: string;
  locationSlug: string;
  service: string;
  serviceSlug: string;
  headline: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  benefits: string[];
  whatToExpect: string[];
  faq: { question: string; answer: string }[];
  howTo?: { name: string; steps: { name: string; text: string }[] };
  relatedPages: { label: string; href: string }[];
  cta: { label: string; href: string };
}

export const locationPages: LocationPageData[] = [
  {
    location: "Lisbon",
    locationSlug: "lisbon",
    service: "Breathwork",
    serviceSlug: "breathwork",
    headline: "Breathwork in Lisbon",
    metaTitle: "Breathwork in Lisbon — Classes & Private Sessions | Niamh Padma",
    metaDescription: "Breathwork classes and private sessions in Lisbon with certified facilitator Niamh Padma. Reduce stress, manage anxiety, and unlock emotional release. Book today.",
    intro: [
      "Breathwork is one of the most powerful tools for nervous system regulation — and Lisbon is one of the best cities in Europe to begin your practice. With a growing wellness community and year-round mild weather, the city offers the perfect environment for deep inner work.",
      "I offer weekly group breathwork classes, private 1-1 sessions, and immersive workshops across Lisbon. Whether you're dealing with anxiety, seeking emotional release, or simply curious about conscious breathing, there's a practice for you.",
    ],
    benefits: [
      "Reduce stress and anxiety within minutes",
      "Release stored tension and emotional blockages",
      "Improve sleep quality and energy levels",
      "Strengthen your mind-body connection",
      "Join a supportive community of practitioners",
    ],
    whatToExpect: [
      "A warm, safe space in a central Lisbon studio",
      "Guided conscious connected breathing techniques",
      "Integration time with journaling or sharing",
      "Sessions suitable for all experience levels",
      "Modifications for any health considerations",
    ],
    faq: [
      { question: "Where do breathwork classes take place in Lisbon?", answer: "Classes are held at studios in central Lisbon including Príncipe Real and Santos. Private sessions can be arranged at your home or a location of your choice." },
      { question: "Do I need experience to try breathwork?", answer: "No experience is needed. All sessions include clear guidance and modifications. First-timers are always welcome." },
      { question: "Is breathwork safe?", answer: "Breathwork is safe for most people. I'll ask about health conditions before your first session. Certain conditions like pregnancy, epilepsy, or cardiovascular issues may require modified techniques." },
      { question: "How much does breathwork cost in Lisbon?", answer: "Group classes start at €15. Private sessions start at €80. Workshop pricing varies. Package discounts are available." },
    ],
    howTo: {
      name: "How to Start Breathwork in Lisbon",
      steps: [
        { name: "Take the questionnaire", text: "Fill out a 2-minute breathwork readiness questionnaire so I can understand your needs and goals." },
        { name: "Receive your recommendation", text: "I'll personally respond within 48 hours with a recommended starting point — group class, private session, or workshop." },
        { name: "Attend your first session", text: "Come to your first session with comfortable clothing and an open mind. Everything else is provided." },
        { name: "Build your practice", text: "With regular practice, you'll develop tools you can use anytime to regulate your nervous system and find calm." },
      ],
    },
    relatedPages: [
      { label: "Yoga in Lisbon", href: "/lisbon/yoga" },
      { label: "Somatic Therapy in Lisbon", href: "/lisbon/somatic-therapy" },
      { label: "Wellness Retreats Portugal", href: "/portugal/wellness-retreats" },
    ],
    cta: { label: "Take the Breathwork Questionnaire", href: "/questionnaires/breathwork" },
  },
  {
    location: "Lisbon",
    locationSlug: "lisbon",
    service: "Yoga",
    serviceSlug: "yoga",
    headline: "Yoga Classes in Lisbon",
    metaTitle: "Yoga Classes in Lisbon — Hatha, Vinyasa, Yin & Nidra | Niamh Padma",
    metaDescription: "Yoga classes in Lisbon: Hatha, Vinyasa, Yin Yoga and Yoga Nidra. Group and private sessions for all levels. Join Niamh Padma's classes in central Lisbon.",
    intro: [
      "Whether you're looking for a dynamic vinyasa flow to start your morning or a restorative yin session to unwind, Lisbon has become one of Europe's most vibrant yoga communities — and I'm honoured to be part of it.",
      "I teach weekly group classes and private sessions across multiple styles: Hatha for strong foundations, Vinyasa for flowing movement, Yin for deep flexibility, and Yoga Nidra for profound relaxation. All levels are welcome, from first-timers to experienced yogis.",
    ],
    benefits: [
      "Build strength, flexibility, and balance",
      "Reduce stress and find mental clarity",
      "Improve posture and reduce chronic pain",
      "Deepen your mind-body awareness",
      "Connect with Lisbon's wellness community",
    ],
    whatToExpect: [
      "Thoughtfully sequenced classes in central Lisbon studios",
      "Clear instruction with hands-on adjustments (with consent)",
      "Modifications for all levels and body types",
      "A welcoming, non-competitive atmosphere",
      "Post-class community and connection",
    ],
    faq: [
      { question: "What styles of yoga do you teach in Lisbon?", answer: "I teach Hatha, Vinyasa Flow, Yin Yoga, and Yoga Nidra. Each style serves different needs — from energising morning flows to deeply restorative evening practices." },
      { question: "I'm a complete beginner — can I join?", answer: "Absolutely. All classes welcome beginners. I offer modifications throughout so you can practise at your own level. Private sessions are also a great way to build confidence before joining groups." },
      { question: "How much are yoga classes in Lisbon?", answer: "Drop-in group classes are €15. Monthly unlimited passes are €50. Private sessions start at €80. Package discounts available." },
      { question: "Where are your Lisbon yoga studios?", answer: "Classes are held at partner studios in Príncipe Real and Santos, both easily accessible by metro and bus." },
    ],
    howTo: {
      name: "How to Start Yoga in Lisbon",
      steps: [
        { name: "Choose your style", text: "Take the yoga questionnaire to discover which style suits your body and goals." },
        { name: "Book your first class", text: "Join a group class or book a private session for one-on-one guidance." },
        { name: "Arrive and practise", text: "Wear comfortable clothing. Mats and props are provided. Arrive 10 minutes early." },
        { name: "Develop consistency", text: "Even one class per week creates meaningful change. Build from there as your practice grows." },
      ],
    },
    relatedPages: [
      { label: "Breathwork in Lisbon", href: "/lisbon/breathwork" },
      { label: "Yoga Nidra in Lisbon", href: "/lisbon/yoga-nidra" },
      { label: "Wellness Retreats Portugal", href: "/portugal/wellness-retreats" },
    ],
    cta: { label: "Find Your Yoga Style", href: "/questionnaires/yoga" },
  },
  {
    location: "Lisbon",
    locationSlug: "lisbon",
    service: "Somatic Therapy",
    serviceSlug: "somatic-therapy",
    headline: "Somatic Therapy in Lisbon",
    metaTitle: "Somatic Therapy in Lisbon — Body-Centred Healing | Niamh Padma",
    metaDescription: "Somatic therapy in Lisbon with Niamh Padma. Body-centred healing for trauma, chronic tension, and nervous system regulation. Private sessions available.",
    intro: [
      "Your body holds wisdom that your mind alone can't access. Somatic therapy works with this body intelligence to release stored tension, process unresolved emotions, and restore your nervous system to a state of balance.",
      "Based in Lisbon, I offer private somatic therapy sessions that combine gentle movement, breath awareness, and guided body sensing. This work is particularly effective for people carrying chronic stress, burnout, or the effects of past trauma.",
    ],
    benefits: [
      "Release chronic tension and holding patterns",
      "Process unresolved emotions stored in the body",
      "Regulate your nervous system",
      "Develop greater body awareness and presence",
      "Build resilience and inner resources",
    ],
    whatToExpect: [
      "A confidential, trauma-informed environment",
      "Gentle, guided exploration of bodily sensations",
      "No pressure to share your story — we follow the body",
      "Practical tools you can use between sessions",
      "Sessions paced to your comfort and capacity",
    ],
    faq: [
      { question: "What happens in a somatic therapy session?", answer: "We begin by checking in with how your body feels right now. Through gentle guidance, we notice areas of tension, sensation, or emotion, and work with what arises. There's no physical manipulation — it's a collaborative, consent-based process." },
      { question: "Is somatic therapy the same as massage?", answer: "No. Somatic therapy works with your nervous system and emotional body, not just muscles. While some techniques involve gentle touch, the primary tool is awareness and guided sensing." },
      { question: "Do I need to talk about my trauma?", answer: "No. Somatic therapy doesn't require you to narrate your experiences. We work with what your body is holding, not the story. Many people find this approach feels safer than traditional talk therapy." },
      { question: "How many sessions will I need?", answer: "This varies greatly. Some people experience significant shifts in 3-5 sessions. Others benefit from longer-term work. We'll discuss this after your initial session." },
    ],
    relatedPages: [
      { label: "Breathwork in Lisbon", href: "/lisbon/breathwork" },
      { label: "Yoga in Lisbon", href: "/lisbon/yoga" },
      { label: "Holistic Nutrition Lisbon", href: "/lisbon/nutrition-coaching" },
    ],
    cta: { label: "Start Your Healing Journey", href: "/questionnaires/somatic" },
  },
  {
    location: "Lisbon",
    locationSlug: "lisbon",
    service: "Yoga Nidra",
    serviceSlug: "yoga-nidra",
    headline: "Yoga Nidra in Lisbon",
    metaTitle: "Yoga Nidra in Lisbon — Guided Relaxation & Yogic Sleep | Niamh Padma",
    metaDescription: "Yoga Nidra classes in Lisbon for deep relaxation and better sleep. Experience yogic sleep with Niamh Padma. Group and private sessions available.",
    intro: [
      "Yoga Nidra — yogic sleep — is one of the most accessible and profoundly restorative practices available. You lie down, close your eyes, and are guided through a systematic relaxation that takes you to the edge of sleep while remaining conscious.",
      "In our overstimulated world, quality rest has become rare. My Yoga Nidra sessions in Lisbon offer a sanctuary for your nervous system. One 30-minute session provides rest equivalent to several hours of conventional sleep.",
    ],
    benefits: [
      "Deep nervous system restoration",
      "Improved sleep quality and duration",
      "Reduced anxiety and mental chatter",
      "No physical effort required — accessible to everyone",
      "Cumulative benefits with regular practice",
    ],
    whatToExpect: [
      "You lie comfortably on a mat with blankets and props",
      "A guided journey through body scanning, breath awareness, and visualisation",
      "Sessions last 45-60 minutes",
      "You may fall asleep — that's perfectly fine",
      "Most people leave feeling deeply rested and clear-headed",
    ],
    faq: [
      { question: "What if I fall asleep during Yoga Nidra?", answer: "That's completely normal and welcome. Your subconscious mind continues to receive the benefits even while you sleep. Over time, you'll learn to hover in the sweet spot between waking and sleeping." },
      { question: "Is Yoga Nidra suitable for beginners?", answer: "Yoga Nidra is perfect for beginners — there are no poses, no flexibility required. You simply lie down and listen. It's the most accessible yoga practice there is." },
      { question: "How often should I practise Yoga Nidra?", answer: "Even once a week can make a significant difference to your sleep and stress levels. Daily practice yields the deepest results. I also provide audio recordings for home practice." },
      { question: "Can Yoga Nidra help with insomnia?", answer: "Yes. Research shows Yoga Nidra reduces the time it takes to fall asleep and improves sleep quality. Many of my clients in Lisbon started specifically for sleep issues." },
    ],
    relatedPages: [
      { label: "Yoga Classes in Lisbon", href: "/lisbon/yoga" },
      { label: "Breathwork in Lisbon", href: "/lisbon/breathwork" },
      { label: "Somatic Therapy in Lisbon", href: "/lisbon/somatic-therapy" },
    ],
    cta: { label: "Book a Yoga Nidra Session", href: "/questionnaires/yoga" },
  },
  {
    location: "Lisbon",
    locationSlug: "lisbon",
    service: "Yin Yoga",
    serviceSlug: "yin-yoga",
    headline: "Yin Yoga in Lisbon",
    metaTitle: "Yin Yoga in Lisbon — Deep Stretching & Relaxation | Niamh Padma",
    metaDescription: "Yin Yoga classes in Lisbon for deep flexibility and stress relief. Slow, meditative practice holding poses 3-5 minutes. All levels welcome with Niamh Padma.",
    intro: [
      "Yin Yoga is the art of slowing down. In a world that constantly demands more, Yin asks you to do less — to hold, to soften, to surrender. Poses are held for 3-5 minutes, targeting the deep connective tissues and fascia that dynamic practices don't reach.",
      "My Yin Yoga classes in Lisbon are a meditative experience. With long holds, supported props, and gentle music, each session becomes a moving meditation that leaves you feeling both deeply stretched and profoundly calm.",
    ],
    benefits: [
      "Increase deep flexibility in hips, spine, and shoulders",
      "Release fascial tension and chronic stiffness",
      "Calm the nervous system and reduce cortisol",
      "Complement dynamic exercise with passive recovery",
      "Develop patience, presence, and surrender",
    ],
    whatToExpect: [
      "Slow-paced class with 6-8 poses held for 3-5 minutes each",
      "Plenty of props for comfort — bolsters, blocks, blankets",
      "Soft lighting and calming atmosphere",
      "Gentle guidance to find your edge without pushing",
      "Suitable for all levels including complete beginners",
    ],
    faq: [
      { question: "Do I need to be flexible for Yin Yoga?", answer: "Not at all. Yin Yoga meets you where you are. We use props extensively so every pose is accessible regardless of your flexibility. Over time, your range naturally increases." },
      { question: "How is Yin different from Restorative Yoga?", answer: "Yin targets connective tissue through moderate stress (a comfortable stretch). Restorative uses full support so there's zero stretch — it's purely about rest. Both are valuable; they serve different purposes." },
      { question: "When should I practise Yin Yoga?", answer: "Evening is ideal as it activates the parasympathetic nervous system and prepares you for sleep. However, Yin is beneficial at any time. Many people enjoy it as a weekend practice." },
      { question: "Can I combine Yin with other practices?", answer: "Absolutely. Yin pairs beautifully with Vinyasa (balance of effort and ease), breathwork, and somatic practices. Many of my clients practise both dynamic and Yin styles." },
    ],
    relatedPages: [
      { label: "Yoga Classes in Lisbon", href: "/lisbon/yoga" },
      { label: "Yoga Nidra in Lisbon", href: "/lisbon/yoga-nidra" },
      { label: "Somatic Therapy in Lisbon", href: "/lisbon/somatic-therapy" },
    ],
    cta: { label: "Find Your Yoga Style", href: "/questionnaires/yoga" },
  },
  {
    location: "Lisbon",
    locationSlug: "lisbon",
    service: "Nutrition Coaching",
    serviceSlug: "nutrition-coaching",
    headline: "Holistic Nutrition Coaching in Lisbon",
    metaTitle: "Holistic Nutrition Coaching in Lisbon | Niamh Padma",
    metaDescription: "Holistic nutrition coaching in Lisbon with Niamh Padma. Personalised guidance for energy, gut health, and mindful eating. In-person and online sessions.",
    intro: [
      "Nutrition is a foundational pillar of wellness, yet modern diet culture has made eating feel complicated and stressful. Holistic nutrition takes a different approach — nourishing your whole self, not just hitting macros.",
      "My nutrition coaching in Lisbon combines evidence-based guidance with intuitive eating principles. We'll work together to build a way of eating that supports your energy, digestion, mood, and overall vitality — without restriction or rigidity.",
    ],
    benefits: [
      "Personalised nutrition guidance for your unique body",
      "Improved energy, digestion, and mental clarity",
      "Heal your relationship with food",
      "Practical meal planning that fits your lifestyle",
      "Integration with yoga and breathwork practices",
    ],
    whatToExpect: [
      "An initial assessment of your current eating patterns and health goals",
      "A personalised nutrition framework (not a rigid meal plan)",
      "Ongoing support and adjustments",
      "Education on whole foods, gut health, and mindful eating",
      "Sessions in-person in Lisbon or online",
    ],
    faq: [
      { question: "Do you prescribe specific diets?", answer: "No. I don't believe in one-size-fits-all diets. We'll explore what works for your body, preferences, and lifestyle. The goal is a sustainable, enjoyable way of eating — not a temporary diet." },
      { question: "Can nutrition coaching help with gut issues?", answer: "Yes. Many digestive issues improve significantly with dietary adjustments, stress reduction, and mindful eating practices. For clinical conditions, I'll work alongside your healthcare provider." },
      { question: "How long is a nutrition coaching programme?", answer: "Most clients see meaningful changes within 6-8 weeks. I offer single sessions, 4-week programmes, and 3-month transformational packages." },
      { question: "Do I need to be in Lisbon?", answer: "No — nutrition coaching works beautifully online. Many of my clients are remote. In-person sessions are available for those based in Lisbon." },
    ],
    relatedPages: [
      { label: "Yoga in Lisbon", href: "/lisbon/yoga" },
      { label: "Breathwork in Lisbon", href: "/lisbon/breathwork" },
      { label: "Wellness Retreats Portugal", href: "/portugal/wellness-retreats" },
    ],
    cta: { label: "Start Your Nutrition Journey", href: "/questionnaires/coaching" },
  },
  {
    location: "Lisbon",
    locationSlug: "lisbon",
    service: "Corporate Wellness",
    serviceSlug: "corporate-wellness",
    headline: "Corporate Wellness in Lisbon",
    metaTitle: "Corporate Wellness Lisbon — Workplace Yoga & Breathwork | Niamh Padma",
    metaDescription: "Corporate wellness programmes in Lisbon: office yoga, breathwork workshops, meditation, and wellness days for teams. Tailored by Niamh Padma.",
    intro: [
      "Employee wellbeing directly impacts productivity, creativity, and retention. Yet most corporate wellness programmes feel generic and uninspiring. I design bespoke wellness experiences that teams actually look forward to.",
      "Based in Lisbon, I work with companies of all sizes to bring yoga, breathwork, meditation, and nutrition education into the workplace — whether that's a weekly lunch-hour class, a monthly workshop, or a full team wellness day.",
    ],
    benefits: [
      "Reduce workplace stress and burnout",
      "Improve team cohesion and morale",
      "Boost focus, creativity, and productivity",
      "Demonstrate genuine investment in employee wellbeing",
      "Flexible formats: on-site, online, or offsite",
    ],
    whatToExpect: [
      "A consultation to understand your team's needs and culture",
      "A tailored programme proposal with pricing",
      "Professional facilitation with all equipment provided",
      "Feedback collection and programme adjustments",
      "Options from single sessions to ongoing programmes",
    ],
    faq: [
      { question: "What size teams do you work with?", answer: "I work with teams from 5 to 100+ people. Sessions can be adapted for any group size, with larger groups benefiting from assistant facilitators." },
      { question: "What does a typical corporate session look like?", answer: "A popular format is a 45-minute lunch-hour session combining gentle yoga or breathwork with a 5-minute guided relaxation. No special clothing or equipment needed — just chairs and willingness." },
      { question: "Can you do this at our office?", answer: "Yes. I bring everything needed — mats, props, music. All I need is a quiet room. I also offer sessions at external venues and online for distributed teams." },
      { question: "How much does corporate wellness cost?", answer: "Pricing depends on session frequency, team size, and format. A single 60-minute session starts from €200. Monthly packages and annual programmes offer better value. Request a proposal for custom pricing." },
    ],
    relatedPages: [
      { label: "Breathwork in Lisbon", href: "/lisbon/breathwork" },
      { label: "Yoga in Lisbon", href: "/lisbon/yoga" },
    ],
    cta: { label: "Request a Proposal", href: "/questionnaires/corporate" },
  },
  {
    location: "Lisbon",
    locationSlug: "lisbon",
    service: "Wellness Coach",
    serviceSlug: "wellness-coach",
    headline: "Wellness Coach in Lisbon",
    metaTitle: "Wellness Coach in Lisbon — Holistic Coaching | Niamh Padma",
    metaDescription: "Holistic wellness coaching in Lisbon combining yoga, breathwork, somatic therapy and nutrition. Personalised 1-1 sessions with Niamh Padma. Book a free call.",
    intro: [
      "A wellness coach is someone who walks beside you on your journey — not telling you what to do, but helping you discover what your body and soul already know. My approach integrates yoga, breathwork, somatic practices, and holistic nutrition into a unified path of transformation.",
      "Based in Lisbon, I offer private coaching sessions both in-person and online. Every programme is designed around your unique needs, goals, and pace. Whether you're navigating burnout, seeking deeper self-connection, or ready for a complete lifestyle shift, coaching provides the structure and accountability to make lasting change.",
    ],
    benefits: [
      "A holistic approach addressing body, mind, and spirit",
      "Personalised practices you can integrate into daily life",
      "Accountability and support between sessions",
      "Drawing from 6+ modalities for a unique programme",
      "Flexible scheduling — in-person or online",
    ],
    whatToExpect: [
      "A free 15-minute discovery call to explore fit",
      "Sessions tailored to your current needs and capacity",
      "A blend of movement, breathwork, and conversation",
      "Between-session practices and resources",
      "Regular check-ins and programme evolution",
    ],
    faq: [
      { question: "How is wellness coaching different from therapy?", answer: "Coaching is forward-focused — we work on where you want to go rather than processing the past. While somatic elements may surface emotions, I'm not a licensed therapist. For clinical mental health needs, I'll refer you to trusted professionals." },
      { question: "How long are coaching programmes?", answer: "I offer single sessions, 4-week starter programmes, and 3-month deep-dive packages. Most transformational change happens in the 3-month format with weekly sessions." },
      { question: "Do I need to be in Lisbon?", answer: "No. Many of my coaching clients are remote. Online sessions via Zoom are just as effective. In-person sessions are available for Lisbon-based clients." },
      { question: "What results can I expect?", answer: "Clients typically report reduced stress, better sleep, increased energy, greater emotional resilience, and a clearer sense of direction. The specific outcomes depend on your goals and commitment." },
    ],
    relatedPages: [
      { label: "Breathwork in Lisbon", href: "/lisbon/breathwork" },
      { label: "Yoga in Lisbon", href: "/lisbon/yoga" },
      { label: "Somatic Therapy in Lisbon", href: "/lisbon/somatic-therapy" },
    ],
    cta: { label: "Book a Free Discovery Call", href: "/questionnaires/coaching" },
  },
  {
    location: "Portugal",
    locationSlug: "portugal",
    service: "Wellness Retreats",
    serviceSlug: "wellness-retreats",
    headline: "Wellness Retreats in Portugal",
    metaTitle: "Wellness Retreats in Portugal — Yoga, Breathwork & Healing | Niamh Padma",
    metaDescription: "Wellness retreats in Portugal combining yoga, breathwork, somatic healing, and plant-based nutrition. Multi-day immersions in Sintra, Algarve, and beyond.",
    intro: [
      "Portugal offers some of Europe's most magical settings for retreat experiences — from the mystical forests of Sintra to the golden coastline of the Algarve. My retreats combine this natural beauty with deep, transformative inner work.",
      "Each retreat is thoughtfully designed as a full immersion: morning breathwork and movement, afternoon integration and nature connection, evening sound healing and yoga nidra. With limited numbers (12-16 participants), every retreat offers intimate, personalised guidance.",
    ],
    benefits: [
      "Complete immersion away from daily distractions",
      "Multiple modalities woven into a cohesive experience",
      "Beautiful venues in Portugal's most inspiring locations",
      "Plant-based nourishment prepared with love",
      "Deep community connection with like-minded souls",
      "Integration support after the retreat ends",
    ],
    whatToExpect: [
      "3-5 day immersive programmes",
      "All meals, accommodation, and sessions included",
      "A blend of yoga, breathwork, somatic work, and free time",
      "Nature excursions and cultural experiences",
      "Small groups for personalised attention",
      "Post-retreat integration resources",
    ],
    faq: [
      { question: "Where are your retreats held?", answer: "Primarily in Sintra (near Lisbon) and the Algarve coast. I also host retreats in other European locations. Each venue is carefully selected for its natural beauty, tranquillity, and quality of accommodation." },
      { question: "What's included in the retreat price?", answer: "All accommodation, plant-based meals, sessions, workshops, materials, and local excursions. Airport transfers from Lisbon are included for Sintra retreats. Flights are not included." },
      { question: "Do I need experience to join a retreat?", answer: "No prior experience is necessary. Retreats welcome all levels. The pace is gentle and there's always space to rest or opt out of any session. You'll be supported exactly where you are." },
      { question: "Are retreats suitable for solo travellers?", answer: "Absolutely. Many participants come alone and leave with deep friendships. Shared and private room options are available. Solo travellers make up about 60% of retreat participants." },
    ],
    howTo: {
      name: "How to Join a Wellness Retreat in Portugal",
      steps: [
        { name: "Check upcoming retreats", text: "Browse the events page for upcoming retreat dates, locations, and pricing." },
        { name: "Secure your spot", text: "Retreats fill quickly. Reserve your place with a deposit. Payment plans are available." },
        { name: "Prepare for your journey", text: "You'll receive a welcome guide with packing suggestions, travel details, and pre-retreat practices." },
        { name: "Arrive and surrender", text: "All you need to bring is yourself. Everything else — the space, the food, the guidance — is taken care of." },
      ],
    },
    relatedPages: [
      { label: "Breathwork in Lisbon", href: "/lisbon/breathwork" },
      { label: "Yoga in Lisbon", href: "/lisbon/yoga" },
      { label: "Events & Retreats", href: "/events" },
    ],
    cta: { label: "View Upcoming Retreats", href: "/events" },
  },
  {
    location: "Portugal",
    locationSlug: "portugal",
    service: "Yoga Retreats",
    serviceSlug: "yoga-retreats",
    headline: "Yoga Retreats in Portugal",
    metaTitle: "Yoga Retreats in Portugal — Immersive Experiences | Niamh Padma",
    metaDescription: "Yoga retreats in Portugal with Niamh Padma. Multi-day immersions combining Hatha, Vinyasa, Yin, and Yoga Nidra in stunning locations. All levels welcome.",
    intro: [
      "Portugal's natural beauty creates the perfect backdrop for a yoga retreat. Imagine practising sun salutations overlooking the Atlantic, deepening into yin poses beneath cork oak trees, or drifting into yoga nidra to the sound of waves.",
      "My yoga retreats in Portugal go beyond the mat. Each retreat integrates multiple yoga styles with breathwork, meditation, plant-based cuisine, and nature immersion for a truly holistic experience. With 100+ coaching hours and retreats across Europe, I create spaces where transformation happens naturally.",
    ],
    benefits: [
      "Deepen your practice without daily-life distractions",
      "Experience multiple yoga styles in one retreat",
      "Connect with nature in Portugal's most beautiful settings",
      "Nourishing plant-based meals included",
      "Return home with a sustainable personal practice",
    ],
    whatToExpect: [
      "Daily yoga sessions across multiple styles",
      "Morning energising practices and evening restorative sessions",
      "Free time for nature walks, swimming, or journaling",
      "Thoughtfully prepared plant-based meals",
      "Small group size (12-16) for personalised guidance",
    ],
    faq: [
      { question: "What level of yoga do I need?", answer: "All levels are warmly welcome. Sessions offer modifications for beginners and variations for advanced practitioners. The retreat environment is supportive and non-competitive." },
      { question: "What styles of yoga are included?", answer: "A typical retreat includes morning Vinyasa or Hatha, afternoon Yin or Restorative, and evening Yoga Nidra. The exact programme varies by retreat." },
      { question: "When are the next yoga retreats?", answer: "I run 3-4 retreats per year, typically in spring and autumn when Portugal's weather is ideal. Check the events page for upcoming dates." },
      { question: "Can I extend my stay in Portugal?", answer: "Of course! Many participants add days before or after the retreat to explore Lisbon, Sintra, or the coast. I'm happy to share recommendations." },
    ],
    relatedPages: [
      { label: "Wellness Retreats Portugal", href: "/portugal/wellness-retreats" },
      { label: "Yoga Classes in Lisbon", href: "/lisbon/yoga" },
      { label: "Events & Retreats", href: "/events" },
    ],
    cta: { label: "View Upcoming Retreats", href: "/events" },
  },
  {
    location: "Lisbon",
    locationSlug: "lisbon",
    service: "Holistic Healing",
    serviceSlug: "holistic-healing",
    headline: "Holistic Healing in Lisbon",
    metaTitle: "Holistic Healing in Lisbon — Integrated Wellness | Niamh Padma",
    metaDescription: "Holistic healing in Lisbon combining yoga, breathwork, somatic therapy, Reiki, and nutrition. An integrated approach to wellness with Niamh Padma.",
    intro: [
      "Holistic healing recognises that you are not a collection of symptoms to be treated — you are a whole person. Mind, body, breath, and spirit are interconnected, and true healing happens when we address all dimensions together.",
      "My practice in Lisbon brings together yoga, breathwork, somatic therapy, Reiki, and holistic nutrition into an integrated healing approach. Rather than offering isolated treatments, I help you build a complete wellness ecosystem tailored to your life.",
    ],
    benefits: [
      "Address root causes, not just symptoms",
      "An integrated approach across multiple modalities",
      "Personalised healing programmes",
      "Support for physical, emotional, and energetic wellbeing",
      "Develop self-healing tools for long-term autonomy",
    ],
    whatToExpect: [
      "An initial holistic assessment covering all aspects of your wellbeing",
      "A personalised programme drawing from multiple modalities",
      "Sessions that may blend yoga, breathwork, somatic work, and energy healing",
      "Nutritional guidance to support your healing journey",
      "Regular reassessment and programme evolution",
    ],
    faq: [
      { question: "What is holistic healing?", answer: "Holistic healing is an approach that treats the whole person — physical, emotional, mental, and spiritual — rather than focusing on isolated symptoms. It integrates multiple practices and traditions to support your body's natural healing capacity." },
      { question: "How do you decide which modalities to use?", answer: "During our initial session, we'll explore what your body and being need most. Some people benefit from starting with breathwork for nervous system regulation. Others need gentle somatic work first. We follow your body's wisdom." },
      { question: "Is holistic healing a replacement for medical treatment?", answer: "No. Holistic healing complements conventional medicine. I always encourage clients to continue working with their healthcare providers. My role is to support the dimensions of wellbeing that medical treatment may not address." },
      { question: "How long before I see results?", answer: "Many people feel shifts after their very first session. Lasting transformation typically unfolds over 6-12 weeks of regular practice. Healing is not linear — we honour your unique pace." },
    ],
    relatedPages: [
      { label: "Somatic Therapy in Lisbon", href: "/lisbon/somatic-therapy" },
      { label: "Breathwork in Lisbon", href: "/lisbon/breathwork" },
      { label: "Nutrition Coaching Lisbon", href: "/lisbon/nutrition-coaching" },
    ],
    cta: { label: "Begin Your Healing Journey", href: "/questionnaires/coaching" },
  },
  {
    location: "Portugal",
    locationSlug: "portugal",
    service: "Breathwork Retreats",
    serviceSlug: "breathwork-retreats",
    headline: "Breathwork Retreats in Portugal",
    metaTitle: "Breathwork Retreats in Portugal — Immersive Experiences | Niamh Padma",
    metaDescription: "Breathwork retreats in Portugal with Niamh Padma. Multi-day immersions combining conscious breathing, somatic release, and deep rest in stunning locations.",
    intro: [
      "A breathwork retreat is an opportunity to go deeper than any single session allows. Over multiple days, with the support of a dedicated container, you can access profound states of release, clarity, and transformation that simply aren't possible in a one-hour class.",
      "My breathwork retreats in Portugal combine multiple breathing modalities — from gentle regulation techniques to powerful conscious connected breathing — with somatic practices, sound healing, nature immersion, and plant-based nutrition. Each retreat is held in carefully chosen venues that support deep inner work.",
    ],
    benefits: [
      "Go deeper than drop-in classes allow",
      "Experience multiple breathwork modalities",
      "Supported emotional and energetic release",
      "Integration through movement, nature, and rest",
      "Small groups for safety and personalised guidance",
      "Post-retreat integration support",
    ],
    whatToExpect: [
      "3-4 day immersive programmes",
      "2-3 breathwork sessions daily (varying intensity)",
      "Complementary practices: yoga, somatic work, sound healing",
      "All meals and accommodation included",
      "Free time for nature, journaling, and integration",
      "Group sharing circles and 1-1 check-ins",
    ],
    faq: [
      { question: "Is a breathwork retreat safe for beginners?", answer: "Yes, with important caveats. I screen all participants for contraindications. Sessions are graduated in intensity — we start gently and build. You're always in control and can modify or pause at any time." },
      { question: "What if I have a strong emotional release?", answer: "This is normal and supported. I'm trained in trauma-informed facilitation. Assistant facilitators are present during group sessions. Integration time is built into the schedule. You won't be left alone with difficult experiences." },
      { question: "What should I bring?", answer: "Comfortable clothing, a journal, and an open mind. All equipment, materials, bedding, and meals are provided. A detailed packing list is sent upon booking." },
      { question: "How do I know if I'm ready for a retreat?", answer: "If you feel called to it, you're ready. Take the breathwork questionnaire and I'll personally assess whether a retreat is the right next step or if we should start with private sessions first." },
    ],
    howTo: {
      name: "How to Prepare for a Breathwork Retreat",
      steps: [
        { name: "Apply and book", text: "Complete the breathwork questionnaire and I'll confirm your suitability. Secure your spot with a deposit." },
        { name: "Prepare your body", text: "In the weeks before, reduce caffeine and alcohol. Start a simple daily breathing practice using the resources I'll send." },
        { name: "Prepare your mind", text: "Set an intention for the retreat. Begin journaling about what you'd like to explore, release, or cultivate." },
        { name: "Arrive with openness", text: "Leave expectations at the door. The breath will show you exactly what you need. Trust the process." },
      ],
    },
    relatedPages: [
      { label: "Breathwork in Lisbon", href: "/lisbon/breathwork" },
      { label: "Wellness Retreats Portugal", href: "/portugal/wellness-retreats" },
      { label: "Events & Retreats", href: "/events" },
    ],
    cta: { label: "Apply for the Next Retreat", href: "/questionnaires/breathwork" },
  },
];

export function getLocationPage(locationSlug: string, serviceSlug: string) {
  return locationPages.find(
    (p) => p.locationSlug === locationSlug && p.serviceSlug === serviceSlug
  );
}

export function getAllLocationParams() {
  return locationPages.map((p) => ({
    location: p.locationSlug,
    service: p.serviceSlug,
  }));
}
