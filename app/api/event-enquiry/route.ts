import { NextResponse } from "next/server";
import {
  upsertMailchimpMember,
  isMailchimpConfigured,
  MailchimpError,
} from "@/lib/mailchimp";

const DEFAULT_RECIPIENT = "hello@somatictherapyinlisbon.com";

function splitName(full: string): { firstName?: string; lastName?: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      phone,
      message,
      retreatTitle,
      retreatSlug,
      recipient,
    } = await request.json();

    if (!name || !email || !retreatTitle) {
      return NextResponse.json(
        { error: "Name, email, and retreat are required" },
        { status: 400 }
      );
    }

    let mailchimpOk = false;
    let resendOk = false;

    // 1. Add to Mailchimp with retreat-specific tag (primary record)
    if (isMailchimpConfigured()) {
      try {
        const { firstName, lastName } = splitName(name);
        const tags = ["retreat-enquiry"];
        if (retreatSlug) tags.push(`retreat-${retreatSlug}`);

        await upsertMailchimpMember({
          email,
          firstName,
          lastName,
          tags,
        });
        mailchimpOk = true;
      } catch (err) {
        if (err instanceof MailchimpError) {
          console.error(
            "[event-enquiry] Mailchimp error",
            err.status,
            err.detail
          );
        } else {
          console.error("[event-enquiry] Mailchimp unexpected error", err);
        }
      }
    } else {
      console.warn("[event-enquiry] Mailchimp not configured — skipping list add");
    }

    // 2. Best-effort: also email Niamh via Resend so she gets notified live
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const to = (recipient && typeof recipient === "string") ? recipient : DEFAULT_RECIPIENT;

        const lines = [
          "New retreat enquiry from the website.",
          "",
          `Retreat: ${retreatTitle}${retreatSlug ? ` (/retreats/${retreatSlug})` : ""}`,
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          ...(phone ? [`Phone: ${phone}`] : []),
          "",
          "Message:",
          message ? message : "(no message)",
          "",
          mailchimpOk
            ? "✓ Added to Mailchimp with tag retreat-" + (retreatSlug || "(unknown)")
            : "⚠ Mailchimp add failed — see server logs",
        ];

        await resend.emails.send({
          from: "Niamh Padma Website <noreply@niamhpadma.com>",
          to,
          subject: `[Retreat: ${retreatTitle}] Enquiry from ${name}`,
          text: lines.join("\n"),
          replyTo: email,
        });
        resendOk = true;
      } catch (err) {
        console.error("[event-enquiry] Resend error", err);
      }
    }

    // Success if at least one of the two destinations worked. Mailchimp is
    // the system of record (we can always re-send Niamh's notification
    // manually). Resend without Mailchimp is also acceptable.
    if (mailchimpOk || resendOk) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Could not record your enquiry — please email hello@somatictherapyinlisbon.com directly" },
      { status: 503 }
    );
  } catch (error) {
    console.error("[event-enquiry] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to send enquiry" },
      { status: 500 }
    );
  }
}
