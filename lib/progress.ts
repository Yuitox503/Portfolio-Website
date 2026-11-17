import { overlapMs, weekRange } from "./time";
import type { Category, CountLog, TimeEntry } from "./tracker";

export type CategoryProgress = Category & {
  /** hours for "hours" categories, number of logs for "count" categories */
  actual: number;
  hit: boolean;
};

/** Pure: weekly totals per category and the score. */
export function computeProgress(
  categories: Category[],
  entries: Pick<TimeEntry, "category_id" | "started_at" | "ended_at">[],
  logs: Pick<CountLog, "category_id">[],
  mondayKey: string,
  now: Date,
) {
  const { start, end } = weekRange(mondayKey);
  const ms = new Map<string, number>();
  for (const e of entries) {
    const d = overlapMs(new Date(e.started_at), e.ended_at ? new Date(e.ended_at) : null, start, end, now);
    ms.set(e.category_id, (ms.get(e.category_id) ?? 0) + d);
  }
  const counts = new Map<string, number>();
  for (const l of logs) counts.set(l.category_id, (counts.get(l.category_id) ?? 0) + 1);

  const progress: CategoryProgress[] = categories.map((c) => {
    const actual = c.type === "hours" ? (ms.get(c.id) ?? 0) / 3_600_000 : (counts.get(c.id) ?? 0);
    return { ...c, actual, hit: actual >= c.weekly_target };
  });
  return { progress, score: progress.filter((p) => p.hit).length, total: progress.length };
}
