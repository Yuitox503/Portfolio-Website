import "server-only";
import { requireUser } from "@/lib/auth";
import { weekRange } from "@/lib/time";

export type Category = {
  id: string;
  name: string;
  type: "hours" | "count";
  weekly_target: number;
  sort_order: number;
};

export type TimeEntry = {
  id: string;
  category_id: string;
  started_at: string;
  ended_at: string | null;
  note: string | null;
};

export type CountLog = {
  id: string;
  category_id: string;
  logged_at: string;
  note: string | null;
};

function fail(what: string, error: { message: string } | null): never {
  throw new Error(`Failed to load ${what}: ${error?.message ?? "unknown error"}`);
}

export async function getCategories(): Promise<Category[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, type, weekly_target, sort_order")
    .eq("is_active", true)
    .order("sort_order");
  if (error) fail("categories", error);
  return data.map((c) => ({ ...c, weekly_target: Number(c.weekly_target) }));
}

export async function getRunningEntry(): Promise<TimeEntry | null> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("time_entries")
    .select("id, category_id, started_at, ended_at, note")
    .is("ended_at", null)
    .maybeSingle();
  if (error) fail("running timer", error);
  return data;
}

/** Time entries that overlap the week starting on `mondayKey`, newest first. */
export async function getWeekEntries(mondayKey: string): Promise<TimeEntry[]> {
  const { supabase } = await requireUser();
  const { start, end } = weekRange(mondayKey);
  const { data, error } = await supabase
    .from("time_entries")
    .select("id, category_id, started_at, ended_at, note")
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
    .select("id, category_id, logged_at, note")
    .gte("logged_at", start.toISOString())
    .lt("logged_at", end.toISOString())
    .order("logged_at", { ascending: false });
  if (error) fail("count logs", error);
  return data;
}

export async function getDailyChecks(dateKey: string): Promise<Record<string, boolean>> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("daily_checks")
    .select("check_key, done")
    .eq("check_date", dateKey);
  if (error) fail("daily checks", error);
  return Object.fromEntries(data.map((r) => [r.check_key, r.done]));
}
