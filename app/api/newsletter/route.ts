import { NextResponse } from "next/server";

interface KitErrorResponse {
  errors?: string[];
  message?: string;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const apiKey = process.env.KIT_API_KEY;
    const formId = process.env.KIT_FORM_ID;

    if (!apiKey || !formId) {
      console.error(
        "[newsletter] Missing env vars — set KIT_API_KEY and KIT_FORM_ID in Vercel"
      );
      return NextResponse.json(
        { error: "Newsletter is not configured" },
        { status: 503 }
      );
    }

    const res = await fetch(
      `https://api.kit.com/v4/forms/${formId}/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kit-Api-Key": apiKey,
        },
        body: JSON.stringify({ email_address: email }),
      }
    );

    if (!res.ok) {
      const data: KitErrorResponse = await res.json().catch(() => ({}));
      console.error("[newsletter] Kit API error", res.status, data);
      return NextResponse.json(
        { error: data.errors?.[0] || data.message || "Failed to subscribe" },
        { status: 502 }
      );
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
