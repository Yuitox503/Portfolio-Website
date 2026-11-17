import { TIMEZONE } from "./config";
import { zonedParts } from "./time";

/** Soft category colours, assigned by display order. Mint is reserved for "target hit". */
const CATEGORY_COLORS = ["#f2b880", "#bba8f0", "#8fc8ec", "#ec9f8f", "#ecd27e", "#e8a8d0"];

export function categoryColor(index: number) {
  return CATEGORY_COLORS[((index % CATEGORY_COLORS.length) + CATEGORY_COLORS.length) % CATEGORY_COLORS.length];
}

/** id → colour, stable across pages as long as the order doesn't change. */
export function colorMap(categories: { id: string }[]) {
  return new Map(categories.map((c, i) => [c.id, categoryColor(i)]));
}

export const HIT_COLOR = "#9ee6b8";

export function greeting(now: Date, tz = TIMEZONE) {
  const h = zonedParts(now, tz).hour;
  if (h < 5) return "Late night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "Tuesday, 17 November" in tz */
export function longDate(now: Date, tz = TIMEZONE) {
  const p = zonedParts(now, tz);
  const wd = new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
  return `${WEEKDAYS[wd]}, ${p.day} ${MONTHS[p.month - 1]}`;
}
