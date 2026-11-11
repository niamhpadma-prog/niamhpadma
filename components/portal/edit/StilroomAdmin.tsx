"use client";

import { useState } from "react";
import {
  deleteCollection,
  deleteStilroomItem,
  saveCollection,
  saveStilroomItem,
} from "@/app/(portal)/portal/admin-actions";
import { EditPanel, Label, SaveBar, SmallButton, inputClass, useSave } from "./ui";

type Collection = { id: string; title: string; description: string | null };

function CollectionForm({ draft, onClose }: { draft: { id?: string; title: string; description: string }; onClose: () => void }) {
  const [value, setValue] = useState(draft);
  const { pending, error, run } = useSave();
  return (
    <EditPanel>
      <Label>Collection title, e.g. &ldquo;Yoga Nidra&rdquo;</Label>
      <input value={value.title} onChange={(e) => setValue({ ...value, title: e.target.value })} className={inputClass} autoFocus />
      <Label>Short description (optional)</Label>
      <textarea value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} rows={2} className={inputClass} />
      <SaveBar
        pending={pending}
        error={error}
        saveLabel={draft.id ? "Save" : "Add collection"}
        onSave={() => run(() => saveCollection(value), onClose)}
        onCancel={onClose}
      />
    </EditPanel>
  );
}

export function NewCollection() {
  const [open, setOpen] = useState(false);
  if (open) return <CollectionForm draft={{ title: "", description: "" }} onClose={() => setOpen(false)} />;
  return (
    <div className="my-3">
      <SmallButton onClick={() => setOpen(true)}>+ Add collection</SmallButton>
    </div>
  );
}

export function CollectionAdmin({ collection, children }: { collection: Collection; children: React.ReactNode }) {
  const [editing, setEditing] = useState(false);
  const { pending, error, run } = useSave();
  if (editing) {
    return (
      <CollectionForm
        draft={{ id: collection.id, title: collection.title, description: collection.description ?? "" }}
        onClose={() => setEditing(false)}
      />
    );
  }
  return (
    <div>
      {children}
      <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
        <SmallButton onClick={() => setEditing(true)}>Edit collection</SmallButton>
        <SmallButton
          tone="danger"
          disabled={pending}
          onClick={() => {
            if (confirm(`Delete the “${collection.title}” collection? Its recordings stay in STILroom under “More to explore”.`))
              run(() => deleteCollection(collection.id));
          }}
        >
          Delete collection
        </SmallButton>
        {error && <span className="text-sm text-terracotta-dark">{error}</span>}
      </div>
    </div>
  );
}

export function StilroomItemAdmin({
  item,
  collections,
  children,
}: {
  item: { id: string; title: string; description: string | null; collection_id: string | null };
  collections: { id: string; title: string }[];
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState({
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    collection_id: item.collection_id ?? "",
  });
  const { pending, error, run } = useSave();

  if (editing) {
    return (
      <EditPanel>
        <Label>Title members see</Label>
        <input value={value.title} onChange={(e) => setValue({ ...value, title: e.target.value })} className={inputClass} autoFocus />
        <Label>Short note (optional)</Label>
        <input value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} className={inputClass} />
        <Label>Collection</Label>
        <select value={value.collection_id} onChange={(e) => setValue({ ...value, collection_id: e.target.value })} className={inputClass}>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
          <option value="">More to explore (no collection)</option>
        </select>
        <SaveBar
          pending={pending}
          error={error}
          onSave={() => run(() => saveStilroomItem(value), () => setEditing(false))}
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
            if (confirm(`Remove “${item.title}” from STILroom? The file is deleted and can't be recovered.`))
              run(() => deleteStilroomItem(item.id));
          }}
        >
          Remove
        </SmallButton>
        {error && <span className="text-sm text-terracotta-dark">{error}</span>}
      </div>
    </div>
  );
}
