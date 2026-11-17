import { addManualEntry } from "../actions";
import { EntryForm } from "../_components/EntryForm";
import { EntryRow } from "../_components/EntryRow";
import { Header } from "../_components/Header";
import { RefreshOnFocus } from "../_components/RefreshOnFocus";
import { WeekNav } from "../_components/WeekNav";
import { getCategories, getWeekEntries } from "@/lib/tracker";
import { formatDateTime, formatDuration, formatTime, toLocalInput } from "@/lib/time";
import { resolveWeek } from "@/lib/week-param";

export const metadata = { title: "Entries · Tracker" };

export default async function EntriesPage({ searchParams }: PageProps<"/tracker/entries">) {
  const now = new Date();
  const { week, currentWeek } = resolveWeek((await searchParams).week, now);
  const [categories, entries] = await Promise.all([getCategories(), getWeekEntries(week)]);

  const hourCats = categories.filter((c) => c.type === "hours");
  const names = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <main className="mx-auto max-w-xl px-4 pb-16">
      <RefreshOnFocus />
      <Header active="entries" />

      <section className="mb-8 rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-display text-lg font-semibold">Add a manual entry</h2>
        <EntryForm categories={hourCats} submitLabel="Add entry" onSubmit={addManualEntry} />
      </section>

      <WeekNav basePath="/tracker/entries" week={week} currentWeek={currentWeek} />

      <h2 className="mb-3 mt-6 font-display text-lg font-semibold">Time entries</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-muted">No time logged this week.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((e) => {
            const start = new Date(e.started_at);
            const end = e.ended_at ? new Date(e.ended_at) : null;
            return (
              <EntryRow
                key={e.id}
                entry={e}
                categoryName={names.get(e.category_id) ?? "Unknown"}
                when={`${formatDateTime(start)} – ${end ? formatTime(end) : "now"}`}
                duration={formatDuration((end ?? now).getTime() - start.getTime())}
                inputs={{ started_at: toLocalInput(start), ended_at: end ? toLocalInput(end) : "" }}
                categories={hourCats}
              />
            );
          })}
        </ul>
      )}
    </main>
  );
}
