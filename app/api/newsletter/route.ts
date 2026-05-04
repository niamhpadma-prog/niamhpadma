import { NextResponse } from "next/server";
import {
  upsertMailchimpMember,
  isMailchimpConfigured,
  MailchimpError,
} from "@/lib/mailchimp";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

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
        tags: ["source:newsletter"],
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[newsletter] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
