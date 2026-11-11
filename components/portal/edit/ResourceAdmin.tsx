"use client";

import { useState } from "react";
import { deleteResource, saveResource } from "@/app/(portal)/portal/admin-actions";
import type { Resource } from "@/lib/portal/corner";
import { EditPanel, Label, SaveBar, SmallButton, inputClass, useSave } from "./ui";

// Wraps a recording or file in Niamh's view with Edit and Remove.
export function ResourceAdmin({
  clientId,
  resource,
  notes,
  children,
}: {
  clientId: string;
  resource: Resource;
  notes: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState({
    id: resource.id,
    title: resource.title,
    description: resource.description ?? "",
    weekly_note_id: resource.weekly_note_id ?? "",
  });
  const { pending, error, run } = useSave();

  if (editing) {
    return (
      <EditPanel>
        <Label>Title the client sees</Label>
        <input value={value.title} onChange={(e) => setValue({ ...value, title: e.target.value })} className={inputClass} autoFocus />
        <Label>Short note (optional)</Label>
        <input value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} className={inputClass} />
        <Label>Where it appears</Label>
        <select
          value={value.weekly_note_id}
          onChange={(e) => setValue({ ...value, weekly_note_id: e.target.value })}
          className={inputClass}
        >
          <option value="">Resources</option>
          {notes.map((n) => (
            <option key={n.id} value={n.id}>
              Weekly notes · {n.label}
            </option>
          ))}
        </select>
        <SaveBar
          pending={pending}
          error={error}
          onSave={() => run(() => saveResource(clientId, value), () => setEditing(false))}
          onCancel={() => setEditing(false)}
        />
      </EditPanel>
    );
  }

  return (
    <div>
      {children}
      <div className="flex flex-wrap gap-1.5 -mt-1 mb-3">
        <SmallButton onClick={() => setEditing(true)}>Edit</SmallButton>
        <SmallButton
          tone="danger"
          disabled={pending}
          onClick={() => {
            if (confirm(`Remove “${resource.title}” from this corner? The file is deleted and can't be recovered.`))
              run(() => deleteResource(clientId, resource.id));
          }}
        >
          Remove
        </SmallButton>
        {error && <span className="text-sm text-terracotta-dark">{error}</span>}
      </div>
    </div>
  );
}
