import { NextResponse } from "next/server";

const DEFAULT_RECIPIENT = "hello@niamhpadma.com";

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

    if (!process.env.RESEND_API_KEY) {
      console.error("[event-enquiry] Missing RESEND_API_KEY");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 503 }
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const to = (recipient && typeof recipient === "string") ? recipient : DEFAULT_RECIPIENT;

    const lines = [
      `New retreat enquiry from the website.`,
      ``,
      `Retreat: ${retreatTitle}${retreatSlug ? ` (/retreats/${retreatSlug})` : ""}`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      ...(phone ? [`Phone: ${phone}`] : []),
      ``,
      `Message:`,
      message ? message : "(no message)",
    ];

    await resend.emails.send({
      from: "Niamh Padma Website <noreply@niamhpadma.com>",
      to,
      subject: `[Retreat: ${retreatTitle}] Enquiry from ${name}`,
      text: lines.join("\n"),
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[event-enquiry] Error:", error);
    return NextResponse.json(
      { error: "Failed to send enquiry" },
      { status: 500 }
    );
  }
}
