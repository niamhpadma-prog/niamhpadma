import type { ReactNode } from "react";
import type { BentoService, ServiceCTA } from "@/components/services/ServicesBento";

// "Specific modalities" card on Work With Me, with a pop-out for each modality.

const ENQUIRE_EMAIL = "mailto:hello@somatictherapyinlisbon.com";
const CALENDLY_URL = "https://calendly.com/hello-somatictherapyinlisbon/30min";

const enquireAndConsult: ServiceCTA[] = [
  { label: "Enquire here", href: ENQUIRE_EMAIL, variant: "primary" },
  { label: "Book a 20 minute consultation", href: CALENDLY_URL, variant: "outline" },
];

function H({ children }: { children: ReactNode }) {
  return <h4 className="font-serif text-2xl text-espresso pt-4">{children}</h4>;
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="text-sage mt-0.5 flex-none" aria-hidden>
            {"•"}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const breathwork: BentoService = {
  id: "modality-breathwork",
  category: "1-1 Coaching",
  hideCategory: true,
  title: "Conscious Connected Breathwork",
  image: {
    src: "/images/previous-experiences/experience-09.jpg",
    alt: "Niamh teaching a seated group class",
    position: "object-[center_20%]",
  },
  body: (
    <>
      <p>
        Depending on your group size, sessions range from 90 minutes to 180 minutes. This nourishing experience offers
        space to step out of the noise and connect with your body and breath.
      </p>
      <p>
        Expect an immersive session facilitated with care and sensitivity, honouring your individual needs. This
        experience is open and accessible to all, with options and invitations offered throughout. No previous
        experience with breathwork is needed.
      </p>
      <p>
        The session weaves together brief movement, conscious connected breathwork, deep rest and nourishing food to
        support your nervous system.
      </p>
      <H>What you may experience through guided breathwork</H>
      <List
        items={[
          "clearing of mental fog and overwhelm",
          "gentle awakening of the physical body",
          "reduced stress and nervous system regulation",
          "release of feel good hormones such as endorphins and oxytocin",
          "deep relaxation and improved sleep quality",
          "emotional processing and release, at your own pace",
          "sustained energy without stimulation",
          "healthier breathing patterns in daily life",
          "support for positive thought patterns and subconscious integration",
        ]}
      />
      <p>
        This conscious connected breathwork session is guided through a lens of empowerment. You are always in control
        of your experience, with freedom to rest, modify or opt out at any time. The intention is not to push, but to
        remember the powerful tools you already carry within you.
      </p>
      <H>Session flow</H>
      <p>
        We will begin with a gentle, accessible movement practice to soften tension and bring awareness into the body.
        From here, we will move into a guided breathwork journey, supported by clear cues and plenty of choice.
      </p>
      <p>
        This will be followed by an extended relaxation with immersive binaural soundscapes designed specifically for
        stress relief and deep rest. We usually close the session by sharing nourishing food to support grounding and
        integration.
      </p>
      <H>Important information</H>
      <p>
        I approach conscious connected breathwork from a person-centered approach, however, Breathwork can bring about
        strong physical, emotional and psychological responses. If you live with the below, another modality might be
        for you.
      </p>
      <List
        items={["Had recent surgery.", "Past the second trimester of pregnancy", "Experience regular panic attacks."]}
      />
      <p className="font-medium text-espresso/80">Please talk to me first before booking if:</p>
      <List
        items={[
          "You have a history of trauma or PTSD.",
          "You have any other serious mental health difficulty that may be relevant to your participation.",
        ]}
      />
      <p>After booking, you will receive a short intake form. Please answer as honestly as you can.</p>
    </>
  ),
  ctas: enquireAndConsult,
};

const reiki: BentoService = {
  id: "modality-reiki",
  category: "1-1 Coaching",
  hideCategory: true,
  title: "Reiki",
  image: {
    src: "/images/shoot-2026/niamh-hands-on-heart.jpg",
    alt: "Niamh with her eyes closed and hands resting on her heart",
  },
  body: (
    <>
      <p>
        Reiki is a Japanese holistic healing modality that works to harmonise our entire being; physically, mentally,
        emotionally and spiritually.
      </p>
      <H>Benefits of Reiki include</H>
      <List
        items={[
          "Deep rest and relaxation",
          "Improves sleep quality",
          "Reduces stress and anxiety",
          "Releases physical tension",
          "Releases stagnant emotional energy",
          "Calms the nervous system",
          "Connects you to your intuition",
        ]}
      />
      <p>
        Reiki is very intelligent and knows where to go within you. The calming and healing effects linger long after
        the treatment.
      </p>
      <p>
        Reiki Energy Alignment sessions are a healing blend of calming breathwork, visualization meditation, essential
        oils, gentle sound healing and hands-on Reiki. This method is from the traditional Usui Reiki method using
        various hand positions along the Chakra system and the sacred Reiki symbols to deliver the ancient method of
        healing energy to you. Sessions finish with intuitive coaching, if needed, to guide you to integrate anything
        that came up for you during the session into your daily life. The intention is to create a safe space for you
        to fully rest, receive, calm your nervous system and experience deep inner harmony.
      </p>
      <p>Reiki sessions are also beneficial if you are experiencing physical pain in a particular area of the body.</p>
      <p>After booking, you will receive a short intake form. Please answer as honestly as you can.</p>
    </>
  ),
  ctas: enquireAndConsult,
};

const yoga: BentoService = {
  id: "modality-yoga",
  category: "1-1 Coaching",
  hideCategory: true,
  title: "Yoga",
  image: {
    src: "/images/shoot-2026/niamh-side-stretch.jpg",
    alt: "Niamh in a side stretch",
    position: "object-top",
  },
  body: (
    <>
      <p>
        One of the very first analogies my 200 hour yoga teacher trainer gave me was that of the lotus flower:
      </p>
      <H>The lotus doesn&rsquo;t skip the mud</H>
      <p>
        The lotus starts life as a tiny seed buried in the dark. Before it ever reaches the light, it has to push
        through mud and murky water. Only then does it open into one of the most striking flowers in nature.
      </p>
      <p>
        It&rsquo;s easy to turn that into a neat story about rising above. I think the lotus is saying something more
        honest: the mud isn&rsquo;t the obstacle, it&rsquo;s the soil. The roots stay anchored in it the whole time.
        The flower doesn&rsquo;t escape where it came from. It grows because of it.
      </p>
      <H>Ground first, then grow</H>
      <p>
        The lotus can reach for the light because it&rsquo;s rooted in something stable. Our bodies work the same way.
        When we feel grounded, with weight dropping into the earth and feet and hands meeting the floor, the nervous
        system gets the message that it&rsquo;s safe enough to expand.
      </p>
      <p>
        On the mat, that means building every posture from the ground up. Find your foundation first and the shape can
        come after. In a vinyasa flow, that stability is what lets you move freely. Strength and ease stop competing and
        start supporting each other.
      </p>
      <H>Every practice is a fresh start</H>
      <p>
        Each evening the lotus closes its petals, and each morning it opens again. Its leaves and petals shed water and
        mud so well that it always comes up clean. Scientists actually call this the &ldquo;lotus effect.&rdquo;
      </p>
      <p>
        Every time you roll out your mat, you get to begin again too. Some days the body feels open and willing. Other
        days it&rsquo;s tight, tired, or somewhere else entirely. Neither one is failing. Each practice is just a new
        set of conditions to meet as they are.
      </p>
      <H>What the lotus has meant across traditions</H>
      <p>
        In Buddhism, the mud stands for human suffering, and the lotus for the awakening that grows out of it, not
        around it. The Vietnamese teacher Thích Nhất Hạnh put it simply: no mud, no lotus.
      </p>
      <p>
        In Hindu and yogic traditions, the lotus stands for purity, divinity, abundance, fertility and wisdom. Lakshmi,
        Saraswati, Brahma and many other deities are shown seated on a lotus in full bloom or holding one. Padmasana,
        lotus pose, takes its name from padma, the Sanskrit word for lotus.
      </p>
      <p>
        Across very different cultures, the lotus keeps coming back as a symbol of spiritual growth and of becoming more
        fully who we are.
      </p>
      <H>Water, feeling and flow</H>
      <p>
        The lotus lives surrounded by water, the element of the sacral chakra, Svadhisthana. This is the centre linked
        to emotion, creativity and our ability to move with change.
      </p>
      <p>
        Water reminds us that feelings are meant to move. When it flows, it nourishes. When it&rsquo;s held back or
        overwhelming, it can be powerful and even frightening. The lotus rests on that water without being swept away.
        It doesn&rsquo;t fight the current or pretend it isn&rsquo;t there. It stays rooted, open and present, which is
        pretty much what we&rsquo;re practising too.
      </p>
      <p>
        I am constantly inspired by nature and the elements, and my yoga teachings are rooted in sharing the breadth
        that yoga has to offer. I am a student and always will be a student of yoga and life. I aim to share this in my
        teachings.
      </p>
      <p>
        Individual and group yoga classes in-person or online can be booked on request. Blending asana, pranayama,
        dharana, these yoga classes are an opportunity to explore the 8 limbs of yoga. With a background in traditional
        Hatha yoga and restorative yoga practices such as Yin Yoga, yoganidra and restorative yoga, an individual or
        group yoga lesson combines 6 years of teaching across multiple continents.
      </p>
    </>
  ),
  ctas: [{ label: "Enquire here", href: ENQUIRE_EMAIL, variant: "primary" }],
};

export const modalitiesService: BentoService = {
  id: "specific-modalities",
  category: "1-1 Coaching",
  title: "Specific modalities",
  image: { src: "/images/shoot-2026/niamh-stool-prayer.jpg", alt: "Niamh seated with hands in prayer", position: "object-top" },
  body: (
    <>
      <p>
        Curious about the modalities I draw my somatic coaching work from? After studying various modalities across
        the world, I also offer individual and group sessions on request in specific fields, if a certain lineage
        interests you.
      </p>
      <p>
        My 1:1 or group offerings span conscious connected breathwork, reiki (hands-off energy work), and yoga. Each
        can be incorporated into retreats, birthdays, wedding parties, bachelorette parties, or other gatherings.
      </p>
    </>
  ),
  hideCategory: true,
  alsoIn: ["Group Classes"],
  popups: [
    { label: "Learn more about Conscious connected breathwork", service: breathwork },
    { label: "Learn more about Reiki", service: reiki },
    { label: "Learn more about yoga", service: yoga },
  ],
};
