import type { MetadataRoute } from "next";
import { getAllLocationParams } from "@/lib/seo/locationPages";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://niamhpadma.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/work-with-me`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];

  const questionnairePages: MetadataRoute.Sitemap = [
    "coaching", "breathwork", "yoga", "somatic", "corporate",
  ].map((type) => ({
    url: `${baseUrl}/questionnaires/${type}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const locationSeoPages: MetadataRoute.Sitemap = getAllLocationParams().map((p) => ({
    url: `${baseUrl}/${p.location}/${p.service}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // TODO: Add dynamic blog posts and events from Sanity

  return [...staticPages, ...questionnairePages, ...locationSeoPages];
}
