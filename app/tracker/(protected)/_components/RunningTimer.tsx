"use client";

import { useEffect, useState, useTransition } from "react";
import { stopTimer } from "../actions";
import { formatClock, formatTime } from "@/lib/time";

type Props = { entryId: string; categoryName: string; startedAt: string; serverNow: number };

export function RunningTimer({ entryId, categoryName, startedAt, serverNow }: Props) {
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
    <section className="sticky top-0 z-10 -mx-4 border-b border-accent/30 bg-bg/95 px-4 py-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <span className="relative flex size-3 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex size-3 rounded-full bg-accent" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-text2">
            {categoryName} <span className="text-muted">· since {formatTime(new Date(start))}</span>
          </p>
          <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-accent">
            {formatClock(now - start)}
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = await stopTimer(entryId);
              setError(res.ok ? null : res.error);
            })
          }
          className="rounded-xl bg-danger px-5 py-3 text-base font-semibold text-bg disabled:opacity-60"
        >
          {pending ? "…" : "Stop"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </section>
  );
}
