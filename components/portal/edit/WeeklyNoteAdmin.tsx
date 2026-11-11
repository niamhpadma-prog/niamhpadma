"use client";

import { useState } from "react";
import { deleteWeeklyNote, saveWeeklyNote } from "@/app/(portal)/portal/admin-actions";
import { EditPanel, FORMAT_HINT, Label, SaveBar, SmallButton, inputClass, useSave } from "./ui";

type Draft = { id?: string; title: string; note_date: string; body: string };

function NoteForm({ clientId, draft, onClose }: { clientId: string; draft: Draft; onClose: () => void }) {
  const [value, setValue] = useState(draft);
  const { pending, error, run } = useSave();
  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValue({ ...value, [k]: e.target.value });

  return (
    <EditPanel>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <div>
          <Label>Title, e.g. &ldquo;Week 3&rdquo;</Label>
          <input value={value.title} onChange={set("title")} className={inputClass} autoFocus />
        </div>
        <div>
          <Label>Date</Label>
          <input type="date" value={value.note_date} onChange={set("note_date")} className={inputClass} />
        </div>
      </div>
      <Label>Note for the client</Label>
      <textarea
        value={value.body}
        onChange={set("body")}
        rows={Math.min(20, Math.max(5, value.body.split("\n").length + 2))}
        className={inputClass}
      />
      <p className="text-[12px] text-espresso-light mt-2">
        {FORMAT_HINT}. To attach a recording, use &ldquo;Add a recording or file&rdquo; at the top of the page.
      </p>
      <SaveBar
        pending={pending}
        error={error}
        saveLabel={draft.id ? "Save" : "Add weekly note"}
        onSave={() => run(() => saveWeeklyNote(clientId, value), onClose)}
        onCancel={onClose}
      />
    </EditPanel>
  );
}

export function NewWeeklyNote({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false);
  if (open) {
    return (
      <NoteForm
        clientId={clientId}
        draft={{ title: "", note_date: new Date().toISOString().slice(0, 10), body: "" }}
        onClose={() => setOpen(false)}
      />
    );
  }
  return (
    <div className="my-3">
      <SmallButton onClick={() => setOpen(true)}>+ Add weekly note</SmallButton>
    </div>
  );
}

// Wraps one weekly note in Niamh's view with Edit and Delete.
export function WeeklyNoteAdmin({
  clientId,
  note,
  children,
}: {
  clientId: string;
  note: { id: string; title: string; note_date: string | null; body: string | null };
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const { pending, error, run } = useSave();

  if (editing) {
    return (
      <NoteForm
        clientId={clientId}
        draft={{ id: note.id, title: note.title, note_date: note.note_date ?? "", body: note.body ?? "" }}
        onClose={() => setEditing(false)}
      />
    );
  }

  return (
    <div>
      {children}
      <div className="flex flex-wrap gap-1.5 mt-3">
        <SmallButton onClick={() => setEditing(true)}>Edit note</SmallButton>
        <SmallButton
          tone="danger"
          disabled={pending}
          onClick={() => {
            if (confirm(`Delete “${note.title}”? Recordings attached to it move to Resources; anything the client wrote on it is deleted.`))
              run(() => deleteWeeklyNote(clientId, note.id));
          }}
        >
          Delete note
        </SmallButton>
        {error && <span className="text-sm text-terracotta-dark">{error}</span>}
      </div>
    </div>
  );
}
