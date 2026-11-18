import { TIMEZONE } from "./config";
import { zonedParts } from "./time";

/**
 * Category colours, assigned by display order. Tints around Wada no. 325 (ochre, apricot, sage,
 * teal, khaki, rosewood). Naples yellow is reserved for "target hit" and Eugenia red for stop /
 * destructive, so a category colour never reads as a state.
 */
const CATEGORY_COLORS = ["#e2b540", "#8cc0ae", "#f0956f", "#4fa39a", "#b9a37b", "#c9777d"];

export function categoryColor(index: number) {
  return CATEGORY_COLORS[((index % CATEGORY_COLORS.length) + CATEGORY_COLORS.length) % CATEGORY_COLORS.length];
}

/** id → colour, stable across pages as long as the order doesn't change. */
export function colorMap(categories: { id: string }[]) {
  return new Map(categories.map((c, i) => [c.id, categoryColor(i)]));
}

export const HIT_COLOR = "#fbe6a0";
/** Used when a category can't be found (deleted or unknown). */
export const FALLBACK_COLOR = "#e2b540";
export const UNKNOWN_COLOR = "#8a9784";

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
