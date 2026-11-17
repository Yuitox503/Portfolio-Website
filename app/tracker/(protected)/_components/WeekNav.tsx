import Link from "next/link";
import { addDays, formatWeekLabel } from "@/lib/time";

export function WeekNav({ basePath, week, currentWeek }: { basePath: string; week: string; currentWeek: string }) {
  const href = (w: string) => (w === currentWeek ? basePath : `${basePath}?week=${w}`);
  const isCurrent = week === currentWeek;
  const btn = "flex size-10 items-center justify-center rounded-xl border border-line text-lg text-text2 active:bg-surface2";

  return (
    <nav className="flex items-center gap-2" aria-label="Week">
      <Link href={href(addDays(week, -7))} className={btn} aria-label="Previous week">
        ‹
      </Link>
      <div className="min-w-0 flex-1 text-center">
        <p className="font-display font-semibold">{formatWeekLabel(week)}</p>
        {isCurrent ? (
          <p className="text-xs text-accent">This week</p>
        ) : (
          <Link href={basePath} className="text-xs text-muted underline underline-offset-2">
            Back to this week
          </Link>
        )}
      </div>
      {isCurrent ? (
        <span className={`${btn} opacity-30`} aria-hidden>
          ›
        </span>
      ) : (
        <Link href={href(addDays(week, 7))} className={btn} aria-label="Next week">
          ›
        </Link>
      )}
    </nav>
  );
}
