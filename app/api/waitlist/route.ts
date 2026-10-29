import { NextResponse } from "next/server";

const RECIPIENT = "hello@somatictherapyinlisbon.com";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = str(body.name);
    const email = str(body.email);
    const firstToKnow = str(body.firstToKnow);
    const companion = str(body.companion);
    const message = str(body.message);
    const deposit = str(body.deposit);
    const retreat = str(body.retreat);

    if (!name || !email || !firstToKnow || !companion || !deposit) {
      return NextResponse.json(
        { error: "Please answer all the required questions" },
        { status: 400 }
      );
    }

    const lines = [
      "New waitlist sign-up from the website.",
      "",
      ...(retreat ? [`Came from: /retreats/${retreat}`, ""] : []),
      `What is your name? ${name}`,
      `What is your email address? ${email}`,
      `Do you want to be the first to know when a 2027 / 2028 retreat goes live? ${firstToKnow}`,
      `Would you come alone or with a friend? ${companion}`,
      `Can you secure your spot with a deposit today? ${deposit}`,
      "",
      "Anything else to share?",
      message || "(nothing added)",
    ];

    if (!process.env.RESEND_API_KEY) {
      // Local development has no Resend key, so print the email instead.
      if (process.env.NODE_ENV !== "production") {
        console.log("[waitlist] RESEND_API_KEY not set — would have sent:\n" + lines.join("\n"));
        return NextResponse.json({ success: true });
      }
      console.error("[waitlist] RESEND_API_KEY not set");
      return NextResponse.json(
        { error: "Could not join the waitlist — please email hello@somatictherapyinlisbon.com directly" },
        { status: 503 }
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Niamh Padma Website <noreply@niamhpadma.com>",
      to: RECIPIENT,
      subject: `[Waitlist] ${name}`,
      text: lines.join("\n"),
      replyTo: email,
    });

    if (error) {
      console.error("[waitlist] Resend error", error);
      return NextResponse.json(
        { error: "Could not join the waitlist — please email hello@somatictherapyinlisbon.com directly" },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[waitlist] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to join the waitlist" }, { status: 500 });
  }
}
