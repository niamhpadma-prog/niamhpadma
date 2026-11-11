import type { SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "portal-media";

// Short-lived links to private recordings and files. A copied link stops
// working after an hour; the storage rules only sign files the user may see.
export async function signMediaUrls(
  supabase: SupabaseClient,
  paths: string[]
): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return {};

  const { data } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrls(unique, 60 * 60);

  const urls: Record<string, string> = {};
  for (const item of data ?? []) {
    if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
  }
  return urls;
}
