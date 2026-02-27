"use client";

import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ReactNode } from "react";

export function SiteWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main className="pt-[56px] md:pt-[64px]">{children}</main>
      <Footer />
    </>
  );
}
