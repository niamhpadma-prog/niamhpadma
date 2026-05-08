"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface EventEnquiryFormProps {
  retreatTitle: string;
  retreatSlug?: string;
  recipientEmail?: string;
  bookCallUrl?: string;
  primaryLabel?: string;
}

const FALLBACK_BOOK_CALL_URL =
  "https://calendly.com/hello-somatictherapyinlisbon/30min";

export function EventEnquiryForm({
  retreatTitle,
  retreatSlug,
  recipientEmail,
  bookCallUrl = FALLBACK_BOOK_CALL_URL,
  primaryLabel = "Reserve Your Spot",
}: EventEnquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/event-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          retreatTitle,
          retreatSlug,
          recipient: recipientEmail,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-sage/10 rounded-3xl p-8 md:p-10 text-center">
        <h3 className="font-serif text-3xl mb-3">Thank you</h3>
        <p className="font-sans text-base text-espresso/70 max-w-md mx-auto">
          Your enquiry for <span className="font-medium">{retreatTitle}</span> has been
          sent. Niamh will be in touch within 48 hours with full details.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full px-5 py-3.5 rounded-2xl bg-white border border-sand/40 font-sans text-sm text-espresso placeholder:text-espresso/30 focus:outline-none focus:border-sage transition-colors";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-xs font-medium text-espresso/60 mb-1.5 block">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label className="font-sans text-xs font-medium text-espresso/60 mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              className={inputClasses}
            />
          </div>
        </div>
        <div>
          <label className="font-sans text-xs font-medium text-espresso/60 mb-1.5 block">
            Phone <span className="text-espresso/30">(optional)</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+351 ..."
            className={inputClasses}
          />
        </div>
        <div>
          <label className="font-sans text-xs font-medium text-espresso/60 mb-1.5 block">
            Anything you’d like to share <span className="text-espresso/30">(optional)</span>
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Questions, dietary needs, room preferences..."
            rows={4}
            className={`${inputClasses} resize-none`}
          />
        </div>
        {status === "error" && (
          <p className="font-sans text-sm text-terracotta">
            Something went wrong. Please try again or email hello@somatictherapyinlisbon.com.
          </p>
        )}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : primaryLabel}
          </Button>
        </div>
        <p className="font-sans text-xs text-espresso/40 pt-1">
          You’re enquiring about <span className="text-espresso/70">{retreatTitle}</span>.
          Niamh personally reviews each enquiry and replies within 48h.
        </p>
      </form>

      <aside className="lg:col-span-2 bg-cream rounded-3xl p-8 md:p-10 border border-sand/30">
        <p className="font-sans text-xs uppercase tracking-widest text-sage mb-3">
          Prefer to talk first?
        </p>
        <h3 className="font-serif text-2xl md:text-3xl leading-tight mb-3">
          Book a free discovery call
        </h3>
        <p className="font-sans text-sm text-espresso/60 leading-relaxed mb-6">
          A relaxed 30-minute conversation about the retreat, your goals, and
          whether the rhythm suits you.
        </p>
        <Button href={bookCallUrl} variant="outline" size="md">
          Book a Call
        </Button>
      </aside>
    </div>
  );
}
