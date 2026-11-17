"use client";

import { useState, useTransition } from "react";
import { startTimer, stopTimer } from "../actions";

type Props = {
  categoryId: string;
  categoryName: string;
  running: { entryId: string; categoryId: string; categoryName: string } | null;
};

export function StartStopButton({ categoryId, categoryName, running }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isThisRunning = running?.categoryId === categoryId;

  function onClick() {
    let stopRunning = false;
    if (running && !isThisRunning) {
      if (!window.confirm(`Stop "${running.categoryName}" and start "${categoryName}"?`)) return;
      stopRunning = true;
    }
    startTransition(async () => {
      if (isThisRunning) {
        const res = await stopTimer(running.entryId);
        setError(res.ok ? null : res.error);
        return;
      }
      let res = await startTimer(categoryId, stopRunning);
      // A timer may have been started on another device since this page loaded.
      if (!res.ok && res.code === "timer_running" && !stopRunning) {
        if (!window.confirm(`Another timer is running. Stop it and start "${categoryName}"?`)) return;
        res = await startTimer(categoryId, true);
      }
      setError(res.ok ? null : res.error);
    });
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={
          isThisRunning
            ? "min-w-20 rounded-xl bg-danger px-4 py-2.5 font-semibold text-bg disabled:opacity-60"
            : "min-w-20 rounded-xl border border-accent/50 px-4 py-2.5 font-semibold text-accent active:bg-accent/10 disabled:opacity-60"
        }
      >
        {pending ? "…" : isThisRunning ? "Stop" : "Start"}
      </button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
