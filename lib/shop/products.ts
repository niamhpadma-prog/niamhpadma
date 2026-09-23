// Single source of truth for the shop. The page renders from this list and the
// order API re-derives prices from it, so a total sent from the browser is
// never trusted.

export interface Product {
  id: string;
  name: string;
  tagline: string;
  priceEur: number;
  size: string;
  description: string;
  tags: string[];
  benefits: string[];
  howToUse: string;
  provenance?: string[];
}

export const BRAND = "ISHKA";

export const products: Product[] = [
  {
    id: "sea-moss",
    name: "Irish Sea Moss",
    tagline: "Daily nourishment for the body",
    priceEur: 28,
    size: "100g",
    description:
      "Chondrus Crispus, wild-harvested from the Atlantic coast of Ireland. Hand-harvested, sun-dried, with no additives — 100% natural, exactly as the ocean made it.",
    provenance: [
      "Plants for the mind & body.",
      "Sourced from the waters.",
      "Natural and sustainably harvested.",
      "Conservation-first.",
    ],
    tags: ["Wild-harvested", "Sun-dried", "No additives", "100% natural"],
    benefits: [
      "Gut health support",
      "Mineral replenishment",
      "Skin support",
      "Hormonal balance",
      "Natural daily nourishment",
      "A ritual connected to nature",
    ],
    howToUse:
      "Stir it into your morning smoothie, or add it to soups and stews for an extra boost. Just one teaspoon a day is enough to feel the benefits.",
  },
  {
    id: "blue-lotus",
    name: "Egyptian Blue Lotus",
    tagline: "A ritual for relaxation, creativity & presence",
    priceEur: 65,
    size: "Tincture, 30ml",
    description:
      "Nymphaea Caerulea, used historically in ceremonial and calming rituals for centuries. Taken as a tincture, a few drops in tea or water — an evening ritual, a nervous system support, and a creativity companion. Sustainably sourced from Egypt, traceable to the farm.",
    tags: [
      "Evening ritual",
      "Nervous system support",
      "Creativity companion",
      "Historic & ceremonial",
    ],
    benefits: [
      "Sleep support",
      "Relaxation",
      "Nervous system regulation",
      "Enhanced dream recollection",
      "Mood support",
    ],
    howToUse:
      "Add 5–10 drops into tea or hot water. Start low, and let your body find its own rhythm.",
  },
];

export const MAX_QUANTITY_PER_PRODUCT = 10;

export function formatEur(amount: number) {
  return `€${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
}
