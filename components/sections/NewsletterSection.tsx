"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface NewsletterSectionProps {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  background?: "cream" | "white" | "sage" | "espresso";
}

export function NewsletterSection({
  heading = "Stay Connected",
  body = "Weekly insights on breathwork, yoga, somatic practices and holistic nutrition.",
  buttonLabel = "Subscribe",
  background = "sage",
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section background={background}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto"
        >
          <h2 className="font-serif text-3xl md:text-4xl mb-4">{heading}</h2>
          <p className="font-sans text-base text-espresso/60 mb-8">{body}</p>

          {status === "success" ? (
            <p className="font-sans text-base text-sage-dark">
              Welcome to the community! Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-full bg-white border border-sand/40 font-sans text-sm text-espresso placeholder:text-espresso/30 focus:outline-none focus:border-sage transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-7 py-3.5 rounded-full bg-espresso text-cream font-sans text-sm font-medium hover:bg-espresso-light transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "..." : buttonLabel}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="font-sans text-sm text-terracotta mt-3">
              Something went wrong. Please try again.
            </p>
          )}
        </motion.div>
      </Container>
    </Section>
  );
}
