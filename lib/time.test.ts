import { describe, expect, it } from "vitest";
import { computeHistory, computeProgress } from "./progress";
import {
  dateKey,
  formatHours,
  isWeekStartKey,
  overlapMs,
  parseLocalInput,
  toLocalInput,
  weekRange,
  weekStartKey,
} from "./time";
import { resolveWeek } from "./week-param";

const H = 3_600_000;
const utc = (s: string) => new Date(s);

describe("week boundaries in Asia/Bangkok (UTC+7)", () => {
  it("week of Mon 16 Nov 2026 starts Sun 15 Nov 17:00 UTC and ends Sun 22 Nov 17:00 UTC", () => {
    const { start, end } = weekRange("2026-11-16");
    expect(start.toISOString()).toBe("2026-11-15T17:00:00.000Z");
    expect(end.toISOString()).toBe("2026-11-22T17:00:00.000Z");
  });

  it("Sunday 23:59:59 Bangkok still belongs to the old week", () => {
    // Sun 22 Nov 23:59:59 +07 == 16:59:59Z
    expect(weekStartKey(utc("2026-11-22T16:59:59Z"))).toBe("2026-11-16");
  });

  it("Monday 00:00:00 Bangkok starts the new week", () => {
    expect(weekStartKey(utc("2026-11-22T17:00:00Z"))).toBe("2026-11-23");
  });

  it("does not use UTC: Sun 20:00 UTC is already Monday 03:00 in Bangkok", () => {
    expect(weekStartKey(utc("2026-11-22T20:00:00Z"))).toBe("2026-11-23");
    expect(dateKey(utc("2026-11-22T20:00:00Z"))).toBe("2026-11-23");
  });

  it("Monday 06:00 UTC is mid-Monday Bangkok, same week", () => {
    expect(weekStartKey(utc("2026-11-16T06:00:00Z"))).toBe("2026-11-16");
  });

  it("handles year and month rollovers", () => {
    // Thu 1 Jan 2026 10:00 Bangkok → week starting Mon 29 Dec 2025
    expect(weekStartKey(utc("2026-01-01T03:00:00Z"))).toBe("2025-12-29");
    expect(weekRange("2025-12-29").end.toISOString()).toBe("2026-01-04T17:00:00.000Z");
  });

  it("validates week keys", () => {
    expect(isWeekStartKey("2026-11-16")).toBe(true); // Monday
    expect(isWeekStartKey("2026-11-17")).toBe(false); // Tuesday
    expect(isWeekStartKey("2026-02-30")).toBe(false);
    expect(isWeekStartKey("nope")).toBe(false);
  });

  it("resolveWeek ignores bad or future ?week values", () => {
    const now = utc("2026-11-18T05:00:00Z");
    expect(resolveWeek(undefined, now)).toEqual({ week: "2026-11-16", currentWeek: "2026-11-16" });
    expect(resolveWeek("2026-11-09", now).week).toBe("2026-11-09");
    expect(resolveWeek("2026-11-23", now).week).toBe("2026-11-16");
    expect(resolveWeek("2026-11-10", now).week).toBe("2026-11-16");
  });
});

describe("overlap / entries spanning midnight Sunday→Monday", () => {
  const { start, end } = weekRange("2026-11-16");
  const now = utc("2026-11-30T00:00:00Z");

  it("splits an entry from Sun 23:00 to Mon 01:00 Bangkok across the two weeks", () => {
    const s = utc("2026-11-22T16:00:00Z"); // Sun 23:00 +07
    const e = utc("2026-11-22T18:00:00Z"); // Mon 01:00 +07
    expect(overlapMs(s, e, start, end, now)).toBe(1 * H);
    const next = weekRange("2026-11-23");
    expect(overlapMs(s, e, next.start, next.end, now)).toBe(1 * H);
  });

  it("counts a running entry up to now", () => {
    const s = utc("2026-11-18T01:00:00Z");
    const fakeNow = utc("2026-11-18T03:30:00Z");
    expect(overlapMs(s, null, start, end, fakeNow)).toBe(2.5 * H);
  });

  it("ignores entries fully outside the week", () => {
    expect(overlapMs(utc("2026-11-10T00:00:00Z"), utc("2026-11-10T02:00:00Z"), start, end, now)).toBe(0);
  });
});

