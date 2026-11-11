"use client";

import { useState, useTransition } from "react";
import { saveNoteReply } from "@/app/(portal)/portal/actions";

export function NoteReply({ noteId, initial }: { noteId: string; initial: string }) {
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await saveNoteReply(noteId, text);
        setSaved(text);
      } catch {
        setError("Couldn't save. Please try again.");
      }
    });
  }

  const changed = text !== saved;

  return (
    <div className="mt-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your thoughts or insights this week…"
        className="w-full min-h-24 border border-sand rounded-xl px-3.5 py-3 bg-cream text-[15px] focus:outline-none focus:border-sage-dark"
      />
      <div className="flex items-center gap-3 mt-2">
        <button
          type="button"
          onClick={save}
          disabled={!changed || pending}
          className="bg-terracotta hover:bg-terracotta-dark text-white rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {!changed && saved && <span className="text-[13px] text-sage-dark">Saved · Niamh can see this</span>}
        {error && <span className="text-[13px] text-terracotta-dark">{error}</span>}
      </div>
    </div>
  );
}
