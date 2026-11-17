import Link from "next/link";
import { deleteCountLog } from "../actions";
import { ActionButton } from "./ActionButton";
import { CountLogger } from "./CountLogger";
import { ChevronRight } from "./icons";
import { ProgressBar } from "./ProgressBar";
import { RunningTimer } from "./RunningTimer";
import { StartStopButton } from "./StartStopButton";
import { WeekChecks } from "./WeekChecks";
import { WeekNav } from "./WeekNav";
import { WeekSummaryCard } from "./WeekSummaryCard";
import { computeProgress } from "@/lib/progress";
import type { Category, CountLog, TimeEntry, WeekChecks as Checks, WeeklyReview } from "@/lib/types";
import { addDays, formatDateTime, formatHours } from "@/lib/time";
import { colorMap, greeting, longDate } from "@/lib/ui";

const NOTE_PLACEHOLDERS: Record<string, string> = {
  "Job applications": "Company name",
};

export type DashboardData = {
  now: Date;
  week: string;
  currentWeek: string;
  today: string;
  categories: Category[];
  running: TimeEntry | null;
  entries: TimeEntry[];
  logs: CountLog[];
  checks: Checks;
  review: WeeklyReview | null;
};

/** Presentational dashboard: all data comes in as props. */
export function DashboardView({ now, week, currentWeek, today, categories, running, entries, logs, checks, review }: DashboardData) {
  const isCurrentWeek = week === currentWeek;
  const summary = computeProgress(categories, entries, logs, week, now);
  const colors = colorMap(categories);
  const names = new Map(categories.map((c) => [c.id, c.name]));
  const runningInfo = running
    ? { entryId: running.id, categoryId: running.category_id, categoryName: names.get(running.category_id) ?? "Timer" }
    : null;
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const daysLeft = isCurrentWeek ? 7 - days.indexOf(today) : 0;
  const reviewHref = `/tracker/reviews/${week}`;

  return (
    <main>
      {running && runningInfo && (
        <RunningTimer
          entryId={running.id}
          categoryName={runningInfo.categoryName}
          startedAt={running.started_at}
          serverNow={now.getTime()}
          color={colors.get(running.category_id) ?? "#f2b880"}
        />
      )}

      <header className="pb-5 pt-7 sm:pt-8">
        <p className="eyebrow">{longDate(now)}</p>
        <h1 className="mt-1.5 font-serif text-[40px] leading-[1.05] sm:text-5xl">
          {greeting(now)}<span className="text-amber">.</span>
        </h1>
      </header>

      <WeekNav basePath="/tracker" week={week} currentWeek={currentWeek} />

      <div className="mt-5">
        <WeekSummaryCard
          summary={summary}
          footnote={
            <Link href={reviewHref} className="flex items-center justify-between gap-3">
              <span>
                {review ? (
                  <>
                    <span className="text-text2">Reviewed</span>
                    {review.rating ? <span className="text-amber"> · {"★".repeat(review.rating)}</span> : null}
                  </>
                ) : isCurrentWeek ? (
                  <>
                    {daysLeft === 1 ? "Last day of the week" : `${daysLeft} days left`} ·{" "}
                    <span className="text-text2">reflect on your week</span>
                  </>
                ) : (
                  <span className="text-text2">Write a review for this week</span>
                )}
              </span>
              <ChevronRight className="shrink-0" />
            </Link>
          }
        />
      </div>

      {summary.progress.length === 0 && (
        <p className="card mt-6 p-4 text-sm text-text2">
          No categories yet. Add some in{" "}
          <Link href="/tracker/settings" className="text-amber underline underline-offset-4">
            Settings
          </Link>{" "}
          or run <code>supabase/seed.sql</code>.
        </p>
      )}

      <h2 className="eyebrow mb-3 mt-9">Targets</h2>
      <ul className="space-y-3">
        {summary.progress.map((c) => {
          const color = colors.get(c.id) ?? "#f2b880";
          const actual = c.type === "hours" ? formatHours(c.actual) : String(c.actual);
          return (
            <li key={c.id} className={`card p-4 transition ${c.hit ? "!ring-accent/30" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {c.name}
                    {!c.is_active && <span className="ml-2 text-xs text-dim">archived</span>}
                  </p>
                  <p className="mt-0.5 text-sm tabular-nums text-muted">
                    <span className={c.hit ? "text-accent" : "text-text2"}>{actual}</span> / {c.weekly_target}
                    {c.type === "hours" ? " hrs" : ""}
                    {c.hit && <span className="ml-1.5 text-accent">· done</span>}
                  </p>
                </div>
                {c.type === "hours" && c.is_active && (
                  <StartStopButton categoryId={c.id} categoryName={c.name} color={color} running={runningInfo} />
                )}
              </div>
              <div className="mt-3.5">
                <ProgressBar ratio={c.ratio} hit={c.hit} color={color} label={`${c.name} progress`} />
              </div>
              {c.type === "count" && c.is_active && isCurrentWeek && (
                <CountLogger
                  categoryId={c.id}
                  categoryName={c.name}
                  color={color}
                  notePlaceholder={NOTE_PLACEHOLDERS[c.name]}
                />
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="eyebrow mb-3 mt-9">Daily rituals</h2>
      <WeekChecks key={week} days={days} today={today} initial={checks} />

      <div className="mb-3 mt-9 flex items-baseline justify-between">
        <h2 className="eyebrow">Recent logs</h2>
        <Link href={isCurrentWeek ? "/tracker/log" : `/tracker/log?week=${week}`} className="text-sm text-muted">
          Edit all →
        </Link>
      </div>
      {logs.length === 0 ? (
        <p className="text-sm text-muted">Nothing logged this week yet.</p>
      ) : (
        <ul className="card divide-y divide-line">
          {logs.slice(0, 6).map((l) => (
            <li key={l.id} className="flex items-center gap-3 py-3 pl-4 pr-2">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: colors.get(l.category_id) ?? "#9a8f83" }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {names.get(l.category_id) ?? "Unknown"}
                  {l.note && <span className="text-muted"> · {l.note}</span>}
                </p>
                <p className="text-xs text-dim">{formatDateTime(new Date(l.logged_at))}</p>
              </div>
              <ActionButton action={deleteCountLog.bind(null, l.id)} label="Undo" confirmText="Remove this log?" />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
