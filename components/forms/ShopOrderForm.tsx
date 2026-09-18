"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  MAX_QUANTITY_PER_PRODUCT,
  formatEur,
  products,
} from "@/lib/shop/products";

const emptyQuantities = () =>
  Object.fromEntries(products.map((p) => [p.id, 0])) as Record<string, number>;

export function ShopOrderForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>(emptyQuantities);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const total = products.reduce(
    (sum, p) => sum + (quantities[p.id] || 0) * p.priceEur,
    0
  );
  const hasItems = total > 0;

  function setQuantity(id: string, next: number) {
    setQuantities((q) => ({
      ...q,
      [id]: Math.min(Math.max(next, 0), MAX_QUANTITY_PER_PRODUCT),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasItems) {
      setStatus("error");
      setErrorMessage("Please choose at least one product.");
      return;
    }
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/shop-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, quantities }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErrorMessage(data.error || "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-sage/10 rounded-3xl p-8 md:p-10 text-center max-w-2xl mx-auto">
        <h3 className="font-serif text-3xl mb-3">Thank you</h3>
        <p className="font-sans text-base text-espresso/70 max-w-md mx-auto">
          Your order has been sent. Niamh will email you within 48 hours to
          confirm, and to arrange payment and delivery.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full px-5 py-3.5 rounded-2xl bg-white border border-sand/40 font-sans text-sm text-espresso placeholder:text-espresso/30 focus:outline-none focus:border-sage transition-colors";
  const labelClasses = "font-sans text-xs font-medium text-espresso/60 mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {/* Products */}
      <fieldset className="space-y-3">
        <legend className={labelClasses}>Your order</legend>
        {products.map((p) => {
          const qty = quantities[p.id] || 0;
          return (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-sand/40 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="font-serif text-lg leading-tight">{p.name}</p>
                <p className="font-sans text-xs text-espresso/50">
                  {formatEur(p.priceEur)} · {p.size}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(p.id, qty - 1)}
                  disabled={qty === 0}
                  aria-label={`Remove one ${p.name}`}
                  className="w-9 h-9 rounded-full border border-sand/60 font-sans text-lg leading-none text-espresso/70 hover:border-sage disabled:opacity-30 transition-colors"
                >
                  −
                </button>
                <span
                  className="w-6 text-center font-sans text-base tabular-nums"
                  aria-live="polite"
                  aria-label={`${p.name} quantity`}
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(p.id, qty + 1)}
                  disabled={qty >= MAX_QUANTITY_PER_PRODUCT}
                  aria-label={`Add one ${p.name}`}
                  className="w-9 h-9 rounded-full border border-sand/60 font-sans text-lg leading-none text-espresso/70 hover:border-sage disabled:opacity-30 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
        <div className="flex items-baseline justify-between px-1 pt-2">
          <span className="font-sans text-sm text-espresso/60">Total</span>
          <span className="font-serif text-2xl tabular-nums">{formatEur(total)}</span>
        </div>
        <p className="font-sans text-xs text-espresso/40 px-1">
          Shipping is confirmed by email once your order is received.
        </p>
      </fieldset>

      {/* Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shop-name" className={labelClasses}>Name</label>
            <input
              id="shop-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              autoComplete="name"
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="shop-email" className={labelClasses}>Email</label>
            <input
              id="shop-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              autoComplete="email"
              required
              className={inputClasses}
            />
          </div>
        </div>
        <div>
          <label htmlFor="shop-phone" className={labelClasses}>
            Phone <span className="text-espresso/30">(optional)</span>
          </label>
          <input
            id="shop-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+351 ..."
            autoComplete="tel"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="shop-address" className={labelClasses}>Delivery address</label>
          <textarea
            id="shop-address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Street, city, postcode, country"
            autoComplete="street-address"
            rows={3}
            required
            className={`${inputClasses} resize-none`}
          />
        </div>
        <div>
          <label htmlFor="shop-notes" className={labelClasses}>
            Anything else <span className="text-espresso/30">(optional)</span>
          </label>
          <textarea
            id="shop-notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Questions, gift notes, delivery preferences..."
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>
      </div>

      {status === "error" && errorMessage && (
        <p className="font-sans text-sm text-terracotta">{errorMessage}</p>
      )}

      <div className="space-y-3">
        <Button type="submit" variant="primary" size="lg" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Place Order"}
        </Button>
        <p className="font-sans text-xs text-espresso/40">
          No payment is taken here. Niamh will email you within 48 hours to
          confirm your order and arrange payment and delivery.
        </p>
      </div>
    </form>
  );
}
