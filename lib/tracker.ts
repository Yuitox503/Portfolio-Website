import "server-only";
import { requireUser } from "@/lib/auth";
import { addDays, weekRange } from "@/lib/time";
import type { Category, CountLog, TimeEntry, WeekChecks, WeeklyReview } from "@/lib/types";

export type { Category, CountLog, TimeEntry, WeeklyReview } from "@/lib/types";

const CATEGORY_COLS = "id, name, type, weekly_target, sort_order, is_active";
const ENTRY_COLS = "id, category_id, started_at, ended_at, note";
const LOG_COLS = "id, category_id, logged_at, note";
const REVIEW_COLS = "week_start, rating, went_well, to_improve, next_focus, updated_at";

function fail(what: string, error: { message: string } | null): never {
  throw new Error(`Failed to load ${what}: ${error?.message ?? "unknown error"}`);
}

const toCategory = (c: Category): Category => ({ ...c, weekly_target: Number(c.weekly_target) });

/** All categories (active and archived), in display order. */
export async function getAllCategories(): Promise<Category[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("categories").select(CATEGORY_COLS).order("sort_order").order("name");
  if (error) fail("categories", error);
  return data.map(toCategory);
}

export async function getRunningEntry(): Promise<TimeEntry | null> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("time_entries").select(ENTRY_COLS).is("ended_at", null).maybeSingle();
  if (error) fail("running timer", error);
  return data;
}

/** Time entries that overlap the week starting on `mondayKey`, newest first. */
export async function getWeekEntries(mondayKey: string): Promise<TimeEntry[]> {
  const { supabase } = await requireUser();
  const { start, end } = weekRange(mondayKey);
  const { data, error } = await supabase
    .from("time_entries")
    .select(ENTRY_COLS)
    .lt("started_at", end.toISOString())
    .or(`ended_at.is.null,ended_at.gt.${start.toISOString()}`)
    .order("started_at", { ascending: false });
  if (error) fail("time entries", error);
  return data;
}

export async function getWeekCountLogs(mondayKey: string): Promise<CountLog[]> {
  const { supabase } = await requireUser();
  const { start, end } = weekRange(mondayKey);
  const { data, error } = await supabase
    .from("count_logs")
    .select(LOG_COLS)
    .gte("logged_at", start.toISOString())
    .lt("logged_at", end.toISOString())
    .order("logged_at", { ascending: false });
  if (error) fail("count logs", error);
  return data;
}

/** Daily checks for the 7 days of a week. */
export async function getWeekChecks(mondayKey: string): Promise<WeekChecks> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("daily_checks")
    .select("check_date, check_key, done")
    .gte("check_date", mondayKey)
    .lte("check_date", addDays(mondayKey, 6));
  if (error) fail("daily checks", error);
  const out: WeekChecks = {};
  for (const r of data) (out[r.check_date] ??= {})[r.check_key] = r.done;
  return out;
}

export async function getReview(mondayKey: string): Promise<WeeklyReview | null> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("weekly_reviews").select(REVIEW_COLS).eq("week_start", mondayKey).maybeSingle();
  if (error) fail("review", error);
  return data;
}

export async function getAllReviews(): Promise<WeeklyReview[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("weekly_reviews").select(REVIEW_COLS).order("week_start", { ascending: false });
  if (error) fail("reviews", error);
  return data;
}

/** Fetches every row of a table, paging past PostgREST's 1000-row limit. */
async function fetchAll<T>(table: string, cols: string, orderBy: string): Promise<T[]> {
  const { supabase } = await requireUser();
  const page = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += page) {
    const { data, error } = await supabase
      .from(table)
      .select(cols)
      .order(orderBy)
      .order("id")
      .range(from, from + page - 1);
    if (error) fail(table, error);
    rows.push(...(data as T[]));
    if (data.length < page) return rows;
  }
}

/** Everything needed to compute week-by-week history. */
export async function getHistoryData() {
  const [categories, entries, logs, reviews] = await Promise.all([
    getAllCategories(),
    fetchAll<Pick<TimeEntry, "category_id" | "started_at" | "ended_at">>(
      "time_entries",
      "id, category_id, started_at, ended_at",
      "started_at",
    ),
    fetchAll<Pick<CountLog, "category_id" | "logged_at">>("count_logs", "id, category_id, logged_at", "logged_at"),
    getAllReviews(),
  ]);
  return { categories, entries, logs, reviews };
}
