import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  // Pages are ISR-cached at the Next layer; bypass Sanity's CDN so re-fetches
  // see writes immediately rather than waiting on its 60s cache window.
  useCdn: false,
});
