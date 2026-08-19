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
      '*[_type == "leadMagnet"][0]{ heading, emailSubject, emailBody, emailButtonLabel, "fileUrl": file.asset->url }'
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
      result?: {
        heading?: string;
        emailSubject?: string;
        emailBody?: string;
        emailButtonLabel?: string;
        fileUrl?: string;
      };
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

    // Every word here comes from the Studio when Niamh has written one. The
    // fallbacks are deliberately plain and functional — placeholders so the
    // email still works before she has been in, never an attempt to write in
    // her voice. See docs/content-safety.md.
    const subject = result.emailSubject?.trim() || `Your copy of ${title}`;
    const body = result.emailBody?.trim() || `Here is your copy of ${title}.`;
    const buttonLabel = result.emailButtonLabel?.trim() || "Download the guide";

    const paragraphs = body
      .split(/\n\s*\n|\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Niamh Padma <noreply@niamhpadma.com>",
      to: email,
      replyTo: "hello@somatictherapyinlisbon.com",
      subject,
      text: `${body}\n\n${buttonLabel}: ${result.fileUrl}`,
      html: guideEmailHtml(paragraphs, buttonLabel, result.fileUrl),
    });
  } catch (err) {
    console.error("[newsletter] Could not email the guide", err);
  }
}

// Niamh's words go in verbatim, so they are escaped rather than trusted as
// markup — she is writing prose in a text box, not HTML.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Deliberately plain, inline-styled HTML: email clients strip stylesheets, and
// the site's cream/espresso palette is enough to make it feel like hers.
function guideEmailHtml(paragraphs: string[], buttonLabel: string, fileUrl: string) {
  const body = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#3C2F2F;">${escapeHtml(
          p
        )}</p>`
    )
    .join("");

  return `<div style="background:#FAF7F2;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:32px;">
    ${body}
    <p style="margin:28px 0 0;">
      <a href="${escapeHtml(fileUrl)}" style="display:inline-block;background:#3C2F2F;color:#FAF7F2;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:15px;font-family:Helvetica,Arial,sans-serif;">${escapeHtml(
        buttonLabel
      )}</a>
    </p>
  </div>
</div>`;
}
