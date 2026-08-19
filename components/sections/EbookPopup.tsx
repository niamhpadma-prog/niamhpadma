"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface LeadMagnet {
  enabled?: boolean;
  heading?: string;
  body?: string;
  buttonLabel?: string;
  successMessage?: string;
  delaySeconds?: number;
  fileUrl?: string;
  image?: { asset?: { url?: string }; alt?: string };
}

// Remembers that this visitor has already seen it, so it never nags on a
// return visit. Bumping the suffix re-shows it to everyone, which is what you
// want when the offer itself changes.
const SEEN_KEY = "np-lead-magnet-seen-v1";

export function EbookPopup({ config }: { config: LeadMagnet | null }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const closeRef = useRef<HTMLButtonElement>(null);

  const active = Boolean(config?.enabled && config?.heading);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private browsing — showing again next visit is an acceptable failure */
    }
  }, []);

  // Open on whichever comes first: the configured delay, or scrolling halfway
  // down the page. Both signal an engaged visitor rather than a bounce.
  useEffect(() => {
    if (!active) return;
    try {
      if (window.localStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* fall through and show it */
    }

    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
      setOpen(true);
    };
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.5) show();
    };

    const delay = Math.max(0, config?.delaySeconds ?? 20) * 1000;
    const timer = setTimeout(show, delay);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [active, config?.delaySeconds]);

  // Escape to close, and move focus into the dialog when it opens.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "ebook" }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) {
        try {
          window.localStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* ignore */
        }
      }
    } catch {
      setStatus("error");
    }
  }

  if (!active) return null;

  const coverUrl = config?.image?.asset?.url;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-espresso/40 backdrop-blur-sm p-4"
          onClick={dismiss}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-magnet-heading"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-cream rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              ref={closeRef}
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-espresso/50 hover:text-espresso hover:bg-espresso/5 transition-colors"
            >
              {"✕"}
            </button>

            {coverUrl && (
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={coverUrl}
                  alt={config?.image?.alt || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 512px"
                />
              </div>
            )}

            <div className="p-7 sm:p-9 text-center">
              <h2
                id="lead-magnet-heading"
                className="font-serif text-2xl sm:text-3xl mb-3"
              >
                {config?.heading}
              </h2>
              {config?.body && (
                <p className="font-sans text-sm sm:text-base text-espresso/60 mb-6">
                  {config.body}
                </p>
              )}

              {status === "success" ? (
                <div className="space-y-4">
                  <p className="font-sans text-base text-sage-dark">
                    {config?.successMessage || "Check your inbox."}
                  </p>
                  {config?.fileUrl && (
                    <a
                      href={config.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-sans text-sm px-6 py-3 rounded-full bg-espresso text-cream hover:bg-espresso/90 transition-colors"
                    >
                      Download the guide
                    </a>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="lead-magnet-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="lead-magnet-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 font-sans text-sm px-5 py-3 rounded-full border border-espresso/15 bg-white focus:outline-none focus:border-sage"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="font-sans text-sm px-6 py-3 rounded-full bg-espresso text-cream hover:bg-espresso/90 disabled:opacity-60 transition-colors whitespace-nowrap"
                  >
                    {status === "loading" ? "Sending…" : config?.buttonLabel || "Send it to me"}
                  </button>
                </form>
              )}

              {status === "error" && (
                <p className="font-sans text-sm text-terracotta mt-4">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
