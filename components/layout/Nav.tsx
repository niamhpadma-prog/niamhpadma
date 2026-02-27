"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

const leftLinks = [
  { label: "About", href: "/about" },
  { label: "Work With Me", href: "/work-with-me" },
  { label: "Events & Retreats", href: "/events" },
];

const rightLinks = [
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const mobileMenuLinks = [
  { label: "About", href: "/about" },
  { label: "Work With Me", href: "/work-with-me" },
  { label: "Events & Retreats", href: "/events" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showName, setShowName] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setIsScrolled(latest > 50);
    setIsHidden(latest > 300 && latest > prev);
  });

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <motion.header
      animate={{ y: isHidden && !isOpen ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <Container>
        {/* Desktop nav — centered logo with links on each side */}
        <nav className="hidden lg:flex items-center justify-between py-5">
          {/* Left links */}
          <ul className="flex items-center gap-8 flex-1">
            {leftLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-sm font-medium text-espresso/70 hover:text-espresso transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Center logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 mx-8"
            onMouseEnter={() => setShowName(true)}
            onMouseLeave={() => setShowName(false)}
          >
            <AnimatePresence>
              {showName && (
                <motion.span
                  initial={{ opacity: 0, x: 8, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: 8, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="font-serif text-lg font-semibold text-espresso tracking-[0.06em] uppercase overflow-hidden whitespace-nowrap"
                >
                  Niamh
                </motion.span>
              )}
            </AnimatePresence>

            <Logo
              size={34}
              color="espresso"
              className="group-hover:scale-110 transition-transform duration-300"
            />

            <AnimatePresence>
              {showName && (
                <motion.span
                  initial={{ opacity: 0, x: -8, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -8, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="font-serif text-lg font-semibold text-espresso tracking-[0.06em] uppercase overflow-hidden whitespace-nowrap"
                >
                  Padma
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Right links */}
          <ul className="flex items-center gap-8 flex-1 justify-end">
            {rightLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-sm font-medium text-espresso/70 hover:text-espresso transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/questionnaires/coaching"
                className="font-sans text-sm font-medium bg-espresso text-cream px-6 py-2.5 rounded-full hover:bg-espresso-light transition-colors duration-300"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile nav */}
        <nav className="flex lg:hidden items-center justify-between py-4">
          {/* Logo with tap-to-reveal name */}
          <button
            onClick={() => setShowName((s) => !s)}
            className="group flex items-center gap-2"
          >
            <AnimatePresence>
              {showName && (
                <motion.span
                  initial={{ opacity: 0, x: 6, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: 6, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="font-serif text-base font-semibold text-espresso tracking-[0.06em] uppercase overflow-hidden whitespace-nowrap"
                >
                  Niamh
                </motion.span>
              )}
            </AnimatePresence>

            <Link href="/">
              <Logo
                size={30}
                color="espresso"
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </Link>

            <AnimatePresence>
              {showName && (
                <motion.span
                  initial={{ opacity: 0, x: -6, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -6, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="font-serif text-base font-semibold text-espresso tracking-[0.06em] uppercase overflow-hidden whitespace-nowrap"
                >
                  Padma
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Right side: Get Started + Menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/questionnaires/coaching"
              className="font-sans text-xs font-medium bg-espresso text-cream px-4 py-2 rounded-full hover:bg-espresso-light transition-colors duration-300"
            >
              Get Started
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <div className="w-6 flex flex-col gap-1.5">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block h-0.5 w-full bg-espresso origin-center"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="block h-0.5 w-full bg-espresso"
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block h-0.5 w-full bg-espresso origin-center"
                />
              </div>
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden bg-cream fixed inset-0 top-[56px] overflow-hidden flex flex-col"
          >
            <Container className="flex-1 flex flex-col justify-center">
              <ul className="flex flex-col gap-2">
                {mobileMenuLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block font-serif text-4xl text-espresso py-3 hover:text-terracotta transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-10"
              >
                <Link
                  href="/questionnaires/coaching"
                  onClick={() => setIsOpen(false)}
                  className="inline-block font-sans text-base font-medium bg-espresso text-cream px-8 py-4 rounded-full hover:bg-espresso-light transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
