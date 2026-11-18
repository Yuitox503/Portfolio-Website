import Link from "next/link";
import { deleteCountLog } from "../actions";
import { ActionButton } from "./ActionButton";
import { CountLogger } from "./CountLogger";
import { CheckIcon, ChevronRight, StarIcon } from "./icons";
import { ProgressBar } from "./ProgressBar";
import { RunningTimer } from "./RunningTimer";
import { StartStopButton } from "./StartStopButton";
import { WeekChecks } from "./WeekChecks";
import { WeekNav } from "./WeekNav";
import { WeekSummaryCard } from "./WeekSummaryCard";
import { computeProgress } from "@/lib/progress";
import type { Category, CountLog, TimeEntry, WeekChecks as Checks, WeeklyReview } from "@/lib/types";
import { addDays, formatDateTime, formatHours } from "@/lib/time";
import { colorMap, FALLBACK_COLOR, greeting, longDate, UNKNOWN_COLOR } from "@/lib/ui";

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
          color={colors.get(running.category_id) ?? FALLBACK_COLOR}
        />
      )}

      <header className="pb-5 pt-7 sm:pt-8">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-[44px] sm:leading-[1.1]">{greeting(now)}</h1>
        <p className="mt-1.5 text-muted">{longDate(now)}</p>
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-x-10">
        <div>
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
                        {review.rating ? (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 align-middle text-primary">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <StarIcon key={i} width={13} height={13} fill="currentColor" />
                            ))}
                          </span>
                        ) : null}
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
              <Link href="/tracker/settings" className="text-primary underline underline-offset-4">
                Settings
              </Link>{" "}
              or run <code>supabase/seed.sql</code>.
            </p>
          )}

          <h2 className="section-title mb-3 mt-9">Targets</h2>
          <ul className="card divide-y divide-line">
            {summary.progress.map((c) => {
              const color = colors.get(c.id) ?? FALLBACK_COLOR;
              const actual = c.type === "hours" ? formatHours(c.actual) : String(c.actual);
              return (
                <li key={c.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {c.name}
                        {!c.is_active && <span className="ml-2 text-xs text-dim">archived</span>}
                      </p>
                      <p className="num mt-0.5 text-sm text-muted">
                        <span className={c.hit ? "font-medium text-hit" : "text-text2"}>{actual}</span> / {c.weekly_target}
                        {c.type === "hours" ? " hrs" : ""}
                        {c.hit && (
                          <span className="ml-2 inline-flex items-center gap-1 text-hit">
                            <CheckIcon width={14} height={14} />
                            done
                          </span>
                        )}
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
        </div>

        <div>
          <h2 className="section-title mb-3 mt-9 lg:mt-0">Daily rituals</h2>
          <WeekChecks key={week} days={days} today={today} initial={checks} />

          <div className="mb-3 mt-9 flex items-baseline justify-between">
            <h2 className="section-title">Recent logs</h2>
            <Link
              href={isCurrentWeek ? "/tracker/log" : `/tracker/log?week=${week}`}
              className="inline-flex items-center gap-0.5 text-sm font-medium text-muted transition hover:text-text2"
            >
              Edit all <ChevronRight width={16} height={16} />
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
                    style={{ background: colors.get(l.category_id) ?? UNKNOWN_COLOR }}
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
        </div>
      </div>
    </main>
  );
}
