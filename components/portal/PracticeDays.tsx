"use client";

import { useState } from "react";
import { deletePracticePlan, savePracticePlan } from "@/app/(portal)/portal/actions";
import type { PracticePlan } from "@/lib/portal/corner";
import { DAY_LABELS } from "@/lib/portal/reminders";
import { SmallButton, inputClass, useSave } from "./edit/ui";

function browserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

function todayIndex() {
  const d = new Date().getDay(); // 0 = Sunday
  return d === 0 ? 7 : d;
}

// "My practice days": each at-home practice, the days the client wants to do
// it, and an optional morning email reminder from Niamh.
export function PracticeDays({
  clientId,
  plans: initial,
  asAdmin,
}: {
  clientId: string;
  plans: PracticePlan[];
  asAdmin: boolean;
}) {
  const [plans, setPlans] = useState(initial);
  const [newTitle, setNewTitle] = useState("");
  const { pending, error, run } = useSave();
  const today = todayIndex();

  function update(plan: PracticePlan, change: Partial<PracticePlan>) {
    const next = { ...plan, ...change };
    setPlans((ps) => ps.map((p) => (p.id === plan.id ? next : p)));
    run(async () => {
      await savePracticePlan(clientId, next, asAdmin ? undefined : browserTimezone());
    });
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    run(async () => {
      const draft = { title, days: [] as number[], reminder_on: false };
      const id = await savePracticePlan(clientId, draft, asAdmin ? undefined : browserTimezone());
      setPlans((ps) => [...ps, { ...draft, id, sort: 0 }]);
      setNewTitle("");
    });
  }

  function remove(plan: PracticePlan) {
    if (!confirm(`Remove “${plan.title}”?`)) return;
    setPlans((ps) => ps.filter((p) => p.id !== plan.id));
    run(() => deletePracticePlan(plan.id));
  }

  return (
    <section>
      <h2 className="font-serif text-[28px] mt-9 mb-2.5 pt-7 border-t border-cream-dark">
        {asAdmin ? "Practice days" : "My practice days"}
      </h2>
      <p className="text-[14px] text-espresso-light">
        {asAdmin
          ? "The at-home practices this client has planned. You can add or change them too."
          : "Add your at-home practices and choose the days you’d like to do them. Switch on a reminder and Niamh will send you a note by email that morning."}
      </p>

      <ul className="mt-4 grid gap-3">
        {plans.map((plan) => (
          <li key={plan.id} className="bg-cream rounded-[14px] px-4 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="font-serif text-xl leading-snug">{plan.title}</div>
              <SmallButton tone="danger" label={`Remove ${plan.title}`} onClick={() => remove(plan)}>
                Remove
              </SmallButton>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3" role="group" aria-label={`Days for ${plan.title}`}>
              {DAY_LABELS.map((label, i) => {
                const day = i + 1;
                const on = plan.days.includes(day);
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      update(plan, { days: on ? plan.days.filter((d) => d !== day) : [...plan.days, day].sort() })
                    }
                    className={`w-12 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                      on
                        ? "bg-sage-dark border-sage-dark text-white"
                        : "bg-white border-sand text-espresso-light hover:border-sage-dark"
                    } ${day === today ? "ring-2 ring-terracotta/40 ring-offset-1 ring-offset-cream" : ""}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-2.5 mt-3 text-[13px] text-espresso-light cursor-pointer w-fit">
              <button
                type="button"
                role="switch"
                aria-checked={plan.reminder_on}
                onClick={() => update(plan, { reminder_on: !plan.reminder_on })}
                className={`relative w-10 h-[22px] rounded-full transition-colors flex-none ${
                  plan.reminder_on ? "bg-terracotta" : "bg-sand"
                }`}
              >
                <span
                  className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform ${
                    plan.reminder_on ? "translate-x-[18px]" : ""
                  }`}
                />
              </button>
              {plan.reminder_on
                ? plan.days.length
                  ? "Email reminder on, sent the morning of each chosen day"
                  : "Email reminder on. Choose some days above"
                : "Email me a reminder"}
            </label>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="flex flex-wrap gap-2 mt-4">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a practice, e.g. 10-minute body scan"
          className={`${inputClass} flex-1 min-w-[220px]`}
        />
        <button
          disabled={pending || !newTitle.trim()}
          className="bg-terracotta hover:bg-terracotta-dark text-white rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && <p className="text-sm text-terracotta-dark mt-2">{error}</p>}
    </section>
  );
}
