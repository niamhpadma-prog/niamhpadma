"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface AccessGateProps {
  courseSlug: string;
  stripePriceId?: string;
}

export function AccessGate({ courseSlug, stripePriceId }: AccessGateProps) {
  const searchParams = useSearchParams();
  const showGate = searchParams.get("access") === "required";
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (!showGate) return null;

  const handleCheckout = async () => {
    if (!stripePriceId) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setCheckoutLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, courseSlug }),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-cream rounded-3xl p-8 max-w-md w-full shadow-xl"
      >
        <h2 className="font-serif text-2xl mb-2 text-center">
          Access Required
        </h2>
        <p className="font-sans text-sm text-espresso/60 text-center mb-6">
          Please purchase this course or sign in to access the lessons.
        </p>

        <AnimatePresence mode="wait">
          {!showMagicLink ? (
            <motion.div
              key="buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <Button
                onClick={handleCheckout}
                variant="primary"
                size="md"
                className="w-full"
                disabled={checkoutLoading || !stripePriceId}
              >
                {checkoutLoading ? "Redirecting..." : "Purchase Course"}
              </Button>
              <Button
                onClick={() => setShowMagicLink(true)}
                variant="outline"
                size="md"
                className="w-full"
              >
                I Already Purchased
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="magic-link"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {status === "sent" ? (
                <div className="text-center py-4">
                  <svg className="w-10 h-10 text-sage mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="font-sans text-sm text-espresso/70">
                    If an account exists with that email, you&apos;ll receive an access link shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-sand/40 font-sans text-sm focus:border-sage focus:outline-none transition-colors placeholder:text-espresso/30"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    className="w-full"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending..." : "Send Access Link"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowMagicLink(false)}
                    className="w-full font-sans text-xs text-espresso/40 hover:text-espresso/60 transition-colors py-1"
                  >
                    Back
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
