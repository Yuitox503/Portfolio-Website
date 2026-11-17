import { deleteCountLog } from "./actions";
import { ActionButton } from "./_components/ActionButton";
import { CountLogger } from "./_components/CountLogger";
import { DailyChecks } from "./_components/DailyChecks";
import { Header } from "./_components/Header";
import { ProgressBar } from "./_components/ProgressBar";
import { RefreshOnFocus } from "./_components/RefreshOnFocus";
import { RunningTimer } from "./_components/RunningTimer";
import { StartStopButton } from "./_components/StartStopButton";
import { WeekNav } from "./_components/WeekNav";
import { computeProgress } from "@/lib/progress";
import { getCategories, getDailyChecks, getRunningEntry, getWeekCountLogs, getWeekEntries } from "@/lib/tracker";
import { dateKey, formatDateTime, formatHours } from "@/lib/time";
import { resolveWeek } from "@/lib/week-param";

const NOTE_PLACEHOLDERS: Record<string, string> = {
  "Job applications": "Company (optional)",
};

export default async function TrackerPage({ searchParams }: PageProps<"/tracker">) {
  const now = new Date();
  const { week, currentWeek } = resolveWeek((await searchParams).week, now);
  const today = dateKey(now);

  const [categories, running, entries, logs, checks] = await Promise.all([
    getCategories(),
    getRunningEntry(),
    getWeekEntries(week),
    getWeekCountLogs(week),
    getDailyChecks(today),
  ]);

  const { progress, score, total } = computeProgress(categories, entries, logs, week, now);
  const names = new Map(categories.map((c) => [c.id, c.name]));
  const runningInfo = running
    ? { entryId: running.id, categoryId: running.category_id, categoryName: names.get(running.category_id) ?? "Timer" }
    : null;
  const isCurrentWeek = week === currentWeek;

  return (
    <main className="mx-auto max-w-xl px-4 pb-16">
      <RefreshOnFocus />
      {running && runningInfo && (
        <RunningTimer
          entryId={running.id}
          categoryName={runningInfo.categoryName}
          startedAt={running.started_at}
          serverNow={now.getTime()}
        />
      )}
      <Header active="dashboard" />

      <WeekNav basePath="/tracker" week={week} currentWeek={currentWeek} />

      <section className="my-6 flex items-end justify-between rounded-2xl border border-line bg-surface px-5 py-4">
        <div>
          <p className="text-sm text-muted">Weekly score</p>
          <p className="font-display text-4xl font-bold">
            <span className={score === total && total > 0 ? "text-accent" : ""}>{score}</span>
            <span className="text-dim"> / {total}</span>
          </p>
        </div>
        <p className="pb-1 text-right text-sm text-muted">targets hit</p>
      </section>

      {categories.length === 0 && (
        <p className="mb-6 rounded-xl border border-orange/40 bg-orange/10 p-4 text-sm">
          No categories yet. Run <code>supabase/seed.sql</code> (see TRACKER_SETUP.md).
        </p>
      )}

      <ul className="space-y-3">
        {progress.map((c) => {
          const actualLabel = c.type === "hours" ? formatHours(c.actual) : String(c.actual);
          const unit = c.type === "hours" ? " hrs" : "";
          return (
            <li
              key={c.id}
              className={`rounded-2xl border bg-surface p-4 ${c.hit ? "border-accent/40" : "border-line"}`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className={`text-sm tabular-nums ${c.hit ? "text-accent" : "text-muted"}`}>
                    {actualLabel} / {c.weekly_target}
                    {unit}
                    {c.hit && " ✓"}
                  </p>
                </div>
                {c.type === "hours" && (
                  <StartStopButton categoryId={c.id} categoryName={c.name} running={runningInfo} />
                )}
              </div>
              <ProgressBar value={c.actual} target={c.weekly_target} hit={c.hit} />
              {c.type === "count" && isCurrentWeek && (
                <CountLogger categoryId={c.id} placeholder={NOTE_PLACEHOLDERS[c.name] ?? "Note (optional)"} />
              )}
            </li>
          );
        })}
      </ul>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold">Today</h2>
        <DailyChecks key={today} date={today} initial={checks} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold">Recent logs</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-muted">Nothing logged this week.</p>
        ) : (
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {logs.slice(0, 15).map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {names.get(l.category_id) ?? "Unknown"}
                    {l.note && <span className="text-text2"> · {l.note}</span>}
                  </p>
                  <p className="text-xs text-muted">{formatDateTime(new Date(l.logged_at))}</p>
                </div>
                <ActionButton
                  action={deleteCountLog.bind(null, l.id)}
                  label="Undo"
                  confirmText="Remove this log?"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
