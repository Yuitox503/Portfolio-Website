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
    <div>
      <ul className="card divide-y divide-line">
        {DAILY_CHECKS.map(({ key, label }) => {
          const doneCount = days.filter((d) => checks[d]?.[key]).length;
          return (
            <li key={key} className="p-4">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <p className="font-medium">{label}</p>
                <p className="num text-sm text-muted">{doneCount}/7</p>
              </div>
              <ol className="grid grid-cols-7 gap-1.5">
                {days.map((date, i) => {
                  const done = Boolean(checks[date]?.[key]);
                  const isToday = date === today;
                  const future = date > today;
                  const look = done
                    ? "bg-hit text-bg"
                    : isToday
                      ? "bg-surface2 text-transparent ring-2 ring-primary hover:text-dim"
                      : "bg-surface2 text-transparent ring-1 ring-line-strong hover:text-dim";
                  return (
                    <li key={date} className="flex flex-col items-center gap-1.5">
                      <span className={`text-[11px] font-medium ${isToday ? "text-primary" : "text-dim"}`}>
                        {DAY_LETTERS[i]}
                      </span>
                      <button
                        type="button"
                        disabled={future}
                        aria-pressed={done}
                        aria-label={`${label}, ${date}${isToday ? " (today)" : ""}`}
                        onClick={() => toggle(date, key, !done)}
                        className={`flex aspect-square w-full max-w-11 items-center justify-center rounded-full transition duration-300 ease-soft active:scale-90 ${look} ${future ? "opacity-30" : ""}`}
                      >
                        <CheckIcon width={16} height={16} />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </li>
          );
        })}
      </ul>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
