"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { DAILY_CHECKS } from "@/lib/config";
import { dateKey, isDateKey, isWeekStartKey, parseLocalInput } from "@/lib/time";

export type ActionResult = { ok: true } | { ok: false; error: string; code?: "timer_running" };

const UNIQUE_VIOLATION = "23505";
const ok = (): ActionResult => ({ ok: true });
const err = (error: string, code?: "timer_running"): ActionResult => ({ ok: false, error, code });

function refresh() {
  revalidatePath("/tracker", "layout");
}

function cleanNote(value: FormDataEntryValue | string | null | undefined) {
  const s = String(value ?? "").trim().slice(0, 500);
  return s || null;
}

// ── Timer ──────────────────────────────────────────────────────────────────

/**
 * Starts a timer. If one is already running, returns `timer_running` unless
 * `stopRunning` is set (the UI asks for confirmation first), in which case the
 * running timer is stopped at the same instant the new one starts.
 */
export async function startTimer(categoryId: string, stopRunning = false): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const now = new Date().toISOString();

  const { data: running, error: runErr } = await supabase
    .from("time_entries")
    .select("id")
    .is("ended_at", null)
    .maybeSingle();
  if (runErr) return err(runErr.message);

  if (running) {
    if (!stopRunning) return err("Another timer is running.", "timer_running");
    const { error } = await supabase
      .from("time_entries")
      .update({ ended_at: now })
      .eq("id", running.id)
      .is("ended_at", null);
    if (error) return err(error.message);
  }

  const { error } = await supabase
    .from("time_entries")
    .insert({ category_id: categoryId, started_at: now, ended_at: null });
  if (error) {
    // The partial unique index is the real guard (e.g. two devices at once).
    if (error.code === UNIQUE_VIOLATION) return err("Another timer is running.", "timer_running");
    return err(error.message);
  }
  refresh();
  return ok();
}

export async function stopTimer(entryId: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("time_entries")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", entryId)
    .is("ended_at", null);
  if (error) return err(error.message);
  refresh();
  return ok();
}

/** Reads category/start/end/note from a form. Times are wall time in TIMEZONE. */
function parseEntryForm(formData: FormData, requireEnd: boolean) {
  const categoryId = String(formData.get("category_id") ?? "");
  const startRaw = String(formData.get("started_at") ?? "");
  const endRaw = String(formData.get("ended_at") ?? "");
  const started = parseLocalInput(startRaw);
  const ended = endRaw ? parseLocalInput(endRaw) : null;

  if (!categoryId) return { error: "Pick a category." } as const;
  if (!started) return { error: "Enter a valid start time." } as const;
  if (endRaw && !ended) return { error: "Enter a valid end time." } as const;
  if (requireEnd && !ended) return { error: "Enter an end time." } as const;
  if (ended && ended <= started) return { error: "End must be after start." } as const;
  if (started.getTime() > Date.now() + 60_000) return { error: "Start can't be in the future." } as const;

  return {
    values: {
      category_id: categoryId,
      started_at: started.toISOString(),
      ended_at: ended ? ended.toISOString() : null,
      note: cleanNote(formData.get("note")),
    },
  } as const;
}

export async function addManualEntry(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const parsed = parseEntryForm(formData, true);
  if ("error" in parsed) return err(parsed.error!);
  const { error } = await supabase.from("time_entries").insert(parsed.values);
  if (error) return err(error.message);
  refresh();
  return ok();
}

export async function updateEntry(entryId: string, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const parsed = parseEntryForm(formData, false);
  if ("error" in parsed) return err(parsed.error!);
  const { error } = await supabase.from("time_entries").update(parsed.values).eq("id", entryId);
  if (error) {
    if (error.code === UNIQUE_VIOLATION) return err("Another timer is already running. Give this entry an end time.");
    return err(error.message);
  }
  refresh();
  return ok();
}

export async function deleteEntry(entryId: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("time_entries").delete().eq("id", entryId);
  if (error) return err(error.message);
  refresh();
  return ok();
}

// ── Counts ─────────────────────────────────────────────────────────────────

export async function logCount(categoryId: string, note?: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("count_logs")
    .insert({ category_id: categoryId, note: cleanNote(note) });
  if (error) return err(error.message);
  refresh();
  return ok();
}

