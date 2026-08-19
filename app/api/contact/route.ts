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
    let sanityOk = false;

    // Store the message in Sanity FIRST, and treat that as what makes a
    // submission succeed.
    //
    // This route used to do Mailchimp + Resend only. Mailchimp keeps the email
    // address but not the message, and RESEND_API_KEY was never set in any
    // environment — so the Resend block silently skipped and every message
    // body ever submitted through this form was thrown away behind a success
    // screen. Persisting here means a missing key can never lose a message
    // again. Same shape as the questionnaire route, so both land in
    // Submissions in the Studio.
    const submittedAt = new Date().toISOString();
    if (process.env.SANITY_API_TOKEN && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      try {
        const sanityRes = await fetch(
          `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
            },
            body: JSON.stringify({
              mutations: [
                {
                  create: {
                    _type: "submission",
                    serviceType: "Contact",
                    title: subject || "Contact form",
                    answers: { name, email },
                    answersText: `Name: ${name}\nEmail: ${email}\nSubject: ${
                      subject || "N/A"
                    }\n\nMessage:\n${message}`,
                    submittedAt,
                  },
                },
              ],
            }),
          }
        );
        if (sanityRes.ok) {
          sanityOk = true;
        } else {
          const detail = await sanityRes.text().catch(() => "");
          console.error("[contact] Sanity store failed", sanityRes.status, detail);
        }
      } catch (err) {
        console.error("[contact] Sanity store failed", err);
      }
    } else {
      console.error("[contact] SANITY_API_TOKEN not set — message will not be stored");
    }

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
          to: "hello@somatictherapyinlisbon.com",
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

    if (!process.env.RESEND_API_KEY) {
      console.error(
        "[contact] RESEND_API_KEY not set — Niamh will not be emailed. Message is stored in Sanity under Submissions."
      );
    }

    if (sanityOk || mailchimpOk || resendOk) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Could not send your message — please email hello@somatictherapyinlisbon.com directly" },
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
