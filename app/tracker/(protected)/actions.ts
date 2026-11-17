"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { DAILY_CHECKS } from "@/lib/config";
import { isDateKey, parseLocalInput } from "@/lib/time";

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
