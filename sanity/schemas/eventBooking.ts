import { defineField, defineType } from "sanity";

// One document per paid place on an event. Created automatically by the Stripe
// webhook after a successful payment — never filled in by hand, which is why
// every field is read-only in the Studio.
export const eventBooking = defineType({
  name: "eventBooking",
  title: "Event Bookings",
  type: "document",
  description:
    "Created automatically when someone pays for an event on the website. Stripe remains the record of what was actually charged.",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
      description: "The name the person gave Stripe at checkout.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "event",
      title: "Event",
      type: "reference",
      to: [{ type: "event" }],
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "amountPaid",
      title: "Amount paid",
      type: "string",
      readOnly: true,
      description: "What Stripe actually charged, including the currency.",
    }),
    defineField({
      name: "stripeSessionId",
      title: "Stripe Session ID",
      type: "string",
      readOnly: true,
      description: "Look this up in Stripe to find the payment and issue a refund.",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "bookedAt",
      title: "Booked at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["active", "refunded", "cancelled"] },
      initialValue: "active",
      description:
        "Set to “refunded” or “cancelled” after you refund someone in Stripe. Only “active” bookings count towards the event's capacity, so changing this frees the place up again. Refunding here does NOT refund the money — do that in Stripe.",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "bookedAtDesc",
      by: [{ field: "bookedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      email: "email",
      eventTitle: "event.title",
      status: "status",
      amount: "amountPaid",
    },
    prepare: ({ name, email, eventTitle, status, amount }) => ({
      title: name ? `${name} — ${email}` : email,
      subtitle: [eventTitle || "Unknown event", amount, status].filter(Boolean).join(" · "),
    }),
  },
});
