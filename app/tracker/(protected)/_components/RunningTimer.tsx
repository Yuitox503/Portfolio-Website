"use client";

import { useEffect, useState, useTransition } from "react";
import { stopTimer } from "../actions";
import { formatClock, formatTime } from "@/lib/time";
import { StopIcon } from "./icons";

type Props = { entryId: string; categoryName: string; startedAt: string; serverNow: number; color: string };

export function RunningTimer({ entryId, categoryName, startedAt, serverNow, color }: Props) {
  const start = new Date(startedAt).getTime();
  // First paint uses the server clock so SSR and hydration agree, then it ticks locally.
  const [now, setNow] = useState(serverNow);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="sticky top-3 z-20 mt-4 overflow-hidden rounded-3xl bg-raised/90 p-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-line-strong backdrop-blur-xl"
      aria-label="Running timer"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{ background: `radial-gradient(90% 120% at 0% 0%, ${color}55, transparent 60%)` }}
      />
      <div className="relative flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm text-text2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60" style={{ background: color }} />
              <span className="relative inline-flex size-2.5 rounded-full" style={{ background: color }} />
            </span>
            <span className="truncate">{categoryName}</span>
            <span className="shrink-0 text-muted">· since {formatTime(new Date(start))}</span>
          </p>
          <p className="mt-0.5 font-serif text-[44px] leading-none tabular-nums text-text">{formatClock(now - start)}</p>
        </div>
        <button
          type="button"
          disabled={pending}
          aria-label={`Stop ${categoryName} timer`}
          onClick={() =>
            startTransition(async () => {
              const res = await stopTimer(entryId);
              setError(res.ok ? null : res.error);
            })
          }
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-danger text-bg transition active:scale-95 disabled:opacity-50"
        >
          <StopIcon width={22} height={22} />
        </button>
      </div>
      {error && <p className="relative mt-2 text-sm text-danger">{error}</p>}
    </section>
  );
}
