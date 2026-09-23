import { NextResponse } from "next/server";
import {
  BRAND,
  MAX_QUANTITY_PER_PRODUCT,
  formatEur,
  products,
} from "@/lib/shop/products";

// Orders are requests, not payments: Niamh receives the order by email and
// follows up to confirm stock, shipping and payment.
//
// Unlike /api/event-enquiry, the recipient is fixed server-side. Letting the
// client choose it would turn this endpoint into an open relay for sending
// mail from the niamhpadma.com domain.
const ORDER_RECIPIENT = "hello@somatictherapyinlisbon.com";

type OrderBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  notes?: unknown;
  quantities?: unknown;
};

function str(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: OrderBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = str(body.name, 200);
  const email = str(body.email, 320);
  const phone = str(body.phone, 60);
  const address = str(body.address);
  const notes = str(body.notes);

  if (!name || !email || !address) {
    return NextResponse.json(
      { error: "Name, email and delivery address are required" },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }

  // Prices come from the product list, never from the request.
  const rawQuantities =
    body.quantities && typeof body.quantities === "object"
      ? (body.quantities as Record<string, unknown>)
      : {};

  const lines = products
    .map((product) => {
      const q = Number(rawQuantities[product.id]);
      const quantity = Number.isInteger(q)
        ? Math.min(Math.max(q, 0), MAX_QUANTITY_PER_PRODUCT)
        : 0;
      return { product, quantity, subtotal: quantity * product.priceEur };
    })
    .filter((line) => line.quantity > 0);

  if (lines.length === 0) {
    return NextResponse.json(
      { error: "Please choose at least one product" },
      { status: 400 }
    );
  }

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  if (!process.env.RESEND_API_KEY) {
    console.error("[shop-order] RESEND_API_KEY not configured — order not sent");
    return NextResponse.json(
      {
        error: `Orders can't be sent right now — please email ${ORDER_RECIPIENT} directly`,
      },
      { status: 503 }
    );
  }

  const text = [
    `New ${BRAND} order from the website.`,
    "",
    ...lines.map(
      (l) =>
        `${l.quantity} × ${l.product.name} (${l.product.size}) @ ${formatEur(
          l.product.priceEur
        )} = ${formatEur(l.subtotal)}`
    ),
    "",
    `Total (excl. shipping): ${formatEur(total)}`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    ...(phone ? [`Phone: ${phone}`] : []),
    "",
    "Delivery address:",
    address,
    "",
    "Notes:",
    notes || "(none)",
    "",
    "No payment has been taken. Reply to this email to confirm the order and arrange payment and delivery.",
  ].join("\n");

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Niamh Padma Website <noreply@niamhpadma.com>",
      to: ORDER_RECIPIENT,
      subject: `[${BRAND} order] ${formatEur(total)} from ${name}`,
      text,
      replyTo: email,
    });
  } catch (err) {
    console.error("[shop-order] Resend error", err);
    return NextResponse.json(
      {
        error: `Your order couldn't be sent — please email ${ORDER_RECIPIENT} directly`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, total });
}
