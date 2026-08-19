import { NextResponse } from "next/server";
import {
  upsertMailchimpMember,
  isMailchimpConfigured,
  MailchimpError,
} from "@/lib/mailchimp";

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Where the signup came from, so Niamh can tell ebook downloads apart from
    // plain newsletter signups in Mailchimp. Allow-listed, never free text.
    const SOURCES: Record<string, string> = { ebook: "ebook" };
    const sourceTag = typeof source === "string" ? SOURCES[source] : undefined;

    if (!isMailchimpConfigured()) {
      console.error(
        "[newsletter] Missing env vars — set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID in Vercel"
      );
      return NextResponse.json(
        { error: "Newsletter is not configured" },
        { status: 503 }
      );
    }

    try {
      await upsertMailchimpMember({
        email,
        tags: sourceTag ? ["newsletter", sourceTag] : ["newsletter"],
      });
    } catch (err) {
      if (err instanceof MailchimpError) {
        // Member already exists / similar — treat as success so we don't
        // leak whether an email is already on the list.
        if (err.status === 400) {
          return NextResponse.json({ success: true });
        }
        console.error("[newsletter] Mailchimp error", err.status, err.detail);
        return NextResponse.json(
          { error: "Failed to subscribe" },
          { status: 502 }
        );
      }
      throw err;
    }

    // Ebook signups get the guide emailed to them. Best-effort on purpose: the
    // signup itself already succeeded, and the pop-up also shows a download
    // link, so a mail failure must never turn into an error for the visitor.
    if (sourceTag === "ebook") {
      await sendGuide(email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[newsletter] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

// Emails the free guide. The PDF lives in Sanity (Free Download Pop-Up → The
// Download), so Niamh can swap the file whenever she likes without a deploy —
// this reads whatever is uploaded at the moment the email is sent.
//
// Sends a link rather than an attachment: attachments push mail into spam
// filters and cap out on size, and the link keeps working when she replaces
// the file.
async function sendGuide(email: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error(
        "[newsletter] RESEND_API_KEY not set — the guide was not emailed. Set it in Vercel."
      );
      return;
    }

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
    if (!res.ok) {
      console.error("[newsletter] Could not read the lead magnet", res.status);
      return;
    }
    const { result } = (await res.json()) as {
      result?: { heading?: string; fileUrl?: string };
    };

    // Nothing uploaded yet — the pop-up falls back to its "get in touch" link,
    // and there is no point sending an email with nothing in it.
    if (!result?.fileUrl) {
      console.error(
        "[newsletter] No PDF uploaded in Sanity — nothing to email. Upload it under Free Download Pop-Up."
      );
      return;
    }

    const title = result.heading || "your free guide";
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Niamh Padma <noreply@niamhpadma.com>",
      to: email,
      replyTo: "hello@somatictherapyinlisbon.com",
      subject: `Your copy of ${title}`,
      text: `Here is your copy of ${title}:\n\n${result.fileUrl}\n\nWith love,\nNiamh`,
      html: `<p>Here is your copy of ${title}:</p><p><a href="${result.fileUrl}">Download the guide</a></p><p>With love,<br>Niamh</p>`,
    });
  } catch (err) {
    console.error("[newsletter] Could not email the guide", err);
  }
}
