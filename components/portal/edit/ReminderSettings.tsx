"use client";

import { useState } from "react";
import { sendTestReminder } from "@/app/(portal)/portal/admin-actions";
import { Markdown } from "../Markdown";
import { EditablePortalText } from "./EditablePortalText";
import { SmallButton, useSave } from "./ui";

// On Niamh's People page: the reminder email clients get on their practice days.
export function ReminderSettings({ message }: { message: string | null }) {
  const { pending, error, run } = useSave();
  const [sentTo, setSentTo] = useState<string | null>(null);

  return (
    <section className="bg-white rounded-2xl border border-cream-dark mt-7 px-6 py-5">
      <h2 className="font-serif text-2xl">Practice reminder email</h2>
      <p className="text-[13px] text-espresso-light mt-1">
        Clients who switch on reminders get this by email on the mornings they&rsquo;ve chosen. Write{" "}
        <code>{"{name}"}</code> for their first name and <code>{"{practice}"}</code> for the practice (or practices)
        planned that day. Replies come to your inbox.
        {!message && <b> Nothing is sent until you write it.</b>}
      </p>
      <div className="mt-3">
        <EditablePortalText textKey="practice_reminder" label="Reminder message" value={message}>
          {message ? <Markdown className="bg-cream rounded-xl px-4 py-3">{message}</Markdown> : undefined}
        </EditablePortalText>
      </div>
      {message && (
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <SmallButton
            disabled={pending}
            onClick={() =>
              run(async () => {
                setSentTo(await sendTestReminder());
              })
            }
          >
            {pending ? "Sending…" : "Send me a test"}
          </SmallButton>
          {sentTo && !error && <span className="text-[13px] text-sage-dark">Sent to {sentTo}</span>}
          {error && <span className="text-[13px] text-terracotta-dark">{error}</span>}
        </div>
      )}
    </section>
  );
}
