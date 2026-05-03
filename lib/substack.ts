export interface SubstackPost {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  coverImage?: string;
  postDate: string;
  slug: string;
}

interface SubstackArchiveItem {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  slug: string;
  post_date: string;
  cover_image?: string;
  audience?: string;
}

const PUBLICATION = "thelittlemoments";
const ARCHIVE_URL = `https://${PUBLICATION}.substack.com/api/v1/archive`;

export async function getLatestSubstackPosts(
  limit = 8
): Promise<SubstackPost[]> {
  try {
    const res = await fetch(
      `${ARCHIVE_URL}?sort=new&offset=0&limit=${limit}`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; NiamhPadmaSite/1.0)" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data: SubstackArchiveItem[] = await res.json();

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle ?? undefined,
      description: item.description ?? undefined,
      url: `https://${PUBLICATION}.substack.com/p/${item.slug}`,
      coverImage: item.cover_image ?? undefined,
      postDate: item.post_date,
      slug: item.slug,
    }));
  } catch (err) {
    console.error("Failed to fetch Substack posts:", err);
    return [];
  }
}
