/** All tracker week/day boundaries are computed in this IANA timezone. */
export const TIMEZONE = "Asia/Bangkok";

export const LOGIN_PATH = "/tracker/login";

export const DAILY_CHECKS = [
  { key: "email", label: "Checked email" },
  { key: "worst_day_min", label: "Worst-day minimum done" },
] as const;

export type DailyCheckKey = (typeof DAILY_CHECKS)[number]["key"];
