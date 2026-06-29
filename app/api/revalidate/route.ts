import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import crypto from "crypto";

interface SanityProjection {
  _id?: string;
  _type?: string;
  type?: string;
  slug?: { current?: string } | null;
}

function verifySanitySignature(
  rawBody: string,
  header: string | null,
  secret: string
): boolean {
  if (!header) return false;
  const parts = header.split(",").reduce<Record<string, string>>((acc, p) => {
    const [k, v] = p.split("=");
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("base64url");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

function pathsForDocument(doc: SanityProjection): string[] {
  const slug = doc.slug?.current;
  switch (doc._type) {
    case "event": {
      const isRetreat = doc.type === "Retreat";
      const detail = slug ? [isRetreat ? `/retreats/${slug}` : `/events/${slug}`] : [];
      return ["/", "/events", ...detail];
    }
    case "post":
      return ["/journal", ...(slug ? [`/journal/${slug}`] : [])];
    case "course":
      return ["/courses", ...(slug ? [`/courses/${slug}`] : [])];
    case "page":
      return slug ? [`/${slug}`] : ["/"];
    case "siteSettings":
      return ["/"];
    default:
      return [];
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const sanitySig = request.headers.get("sanity-webhook-signature");

  // Auth path 1: Sanity webhook with HMAC signature (preferred)
  const sanitySecret = process.env.SANITY_WEBHOOK_SECRET;
  let authedAsWebhook = false;
  if (sanitySig && sanitySecret && verifySanitySignature(rawBody, sanitySig, sanitySecret)) {
    authedAsWebhook = true;
  }

  // Auth path 2: legacy { secret, path } JSON body matching SANITY_API_TOKEN
  let body: SanityProjection & { secret?: string; path?: string } = {};
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const legacyAuthed =
    body.secret && body.secret === process.env.SANITY_API_TOKEN;

  if (!authedAsWebhook && !legacyAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Branch 1: Sanity webhook payload — revalidate based on _type/slug
  if (authedAsWebhook && body._type) {
    const paths = pathsForDocument(body);
    paths.forEach((p) => {
      try {
        revalidatePath(p);
      } catch (err) {
        console.error("[revalidate] revalidatePath failed", p, err);
      }
    });
    return NextResponse.json({
      revalidated: true,
      type: body._type,
      paths,
    });
  }

  // Branch 2: legacy explicit { path } payload
  if (legacyAuthed) {
    if (body.path) {
      revalidatePath(body.path);
    } else {
      revalidatePath("/", "layout");
    }
    return NextResponse.json({ revalidated: true, path: body.path || "/" });
  }

  // Webhook authed but unrecognised payload — no-op success so Sanity doesn't retry
  return NextResponse.json({ revalidated: false, reason: "unrecognised payload" });
}
