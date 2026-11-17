import { addDays, overlapMs, weekRange, weekStartKey } from "./time";
import type { Category, CountLog, TimeEntry } from "./types";

export type CategoryProgress = Category & {
  /** hours for "hours" categories, number of logs for "count" categories */
  actual: number;
  /** 0..1, capped */
  ratio: number;
  hit: boolean;
};

export type WeekSummary = {
  week: string;
  progress: CategoryProgress[];
  /** categories that hit their target */
  score: number;
  total: number;
  /** average of each category's capped completion, 0..100 */
  percent: number;
};

type EntryLike = Pick<TimeEntry, "category_id" | "started_at" | "ended_at">;
type LogLike = Pick<CountLog, "category_id" | "logged_at">;

/**
 * Weekly totals per category, the score (targets hit) and the overall percent.
 * Archived categories are only included if they have data in that week, so
 * archiving one later doesn't rewrite history.
 */
export function computeProgress(
  categories: Category[],
  entries: EntryLike[],
  logs: LogLike[],
  mondayKey: string,
  now: Date,
): WeekSummary {
  const { start, end } = weekRange(mondayKey);
  const ms = new Map<string, number>();
  for (const e of entries) {
    const d = overlapMs(new Date(e.started_at), e.ended_at ? new Date(e.ended_at) : null, start, end, now);
    if (d > 0) ms.set(e.category_id, (ms.get(e.category_id) ?? 0) + d);
  }
  const counts = new Map<string, number>();
  for (const l of logs) {
    const t = new Date(l.logged_at).getTime();
    if (t >= start.getTime() && t < end.getTime()) counts.set(l.category_id, (counts.get(l.category_id) ?? 0) + 1);
  }

  const progress: CategoryProgress[] = categories
    .filter((c) => c.is_active || ms.has(c.id) || counts.has(c.id))
    .map((c) => {
      const actual = c.type === "hours" ? (ms.get(c.id) ?? 0) / 3_600_000 : (counts.get(c.id) ?? 0);
      const ratio = c.weekly_target > 0 ? Math.min(1, actual / c.weekly_target) : 1;
      return { ...c, actual, ratio, hit: actual >= c.weekly_target };
    });

  const score = progress.filter((p) => p.hit).length;
  const percent = progress.length
    ? Math.round((progress.reduce((sum, p) => sum + p.ratio, 0) / progress.length) * 100)
    : 0;
  return { week: mondayKey, progress, score, total: progress.length, percent };
}

/** Summaries for every week from the first week with data up to `currentWeek`, newest first. */
export function computeHistory(
  categories: Category[],
  entries: EntryLike[],
  logs: LogLike[],
  currentWeek: string,
  now: Date,
  extraWeeks: string[] = [],
): WeekSummary[] {
  const firsts = [
    ...entries.map((e) => weekStartKey(new Date(e.started_at))),
    ...logs.map((l) => weekStartKey(new Date(l.logged_at))),
    ...extraWeeks,
    currentWeek,
  ];
  const first = firsts.reduce((a, b) => (a < b ? a : b));
  const weeks: WeekSummary[] = [];
  // Cap at ~5 years so a mistyped year can't create thousands of rows.
  for (let w = currentWeek, i = 0; w >= first && i < 260; w = addDays(w, -7), i++) {
    weeks.push(computeProgress(categories, entries, logs, w, now));
  }
  return weeks;
}

/** A gentle one-word read on the week. */
export function weekMood(percent: number) {
  if (percent >= 100) return "Perfect week";
  if (percent >= 80) return "Strong week";
  if (percent >= 50) return "Steady week";
  if (percent > 0) return "Slow week";
  return "Fresh start";
}
