"use client";

import { useState } from "react";
import { deleteTask, moveTask, saveTask } from "@/app/(portal)/portal/admin-actions";
import type { Task } from "@/lib/portal/corner";
import { Markdown } from "../Markdown";
import { EditPanel, FORMAT_HINT, Label, SaveBar, SmallButton, inputClass, useSave } from "./ui";

type Draft = { id?: string; section: string; body: string; detail: string };

function TaskForm({
  clientId,
  draft,
  onClose,
}: {
  clientId: string;
  draft: Draft;
  onClose: () => void;
}) {
  const [value, setValue] = useState(draft);
  const { pending, error, run } = useSave();
  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValue({ ...value, [k]: e.target.value });

  return (
    <EditPanel>
      <Label>Task</Label>
      <textarea value={value.body} onChange={set("body")} rows={3} className={inputClass} autoFocus />
      <Label>&ldquo;Why this is important&rdquo; (optional, shown in a fold-out under the task)</Label>
      <textarea value={value.detail} onChange={set("detail")} rows={2} className={inputClass} />
      <Label>Checklist heading (tasks with the same heading are grouped together)</Label>
      <input value={value.section} onChange={set("section")} className={inputClass} />
      <p className="text-[12px] text-espresso-light mt-2">{FORMAT_HINT}</p>
      <SaveBar
        pending={pending}
        error={error}
        saveLabel={draft.id ? "Save" : "Add task"}
        onSave={() => run(() => saveTask(clientId, value), onClose)}
        onCancel={onClose}
      />
    </EditPanel>
  );
}

// Niamh's version of the checklist: same look, plus edit, reorder and delete.
export function TaskListAdmin({
  clientId,
  section,
  tasks,
}: {
  clientId: string;
  section: string;
  tasks: Task[];
}) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const { pending, error, run } = useSave();
  const doneCount = tasks.filter((t) => t.done_at).length;

  return (
    <>
      {tasks.length > 0 && (
        <p className="font-sans text-[13px] font-medium text-sage-dark mt-3">
          Client has done {doneCount} of {tasks.length}
        </p>
      )}
      <ul className="mt-2 space-y-1">
        {tasks.map((task, i) =>
          editing === task.id ? (
            <li key={task.id}>
              <TaskForm
                clientId={clientId}
                draft={{ id: task.id, section: task.section, body: task.body, detail: task.detail ?? "" }}
                onClose={() => setEditing(null)}
              />
            </li>
          ) : (
            <li key={task.id} className="px-3 py-2.5 rounded-[10px] hover:bg-cream">
              <div className="flex gap-3 items-start">
                <span className={`portal-check mt-0.5 ${task.done_at ? "!bg-sage-dark !border-sage-dark" : ""}`} aria-hidden />
                <div className="flex-1 min-w-0">
                  <Markdown className="[&_p]:m-0">{task.body}</Markdown>
                  {task.detail && (
                    <div className="text-[13px] text-espresso-light mt-1">
                      <b>Why this is important:</b> <Markdown className="inline [&_p]:inline">{task.detail}</Markdown>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <SmallButton onClick={() => setEditing(task.id)}>Edit</SmallButton>
                    <SmallButton label="Move up" disabled={i === 0 || pending} onClick={() => run(() => moveTask(clientId, task.id, "up"))}>↑</SmallButton>
                    <SmallButton label="Move down" disabled={i === tasks.length - 1 || pending} onClick={() => run(() => moveTask(clientId, task.id, "down"))}>↓</SmallButton>
                    <SmallButton
                      tone="danger"
                      disabled={pending}
                      onClick={() => {
                        if (confirm("Delete this task? This can't be undone.")) run(() => deleteTask(clientId, task.id));
                      }}
                    >
                      Delete
                    </SmallButton>
                  </div>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
      {error && <p className="text-sm text-terracotta-dark mt-2">{error}</p>}
      {editing === "new" ? (
        <TaskForm clientId={clientId} draft={{ section, body: "", detail: "" }} onClose={() => setEditing(null)} />
      ) : (
        <div className="mt-2 ml-3">
          <SmallButton onClick={() => setEditing("new")}>+ Add task</SmallButton>
        </div>
      )}
    </>
  );
}
