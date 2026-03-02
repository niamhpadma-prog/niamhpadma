import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { BlogCard } from "@/components/cards/BlogCard";
import { JsonLd } from "@/components/seo/JsonLd";

const postImages: Record<string, { src: string; alt: string; orientation?: "vertical" | "landscape" }> = {
  "making-yoga-a-practice-of-self-compassion": { src: "/images/yoga-practice.jpg", alt: "Yoga practice", orientation: "vertical" },
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
  "turn-on": {
    title: "Turn On.",
    excerpt: "Yesterday, laid amongst the beating bodies of my dearest friends, clutching one's finger tip and tracing my nail on one's knee, I suddenly realised.",
    categories: ["Poems"],
    publishedAt: "2025-02-28T10:00:00Z",
    readingTime: 2,
    body: `Yesterday, laid amongst the beating bodies of my dearest friends, clutching one's finger tip and tracing my nail on one's knee, I suddenly realised. A thread of thought weaved its way through my mind. & in that moment nothing else mattered.

'I am so turned on by life!'

This thought arrived in my mind, and left just as quickly. I blurted it out as I couldn't wait to share it.

Turned on by the sun setting over the ocean. Turned on by the sound of laughter filling a room. Turned on by the feeling of bare feet on warm earth. Turned on by the taste of fresh fruit picked from a tree. Turned on by the depth of a conversation that makes time disappear.

What turns you on about life?`,
    relatedSlugs: ["what-if", "poems-for-shavasanah"],
  },
  "what-if": {
    title: "What If..",
    excerpt: "A philosophical meditation on time and presence, posing hypothetical scenarios about what would happen if seconds lasted longer.",
    categories: ["Poems"],
    publishedAt: "2024-03-22T10:00:00Z",
    readingTime: 2,
    body: `What if just for today. Seconds lasted for an eternity.

What if we could focus on each individual moment as it passed. Really focus. Not the next one. Not the one before. But THIS one.

What if we noticed the way the light changes as the sun moves across the sky. The way a stranger's face softens when they smile. The way our breath feels entering our body — warm, alive, ours.

What if seconds didn't disappear before we had the chance to acknowledge them. What if we stopped chasing the next moment and simply arrived in this one.

What if that was enough.`,
    relatedSlugs: ["turn-on", "words"],
  },
  "poems-for-shavasanah": {
    title: "Poems for Shavasanah",
    excerpt: "I wrote these poems from a heart centred space in which I am completely vulnerable. It is only with vulnerability one can share poems.",
    categories: ["Poems"],
    publishedAt: "2024-02-11T10:00:00Z",
    readingTime: 3,
    body: `I wrote these poems from a heart centred space in which I am completely vulnerable. It is only with vulnerability one can share poems and I respect any human being for sharing their deepest thoughts and words with the world in such a way. Poetry is a beautiful way to share thoughts with the world.

During a yoga class, students are especially open to taking in these words and embodying them into their own practice and life. In order to really understand a poem, I think it is important to listen openly.

These poems are written for the final resting pose — shavasanah — the moment where the body is still and the mind is soft. They are an invitation to let go, to receive, and to remember what you already know deep within.

May they find you in the quiet moments when you need them most.`,
    relatedSlugs: ["poems-and-inspiration-from-the-heart", "what-if"],
  },
  "awaken-your-senses-ireland-retreat": {
    title: "Awaken Your Senses — Ireland Retreat",
    excerpt: "Mornings of movement to connect to the physical body. Afternoons of workshops to delve deeper into the mental body.",
    categories: ["Retreats"],
    publishedAt: "2023-08-24T10:00:00Z",
    readingTime: 3,
    body: `Mornings of movement to connect to the physical body. Afternoons of workshops to delve deeper into the mental body. Evenings of feasting, sharing stories and dancing at the fire to connect to the spiritual body.

AWAKEN YOUR SENSES was about more than just a holistic retreat in the countryside of Ireland. Our intention behind this retreat was to show what the body, mind and soul is capable of when we tune into the present moment. When we really SEE, SMELL, LISTEN, TASTE and FEEL. To uncover what can be discovered when we awaken all of our senses.

The retreat brought together a beautiful group of humans, each on their own unique journey but all united by a desire to slow down, reconnect, and remember what it feels like to be fully alive.

We practiced yoga as the morning mist rose over the fields. We dove deep into breathwork sessions that left us shaking, crying, laughing. We shared meals made with love from the land around us. And in the evenings, we gathered around the fire and let the stories flow.

This is what wellness looks like when it's lived, not just studied.`,
    relatedSlugs: ["awaken-your-senses-retreat-loving"],
  },
  "awaken-your-senses-retreat-loving": {
    title: "Awaken Your Senses — Argentina Retreat",
    excerpt: "Life is feeling flowier than a waterfall. There are moments in my days where I feel like I am observing myself flowing through life.",
    categories: ["Retreats"],
    publishedAt: "2023-08-24T10:00:00Z",
    readingTime: 2,
    body: `Life is feeling flowier than a waterfall. Could you say a waterfall is flowy? What's flowier than a waterfall? Not sure but you get what I'm trying to say.

There are moments in my days where I feel like I am observing myself flowing through life. Moments that should be difficult & cause stress I just smile & bless the situation with love. Each section of life fitting perfectly together like a jigsaw piece.

Sometimes I feel like my direction is so powerful that it just does the driving for me & I'm just along for the ride observing all the magic unfold.

Argentina taught me about surrender. About trusting the flow of life even when the current gets rough. About finding beauty in the unknown and comfort in discomfort. This retreat was a mirror — reflecting back to each of us the parts of ourselves we'd been too busy to see.`,
    relatedSlugs: ["awaken-your-senses-ireland-retreat"],
  },
  "swapping-alcohol-for-chai-lattes": {
    title: "Swapping Alcohol for Chai Lattes",
    excerpt: "You're travelling home after a festival. You're sticky. Probably from the beer and drinks that were poured over you over the weekend.",
    categories: ["Wellness"],
    publishedAt: "2023-07-25T10:00:00Z",
    readingTime: 3,
    body: `You're travelling home after a festival. You're sticky. Probably from the beer and drinks that were poured over you over the weekend.

You've lost count of the number of drinks you had. You ate one meal a day if you were lucky. You slept about 3 hours over the course of 3 days. 5 days later you still feel the same as the come down / hangover / lack of food / lack of sleep is still casting its shadows over.

Sound familiar?

I made the decision to stop drinking alcohol — not just at festivals, but in life. And I replaced it with something that brought me just as much joy in social settings: chai lattes.

It wasn't about restriction. It was about choosing how I wanted to feel. Choosing clarity over fog. Choosing presence over numbness. Choosing to wake up the next morning and actually remember the conversations, the laughter, the connections.

The surprising thing? Nothing was lost. The festivals are still fun. The conversations are still deep. The dancing is still wild. If anything, everything became more vivid, more real, more mine.`,
    relatedSlugs: ["food-restrictions", "power-of-morning-routine"],
  },
  "poems-and-inspiration-from-the-heart": {
    title: "Poems and Inspiration from the Heart",
    excerpt: "The author's daily practice of writing poetry that reflects personal introspection and experiences, shared with yoga students as inspiration.",
    categories: ["Poems"],
    publishedAt: "2023-07-14T10:00:00Z",
    readingTime: 2,
    body: `Writing poetry has become a daily practice for me — a way to distill the deepest parts of my inner world into words that can be shared.

These poems are symbolism of my deepest thoughts. They come from morning journaling, from moments of stillness between classes, from the quiet space before sleep when the mind finally softens.

I share them with my yoga students as inspiration during their practice. Poetry helps cultivate creativity and open-ness in the mind through avenues other than yoga asana (the physical practice).

Some are original compositions. Others are poems I've discovered online that resonate with where I am right now — in my practice, my teaching, my life. What matters is not who wrote them, but how they land in your body when you hear them.

I believe that words, when offered with sincerity, have the power to unlock something in the listener that logic alone cannot reach.`,
    relatedSlugs: ["poems-for-shavasanah", "words"],
  },
  "how-to-overcome-fear-of-what-others-think": {
    title: "How to Overcome Fear of What Others Think",
    excerpt: "I've always been pretty expressive with my body when it comes to movement. In a way I find it easier to express how I feel through my body than through my words.",
    categories: ["Mindset"],
    publishedAt: "2023-07-14T10:00:00Z",
    readingTime: 3,
    body: `I've always been pretty expressive with my body when it comes to movement. In a way I find it easier to express how I feel through my body than through my words. In particular through dance. Non verbal communication is the way we express ourselves in the world without speech.

But there was a time when I held myself back. When I dimmed my movement because I was afraid of being seen. Afraid of being judged. Afraid of being "too much."

The fear of what others think is one of the most universal human experiences. It's hardwired — our ancestors needed social acceptance for survival. But in the modern world, this fear often keeps us small, keeps us performing a version of ourselves that feels safe but not true.

Here's what I've learned: the moment you stop performing for others and start expressing for yourself, everything shifts. The energy changes. People feel the authenticity. And the ones who matter? They lean in closer.

Start small. Dance when no one's watching. Then dance when everyone is. Let your body speak the truth your words haven't found yet.`,
    relatedSlugs: ["the-inner-critic", "growing-through-fear"],
  },
  "making-yoga-a-practice-of-self-compassion": {
    title: "Making Yoga a Practice of Self-Compassion",
    excerpt: "I see yoga as a practice of curiosity. Of discovery. Because every time I practice I discover something about myself that I wasn't aware of before.",
    categories: ["Yoga"],
    publishedAt: "2023-07-11T10:00:00Z",
    readingTime: 2,
    body: `I see yoga as a practice of curiosity. Of discovery. Because every time I practice I discover something about myself that I wasn't aware of before. Every. Single. Day.

#internationalYogaDay is a great day to raise awareness of the benefits of yoga, such as building mental & physical strength. But more than that, it's an opportunity to highlight how we can celebrate yoga in the every day.

I don't mean practicing handstands every morning. Although that is fun. I mean showing compassion to yourself.

Yoga isn't about touching your toes. It's about what you learn on the way down. It's about noticing when you're pushing too hard and choosing to soften. It's about catching the moment your inner critic pipes up and responding with kindness instead.

Self-compassion on the mat looks like modifying a pose when your body asks for it. It looks like resting in child's pose while others flow. It looks like celebrating what your body CAN do instead of fixating on what it can't.

And here's the beautiful thing — what you practice on the mat, you carry into life.`,
    relatedSlugs: ["how-to-overcome-fear-of-what-others-think"],
  },
  "why-being-a-chameleon-is-a-superpower": {
    title: "Why Being a Chameleon is a SuperPower",
    excerpt: "According to the National Science Foundation, an average person experiences approximately 60,000 thoughts daily.",
    categories: ["Mindset"],
    publishedAt: "2023-07-11T10:00:00Z",
    readingTime: 4,
    body: `According to the National Science Foundation, an average person experiences approximately 60,000 thoughts daily. Of these, 95% are repetitions from the previous day, and 80% tend toward negativity.

This raises an intriguing question: we underutilize our remarkable cognitive capacity, dedicating only about 5% to developing fresh perspectives, generating novel project ideas, or implementing innovative strategic approaches.

The challenge becomes clear — how do we establish new neural pathways to increase this percentage? How do we break free from habitual thought patterns and embrace adaptability as a strength?

The metaphor of a chameleon proves remarkably apt. Just as these creatures modify their appearance to navigate different environments, humans possess an underestimated superpower: adaptability.

In professional and personal contexts, the capacity to shift perspectives, adjust communication styles, and modify approaches based on circumstances creates incredible advantages. This flexibility enables us to connect authentically with diverse people, solve problems from multiple angles, and navigate change more effectively.

Rather than viewing adaptability as inconsistency or lack of core identity, recognize it as sophisticated emotional and intellectual intelligence. The ability to "read the room," adjust tactics, and remain resilient across varying conditions is what distinguishes exceptional humans.

Developing this chameleon quality requires intentional practice: seeking novel experiences, engaging perspectives different from your own, and deliberately challenging established thought patterns.`,
    relatedSlugs: ["be-the-architect-of-your-brain", "the-inner-critic"],
  },
  "be-the-architect-of-your-brain": {
    title: "Be the Architect of Your Brain",
    excerpt: "The author describes themselves as an architect of their own brain, building new walls and bridges every day.",
    categories: ["Mindset"],
    publishedAt: "2023-06-26T10:00:00Z",
    readingTime: 3,
    body: `I am an architect. But not in the traditional sense. I am an architect of my own brain, building new walls and bridges every day.

When you recognize that you have the power to construct the brain you desire, you move beyond comparative thinking — abandoning notions of "better or worse" in absolute terms.

While circumstances vary between individuals, each person's unique journey matters. Where YOU are right now is exactly where you need to be.

Recent neuroscience research has shown that having a positive perspective on where YOU are & being mindful of how you speak to yourself builds new neural connections and pathways. Your brain is literally reshaping itself based on your thoughts, your habits, your internal dialogue.

So I ask you: what are you building? Are you constructing walls of self-doubt, or bridges toward possibility? Are you reinforcing old patterns that no longer serve you, or laying foundations for the person you're becoming?

Every thought is a brick. Every habit is a blueprint. Every day is an opportunity to build something new.

You are the architect. Start designing.`,
    relatedSlugs: ["why-being-a-chameleon-is-a-superpower", "success-is-an-inside-job"],
  },
  "words": {
    title: "Words",
    excerpt: "The popular saying 'Sticks and stones may break my bones but words will never hurt me' has evolved significantly.",
    categories: ["Poems"],
    publishedAt: "2023-06-18T10:00:00Z",
    readingTime: 3,
    body: `The popular saying "Sticks and stones may break my bones but words will never hurt me" has evolved significantly. We now recognize that words can create lasting trauma affecting both mind and body.

Words carry profound meaning and possess considerable power. They can shift perspectives on situations, uplift spirits, or cause deep wounds if left unaddressed.

The impact extends from childhood messages received from parents to remarks made by past partners — these utterances can leave scars that cut deeply without proper healing.

Words shape our reality. They influence how we perceive ourselves and our circumstances. A single comment can alter someone's entire trajectory or self-image. The language we absorb becomes internalized, affecting our mental landscape for years.

This recognition represents an important cultural shift. Rather than dismissing verbal harm as inconsequential, contemporary understanding acknowledges the neurobiological and psychological damage words inflict. The body remembers harmful language; it becomes encoded in our nervous system.

Healing from word-related trauma requires conscious effort. Recognizing the power of language — both destructive and constructive — allows us to use words more thoughtfully and compassionately, understanding their lasting capacity to wound or restore.

Choose your words wisely. They are more powerful than you know.`,
    relatedSlugs: ["the-inner-critic", "poems-for-shavasanah"],
  },
  "why-eating-at-your-desk-is-illegal-in-france": {
    title: "Why Eating at Your Desk is Illegal in France",
    excerpt: "I know how easy it is to want to be as 'productive' as possible by quickly grabbing lunch and rushing back to your desk.",
    categories: ["Nutrition"],
    publishedAt: "2022-10-19T10:00:00Z",
    readingTime: 3,
    body: `I know how easy it is to want to be as 'productive' as possible by quickly grabbing lunch and rushing back to your desk.

In France, there's actually a labour law that prohibits employees from eating lunch at their desks. While it was relaxed during the pandemic, the principle behind it is powerful: the French understand that how you eat matters just as much as what you eat.

Research shows that desk lunching negatively impacts both physical and psychological well-being. When we eat while distracted — scrolling emails, finishing reports — our body doesn't properly register the meal. We eat faster, chew less, and our digestive system doesn't receive the signals it needs to work optimally.

Rather than boosting productivity, eating while working can harm your health and mental state. Your brain needs a break. Your digestive system needs your attention. Your creativity needs space to breathe.

Try this: for one week, step away from your desk for lunch. Sit somewhere different. Taste your food. Chew slowly. Notice the textures and flavours. See how you feel in the afternoon compared to your usual desk lunch.

Your body — and your work — will thank you.`,
    relatedSlugs: ["eating-for-your-mind", "food-restrictions"],
  },
  "food-restrictions": {
    title: "Food Restrictions..",
    excerpt: "Why should people restrict foods they enjoy simply because external sources dictate what should and shouldn't be consumed?",
    categories: ["Nutrition"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 2,
    body: `Why should we restrict foods we enjoy simply because external sources — media, celebrities, brands, government — dictate what should and shouldn't be consumed?

No one knows your body better than you, right?

The wellness industry is full of rules: don't eat gluten, avoid dairy, cut out sugar, go keto, try carnivore, be vegan. The list changes every year, and it's exhausting.

Here's what I believe: consciously choosing what to eat — whether that's a spinach and broccoli omelette, or a loaded cheesy pizza — allows you to make informed decisions aligned with your own preferences and needs.

The key word is CONSCIOUSLY. When you eat with awareness, you naturally gravitate toward what makes you feel good. And sometimes that's a green smoothie. And sometimes that's chocolate cake. Both are valid.

Food restriction creates stress. Stress impacts digestion. Poor digestion impacts nutrient absorption. And suddenly the "healthy" diet is making you less healthy.

Eat what makes your body feel alive. Listen to its signals. Trust yourself more than any headline.`,
    relatedSlugs: ["eating-for-your-mind", "overnight-fasting"],
  },
  "eating-for-your-mind": {
    title: "Eating for Your Mind..",
    excerpt: "If you are experiencing confusion or disorientation, muscle cramps, weakness, headaches or fatigue it may be time to look at the food on your plate.",
    categories: ["Nutrition"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 2,
    body: `If you are experiencing confusion or disorientation, muscle cramps, weakness, headaches or fatigue it may be time to look at the food on your plate. Are you getting enough electrolytes?

Electrolytes are essential minerals such as sodium, calcium & potassium that help with sleep, immune system function, concentration, digestion, and hydration.

Travelling in tropical and hot countries, I became obsessed with my daily fresh coconut. There is something about picking up a coconut off the floor, opening it and drinking the water straight from the source. It's nature's perfect electrolyte drink.

But you don't need to be on a tropical island to nourish your mind through food. Here are simple ways to boost your electrolytes naturally:

Coconut water, bananas, avocados, leafy greens, sea salt in your water, bone broth, citrus fruits.

Your brain is approximately 75% water. When it's dehydrated, everything suffers — mood, focus, memory, creativity. Before reaching for another coffee, try a glass of water with a pinch of sea salt and a squeeze of lemon.

Feed your mind. It's doing a lot for you.`,
    relatedSlugs: ["food-restrictions", "overnight-fasting"],
  },
  "setting-new-moon-intentions": {
    title: "Setting New Moon Intentions",
    excerpt: "Each new moon is a time for setting new intention(s) for the 4 weeks ahead.",
    categories: ["Wellness"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 2,
    body: `Each new moon is a time for setting new intention(s) for the 4 weeks ahead. This can be how you want to feel, something you want to do, a job you really want to get... anything that feels right for you.

What helps me is looking at my big goals for the year and thinking about small things that I can achieve that help me towards my big goals.

Write these intentions as though they're already happening. Say them aloud.

"I always speak my truth no matter what"

"I attract abundance in all areas of my life"

"I am exactly where I need to be"

The new moon represents new beginnings — a blank page, a fresh start. It's the darkest night of the lunar cycle, and in that darkness lies infinite potential.

Create a ritual around it. Light a candle. Get your journal. Sit in stillness. Ask yourself: what do I want to invite into my life this month? Write it down. Speak it into existence. Then let it go and trust the process.`,
    relatedSlugs: ["power-of-morning-routine", "success-is-an-inside-job"],
  },
  "growing-through-fear": {
    title: "Growing Through Fear..",
    excerpt: "Fear — whether of failure, inadequacy, or change — often prevents people from pursuing meaningful experiences.",
    categories: ["Mindset"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 3,
    body: `"Wow you're so brave travelling by yourself." "Thanks, I am also scared."

This is a conversation I've had many times. People see the courage but rarely the fear that comes with it.

Had I succumbed to fear from others or my own doubts, I would not have embarked on solo travel. I would not have left my comfortable life in England nearly two years ago. I would not have continued journeying when circumstances became challenging.

Fear and courage are not opposites. They are companions. You cannot have courage without first having fear. The brave act is not the absence of fear — it's the decision to move forward despite it.

Every meaningful experience I've had in my life existed on the other side of fear. Moving countries. Teaching my first yoga class. Leading my first retreat. Sharing my poetry with strangers. Starting over. Again and again.

Growth doesn't happen in comfort. It happens in the space between what you know and what you don't. In the trembling hands and racing heart. In the moment you say "yes" before you feel ready.

Grow THROUGH fear. Not around it. Not away from it. Through it.`,
    relatedSlugs: ["the-inner-critic", "how-to-overcome-fear-of-what-others-think"],
  },
  "power-of-morning-routine": {
    title: "Power of Morning Routine",
    excerpt: "When I wake up 'on the wrong side of the bed' there are so many voices in my head telling me 'today's going to be a bad day'.",
    categories: ["Wellness"],
    publishedAt: "2022-10-18T10:00:00Z",
    readingTime: 3,
    body: `When I wake up 'on the wrong side of the bed' in the morning, or I wake up late, or I slept badly, there are so many voices in my head telling me 'today's going to be a bad day'.

Did you know the story we consistently tell ourselves is what our brain believes? So if you tell yourself that it's going to be a bad day just because you had a little less sleep than you would have liked then PROBABLY you're going to be snappier with your boss, have an argument with your partner, miss the bus etc.

But if you wake up and consciously choose a different narrative — even when the circumstances aren't ideal — everything shifts.

My morning routine is non-negotiable. Not because it's complicated, but because it sets the tone. Here's what works for me:

Wake up. Don't look at your phone. Drink water. Move your body — even just 5 minutes of stretching. Breathe intentionally for 2 minutes. Set one intention for the day. Then begin.

The morning is yours. It's the one part of the day that hasn't been claimed by anyone else's agenda. Protect it. Use it to remind yourself who you are and how you want to show up.

Your morning creates your day. Your days create your life.`,
    relatedSlugs: ["success-is-an-inside-job", "setting-new-moon-intentions"],
  },
  "equinox-thoughts": {
    title: "Equinox Thoughts..",
    excerpt: "The equinox happens twice a year — when we enter spring and when we enter autumn.",
    categories: ["Wellness"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 2,
    body: `The equinox happens twice a year — when we enter spring and when we enter autumn. During this astronomical event, the sun crosses the celestial equator meaning day and night are about the same length in hours.

As seasons change, nature, animals, and the planet transform accordingly — and humans do too. Chinese medicine teaches that seasons play an integral role in our lives and overall health.

Living in harmony with natural cycles creates flow and alignment. When we attune ourselves to the universe's natural rhythms, life tends to feel more balanced and purposeful.

Spring equinox invites us to plant seeds — literally and metaphorically. To begin new projects, set fresh intentions, and emerge from the introspection of winter.

Autumn equinox asks us to harvest and release. To celebrate what we've grown and let go of what no longer serves us. To prepare for the quieter, more reflective months ahead.

We are not separate from nature. We ARE nature. When we honour these cycles within ourselves, we stop fighting the current and start flowing with it.

What season are you in right now?`,
    relatedSlugs: ["setting-new-moon-intentions"],
  },
  "appreciating-the-little-things": {
    title: "Appreciating the Little Things..",
    excerpt: "When I stop to appreciate the 'fanciful' in everything life every little thing just fills me up with so much joy.",
    categories: ["Mindset"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 2,
    body: `When I stop to appreciate the 'fanciful' in everything life every little thing just fills me up with so much joy. Even the things that on the surface seem boring, an inconvenience or difficult to some.

Long car journeys, meal prep, washing the dishes, feeding the cat, walking to work, cleaning the house, eating lunch.

In our modern world we have so many distractions that take away from the beautifulness of the leaves on the forest floor or the unusual flavours in the food on our plate.

We scroll through someone else's life while our own unfolds unnoticed. We rush through tasks to get to the "good part" without realizing that THIS is the good part.

The mundane is where life actually happens. Not in the holidays or the milestones or the Instagram moments — but in the quiet, ordinary Tuesday mornings. In the steam rising from your cup. In the sound of rain on the window.

Appreciation isn't something you save for special occasions. It's a muscle you build daily. And the stronger it gets, the richer your life becomes — without anything external needing to change.`,
    relatedSlugs: ["finding-love-in-the-being", "success-is-an-inside-job"],
  },
  "the-inner-critic": {
    title: "The Inner Critic",
    excerpt: "The inner critic is funny, isn't it? I know mine loves to pop its head up far too often.",
    categories: ["Mindset"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 2,
    body: `The inner critic is funny, isn't it? I know mine loves to pop its head up far too often.

That little voice in your head tells you that you're not good enough, that you could never start your own business, that you couldn't move countries because who would you know? That you could never change jobs because what experience do you have in that sector?

I know for me some days that voice is a loud one. It can take over, until I remember who I am and I tell it to shut up because I know it's not true.

The inner critic isn't you. It's a protection mechanism — a part of your psyche that learned long ago to keep you "safe" by keeping you small. It speaks in absolutes: never, always, can't, shouldn't.

But here's the thing: you don't have to believe everything you think. You can hear the critic, acknowledge it, and choose a different response.

Next time it speaks up, try this: "Thank you for trying to protect me. But I've got this."

The voice may never fully disappear. But it can get quieter. And YOUR voice — the one that knows your truth — can get louder.`,
    relatedSlugs: ["how-to-overcome-fear-of-what-others-think", "growing-through-fear"],
  },
  "finding-love-in-the-being": {
    title: "Finding Love in the 'Being'",
    excerpt: "The author reflects on their tendency to romanticize past moments while failing to appreciate the present.",
    categories: ["Mindset"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 3,
    body: `I catch myself doing it all the time — looking back at old photos, reminiscing about earlier times, wishing I could return to those periods.

But upon deeper reflection, I realize something critical: even while physically present in those cherished moments, my mind was often elsewhere. I was anticipating the future, worrying about trivial concerns, or mentally planning what came next — rather than fully inhabiting the actual experience unfolding before me.

We romanticize the past because we strip it of the anxiety we felt at the time. We remember the sunset but forget the argument that happened an hour before. We remember the adventure but forget the homesickness.

This suggests a broader truth about the human condition: we frequently miss the value of our current circumstances by constantly projecting our consciousness into imagined futures or idealized pasts.

What if the moment you're living right now is one you'll look back on with longing in five years? What if THIS is the good old days?

Finding love in the 'being' means arriving fully in your own life. Not the version you're planning or the version you remember — but the one that's happening right now, in this breath, in this body.

That's where the love is. It's always been here.`,
    relatedSlugs: ["appreciating-the-little-things", "what-if"],
  },
  "success-is-an-inside-job": {
    title: "Success is an Inside Job",
    excerpt: "Success is an inside job. It's not what you do on the outside that will ultimately give you your sense of satisfaction.",
    categories: ["Mindset"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 3,
    body: `Success is an inside job. It's not what you do on the outside that will ultimately give you your sense of satisfaction.

While praise from others feels rewarding, the deeper satisfaction comes from personal commitments kept privately. Waking early to witness a sunrise without external obligation — creating a sense of accomplishment through self-discipline. Following through on personal promises to exercise or move your body. Completing work when no one observes your effort.

The small victories achieved in solitude — when accountability exists only to oneself — carry greater weight than public recognition. These private moments of integrity and follow-through build lasting confidence and genuine success.

External success is borrowed validation. It comes and goes with other people's opinions, algorithms, and circumstances beyond your control. Internal success — knowing you honoured your word to yourself — is something no one can take from you.

Start keeping small promises to yourself. Wake when you said you would. Move your body when you committed to. Write when inspiration is absent. Show up for yourself the way you show up for others.

That's where real success lives. Inside.`,
    relatedSlugs: ["be-the-architect-of-your-brain", "power-of-morning-routine"],
  },
  "overnight-fasting": {
    title: "Overnight Fasting..",
    excerpt: "Studies have shown that leaving 12 hours between dinner and breakfast gives your body time to rest and digest food.",
    categories: ["Nutrition"],
    publishedAt: "2022-10-15T10:00:00Z",
    readingTime: 2,
    body: `Studies have shown that leaving 12 hours between dinner and breakfast gives your body time to rest and digest food. This fasted state benefits mood, energy levels, immune system function, and gut microbiome health.

In Western culture, people commonly eat snacks until 10-11 PM, then resume eating at 6-8 AM. Over time, this pattern can be detrimental to health because it doesn't allow adequate digestive rest.

Your digestive system needs downtime — just like you do. When you're constantly feeding it, it never gets to focus on repair, detoxification, and cellular renewal.

Overnight fasting doesn't require any dramatic lifestyle change. It's simply about creating a 12-hour window between your last meal and your first. Finish dinner by 8 PM, have breakfast at 8 AM. That's it.

The benefits compound over time. Better sleep (your body isn't working overtime digesting). More energy in the morning. Improved gut health as beneficial bacteria thrive during fasting periods. Clearer thinking as inflammation decreases.

It's not about restriction — it's about rhythm. Your body has a natural clock, and when you honour it, everything works better.`,
    relatedSlugs: ["eating-for-your-mind", "food-restrictions"],
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

      {/* Cover image */}
      <Container>
        <div className="pt-8 mb-12">
          {postImages[slug] ? (
            <div className={`relative rounded-3xl overflow-hidden ${
              postImages[slug].orientation === "vertical"
                ? "aspect-[3/4] max-w-2xl mx-auto"
                : "aspect-[21/9]"
            }`}>
              <Image
                src={postImages[slug].src}
                alt={postImages[slug].alt}
                fill
                className="object-cover"
                sizes={postImages[slug].orientation === "vertical" ? "(max-width: 768px) 100vw, 672px" : "100vw"}
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
