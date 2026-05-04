import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  upsertMailchimpMember,
  isMailchimpConfigured,
  MailchimpError,
} from "@/lib/mailchimp";

interface CalendlyPayload {
  event: string;
  payload: {
    email: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    scheduled_event?: {
      name?: string;
      event_type?: string;
      start_time?: string;
    };
    event?: { name?: string };
    questions_and_answers?: { question: string; answer: string }[];
  };
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function splitName(full: string): { firstName?: string; lastName?: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function verifyCalendlySignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  const parts = signatureHeader.split(",").reduce<Record<string, string>>(
    (acc, part) => {
      const [k, v] = part.split("=");
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    },
    {}
  );
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(v1, "hex")
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("calendly-webhook-signature");
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;

  if (secret) {
    if (!verifyCalendlySignature(rawBody, signature, secret)) {
      console.error("[calendly-webhook] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    console.warn(
      "[calendly-webhook] CALENDLY_WEBHOOK_SECRET not set — accepting unsigned"
    );
  }

  let body: CalendlyPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only act on new bookings. invitee.canceled would need different logic.
  if (body.event !== "invitee.created") {
    return NextResponse.json({ received: true });
  }

  const email = body.payload.email;
  if (!email) {
    return NextResponse.json({ received: true });
  }

  let firstName = body.payload.first_name;
  let lastName = body.payload.last_name;
  if ((!firstName || !lastName) && body.payload.name) {
    const split = splitName(body.payload.name);
    firstName = firstName || split.firstName;
    lastName = lastName || split.lastName;
  }

  const eventName =
    body.payload.scheduled_event?.name || body.payload.event?.name;
  const tags = ["calendly", "book-a-meeting"];
  if (eventName) tags.push(`calendly-${slugify(eventName)}`);

  if (!isMailchimpConfigured()) {
    console.error("[calendly-webhook] Mailchimp not configured");
    return NextResponse.json({ received: true });
  }

  try {
    await upsertMailchimpMember({ email, firstName, lastName, tags });
  } catch (err) {
    if (err instanceof MailchimpError) {
      console.error(
        "[calendly-webhook] Mailchimp error",
        err.status,
        err.detail
      );
    } else {
      console.error("[calendly-webhook] Unexpected error", err);
    }
    // Return 200 anyway so Calendly doesn't retry forever
  }

  return NextResponse.json({ received: true });
}
