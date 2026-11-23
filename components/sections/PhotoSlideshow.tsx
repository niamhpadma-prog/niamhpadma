"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type SlideshowPhoto = { src: string; alt: string };

// One photo at a time with arrows, swipe, keyboard and thumbnails. Photos are
// shown whole (not cropped) because portrait and landscape shots are mixed.
export function PhotoSlideshow({ photos }: { photos: SlideshowPhoto[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = photos.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (count === 0) return null;
  const photo = photos[index];

  return (
    <div className="mx-auto max-w-5xl" aria-roledescription="carousel" aria-label="Photos from previous experiences">
      <div
        className="relative aspect-[4/5] md:aspect-[3/2] overflow-hidden rounded-3xl bg-espresso"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        {/* Soft blurred copy fills the space around portrait shots. */}
        <Image src={photo.src} alt="" aria-hidden fill sizes="10vw" className="object-cover blur-2xl opacity-40 scale-110" />
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-contain"
          priority={index === 0}
        />

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-cream/90 text-espresso flex items-center justify-center hover:bg-cream transition-colors"
        >
          <span aria-hidden>←</span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-cream/90 text-espresso flex items-center justify-center hover:bg-cream transition-colors"
        >
          <span aria-hidden>→</span>
        </button>
        <p className="absolute bottom-4 right-5 font-sans text-xs tracking-widest text-cream/80" aria-live="polite">
          {index + 1} / {count}
        </p>
      </div>

      <ul className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {photos.map((p, i) => (
          <li key={p.src} className="flex-none">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={`relative block w-20 h-16 md:w-24 md:h-20 overflow-hidden rounded-xl transition-opacity ${
                i === index ? "ring-2 ring-terracotta opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={p.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
