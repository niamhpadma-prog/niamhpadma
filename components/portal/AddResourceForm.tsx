"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/media";
import { MAX_UPLOAD_BYTES as MAX_BYTES, kindFor, storageName } from "@/lib/portal/upload";

// Niamh's form for adding a recording or file to one client's corner.
export function AddResourceForm({
  clientId,
  notes,
}: {
  clientId: string;
  notes: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [noteId, setNoteId] = useState("");
  const [status, setStatus] = useState<{ error?: string; done?: string }>({});
  const [busy, setBusy] = useState(false);

  function pick(f: File | null) {
    setFile(f);
    setStatus({});
    if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setStatus({ error: "That file is over 50 MB. Send it to Claude to make a smaller copy first." });
      return;
    }
    setBusy(true);
    setStatus({});

    const supabase = createClient();
    const path = `users/${clientId}/${storageName(file)}`;
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { contentType: file.type || undefined });

    if (uploadError) {
      setBusy(false);
      setStatus({ error: `Upload failed: ${uploadError.message}` });
      return;
    }

    const { error } = await supabase.from("resources").insert({
      user_id: clientId,
      weekly_note_id: noteId || null,
      kind: kindFor(file),
      title: title.trim() || file.name,
      description: description.trim() || null,
      storage_path: path,
    });

    setBusy(false);
    if (error) {
      await supabase.storage.from(MEDIA_BUCKET).remove([path]);
      setStatus({ error: `Couldn't save it: ${error.message}` });
      return;
    }

    setStatus({ done: `"${title.trim() || file.name}" is now in their corner.` });
    setFile(null);
    setTitle("");
    setDescription("");
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  const input =
    "w-full px-3.5 py-2.5 border border-sand rounded-[10px] bg-cream text-[15px] focus:outline-none focus:border-sage-dark";

  return (
    <form onSubmit={upload} className="bg-white rounded-2xl border border-cream-dark p-6 mb-6">
      <div className="text-[11px] tracking-[0.18em] uppercase text-sage-dark font-semibold">
        Add a recording or file
      </div>
      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        <label className="block sm:col-span-2">
          <span className="block text-xs text-espresso-light mb-1.5">File (audio, video or PDF, up to 50 MB)</span>
          <input
            type="file"
            accept="audio/*,video/*,application/pdf"
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
            className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-cream-dark file:px-4 file:py-2 file:text-sm"
            required
          />
        </label>
        <label className="block">
          <span className="block text-xs text-espresso-light mb-1.5">Title the client sees</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} required />
        </label>
        <label className="block">
          <span className="block text-xs text-espresso-light mb-1.5">Short note (optional, e.g. &ldquo;11 min&rdquo;)</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className={input} />
        </label>
        <label className="block sm:col-span-2">
          <span className="block text-xs text-espresso-light mb-1.5">Where it appears</span>
          <select value={noteId} onChange={(e) => setNoteId(e.target.value)} className={input}>
            <option value="">Resources</option>
            {notes.map((n) => (
              <option key={n.id} value={n.id}>
                Weekly notes · {n.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-center gap-3 mt-5">
        <button
          disabled={busy || !file}
          className="bg-terracotta hover:bg-terracotta-dark text-white rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
        {status.error && <span className="text-sm text-terracotta-dark">{status.error}</span>}
        {status.done && <span className="text-sm text-sage-dark">{status.done}</span>}
      </div>
    </form>
  );
}
