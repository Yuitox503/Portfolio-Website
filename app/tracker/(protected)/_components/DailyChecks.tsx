"use client";

import { useOptimistic, useState, useTransition } from "react";
import { setDailyCheck } from "../actions";
import { DAILY_CHECKS } from "@/lib/config";

export function DailyChecks({ date, initial }: { date: string; initial: Record<string, boolean> }) {
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [checks, setOptimistic] = useOptimistic(initial, (state, [key, done]: [string, boolean]) => ({
    ...state,
    [key]: done,
  }));

  return (
    <>
      <ul className="space-y-2">
        {DAILY_CHECKS.map(({ key, label }) => {
          const done = Boolean(checks[key]);
          return (
            <li key={key}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={(e) => {
                    const next = e.target.checked;
                    startTransition(async () => {
                      setOptimistic([key, next]);
                      const res = await setDailyCheck(date, key, next);
                      setError(res.ok ? null : res.error);
                    });
                  }}
                  className="size-5 accent-accent"
                />
                <span className={done ? "text-muted line-through" : ""}>{label}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </>
  );
}
