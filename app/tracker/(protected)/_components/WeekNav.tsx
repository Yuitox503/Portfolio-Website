import Link from "next/link";
import { addDays, formatWeekLabel } from "@/lib/time";
import { ChevronLeft, ChevronRight } from "./icons";

type Props = {
  basePath: string;
  week: string;
  currentWeek: string;
  /** Put the week in the path (/base/2026-11-16) instead of ?week= */
  pathStyle?: boolean;
};

export function WeekNav({ basePath, week, currentWeek, pathStyle }: Props) {
  const href = (w: string) =>
    pathStyle ? `${basePath}/${w}` : w === currentWeek ? basePath : `${basePath}?week=${w}`;
  const isCurrent = week === currentWeek;
  const btn =
    "flex size-10 shrink-0 items-center justify-center rounded-full text-text2 ring-1 ring-line transition active:bg-surface2";

  return (
    <nav className="flex items-center gap-3" aria-label="Choose week">
      <Link href={href(addDays(week, -7))} className={btn} aria-label="Previous week">
        <ChevronLeft />
      </Link>
      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-[15px] font-medium text-text">{formatWeekLabel(week)}</p>
        {isCurrent ? (
          <p className="eyebrow mt-0.5 !text-amber">This week</p>
        ) : (
          <Link href={href(currentWeek)} className="eyebrow mt-0.5 inline-block underline decoration-dim underline-offset-4">
            Jump to this week
          </Link>
        )}
      </div>
      {isCurrent ? (
        <span className={`${btn} opacity-25`} aria-hidden>
          <ChevronRight />
        </span>
      ) : (
        <Link href={href(addDays(week, 7))} className={btn} aria-label="Next week">
          <ChevronRight />
        </Link>
      )}
    </nav>
  );
}
