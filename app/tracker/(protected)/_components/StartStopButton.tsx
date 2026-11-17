"use client";

import { useState, useTransition } from "react";
import { startTimer, stopTimer } from "../actions";
import { PlayIcon, StopIcon } from "./icons";

type Props = {
  categoryId: string;
  categoryName: string;
  color: string;
  running: { entryId: string; categoryId: string; categoryName: string } | null;
};

export function StartStopButton({ categoryId, categoryName, color, running }: Props) {
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
        aria-label={isThisRunning ? `Stop ${categoryName}` : `Start ${categoryName}`}
        className="flex size-12 items-center justify-center rounded-full transition active:scale-95 disabled:opacity-50"
        style={
          isThisRunning
            ? { background: "var(--color-danger)", color: "var(--color-bg)" }
            : { background: `${color}1f`, color, boxShadow: `inset 0 0 0 1px ${color}55` }
        }
      >
        {isThisRunning ? <StopIcon /> : <PlayIcon className="translate-x-px" />}
      </button>
      {error && <p className="mt-1 max-w-40 text-right text-xs text-danger">{error}</p>}
    </div>
  );
}
