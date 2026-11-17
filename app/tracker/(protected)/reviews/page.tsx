import Link from "next/link";
import { ChevronRight, StarIcon } from "../_components/icons";
import { ProgressRing } from "../_components/ProgressRing";
import { computeHistory, weekMood } from "@/lib/progress";
import { formatWeekLabel } from "@/lib/time";
import { getHistoryData } from "@/lib/tracker";
import { HIT_COLOR } from "@/lib/ui";
import { resolveWeek } from "@/lib/week-param";

export const metadata = { title: "Reviews · Tracker" };

export default async function ReviewsPage() {
  const now = new Date();
  const { currentWeek } = resolveWeek(undefined, now);
  const { categories, entries, logs, reviews } = await getHistoryData();
  const history = computeHistory(categories, entries, logs, currentWeek, now, reviews.map((r) => r.week_start));
  const byWeek = new Map(reviews.map((r) => [r.week_start, r]));

  const recent = history.slice(0, 12).reverse();
  const past = history.filter((w) => w.week !== currentWeek);
  const lastFour = past.slice(0, 4);
  const avg = lastFour.length ? Math.round(lastFour.reduce((s, w) => s + w.percent, 0) / lastFour.length) : null;
  const best = past.reduce<(typeof past)[number] | null>((b, w) => (!b || w.percent > b.percent ? w : b), null);

  return (
    <main>
      <header className="pb-5 pt-7 sm:pt-8">
        <p className="eyebrow">Week by week</p>
        <h1 className="mt-1.5 font-serif text-[40px] leading-[1.05] sm:text-5xl">Reviews</h1>
        <p className="mt-2 text-sm text-text2">Look back, be kind, adjust.</p>
      </header>

      <section className="card p-5" aria-label="Recent weeks">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Last 4 weeks</p>
            <p className="mt-1 font-serif text-4xl tabular-nums">{avg === null ? "—" : `${avg}%`}</p>
            <p className="text-sm text-muted">average completion</p>
          </div>
          {best && (
            <div className="text-right">
              <p className="eyebrow">Best week</p>
              <p className="mt-1 font-serif text-2xl tabular-nums text-accent">{best.percent}%</p>
              <p className="text-sm text-muted">{formatWeekLabel(best.week)}</p>
            </div>
          )}
        </div>
        <ol className="mt-5 flex h-24 items-end gap-1.5" aria-label="Completion for the last 12 weeks">
          {recent.map((w) => (
            <li key={w.week} className="flex h-full flex-1 flex-col justify-end">
              <Link
                href={`/tracker/reviews/${w.week}`}
                title={`${formatWeekLabel(w.week)}: ${w.percent}%`}
                aria-label={`${formatWeekLabel(w.week)}: ${w.percent}%`}
                className="block rounded-md transition hover:opacity-80"
                style={{
                  height: `${Math.max(6, w.percent)}%`,
                  background: w.percent >= 100 ? HIT_COLOR : w.week === currentWeek ? "rgba(242,184,128,0.45)" : "#f2b880",
                }}
              />
            </li>
          ))}
        </ol>
      </section>

      <ul className="mt-6 space-y-3">
        {history.map((w) => {
          const review = byWeek.get(w.week);
          const isCurrent = w.week === currentWeek;
          return (
            <li key={w.week}>
              <Link href={`/tracker/reviews/${w.week}`} className="card flex items-center gap-4 p-4 transition active:bg-surface2">
                <ProgressRing percent={w.percent} size={58} stroke={6}>
                  <span className="text-[13px] font-semibold tabular-nums">{w.percent}%</span>
                </ProgressRing>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {formatWeekLabel(w.week)}
                    {isCurrent && <span className="eyebrow ml-2 !text-amber">now</span>}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    <span className="tabular-nums text-text2">
                      {w.score}/{w.total}
                    </span>{" "}
                    targets · <span className="font-serif italic">{weekMood(w.percent)}</span>
                  </p>
                  {review ? (
                    <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-text2">
                      {review.rating ? (
                        <span className="flex shrink-0 text-amber" aria-label={`${review.rating} of 5`}>
                          {Array.from({ length: review.rating }, (_, i) => (
                            <StarIcon key={i} width={13} height={13} fill="currentColor" />
                          ))}
                        </span>
                      ) : null}
                      <span className="truncate">{review.went_well ?? review.next_focus ?? "Reviewed"}</span>
                    </p>
                  ) : (
                    !isCurrent && <p className="mt-1 text-sm text-amber/80">Not reviewed yet</p>
                  )}
                </div>
                <ChevronRight className="shrink-0 text-dim" />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