/** Reads category/time/note for a count log. Time is wall time in TIMEZONE. */
function parseLogForm(formData: FormData) {
  const categoryId = String(formData.get("category_id") ?? "");
  const logged = parseLocalInput(String(formData.get("logged_at") ?? ""));
  if (!categoryId) return { error: "Pick a category." } as const;
  if (!logged) return { error: "Enter a valid date and time." } as const;
  if (logged.getTime() > Date.now() + 60_000) return { error: "That time is in the future." } as const;
  return {
    values: { category_id: categoryId, logged_at: logged.toISOString(), note: cleanNote(formData.get("note")) },
  } as const;
}

/** Back-dated or corrected count log. */
export async function addCountLog(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const parsed = parseLogForm(formData);
  if ("error" in parsed) return err(parsed.error!);
  const { error } = await supabase.from("count_logs").insert(parsed.values);
  if (error) return err(error.message);
  refresh();
  return ok();
}

export async function updateCountLog(logId: string, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const parsed = parseLogForm(formData);
  if ("error" in parsed) return err(parsed.error!);
  const { error } = await supabase.from("count_logs").update(parsed.values).eq("id", logId);
  if (error) return err(error.message);
  refresh();
  return ok();
}

export async function deleteCountLog(logId: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("count_logs").delete().eq("id", logId);
  if (error) return err(error.message);
  refresh();
  return ok();
}

// ── Daily checks ───────────────────────────────────────────────────────────

export async function setDailyCheck(date: string, key: string, done: boolean): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!isDateKey(date)) return err("Invalid date.");
  if (date > dateKey(new Date())) return err("You can't tick a day that hasn't happened yet.");
  if (!DAILY_CHECKS.some((c) => c.key === key)) return err("Invalid check.");
  const { error } = await supabase
    .from("daily_checks")
    .upsert(
      { user_id: userId, check_date: date, check_key: key, done },
      { onConflict: "user_id,check_date,check_key" },
    );
  if (error) return err(error.message);
  refresh();
  return ok();
}

// ── Weekly reviews ─────────────────────────────────────────────────────────

function cleanText(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim().slice(0, 4000);
  return s || null;
}

export async function saveReview(week: string, formData: FormData): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!isWeekStartKey(week)) return err("Invalid week.");
  const ratingRaw = Number(formData.get("rating"));
  const rating = Number.isInteger(ratingRaw) && ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : null;
  const { error } = await supabase.from("weekly_reviews").upsert(
    {
      user_id: userId,
      week_start: week,
      rating,
      went_well: cleanText(formData.get("went_well")),
      to_improve: cleanText(formData.get("to_improve")),
      next_focus: cleanText(formData.get("next_focus")),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,week_start" },
  );
  if (error) return err(error.message);
  refresh();
  return ok();
}

export async function deleteReview(week: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("weekly_reviews").delete().eq("week_start", week);
  if (error) return err(error.message);
  refresh();
  return ok();
}

// ── Categories ─────────────────────────────────────────────────────────────

/** Creates a category (id = null) or updates name/target. Type is fixed after creation. */
export async function saveCategory(id: string | null, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const target = Number(formData.get("weekly_target"));
  if (!name) return err("Give it a name.");
  if (!Number.isFinite(target) || target < 0 || target > 1000) return err("Target must be a number from 0 to 1000.");

  if (id) {
    const { error } = await supabase.from("categories").update({ name, weekly_target: target }).eq("id", id);
    if (error) return err(error.message);
  } else {
    const type = String(formData.get("type"));
    if (type !== "hours" && type !== "count") return err("Pick hours or count.");
    const { data: last } = await supabase
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await supabase
      .from("categories")
      .insert({ name, type, weekly_target: target, sort_order: (last?.sort_order ?? 0) + 1 });
    if (error) return err(error.message);
  }
  refresh();
  return ok();
}

/** Archive (hide) or restore a category. Its history is kept. */
export async function setCategoryActive(id: string, active: boolean): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("categories").update({ is_active: active }).eq("id", id);
  if (error) return err(error.message);
  refresh();
  return ok();
}

/** Moves a category one place up or down and renumbers sort_order 1..n. */
export async function moveCategory(id: string, direction: -1 | 1): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("categories").select("id").order("sort_order").order("name");
  if (error) return err(error.message);
  const ids = data.map((c) => c.id as string);
  const i = ids.indexOf(id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= ids.length) return ok();
  [ids[i], ids[j]] = [ids[j], ids[i]];
  const results = await Promise.all(
    ids.map((cid, n) => supabase.from("categories").update({ sort_order: n + 1 }).eq("id", cid)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return err(failed.error.message);
  refresh();
  return ok();
}
