/**
 * Timezone-aware date helpers for the tracker.
 *
 * Weeks run Monday 00:00 → next Monday 00:00 in TIMEZONE (the end is exclusive,
 * so Sunday 23:59:59.999 is the last instant of a week). Date keys are plain
 * "YYYY-MM-DD" strings for the calendar date in TIMEZONE.
 *
 * Pure functions only (no server/client deps) so they can be unit tested and
 * used from both server and client components.
 */
import { TIMEZONE } from "./config";

const DAY_MS = 24 * 60 * 60 * 1000;

type Parts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(tz: string) {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatters.set(tz, f);
  }
  return f;
}

/** Wall-clock parts of an instant in a timezone. */
export function zonedParts(date: Date, tz = TIMEZONE): Parts {
  const out: Record<string, number> = {};
  for (const p of formatter(tz).formatToParts(date)) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return {
    year: out.year,
    month: out.month,
    day: out.day,
    hour: out.hour === 24 ? 0 : out.hour,
    minute: out.minute,
    second: out.second,
  };
}

/** Offset of tz from UTC at the given instant, in ms (Bangkok: +7h). */
function offsetMs(date: Date, tz: string) {
  const p = zonedParts(date, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** The UTC instant of a wall-clock time in tz. Handles DST zones too. */
export function zonedToUtc(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  tz = TIMEZONE,
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  let ts = guess - offsetMs(new Date(guess), tz);
  // Second pass in case the offset differs at the corrected instant (DST).
  ts = guess - offsetMs(new Date(ts), tz);
  return new Date(ts);
}

const pad = (n: number) => String(n).padStart(2, "0");

function keyFromUtcDate(d: Date) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return { y, m, d };
}

export function isDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const { y, m, d } = parseKey(value);
  return keyFromUtcDate(new Date(Date.UTC(y, m - 1, d))) === value;
}

/** Calendar date ("YYYY-MM-DD") of an instant in tz. */
export function dateKey(date: Date, tz = TIMEZONE) {
  const p = zonedParts(date, tz);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function addDays(key: string, days: number) {
  const { y, m, d } = parseKey(key);
  return keyFromUtcDate(new Date(Date.UTC(y, m - 1, d) + days * DAY_MS));
}

/** 0 = Monday … 6 = Sunday, for a date key. */
function isoWeekdayIndex(key: string) {
  const { y, m, d } = parseKey(key);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

/** Date key of the Monday starting the week that contains `date` in tz. */
export function weekStartKey(date: Date, tz = TIMEZONE) {
  const key = dateKey(date, tz);
  return addDays(key, -isoWeekdayIndex(key));
}

export function isWeekStartKey(value: unknown): value is string {
  return isDateKey(value) && isoWeekdayIndex(value) === 0;
}

/** [start, end) instants of the week beginning on the Monday `mondayKey`. */
export function weekRange(mondayKey: string, tz = TIMEZONE) {
  const { y, m, d } = parseKey(mondayKey);
  const next = parseKey(addDays(mondayKey, 7));
  return {
    start: zonedToUtc(y, m, d, 0, 0, tz),
    end: zonedToUtc(next.y, next.m, next.d, 0, 0, tz),
  };
}

/** Milliseconds of [start, end ?? now) that fall inside [rangeStart, rangeEnd). */
export function overlapMs(
  start: Date,
  end: Date | null,
  rangeStart: Date,
  rangeEnd: Date,
  now: Date,
) {
  const s = Math.max(start.getTime(), rangeStart.getTime());
  const e = Math.min((end ?? now).getTime(), rangeEnd.getTime());
  return Math.max(0, e - s);
}

/** "2026-11-17T09:30" (a datetime-local value, read as wall time in tz) → instant. */
export function parseLocalInput(value: string, tz = TIMEZONE): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m.map(Number);
  if (!isDateKey(`${m[1]}-${m[2]}-${m[3]}`) || h > 23 || mi > 59) return null;
  return zonedToUtc(y, mo, d, h, mi, tz);
}

/** Instant → "YYYY-MM-DDTHH:MM" wall time in tz, for a datetime-local input. */
export function toLocalInput(date: Date, tz = TIMEZONE) {
  const p = zonedParts(date, tz);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/** 3725000 → "1:02:05" */
export function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${pad(m)}:${pad(s)}`;
}

/** 5400000 → "1h 30m" */
export function formatDuration(ms: number) {
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h ? `${h}h ${pad(m)}m` : `${m}m`;
}

/**
 * Hours with at most one decimal, rounded DOWN so 4.97 shows as "4.9" and a
 * bar never reads "5 / 5" before the target is actually hit.
 */
export function formatHours(hours: number) {
  return String(Math.floor(hours * 10 + 1e-9) / 10);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "16 – 22 Nov 2026" */
export function formatWeekLabel(mondayKey: string) {
  const a = parseKey(mondayKey);
  const b = parseKey(addDays(mondayKey, 6));
  const left = a.m === b.m ? `${a.d}` : a.y === b.y ? `${a.d} ${MONTHS[a.m - 1]}` : `${a.d} ${MONTHS[a.m - 1]} ${a.y}`;
  return `${left} – ${b.d} ${MONTHS[b.m - 1]} ${b.y}`;
}

/** "Mon 17 Nov, 09:30" in tz */
export function formatDateTime(date: Date, tz = TIMEZONE) {
  const p = zonedParts(date, tz);
  const wd = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][isoWeekdayIndex(dateKey(date, tz))];
  return `${wd} ${p.day} ${MONTHS[p.month - 1]}, ${pad(p.hour)}:${pad(p.minute)}`;
}

/** "09:30" in tz */
export function formatTime(date: Date, tz = TIMEZONE) {
  const p = zonedParts(date, tz);
  return `${pad(p.hour)}:${pad(p.minute)}`;
}
