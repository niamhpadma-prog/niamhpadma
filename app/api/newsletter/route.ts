import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Subscribe via Kit (ConvertKit) if configured
    if (process.env.KIT_API_KEY && process.env.KIT_FORM_ID) {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.KIT_FORM_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.KIT_API_KEY,
            email,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Kit subscription failed");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
