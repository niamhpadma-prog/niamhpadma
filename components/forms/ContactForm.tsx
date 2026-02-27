"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-sage/10 rounded-3xl p-8 text-center">
        <h3 className="font-serif text-2xl mb-2">Message Sent</h3>
        <p className="font-sans text-sm text-espresso/60">
          Thank you for reaching out. I&apos;ll get back to you within 48 hours.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full px-5 py-3.5 rounded-2xl bg-white border border-sand/40 font-sans text-sm text-espresso placeholder:text-espresso/30 focus:outline-none focus:border-sage transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          Subject
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="What's this about?"
          className={inputClasses}
        />
      </div>
      <div>
        <label className="font-sans text-xs font-medium text-espresso/60 mb-1.5 block">
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell me about your wellness goals or ask any questions..."
          required
          rows={5}
          className={`${inputClasses} resize-none`}
        />
      </div>
      {status === "error" && (
        <p className="font-sans text-sm text-terracotta">
          Something went wrong. Please try again.
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
