"use client";

import { useState } from "react";

// The course CheckoutButton silently does nothing when checkout fails, which is
// acceptable there but not here: an event can legitimately sell out between the
// page being cached and someone clicking, and that has to be visible rather
// than looking like a broken button.
export function EventCheckoutButton({
  eventSlug,
  label = "Book Now",
}: {
  eventSlug: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventSlug }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      setError(
        data.error ||
          "Something went wrong starting the payment. Please try again, or get in touch."
      );
    } catch {
      setError(
        "Something went wrong starting the payment. Please try again, or get in touch."
      );
    }
    setLoading(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-300 bg-espresso text-cream hover:bg-espresso-light px-7 py-3.5 text-base disabled:opacity-60"
      >
        {loading ? "Taking you to checkout..." : label}
      </button>
      {error && (
        <p className="font-sans text-sm text-terracotta mt-3">
          {error}{" "}
          <a href="#enquire" className="underline underline-offset-2">
            Send an enquiry instead
          </a>
          .
        </p>
      )}
      <p className="font-sans text-xs text-espresso/40 mt-3">
        Secure payment by card through Stripe.
      </p>
    </div>
  );
}
