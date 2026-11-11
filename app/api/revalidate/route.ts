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

// Which pages a published document affects.
//
// `wholeLayout` is for content that appears on every page (the lead-magnet
// popup lives in app/(site)/layout.tsx), where listing paths individually
// would mean naming every route in the site.
//
// Anything falling through to `default` updates only when the page's own
// refresh timer comes round — a day, since the timer was raised to cut ISR
// writes. So a missing type here reads as "I published it and nothing
// happened", which is why the four content types that were missing are now
// listed explicitly.
function pathsForDocument(doc: SanityProjection): {
  paths: string[];
  wholeLayout?: boolean;
} {
  const slug = doc.slug?.current;
  switch (doc._type) {
    case "event": {
      const isRetreat = doc.type === "Retreat";
      const detail = slug ? [isRetreat ? `/retreats/${slug}` : `/events/${slug}`] : [];
      return { paths: ["/", "/events", ...detail] };
    }
    case "post":
      return { paths: ["/journal", ...(slug ? [`/journal/${slug}`] : [])] };
    case "course":
      return { paths: ["/courses", ...(slug ? [`/courses/${slug}`] : [])] };
    case "page":
      return { paths: slug ? [`/${slug}`] : ["/"] };
    case "siteSettings":
      return { paths: ["/"] };
    // Shown on the homepage and on Work With Me.
    case "testimonial":
      return { paths: ["/", "/work-with-me"] };
    case "waysToWork":
      return { paths: ["/work-with-me"] };
    case "introMedia":
      return { paths: ["/my-story"] };
    // The popup renders in the site layout, so it is on every page.
    case "leadMagnet":
      return { paths: [], wholeLayout: true };
    default:
      return { paths: [] };
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
    const { paths, wholeLayout } = pathsForDocument(body);

    if (wholeLayout) {
      try {
        revalidatePath("/", "layout");
      } catch (err) {
        console.error("[revalidate] layout revalidation failed", err);
      }
    }

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
      ...(wholeLayout ? { wholeLayout: true } : {}),
      // Surfaces a document type nothing knows about, rather than returning a
      // cheerful success for an edit that will not appear for a day.
      ...(paths.length === 0 && !wholeLayout
        ? { warning: `No pages are mapped for type "${body._type}"` }
        : {}),
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
