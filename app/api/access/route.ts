import { NextResponse } from "next/server";
import { generateAccessToken } from "@/lib/auth";
import { sanityQuery } from "@/lib/sanity/writeClient";

export async function POST(request: Request) {
  try {
    const { email, courseSlug } = await request.json();

    if (!email || !courseSlug) {
      return NextResponse.json({ error: "Email and course slug are required" }, { status: 400 });
    }

    // Check if enrollment exists
    const enrollment = await sanityQuery<{ _id: string } | null>(
      `*[_type == "courseEnrollment" && email == $email && course->slug.current == $courseSlug && status == "active"][0]{ _id }`,
      { email, courseSlug }
    );

    // Always return success to avoid leaking whether an email is enrolled
    if (enrollment) {
      const token = await generateAccessToken(email, courseSlug);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://niamhpadma.com";
      const accessUrl = `${siteUrl}/api/access/verify?token=${token}`;

      // Send magic link via Resend
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "Niamh Padma <noreply@niamhpadma.com>",
          to: email,
          subject: "Your course access link",
          text: `Here's your access link:\n\n${accessUrl}\n\nThis link is valid for 30 days.\n\nWith love,\nNiamh`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, you'll receive an access link shortly.",
    });
  } catch (error) {
    console.error("Access request error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
