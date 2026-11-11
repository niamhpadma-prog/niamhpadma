"use client";

import { useOptimistic, useTransition } from "react";
import { setIsClient } from "@/app/(portal)/portal/admin-actions";

// The "1:1 client" switch on Niamh's people list.
export function ClientToggle({ userId, isClient }: { userId: string; isClient: boolean }) {
  const [on, setOn] = useOptimistic(isClient);
  const [, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-[12px] text-espresso-light cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() =>
          startTransition(async () => {
            setOn(!on);
            await setIsClient(userId, !on);
          })
        }
        className={`relative w-10 h-[22px] rounded-full transition-colors ${on ? "bg-sage-dark" : "bg-sand"}`}
      >
        <span
          className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-[18px]" : ""}`}
        />
      </button>
      1:1 client
    </label>
  );
}
