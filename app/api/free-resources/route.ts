import { NextResponse } from "next/server";
import {
  upsertMailchimpMember,
  isMailchimpConfigured,
  MailchimpError,
} from "@/lib/mailchimp";
import { FREE_RESOURCE_SLUGS, nourishingYourCycle, type FreeResourceSlug } from "@/lib/freeResources";

// Sign-up wall for the free downloads on the home page. Adds the visitor to
// Mailchimp (name + email), tagged with the resource they asked for, then
// emails them a link so they keep a copy. The page shows the download
// straight away, so the email is a bonus and never blocks the visitor.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mailchimp tags per resource. The ebook keeps its existing "ebook" tag so
// pop-up and home-page downloads sit together in Mailchimp.
const TAGS: Record<FreeResourceSlug, string[]> = {
  "nourishing-your-cycle": ["newsletter", "free-resource", "nourishing-your-cycle"],
  "mindful-nutrition": ["newsletter", "free-resource", "ebook"],
};

export async function POST(request: Request) {
  try {
    const { firstName, email, resource } = await request.json();

    const name = typeof firstName === "string" ? firstName.trim().slice(0, 80) : "";
    const addr = typeof email === "string" ? email.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!EMAIL_RE.test(addr)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (!FREE_RESOURCE_SLUGS.includes(resource)) {
      return NextResponse.json({ error: "Unknown resource" }, { status: 400 });
    }
    const slug = resource as FreeResourceSlug;

    if (!isMailchimpConfigured()) {
      console.error(
        "[free-resources] Missing env vars — set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID in Vercel"
      );
      return NextResponse.json({ error: "Sign-up is not configured" }, { status: 503 });
    }

    try {
      await upsertMailchimpMember({ email: addr, firstName: name, tags: TAGS[slug] });
    } catch (err) {
      // 400 is usually "already on the list" — still let them download, and
      // don't reveal whether an email is already subscribed.
      if (!(err instanceof MailchimpError) || err.status !== 400) {
        console.error("[free-resources] Mailchimp error", err);
        return NextResponse.json({ error: "Failed to sign up" }, { status: 502 });
      }
    }

    await emailLink(addr, slug, new URL(request.url).origin);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[free-resources] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}

// Best-effort email with the download link. Wording is deliberately plain and
// functional — never an attempt to write in Niamh's voice
// (docs/content-safety.md).
async function emailLink(email: string, slug: FreeResourceSlug, origin: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[free-resources] RESEND_API_KEY not set — no email sent.");
      return;
    }

    let title: string;
    let fileUrl: string | undefined;
    if (slug === "nourishing-your-cycle") {
      title = nourishingYourCycle.title;
      fileUrl = new URL(nourishingYourCycle.fileUrl, origin).toString();
    } else {
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      if (!projectId) return;
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
      const query = encodeURIComponent(
        '*[_type == "leadMagnet"][0]{ heading, "fileUrl": file.asset->url }'
      );
      const res = await fetch(
        `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const { result } = (await res.json()) as { result?: { heading?: string; fileUrl?: string } };
      title = result?.heading || "your free guide";
      fileUrl = result?.fileUrl;
    }
    if (!fileUrl) return;

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Niamh Padma <noreply@niamhpadma.com>",
      to: email,
      replyTo: "hello@somatictherapyinlisbon.com",
      subject: `Your copy of ${title}`,
      text: `Here is your copy of ${title}.\n\nDownload: ${fileUrl}`,
      html: `<div style="background:#FAF7F2;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:32px;">
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#3C2F2F;">Here is your copy of ${escapeHtml(title)}.</p>
    <p style="margin:28px 0 0;">
      <a href="${escapeHtml(fileUrl)}" style="display:inline-block;background:#3C2F2F;color:#FAF7F2;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:15px;font-family:Helvetica,Arial,sans-serif;">Download</a>
    </p>
  </div>
</div>`,
    });
  } catch (err) {
    console.error("[free-resources] Could not email the link", err);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
