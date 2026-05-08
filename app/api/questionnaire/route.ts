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

function slugifyServiceType(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    const { serviceType, title, answers } = await request.json();

    if (!serviceType || !answers || !answers.email) {
      return NextResponse.json(
        { error: "Service type and email are required" },
        { status: 400 }
      );
    }

    // Store submission in Sanity (audit trail)
    if (process.env.SANITY_API_TOKEN && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      try {
        await fetch(
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
                    serviceType,
                    title,
                    answers,
                    submittedAt: new Date().toISOString(),
                  },
                },
              ],
            }),
          }
        );
      } catch (err) {
        console.error("[questionnaire] Sanity store failed", err);
      }
    }

    let mailchimpOk = false;
    let resendOk = false;

    // Add to Mailchimp with `questionnaire` + per-type tag
    if (isMailchimpConfigured()) {
      try {
        const email = answers.email as string;
        const name = (answers.name as string) || "";
        const { firstName, lastName } = splitName(name);
        const tags = ["questionnaire", `questionnaire-${slugifyServiceType(serviceType)}`];
        await upsertMailchimpMember({
          email,
          firstName,
          lastName,
          tags,
        });
        mailchimpOk = true;
      } catch (err) {
        if (err instanceof MailchimpError) {
          console.error("[questionnaire] Mailchimp error", err.status, err.detail);
        } else {
          console.error("[questionnaire] Mailchimp unexpected error", err);
        }
      }
    }

    // Email Niamh the answers (best-effort)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const answersFormatted = Object.entries(answers)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
          .join("\n");

        await resend.emails.send({
          from: "Niamh Padma Website <noreply@niamhpadma.com>",
          to: "hello@somatictherapyinlisbon.com",
          subject: `New ${title || serviceType} Questionnaire Submission`,
          text: `New questionnaire submission\n\nType: ${serviceType}\nForm: ${title || ""}\n\n${answersFormatted}\n\n${
            mailchimpOk
              ? `✓ Added to Mailchimp with tags: questionnaire, questionnaire-${slugifyServiceType(serviceType)}`
              : "⚠ Mailchimp add failed — see server logs"
          }`,
          replyTo: answers.email as string,
        });
        resendOk = true;
      } catch (err) {
        console.error("[questionnaire] Resend error", err);
      }
    }

    if (mailchimpOk || resendOk) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Could not record your submission — please email hello@somatictherapyinlisbon.com directly" },
      { status: 503 }
    );
  } catch (error) {
    console.error("Questionnaire submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit questionnaire" },
      { status: 500 }
    );
  }
}
