"use client";

import { useState } from "react";
import { updateCornerField, type CornerField } from "@/app/(portal)/portal/admin-actions";
import { EditPanel, FORMAT_HINT, SaveBar, SmallButton, inputClass, useSave } from "./ui";

// A piece of corner text (title, welcome, intros) with an Edit button.
export function EditableField({
  clientId,
  field,
  label,
  value,
  multiline = true,
  children,
}: {
  clientId: string;
  field: CornerField;
  label: string;
  value: string | null;
  multiline?: boolean;
  children?: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value ?? "");
  const { pending, error, run } = useSave();

  if (editing) {
    return (
      <EditPanel>
        <div className="text-xs font-semibold text-sage-dark mb-2">{label}</div>
        {multiline ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={Math.min(24, Math.max(4, text.split("\n").length + 2))}
            className={`${inputClass} font-sans leading-relaxed`}
            autoFocus
          />
        ) : (
          <input value={text} onChange={(e) => setText(e.target.value)} className={inputClass} autoFocus />
        )}
        {multiline && <p className="text-[12px] text-espresso-light mt-2">{FORMAT_HINT}</p>}
        <SaveBar
          pending={pending}
          error={error}
          onSave={() => run(() => updateCornerField(clientId, field, text), () => setEditing(false))}
          onCancel={() => {
            setText(value ?? "");
            setEditing(false);
          }}
        />
      </EditPanel>
    );
  }

  return (
    <div className="group relative">
      {children ?? <p className="text-espresso-light italic my-2">No {label.toLowerCase()} yet.</p>}
      <div className="mt-1">
        <SmallButton onClick={() => setEditing(true)}>Edit {label.toLowerCase()}</SmallButton>
      </div>
    </div>
  );
}
