"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface WaitlistFormProps {
  /** Slug of the retreat the visitor came from, if any. */
  retreat?: string;
}

const FIRST_TO_KNOW_OPTIONS = ["Yes", "No"];
const COMPANION_OPTIONS = ["Alone", "With a friend", "Not sure yet"];
const DEPOSIT_OPTIONS = ["Yes", "Not yet"];

const EMPTY = {
  name: "",
  email: "",
  firstToKnow: "",
  companion: "",
  message: "",
  deposit: "",
};

export function WaitlistForm({ retreat }: WaitlistFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState(EMPTY);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, retreat }),
      });
      if (res.ok) {
        setStatus("success");
        setFormData(EMPTY);
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
          You’re on the waitlist. Niamh will be in touch with you soon.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full px-5 py-3.5 rounded-2xl bg-white border border-sand/40 font-sans text-sm text-espresso placeholder:text-espresso/30 focus:outline-none focus:border-sage transition-colors";
  const labelClasses = "font-sans text-sm font-medium text-espresso/80 mb-2 block";

  const choice = (
    field: "firstToKnow" | "companion" | "deposit",
    label: string,
    options: string[]
  ) => (
    <fieldset>
      <legend className={labelClasses}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = formData[field] === opt;
          return (
            <label
              key={opt}
              className={`cursor-pointer px-5 py-2.5 rounded-full border font-sans text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage ${
                selected
                  ? "bg-espresso border-espresso text-cream"
                  : "bg-white border-sand/60 text-espresso/80 hover:border-espresso/50"
              }`}
            >
              <input
                type="radio"
                name={field}
                value={opt}
                checked={selected}
                onChange={() => setFormData({ ...formData, [field]: opt })}
                required
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <label htmlFor="waitlist-name" className={labelClasses}>
          What is your name?
        </label>
        <input
          id="waitlist-name"
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
        <label htmlFor="waitlist-email" className={labelClasses}>
          What is your email address?
        </label>
        <input
          id="waitlist-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
          autoComplete="email"
          required
          className={inputClasses}
        />
      </div>
      {choice(
        "firstToKnow",
        "Do you want to be the first to know when a 2027 / 2028 retreat goes live?",
        FIRST_TO_KNOW_OPTIONS
      )}
      {choice("companion", "Would you come alone or with a friend?", COMPANION_OPTIONS)}
      <div>
        <label htmlFor="waitlist-message" className={labelClasses}>
          Anything else to share? <span className="text-espresso/40 font-normal">(optional)</span>
        </label>
        <textarea
          id="waitlist-message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className={`${inputClasses} resize-none`}
        />
      </div>
      {choice("deposit", "Can you secure your spot with a deposit today?", DEPOSIT_OPTIONS)}
      {status === "error" && (
        <p className="font-sans text-sm text-terracotta">
          Something went wrong. Please try again or email hello@somatictherapyinlisbon.com.
        </p>
      )}
      <div className="pt-2">
        <Button type="submit" variant="primary" size="lg" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Add me to the waitlist"}
        </Button>
      </div>
    </form>
  );
}
