"use client";

import { useState } from "react";
import { updatePortalText, type PortalTextKey } from "@/app/(portal)/portal/admin-actions";
import { EditPanel, FORMAT_HINT, SaveBar, SmallButton, inputClass, useSave } from "./ui";

// Wording on a STILroom page that Niamh can change in place.
export function EditablePortalText({
  textKey,
  label,
  value,
  children,
}: {
  textKey: PortalTextKey;
  label: string;
  value: string | null;
  children?: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value ?? "");
  const { pending, error, run } = useSave();

  if (editing) {
    return (
      <EditPanel>
        <div className="text-xs font-semibold text-sage-dark mb-2">{label}</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={Math.min(24, Math.max(5, text.split("\n").length + 2))}
          className={`${inputClass} leading-relaxed`}
          autoFocus
        />
        <p className="text-[12px] text-espresso-light mt-2">{FORMAT_HINT}</p>
        <SaveBar
          pending={pending}
          error={error}
          onSave={() => run(() => updatePortalText(textKey, text), () => setEditing(false))}
          onCancel={() => {
            setText(value ?? "");
            setEditing(false);
          }}
        />
      </EditPanel>
    );
  }

  return (
    <div>
      {children ?? <p className="text-espresso-light italic my-2">No {label.toLowerCase()} yet.</p>}
      <div className="mt-1">
        <SmallButton onClick={() => setEditing(true)}>Edit {label.toLowerCase()}</SmallButton>
      </div>
    </div>
  );
}
