"use client";

import { useActionState } from "react";
import { setPassword } from "@/app/(portal)/portal/set-password/actions";

const inputClass =
  "w-full px-3.5 py-3 border border-sand rounded-[10px] bg-cream font-sans text-[15px] text-espresso focus:outline-none focus:border-sage-dark";

export function SetPasswordForm({ askName }: { askName: boolean }) {
  const [state, action, pending] = useActionState(setPassword, {});

  return (
    <form action={action} className="font-sans text-left">
      {askName && (
        <label className="block mt-5">
          <span className="block text-xs text-espresso-light mb-1.5">Your name</span>
          <input name="full_name" autoComplete="name" className={inputClass} required />
        </label>
      )}
      <label className="block mt-5">
        <span className="block text-xs text-espresso-light mb-1.5">Password (at least 8 characters)</span>
        <input name="password" type="password" autoComplete="new-password" minLength={8} className={inputClass} required />
      </label>
      <button
        className="w-full mt-6 bg-terracotta hover:bg-terracotta-dark text-white rounded-full px-6 py-3 font-medium transition-colors disabled:opacity-60"
        disabled={pending}
      >
        {pending ? "Saving…" : "Open my space"}
      </button>
      {state.error && <p className="text-sm text-terracotta-dark mt-4 text-center">{state.error}</p>}
    </form>
  );
}
