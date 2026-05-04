import { NextResponse } from "next/server";
import {
  upsertMailchimpMember,
  isMailchimpConfigured,
  MailchimpError,
} from "@/lib/mailchimp";

function splitName(full: string): { firstName?: string; lastName?: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    let mailchimpOk = false;
    let resendOk = false;

    // Add to Mailchimp with `contact` tag
    if (isMailchimpConfigured()) {
      try {
        const { firstName, lastName } = splitName(name);
        const tags = ["contact"];
        // Keep a tag identifying which subject they came in under, when prefilled
        if (subject && typeof subject === "string" && subject.toLowerCase().startsWith("booking:")) {
          tags.push("booking-enquiry");
        }
        await upsertMailchimpMember({
          email,
          firstName,
          lastName,
          tags,
        });
        mailchimpOk = true;
      } catch (err) {
        if (err instanceof MailchimpError) {
          console.error("[contact] Mailchimp error", err.status, err.detail);
        } else {
          console.error("[contact] Mailchimp unexpected error", err);
        }
      }
    }

    // Notify Niamh via Resend (best-effort)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Niamh Padma Website <noreply@niamhpadma.com>",
          to: "hello@niamhpadma.com",
          subject: `Contact Form: ${subject || "New Message"}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "N/A"}\n\nMessage:\n${message}\n\n${
            mailchimpOk
              ? "✓ Added to Mailchimp with tag: contact"
              : "⚠ Mailchimp add failed — see server logs"
          }`,
          replyTo: email,
        });
        resendOk = true;
      } catch (err) {
        console.error("[contact] Resend error", err);
      }
    }

    if (mailchimpOk || resendOk) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Could not send your message — please email hello@niamhpadma.com directly" },
      { status: 503 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
