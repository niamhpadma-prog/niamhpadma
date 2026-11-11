// Shared rules for files Niamh uploads to the portal.

// Supabase's free plan accepts files up to 50 MB.
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export function kindFor(file: File): "audio" | "video" | "file" {
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

export function storageName(file: File) {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
  return `${Date.now()}-${safe}`;
}
