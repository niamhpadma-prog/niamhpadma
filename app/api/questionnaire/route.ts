import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { serviceType, title, answers } = await request.json();

    if (!serviceType || !answers || !answers.email) {
      return NextResponse.json(
        { error: "Service type and email are required" },
        { status: 400 }
      );
    }

    // Store submission in Sanity if configured
    if (process.env.SANITY_API_TOKEN && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

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
    }

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const answersFormatted = Object.entries(answers)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join("\n");

      await resend.emails.send({
        from: "Niamh Padma Website <noreply@niamhpadma.com>",
        to: "hello@niamhpadma.com",
        subject: `New ${title} Questionnaire Submission`,
        text: `New questionnaire submission\n\nType: ${serviceType}\nForm: ${title}\n\n${answersFormatted}`,
        replyTo: answers.email as string,
      });
    }

    // Subscribe to newsletter via Kit
    if (process.env.KIT_API_KEY && process.env.KIT_FORM_ID && answers.email) {
      await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.KIT_FORM_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.KIT_API_KEY,
            email: answers.email,
            tags: [serviceType],
            fields: {
              name: answers.name || "",
            },
          }),
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Questionnaire submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit questionnaire" },
      { status: 500 }
    );
  }
}
