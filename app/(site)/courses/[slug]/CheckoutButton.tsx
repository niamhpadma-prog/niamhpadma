"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface CheckoutButtonProps {
  courseSlug: string;
  stripePriceId?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function CheckoutButton({
  courseSlug,
  stripePriceId,
  children,
  size = "lg",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!stripePriceId) return;
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      variant="primary"
      size={size}
      disabled={loading || !stripePriceId}
    >
      {loading ? "Redirecting..." : children}
    </Button>
  );
}
