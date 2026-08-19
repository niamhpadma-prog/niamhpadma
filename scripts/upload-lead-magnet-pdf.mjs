// Uploads the Mindful Nutrition guide as the pop-up's download.
//
// Only touches leadMagnet.file. Niamh can replace the PDF in the Studio at any
// time afterwards; nothing here is authored copy. Requires SANITY_API_TOKEN.
//
//   node --env-file=<env> scripts/upload-lead-magnet-pdf.mjs <path-to.pdf>

import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const token = process.env.SANITY_API_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ckid5xtf";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const path = process.argv[2];

if (!token) throw new Error("SANITY_API_TOKEN is not set");
if (!path) throw new Error("Pass the path to the PDF");

const bytes = await readFile(path);
const filename = basename(path);

const upload = await fetch(
  `https://${projectId}.api.sanity.io/v2024-01-01/assets/files/${dataset}?filename=${encodeURIComponent(filename)}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/pdf", Authorization: `Bearer ${token}` },
    body: bytes,
  }
);
if (!upload.ok) throw new Error(`Upload failed: ${upload.status} ${await upload.text()}`);
const { document: asset } = await upload.json();
console.log("Uploaded", asset._id, `(${asset.size} bytes)`);

const patch = await fetch(
  `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      mutations: [
        {
          patch: {
            id: "leadMagnet",
            set: { file: { _type: "file", asset: { _type: "reference", _ref: asset._id } } },
          },
        },
      ],
    }),
  }
);
if (!patch.ok) throw new Error(`Patch failed: ${patch.status} ${await patch.text()}`);
console.log("leadMagnet.file set →", asset.url);
