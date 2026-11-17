import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "../../_components/icons";
import { ProgressBar } from "../../_components/ProgressBar";
import { ReviewForm } from "../../_components/ReviewForm";
import { WeekNav } from "../../_components/WeekNav";
import { WeekSummaryCard } from "../../_components/WeekSummaryCard";
import { computeProgress } from "@/lib/progress";
import { formatHours, formatWeekLabel, isWeekStartKey, weekStartKey } from "@/lib/time";
import { getAllCategories, getReview, getWeekCountLogs, getWeekEntries } from "@/lib/tracker";
import { colorMap } from "@/lib/ui";

export async function generateMetadata({ params }: PageProps<"/tracker/reviews/[week]">) {
  const { week } = await params;
  return { title: isWeekStartKey(week) ? `${formatWeekLabel(week)} · Review` : "Review" };
}

export default async function WeekReviewPage({ params }: PageProps<"/tracker/reviews/[week]">) {
  const { week } = await params;
  const now = new Date();
  const currentWeek = weekStartKey(now);
  if (!isWeekStartKey(week) || week > currentWeek) notFound();

  const [categories, entries, logs, review] = await Promise.all([
    getAllCategories(),
    getWeekEntries(week),
    getWeekCountLogs(week),
    getReview(week),
  ]);
  const summary = computeProgress(categories, entries, logs, week, now);
  const colors = colorMap(categories);
  const editHref = week === currentWeek ? "/tracker/log" : `/tracker/log?week=${week}`;

  return (
    <main>
      <div className="pt-6">
        <Link href="/tracker/reviews" className="inline-flex items-center gap-1 text-sm text-muted">
          <ChevronLeft width={16} height={16} /> All reviews
        </Link>
      </div>
      <header className="pb-5 pt-4">
        <p className="eyebrow">Weekly review</p>
        <h1 className="mt-1.5 font-serif text-[36px] leading-[1.05] sm:text-5xl">{formatWeekLabel(week)}</h1>
      </header>

      <WeekNav basePath="/tracker/reviews" week={week} currentWeek={currentWeek} pathStyle />

      <div className="mt-5">
        <WeekSummaryCard summary={summary}>
          <ul className="relative mt-5 space-y-3.5 border-t border-line pt-5">
            {summary.progress.map((c) => (
              <li key={c.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-text2">{c.name}</span>
                  <span className={`shrink-0 tabular-nums ${c.hit ? "text-accent" : "text-muted"}`}>
                    {c.type === "hours" ? formatHours(c.actual) : c.actual} / {c.weekly_target}
                    {c.type === "hours" ? " hrs" : ""}
                    {c.hit ? " ✓" : ""}
                  </span>
                </div>
                <ProgressBar ratio={c.ratio} hit={c.hit} color={colors.get(c.id) ?? "#f2b880"} thin label={c.name} />
              </li>
            ))}
          </ul>
          <p className="relative mt-5 text-sm text-muted">
            Something off?{" "}
            <Link href={editHref} className="text-amber underline underline-offset-4">
              Fix this week&apos;s data
            </Link>
          </p>
        </WeekSummaryCard>
      </div>

      <section className="card mt-6 p-5 sm:p-6">
        <h2 className="mb-5 font-serif text-2xl">Reflection</h2>
        <ReviewForm key={week} week={week} review={review} />
      </section>
    </main>
  );
}
