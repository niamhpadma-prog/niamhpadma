// Single source of truth for the shop. The page renders from this list and the
// order API re-derives prices from it, so a total sent from the browser is
// never trusted.

export interface ProductSection {
  heading: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  priceEur: number;
  size: string;
  // Rendered in order, one block each, between the title and the ritual.
  story: ProductSection[];
  ritual: string;
  care: string;
  ctaLabel: string;
}

export const BRAND = "ISHKA";

export const brandTagline = "Rituals from the water";

export const brandIntro =
  "ISHKA takes its name from uisce, the Irish word for water. We offer two plants, both shaped by water and both used in ritual for generations. We keep our range small, our sources traceable, and our words honest, because we believe in ritual over consumption and sustainability over extraction. Shipped across Europe.";

export const BRAND_INSTAGRAM = "ishka_org";
export const BRAND_EMAIL = "ushkaorg@gmail.com";

export const products: Product[] = [
  {
    id: "sea-moss",
    name: "Irish Sea Moss",
    tagline: "Gathered from the Atlantic edge",
    priceEur: 28,
    size: "100g",
    story: [
      {
        heading: "From the water",
        body: "Our sea moss grows wild on the rocks of Clare's Atlantic coast, where cold, moving water shapes everything it touches. Coastal communities here have gathered it for generations, known as carrageen, simmered into puddings and tonics, and passed down as kitchen knowledge rather than trend.",
      },
      {
        heading: "What it is",
        body: "Chondrus crispus is a red seaweed of the North Atlantic. It is a whole sea vegetable, and it naturally carries the minerals of the water it grows in, including iodine.",
      },
      {
        heading: "What the research says",
        body: "Scientists have studied sea moss for its mineral profile, its natural fibres, and its antioxidant compounds, but most of that work is still early and comes from laboratory and animal studies rather than human trials. We don't sell sea moss as a cure or a fix. We offer it as a food with a long coastal history, taken slowly and with intention.",
      },
      {
        heading: "Harvested with care",
        body: "Seaweed absorbs whatever is in its water, which is why where and how it is gathered matters. Our sea moss comes from the wild Atlantic waters off the west coast of County Clare. It is gathered by Wild Irish Seaweeds, a family who have harvested this shoreline for over a century, using hand techniques passed down through four generations. Each frond is cut just above the root so the plant can grow back, and it is only gathered in season. The harvesting grounds are tested for water quality, and every batch comes with its own nutritional, chemical, and microbiological analysis. We chose this source because we believe the story of the water is as important as the seaweed itself.",
      },
    ],
    ritual:
      "Rinse. Soak in fresh water until soft. Blend into a smooth gel and keep it cool. Stir a spoonful into a morning smoothie, a warm tea, or a bowl of oats. Let it be a small daily return to the sea.",
    care: "Sea moss is naturally rich in iodine. If you are pregnant or breastfeeding, have a thyroid condition, or take blood-thinning medication, please speak with your doctor before adding it to your routine.",
    ctaLabel: "Shop Irish Sea Moss",
  },
  {
    id: "blue-lotus",
    name: "Blue Lotus",
    tagline: "A flower of stillness",
    priceEur: 65,
    size: "Tincture, 30ml",
    story: [
      {
        heading: "From the water",
        body: "Like everything ISHKA offers, blue lotus is a plant of water. It grows in the still pools and slow rivers of the Nile, rising from the mud each morning to open with the sun and closing again as the light fades. To the ancient Egyptians it was a sacred flower, painted on temple walls and tomb paintings, and linked to the sun, to rebirth, and to the quiet space between waking and rest.",
      },
      {
        heading: "What it is",
        body: "Nymphaea caerulea is a water lily native to Egypt and East Africa. Our tincture is an extract of its flowers, made to be taken slowly, in small amounts, at the close of the day.",
      },
      {
        heading: "What the research says",
        body: "Blue lotus has a long ceremonial history, but modern science knows much less about it. Researchers have identified flavonoids and other plant compounds in the flower, yet studies suggest the amount of these compounds varies widely depending on the plant, how it is grown, and how it is prepared. There are no human clinical trials on blue lotus. We don't sell it as a remedy for sleep, stress, or anything else. We offer it as a ritual plant, one that marks the turn from doing to being.",
      },
      {
        heading: "Sourced with care",
        body: "Our blue lotus has its roots in Egypt, the flower's ancestral home, and is cultivated in Sri Lanka, where warm water and a long growing season let it flourish. It is grown in tended ponds rather than gathered from the wild, and we can trace every batch back to the grower and the water it grew in. Knowing exactly where a plant comes from is part of the ritual for us: the flower in your glass has a place, a pond, and a person behind it.",
      },
    ],
    ritual:
      "In the evening, as the light goes, set the day down. Add a few drops to a small glass of water or warm tea. Sit somewhere quiet. Breathe slowly. Let it be a moment of stillness, the flower closing with the dusk.",
    care: "Blue lotus is not suitable during pregnancy or breastfeeding, or for anyone under 18. Don't combine it with alcohol, sedatives, or other medication without speaking to your doctor first, and don't drive or operate machinery after taking it. Start with a small amount.",
    ctaLabel: "Shop Blue Lotus",
  },
];

export const MAX_QUANTITY_PER_PRODUCT = 10;

export function formatEur(amount: number) {
  return `€${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
}
