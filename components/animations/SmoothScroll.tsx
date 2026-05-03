"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Route in-page hash anchor clicks through Lenis. Without this, Next.js's
    // scroll-to-anchor uses window.scrollTo, which Lenis overrides on the
    // next frame so the page never moves.
    function onAnchorClick(e: MouseEvent) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const target = e.target as Element | null;
      if (!target) return;
      const a = target.closest('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(el as HTMLElement, { offset: 0 });
      history.pushState(null, "", url.hash);
    }
    document.addEventListener("click", onAnchorClick, true);

    // Scroll to hash on initial page load (Lenis swallows the browser's own
    // anchor scroll otherwise).
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        setTimeout(() => lenis.scrollTo(el as HTMLElement, { immediate: true }), 100);
      }
    }

    return () => {
      document.removeEventListener("click", onAnchorClick, true);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}
