import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@/components/analytics/Analytics";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF7F2",
};

export const metadata: Metadata = {
  title: {
    default: "Niamh Padma — Yoga, Breathwork & Somatic Wellness in Lisbon",
    template: "%s | Niamh Padma",
  },
  description:
    "Yoga, breathwork, somatic therapy and holistic nutrition coaching in Lisbon. Retreats across Europe. 100+ coaching hours. Book your session with Niamh Padma.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://niamhpadma.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Niamh Padma",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GSC_ID || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jakarta.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
