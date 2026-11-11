"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/media";
import { MAX_UPLOAD_BYTES, kindFor, storageName } from "@/lib/portal/upload";
import { inputClass } from "./ui";

// Niamh's form for adding a video, recording or PDF to STILroom.
export function StilroomUploadForm({ collections }: { collections: { id: string; title: string }[] }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? "");
  const [status, setStatus] = useState<{ error?: string; done?: string }>({});
  const [busy, setBusy] = useState(false);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setStatus({ error: "That file is over 50 MB. Send it to Claude to make a smaller copy first." });
      return;
    }
    setBusy(true);
    setStatus({});

    const supabase = createClient();
    const path = `stilroom/${storageName(file)}`;
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { contentType: file.type || undefined });
    if (uploadError) {
      setBusy(false);
      setStatus({ error: `Upload failed: ${uploadError.message}` });
      return;
    }

    const name = title.trim() || file.name;
    const { error } = await supabase.from("stilroom_items").insert({
      collection_id: collectionId || null,
      kind: kindFor(file),
      title: name,
      description: description.trim() || null,
      storage_path: path,
    });
    setBusy(false);
    if (error) {
      await supabase.storage.from(MEDIA_BUCKET).remove([path]);
      setStatus({ error: `Couldn't save it: ${error.message}` });
      return;
    }

    setStatus({ done: `"${name}" is now in STILroom.` });
    setFile(null);
    setTitle("");
    setDescription("");
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={upload} className="bg-white rounded-2xl border border-cream-dark p-6 mb-6">
      <div className="text-[11px] tracking-[0.18em] uppercase text-sage-dark font-semibold">
        Add to STILroom
      </div>
      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        <label className="block sm:col-span-2">
          <span className="block text-xs text-espresso-light mb-1.5">File (video, audio or PDF, up to 50 MB)</span>
          <input
            type="file"
            accept="audio/*,video/*,application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setFile(f);
              setStatus({});
              if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, ""));
            }}
            className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-cream-dark file:px-4 file:py-2 file:text-sm"
            required
          />
        </label>
        <label className="block">
          <span className="block text-xs text-espresso-light mb-1.5">Title members see</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
        </label>
        <label className="block">
          <span className="block text-xs text-espresso-light mb-1.5">Short note (optional, e.g. &ldquo;20 min&rdquo;)</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
        </label>
        <label className="block sm:col-span-2">
          <span className="block text-xs text-espresso-light mb-1.5">Collection</span>
          <select value={collectionId} onChange={(e) => setCollectionId(e.target.value)} className={inputClass}>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
            <option value="">More to explore (no collection)</option>
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
