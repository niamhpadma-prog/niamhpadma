"use client";

import { useOptimistic, useTransition } from "react";
import { toggleTask } from "@/app/(portal)/portal/actions";
import type { Task } from "@/lib/portal/corner";
import { Markdown } from "./Markdown";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [optimistic, setOptimistic] = useOptimistic(
    tasks,
    (state, { id, done }: { id: string; done: boolean }) =>
      state.map((t) => (t.id === id ? { ...t, done_at: done ? "now" : null } : t))
  );
  const [, startTransition] = useTransition();

  const done = optimistic.filter((t) => t.done_at).length;

  function onToggle(id: string, value: boolean) {
    startTransition(async () => {
      setOptimistic({ id, done: value });
      await toggleTask(id, value);
    });
  }

  return (
    <>
      <p className="font-sans text-[13px] font-medium text-sage-dark mt-3">
        {done} of {optimistic.length} done
      </p>
      <ul className="mt-2 space-y-1">
        {optimistic.map((task) => (
          <li key={task.id}>
            <label className="flex gap-3 items-start px-3 py-2.5 rounded-[10px] hover:bg-cream cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(task.done_at)}
                onChange={(e) => onToggle(task.id, e.target.checked)}
                className="portal-check mt-0.5"
              />
              <span className={task.done_at ? "text-espresso-light line-through decoration-sand" : ""}>
                <Markdown className="[&_p]:m-0">{task.body}</Markdown>
              </span>
            </label>
            {task.detail && (
              <details className="bg-cream rounded-xl px-4 py-3 my-1.5 ml-11">
                <summary className="cursor-pointer text-sm">Why this is important</summary>
                <Markdown className="text-sm text-espresso-light mt-2">{task.detail}</Markdown>
              </details>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
