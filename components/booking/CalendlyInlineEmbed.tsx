"use client";

import Script from "next/script";

interface CalendlyInlineEmbedProps {
  url: string;
  minHeight?: number;
  className?: string;
  hideEventTypeDetails?: boolean;
  hideGdprBanner?: boolean;
}

export function CalendlyInlineEmbed({
  url,
  minHeight = 720,
  className = "",
  hideEventTypeDetails = false,
  hideGdprBanner = true,
}: CalendlyInlineEmbedProps) {
  const params = new URLSearchParams();
  if (hideEventTypeDetails) params.set("hide_event_type_details", "1");
  if (hideGdprBanner) params.set("hide_gdpr_banner", "1");
  // Theme tokens — match site palette (cream, espresso, terracotta, sage)
  params.set("background_color", "fbf6ee");
  params.set("text_color", "3a2e22");
  params.set("primary_color", "c97b5e");

  const dataUrl = `${url}?${params.toString()}`;

  return (
    <>
      <div
        className={`calendly-inline-widget w-full ${className}`}
        data-url={dataUrl}
        style={{ minWidth: 320, minHeight, height: minHeight }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}
