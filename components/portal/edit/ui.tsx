"use client";

import { useState, useTransition } from "react";

export const inputClass =
  "w-full px-3.5 py-2.5 border border-sand rounded-[10px] bg-white text-[15px] text-espresso focus:outline-none focus:border-sage-dark";

export const FORMAT_HINT = (
  <>
    Start a line with <code>*</code> for a bullet point · <code>**bold**</code> · links as{" "}
    <code>[text](https://…)</code> · leave a blank line between paragraphs
  </>
);

export function SmallButton({
  children,
  onClick,
  tone = "plain",
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "plain" | "danger";
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`text-[12px] font-medium rounded-full border px-3 py-1 transition-colors disabled:opacity-40 ${
        tone === "danger"
          ? "border-terracotta/40 text-terracotta-dark hover:bg-[#F6E6DD]"
          : "border-sand text-espresso-light hover:bg-cream-dark hover:text-espresso"
      }`}
    >
      {children}
    </button>
  );
}

// Runs a save, keeps track of "Saving…" and shows any error in plain words.
export function useSave() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<void>, onDone?: () => void) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        onDone?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      }
    });
  }

  return { pending, error, run };
}

export function SaveBar({
  pending,
  error,
  onSave,
  onCancel,
  saveLabel = "Save",
}: {
  pending: boolean;
  error: string | null;
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">
      <button
        type="button"
        onClick={onSave}
        disabled={pending}
        className="bg-terracotta hover:bg-terracotta-dark text-white rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {pending ? "Saving…" : saveLabel}
      </button>
      <button type="button" onClick={onCancel} className="text-sm text-espresso-light underline underline-offset-2">
        Cancel
      </button>
      {error && <span className="text-sm text-terracotta-dark">{error}</span>}
    </div>
  );
}

// The dashed box that marks something Niamh is editing.
export function EditPanel({ children }: { children: React.ReactNode }) {
  return <div className="border border-dashed border-sage rounded-xl bg-cream p-4 my-3">{children}</div>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs text-espresso-light mb-1.5 mt-3 first:mt-0">{children}</span>;
}
