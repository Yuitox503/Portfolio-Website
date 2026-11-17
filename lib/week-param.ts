import { isWeekStartKey, weekStartKey } from "./time";

/** Resolves ?week=YYYY-MM-DD (a Monday) to a week key; falls back to the current week. */
export function resolveWeek(param: string | string[] | undefined, now: Date) {
  const currentWeek = weekStartKey(now);
  const requested = Array.isArray(param) ? param[0] : param;
  const week = isWeekStartKey(requested) && requested <= currentWeek ? requested : currentWeek;
  return { week, currentWeek };
}
