// Update Breathwork Fundamentals course thumbnail
// Run with: npx tsx scripts/update-breathwork-thumbnail.ts
import { readFileSync } from "fs";
import { resolve } from "path";

const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    if (!process.env[key]) {
      process.env[key] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN!;

if (!projectId || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
}

async function uploadAsset(filePath: string, filename: string) {
  const fileBuffer = readFileSync(filePath);
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
        Authorization: `Bearer ${token}`,
      },
      body: fileBuffer,
    }
  );
  if (!res.ok) {
    throw new Error(`Upload failed: ${await res.text()}`);
  }
  const json = (await res.json()) as { document: { _id: string } };
  return json.document._id;
}

async function mutate(mutations: Record<string, unknown>[]) {
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
  if (!res.ok) {
    throw new Error(`Mutation failed: ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  const imagePath = resolve(process.cwd(), "public/images/hero-left.jpg");
  console.log("Uploading hero-left.jpg to Sanity...");
  const assetId = await uploadAsset(imagePath, "breathwork-fundamentals-thumbnail.jpg");
  console.log("  ✓ Uploaded as", assetId);

  console.log("Patching course-breathwork-fundamentals thumbnail...");
  await mutate([
    {
      patch: {
        id: "course-breathwork-fundamentals",
        set: {
          thumbnail: {
            _type: "image",
            asset: { _type: "reference", _ref: assetId },
            alt: "Woman with eyes closed in quiet meditation",
            hotspot: { _type: "sanity.imageHotspot", x: 0.5, y: 0.18, height: 0.4, width: 0.4 },
            crop: { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0, right: 0 },
          },
        },
      },
    },
  ]);
  console.log("  ✓ Course thumbnail updated (hotspot at top)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
