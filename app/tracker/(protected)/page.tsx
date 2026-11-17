import { DashboardView } from "./_components/DashboardView";
import { dateKey } from "@/lib/time";
import {
  getAllCategories,
  getReview,
  getRunningEntry,
  getWeekChecks,
  getWeekCountLogs,
  getWeekEntries,
} from "@/lib/tracker";
import { resolveWeek } from "@/lib/week-param";

export default async function TrackerPage({ searchParams }: PageProps<"/tracker">) {
  const now = new Date();
  const { week, currentWeek } = resolveWeek((await searchParams).week, now);

  const [categories, running, entries, logs, checks, review] = await Promise.all([
    getAllCategories(),
    getRunningEntry(),
    getWeekEntries(week),
    getWeekCountLogs(week),
    getWeekChecks(week),
    getReview(week),
  ]);

  return (
    <DashboardView
      now={now}
      week={week}
      currentWeek={currentWeek}
      today={dateKey(now)}
      categories={categories}
      running={running}
      entries={entries}
      logs={logs}
      checks={checks}
      review={review}
    />
  );
}
