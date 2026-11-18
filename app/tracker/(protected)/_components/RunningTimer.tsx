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
      className="sticky top-3 z-20 mt-4 rounded-[20px] bg-raised p-4 ring-1 ring-line-strong"
      aria-label="Running timer"
    >
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm text-text2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
            <span className="truncate font-medium">{categoryName}</span>
            <span className="shrink-0 text-muted">· since {formatTime(new Date(start))}</span>
          </p>
          <p className="num mt-1 text-[44px] font-semibold leading-none tracking-tight text-text">{formatClock(now - start)}</p>
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
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-stop text-bg transition active:scale-95 disabled:opacity-50"
        >
          <StopIcon width={22} height={22} />
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </section>
  );
}
