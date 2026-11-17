import { addCountLog, addManualEntry, deleteCountLog, deleteEntry, updateCountLog, updateEntry } from "../actions";
import { AddPanel } from "../_components/AddPanel";
import { EditableRow } from "../_components/EditableRow";
import { WeekNav } from "../_components/WeekNav";
import { formatDateTime, formatDuration, formatTime, toLocalInput } from "@/lib/time";
import { getAllCategories, getWeekCountLogs, getWeekEntries } from "@/lib/tracker";
import { colorMap } from "@/lib/ui";
import { resolveWeek } from "@/lib/week-param";

export const metadata = { title: "Log · Tracker" };

export default async function LogPage({ searchParams }: PageProps<"/tracker/log">) {
  const now = new Date();
  const { week, currentWeek } = resolveWeek((await searchParams).week, now);
  const [categories, entries, logs] = await Promise.all([getAllCategories(), getWeekEntries(week), getWeekCountLogs(week)]);

  const colors = colorMap(categories);
  const names = new Map(categories.map((c) => [c.id, c.name]));
  // Active categories first in pickers, archived ones still selectable for corrections.
  const options = (type: "hours" | "count") =>
    categories
      .filter((c) => c.type === type)
      .sort((a, b) => Number(b.is_active) - Number(a.is_active))
      .map((c) => ({ id: c.id, name: c.is_active ? c.name : `${c.name} (archived)` }));
  const hourOptions = options("hours");
  const countOptions = options("count");
  const totalMs = entries.reduce(
    (s, e) => s + ((e.ended_at ? new Date(e.ended_at) : now).getTime() - new Date(e.started_at).getTime()),
    0,
  );

  return (
    <main>
      <header className="pb-5 pt-7 sm:pt-8">
        <p className="eyebrow">Everything editable</p>
        <h1 className="mt-1.5 font-serif text-[40px] leading-[1.05] sm:text-5xl">Log</h1>
        <p className="mt-2 text-sm text-text2">Fix a forgotten timer, back-date a log, or delete a mistake.</p>
      </header>

      <WeekNav basePath="/tracker/log" week={week} currentWeek={currentWeek} />

      <section className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="eyebrow">Time</h2>
          <p className="text-sm tabular-nums text-muted">{formatDuration(totalMs)} total</p>
        </div>
        <div className="space-y-3">
          <AddPanel kind="time" label="Add a time entry" categories={hourOptions} onSubmit={addManualEntry} />
          {entries.length === 0 ? (
            <p className="px-1 text-sm text-muted">No time logged this week.</p>
          ) : (
            <ul className="card divide-y divide-line overflow-hidden">
              {entries.map((e) => {
                const start = new Date(e.started_at);
                const end = e.ended_at ? new Date(e.ended_at) : null;
                const name = names.get(e.category_id) ?? "Unknown";
                return (
                  <EditableRow
                    key={e.id}
                    kind="time"
                    color={colors.get(e.category_id) ?? "#9a8f83"}
                    title={name}
                    badge={end ? undefined : "running"}
                    subtitle={`${formatDateTime(start)} – ${end ? formatTime(end) : "now"} · ${formatDuration(
                      (end ?? now).getTime() - start.getTime(),
                    )}${e.note ? ` · ${e.note}` : ""}`}
                    categories={hourOptions}
                    defaults={{
                      category_id: e.category_id,
                      started_at: toLocalInput(start),
                      ended_at: end ? toLocalInput(end) : "",
                      note: e.note ?? "",
                    }}
                    allowOpenEnd={!end}
                    onSave={updateEntry.bind(null, e.id)}
                    onDelete={deleteEntry.bind(null, e.id)}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="eyebrow">Counts</h2>
          <p className="text-sm tabular-nums text-muted">{logs.length} logged</p>
        </div>
        <div className="space-y-3">
          <AddPanel kind="count" label="Add a count log" categories={countOptions} onSubmit={addCountLog} />
          {logs.length === 0 ? (
            <p className="px-1 text-sm text-muted">Nothing counted this week.</p>
          ) : (
            <ul className="card divide-y divide-line overflow-hidden">
              {logs.map((l) => {
                const at = new Date(l.logged_at);
                return (
                  <EditableRow
                    key={l.id}
                    kind="count"
                    color={colors.get(l.category_id) ?? "#9a8f83"}
                    title={names.get(l.category_id) ?? "Unknown"}
                    subtitle={`${formatDateTime(at)}${l.note ? ` · ${l.note}` : ""}`}
                    categories={countOptions}
                    defaults={{ category_id: l.category_id, started_at: toLocalInput(at), note: l.note ?? "" }}
                    onSave={updateCountLog.bind(null, l.id)}
                    onDelete={deleteCountLog.bind(null, l.id)}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
