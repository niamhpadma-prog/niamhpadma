import type { MetadataRoute } from "next";
import { getAllLocationParams } from "@/lib/seo/locationPages";
import { client } from "@/lib/sanity/client";
import { sitemapQuery } from "@/lib/sanity/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://niamhpadma.com";

type SanitySitemapData = {
  posts: { slug: { current: string }; _updatedAt: string }[];
  events: { slug: { current: string }; _updatedAt: string }[];
  courses: { slug: { current: string }; _updatedAt: string }[];
  retreats: { slug: { current: string }; _updatedAt: string }[];
  locationPages: { city: string; service: string; _updatedAt: string }[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/my-story`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/work-with-me`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/discovery-call`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const questionnairePages: MetadataRoute.Sitemap = [
    "coaching", "breathwork", "yoga", "somatic", "corporate",
  ].map((type) => ({
    url: `${baseUrl}/questionnaires/${type}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticLocationPages: MetadataRoute.Sitemap = getAllLocationParams().map((p) => ({
    url: `${baseUrl}/${p.location}/${p.service}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  let sanityData: SanitySitemapData = {
    posts: [], events: [], courses: [], retreats: [], locationPages: [],
  };
  try {
    sanityData = await client.fetch<SanitySitemapData>(sitemapQuery);
  } catch (err) {
    console.error("[sitemap] Sanity fetch failed:", err);
  }

  const blogPosts: MetadataRoute.Sitemap = sanityData.posts
    .filter((p) => p.slug?.current)
    .map((p) => ({
      url: `${baseUrl}/journal/${p.slug.current}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const eventPages: MetadataRoute.Sitemap = sanityData.events
    .filter((e) => e.slug?.current)
    .map((e) => ({
      url: `${baseUrl}/events/${e.slug.current}`,
      lastModified: new Date(e._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const coursePages: MetadataRoute.Sitemap = sanityData.courses
    .filter((c) => c.slug?.current)
    .map((c) => ({
      url: `${baseUrl}/courses/${c.slug.current}`,
      lastModified: new Date(c._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const retreatPages: MetadataRoute.Sitemap = sanityData.retreats
    .filter((r) => r.slug?.current)
    .map((r) => ({
      url: `${baseUrl}/retreats/${r.slug.current}`,
      lastModified: new Date(r._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const cmsLocationPages: MetadataRoute.Sitemap = sanityData.locationPages
    .filter((p) => p.city && p.service)
    .map((p) => ({
      url: `${baseUrl}/${p.city.toLowerCase()}/${p.service.toLowerCase()}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const seen = new Set<string>();
  return [
    ...staticPages,
    ...questionnairePages,
    ...staticLocationPages,
    ...cmsLocationPages,
    ...blogPosts,
    ...eventPages,
    ...coursePages,
    ...retreatPages,
  ].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
