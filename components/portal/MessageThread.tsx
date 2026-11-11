"use client";

import { useRef, useState, useTransition } from "react";
import { sendMessage } from "@/app/(portal)/portal/actions";
import type { Message } from "@/lib/portal/corner";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

export function MessageThread({
  clientId,
  viewerId,
  messages,
  asAdmin,
}: {
  clientId: string;
  viewerId: string;
  messages: Message[];
  asAdmin: boolean;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useRef<HTMLFormElement>(null);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await sendMessage(clientId, text);
        setText("");
      } catch {
        setError("Couldn't send. Please try again.");
      }
    });
  }

  return (
    <section className="bg-espresso text-cream rounded-2xl p-6 mt-9">
      <div className="font-sans text-[11px] tracking-[0.18em] uppercase font-semibold text-sand">
        {asAdmin ? "Messages" : "Ask Niamh"}
      </div>
      {!asAdmin && (
        <p className="mt-1.5">
          Finished a task or have a question? Write it here. Niamh gets an email and replies within 48 hours.
        </p>
      )}
      {messages.length > 0 && (
        <div className="mt-4 grid gap-2.5">
          {messages.map((m) => {
            const mine = m.sender_id === viewerId;
            return (
              <div
                key={m.id}
                className={`rounded-xl px-3.5 py-3 text-sm whitespace-pre-wrap ${mine ? "bg-terracotta/25" : "bg-cream/10"}`}
              >
                <b>
                  {mine ? "You" : asAdmin ? "Client" : "Niamh"} · {fmt.format(new Date(m.created_at))}
                </b>
                <br />
                {m.body}
              </div>
            );
          })}
        </div>
      )}
      <form ref={form} onSubmit={send}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={asAdmin ? "Write a reply…" : "Write to Niamh…"}
          className="w-full min-h-24 mt-3 rounded-xl px-3.5 py-3 bg-cream/10 border border-cream/20 text-cream placeholder:text-sand focus:outline-none focus:border-sand"
        />
        <div className="flex items-center gap-3 mt-3">
          <button
            disabled={pending || !text.trim()}
            className="bg-terracotta hover:bg-terracotta-dark text-white rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {pending ? "Sending…" : "Send"}
          </button>
          {error && <span className="text-sm text-sand">{error}</span>}
        </div>
      </form>
    </section>
  );
}
