"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { FreeResource } from "@/lib/freeResources";

// Remembers who has already signed up on this device, so the second download
// doesn't ask for their details again (it still records the sign-up quietly,
// so Mailchimp knows they took both).
const SIGNED_UP_KEY = "np-free-resources-signup-v1";
// The site-wide ebook pop-up's "already seen" flag (EbookPopup.tsx). Set on
// sign-up here so the pop-up doesn't then ask the same person again.
const POPUP_SEEN_KEY = "np-lead-magnet-seen-v1";

interface SavedSignup {
  firstName: string;
  email: string;
}

function readSaved(): SavedSignup | null {
  try {
    const raw = window.localStorage.getItem(SIGNED_UP_KEY);
    return raw ? (JSON.parse(raw) as SavedSignup) : null;
  } catch {
    return null;
  }
}

function signUp(details: SavedSignup, resource: FreeResource) {
  return fetch("/api/free-resources", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...details, resource: resource.slug }),
  });
}

export function FreeResources({
  heading,
  resources,
  background = "sage",
}: {
  heading: string;
  resources: FreeResource[];
  background?: "cream" | "white" | "sage";
}) {
  const [active, setActive] = useState<FreeResource | null>(null);

  if (resources.length === 0) return null;

  return (
    <Section background={background} id="free-resources">
      <Container>
        <div className="text-center mb-10 md:mb-14">
          <p className="font-sans text-sm uppercase tracking-widest text-sage-dark mb-3">Free</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold">{heading}</h2>
        </div>

        <div
          className={`grid grid-cols-1 gap-8 mx-auto ${
            resources.length > 1 ? "md:grid-cols-2 max-w-4xl" : "max-w-md"
          }`}
        >
          {resources.map((r) => (
            <article
              key={r.slug}
              className="flex flex-col bg-cream rounded-3xl overflow-hidden shadow-sm"
            >
              {r.coverUrl && (
                <div className="relative aspect-[4/3] bg-sand/30 overflow-hidden">
                  <img
                    src={r.coverUrl}
                    alt={r.coverAlt || ""}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>
              )}
              <div className="flex flex-col flex-1 p-7">
                <h3 className="font-serif text-2xl mb-3">{r.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-espresso/65 mb-6 flex-1">
                  {r.description}
                </p>
                <button
                  type="button"
                  onClick={() => setActive(r)}
                  className="self-start font-sans text-sm px-6 py-3 rounded-full bg-espresso text-cream hover:bg-espresso/90 transition-colors"
                >
                  Download free
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {active && (
          <SignupDialog key={active.slug} resource={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </Section>
  );
}

function SignupDialog({
  resource,
  onClose,
}: {
  resource: FreeResource;
  onClose: () => void;
}) {
  // Only mounted after a click, so localStorage is always available here.
  const [saved] = useState<SavedSignup | null>(readSaved);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  // Someone who already signed up here goes straight to the download.
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    saved ? "success" : "idle"
  );
  const closeRef = useRef<HTMLButtonElement>(null);

  // Returning visitor: record this download against their sign-up, quietly.
  useEffect(() => {
    if (saved) signUp(saved, resource).catch(() => {});
    // Only once, when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const details = { firstName: firstName.trim(), email: email.trim() };
    try {
      const res = await signUp(details, resource);
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      try {
        window.localStorage.setItem(SIGNED_UP_KEY, JSON.stringify(details));
        window.localStorage.setItem(POPUP_SEEN_KEY, "1");
      } catch {
        /* private browsing — they'll just be asked again next time */
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-espresso/40 backdrop-blur-sm p-4"
      onClick={close}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="free-resource-heading"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-cream rounded-3xl shadow-2xl p-7 sm:p-9 text-center"
      >
        <button
          ref={closeRef}
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-espresso/50 hover:text-espresso hover:bg-espresso/5 transition-colors"
        >
          {"✕"}
        </button>

        <h2 id="free-resource-heading" className="font-serif text-2xl sm:text-3xl mb-3 px-4">
          {resource.title}
        </h2>

        {status === "success" ? (
          <div className="space-y-5">
            <p className="font-sans text-sm text-espresso/65">
              Your download is ready. A copy is on its way to your inbox too.
            </p>
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-sans text-sm px-6 py-3 rounded-full bg-espresso text-cream hover:bg-espresso/90 transition-colors"
            >
              Download the PDF
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            <p className="font-sans text-sm text-espresso/65 text-center mb-5">
              Add your name and email to download.
            </p>
            <label htmlFor="free-resource-name" className="sr-only">
              First name
            </label>
            <input
              id="free-resource-name"
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full font-sans text-sm px-5 py-3 rounded-full border border-espresso/15 bg-white focus:outline-none focus:border-sage"
            />
            <label htmlFor="free-resource-email" className="sr-only">
              Email address
            </label>
            <input
              id="free-resource-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full font-sans text-sm px-5 py-3 rounded-full border border-espresso/15 bg-white focus:outline-none focus:border-sage"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full font-sans text-sm px-6 py-3 rounded-full bg-espresso text-cream hover:bg-espresso/90 disabled:opacity-60 transition-colors"
            >
              {status === "loading" ? "Sending…" : "Get the free download"}
            </button>
            <p className="font-sans text-xs text-espresso/45 text-center pt-1">
              You&apos;ll also join my newsletter. Unsubscribe any time.
            </p>
            {status === "error" && (
              <p className="font-sans text-sm text-terracotta text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
