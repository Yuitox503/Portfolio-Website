"use client";

import { useOptimistic, useState, useTransition } from "react";
import { setDailyCheck } from "../actions";
import { DAILY_CHECKS } from "@/lib/config";
import type { WeekChecks as Checks } from "@/lib/types";
import { CheckIcon } from "./icons";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

type Props = { days: string[]; today: string; initial: Checks };

/** One row of 7 day-dots per check. Any past day or today can be toggled. */
export function WeekChecks({ days, today, initial }: Props) {
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [checks, setOptimistic] = useOptimistic(
    initial,
    (state, { date, key, done }: { date: string; key: string; done: boolean }) => ({
      ...state,
      [date]: { ...state[date], [key]: done },
    }),
  );

  function toggle(date: string, key: string, done: boolean) {
    startTransition(async () => {
      setOptimistic({ date, key, done });
      const res = await setDailyCheck(date, key, done);
      setError(res.ok ? null : res.error);
    });
  }

  return (
    <div className="space-y-3">
      {DAILY_CHECKS.map(({ key, label }) => {
        const doneCount = days.filter((d) => checks[d]?.[key]).length;
        return (
          <div key={key} className="card p-4">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <p className="font-medium">{label}</p>
              <p className="text-sm tabular-nums text-muted">{doneCount}/7</p>
            </div>
            <ol className="grid grid-cols-7 gap-1.5">
              {days.map((date, i) => {
                const done = Boolean(checks[date]?.[key]);
                const isToday = date === today;
                const future = date > today;
                return (
                  <li key={date} className="flex flex-col items-center gap-1.5">
                    <span className={`text-[11px] font-medium ${isToday ? "text-amber" : "text-dim"}`}>
                      {DAY_LETTERS[i]}
                    </span>
                    <button
                      type="button"
                      disabled={future}
                      aria-pressed={done}
                      aria-label={`${label}, ${date}${isToday ? " (today)" : ""}`}
                      onClick={() => toggle(date, key, !done)}
                      className={[
                        "flex aspect-square w-full max-w-11 items-center justify-center rounded-full transition duration-300 ease-soft active:scale-90",
                        done ? "bg-accent text-bg" : "bg-white/[0.06] text-transparent ring-1 ring-line-strong hover:text-dim",
                        isToday && !done ? "!ring-2 !ring-amber/70" : "",
                        future ? "opacity-30" : "",
                      ].join(" ")}
                    >
                      <CheckIcon width={16} height={16} />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