describe("weekly progress and score", () => {
  const cats = [
    { id: "a", name: "Apps", type: "count" as const, weekly_target: 2, sort_order: 1, is_active: true },
    { id: "c", name: "Course", type: "hours" as const, weekly_target: 5, sort_order: 2, is_active: true },
    { id: "p", name: "Practice", type: "hours" as const, weekly_target: 3, sort_order: 3, is_active: true },
  ];

  it("sums hours inside the week only and counts logs", () => {
    const entries = [
      // 3h fully inside
      { category_id: "c", started_at: "2026-11-17T01:00:00Z", ended_at: "2026-11-17T04:00:00Z" },
      // Sun 21:00 → Mon 02:00 Bangkok of the NEXT week boundary: 3h inside this week
      { category_id: "c", started_at: "2026-11-22T14:00:00Z", ended_at: "2026-11-22T19:00:00Z" },
      // previous week, must not count
      { category_id: "p", started_at: "2026-11-15T10:00:00Z", ended_at: "2026-11-15T16:59:00Z" },
    ];
    const logs = [
      { category_id: "a", logged_at: "2026-11-16T02:00:00Z" },
      { category_id: "a", logged_at: "2026-11-22T16:59:00Z" }, // Sun 23:59 Bangkok: still this week
      { category_id: "a", logged_at: "2026-11-22T17:00:00Z" }, // Mon 00:00 Bangkok: next week
    ];
    const { progress, score, total } = computeProgress(cats, entries, logs, "2026-11-16", utc("2026-11-30T00:00:00Z"));
    const by = Object.fromEntries(progress.map((p) => [p.id, p]));
    expect(by.a.actual).toBe(2);
    expect(by.a.hit).toBe(true);
    expect(by.c.actual).toBe(6);
    expect(by.c.hit).toBe(true);
    expect(by.p.actual).toBe(0);
    expect(by.p.hit).toBe(false);
    expect([score, total]).toEqual([2, 3]);
  });

  it("overall percent averages each category's capped completion", () => {
    // Apps 2/2 = 100%, Course 6/5 capped at 100%, Practice 0/3 = 0% → 67%
    const entries = [{ category_id: "c", started_at: "2026-11-17T01:00:00Z", ended_at: "2026-11-17T07:00:00Z" }];
    const logs = [
      { category_id: "a", logged_at: "2026-11-17T02:00:00Z" },
      { category_id: "a", logged_at: "2026-11-17T03:00:00Z" },
    ];
    const s = computeProgress(cats, entries, logs, "2026-11-16", utc("2026-11-30T00:00:00Z"));
    expect(s.percent).toBe(67);
    // Practice 1.5/3 = 50% → (100 + 100 + 50) / 3 = 83%
    const half = [...entries, { category_id: "p", started_at: "2026-11-18T01:00:00Z", ended_at: "2026-11-18T02:30:00Z" }];
    expect(computeProgress(cats, half, logs, "2026-11-16", utc("2026-11-30T00:00:00Z")).percent).toBe(83);
  });

  it("archived categories only count in weeks where they have data", () => {
    const withArchived = [...cats, { id: "x", name: "Old", type: "count" as const, weekly_target: 1, sort_order: 4, is_active: false }];
    const logs = [{ category_id: "x", logged_at: "2026-11-10T03:00:00Z" }];
    const now = utc("2026-11-30T00:00:00Z");
    expect(computeProgress(withArchived, [], logs, "2026-11-09", now).total).toBe(4);
    expect(computeProgress(withArchived, [], logs, "2026-11-16", now).total).toBe(3);
  });

  it("history lists every week from the first data week to now, newest first", () => {
    const logs = [{ category_id: "a", logged_at: "2026-11-03T03:00:00Z" }];
    const h = computeHistory(cats, [], logs, "2026-11-16", utc("2026-11-18T00:00:00Z"));
    expect(h.map((w) => w.week)).toEqual(["2026-11-16", "2026-11-09", "2026-11-02"]);
    expect(h[2].progress.find((p) => p.id === "a")?.actual).toBe(1);
  });

  it("a fresh week starts from zero at Monday 00:00 Bangkok", () => {
    const entries = [{ category_id: "c", started_at: "2026-11-22T10:00:00Z", ended_at: "2026-11-22T16:59:00Z" }];
    const { progress, score } = computeProgress(cats, entries, [], "2026-11-23", utc("2026-11-22T17:00:00Z"));
    expect(progress.every((p) => p.actual === 0)).toBe(true);
    expect(score).toBe(0);
  });
});

describe("formatting and datetime-local inputs", () => {
  it("rounds hours down so the label never shows a target as hit early", () => {
    expect(formatHours(4.97)).toBe("4.9");
    expect(formatHours(3.5)).toBe("3.5");
    expect(formatHours(5)).toBe("5");
    expect(formatHours(0.3)).toBe("0.3");
  });

  it("reads datetime-local values as Bangkok wall time", () => {
    expect(parseLocalInput("2026-11-23T00:00")?.toISOString()).toBe("2026-11-22T17:00:00.000Z");
    expect(toLocalInput(utc("2026-11-22T17:00:00Z"))).toBe("2026-11-23T00:00");
    expect(parseLocalInput("2026-02-30T10:00")).toBeNull();
    expect(parseLocalInput("garbage")).toBeNull();
  });
});
