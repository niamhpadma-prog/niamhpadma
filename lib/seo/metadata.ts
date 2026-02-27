import type { Metadata } from "next";

interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: { asset?: { url?: string } };
  noIndex?: boolean;
}

export function generatePageMetadata(
  title: string,
  seo?: SeoFields
): Metadata {
  return {
    title: seo?.metaTitle || title,
    description: seo?.metaDescription,
    openGraph: {
      title: seo?.metaTitle || title,
      description: seo?.metaDescription || undefined,
      images: seo?.ogImage?.asset?.url ? [seo.ogImage.asset.url] : undefined,
    },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}
