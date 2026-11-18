import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon, ChevronLeft } from "../../_components/icons";
import { ProgressBar } from "../../_components/ProgressBar";
import { ReviewForm } from "../../_components/ReviewForm";
import { WeekNav } from "../../_components/WeekNav";
import { WeekSummaryCard } from "../../_components/WeekSummaryCard";
import { computeProgress } from "@/lib/progress";
import { formatHours, formatWeekLabel, isWeekStartKey, weekStartKey } from "@/lib/time";
import { getAllCategories, getReview, getWeekCountLogs, getWeekEntries } from "@/lib/tracker";
import { colorMap, FALLBACK_COLOR } from "@/lib/ui";

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
    <main className="mx-auto max-w-2xl">
      <div className="pt-6">
        <Link href="/tracker/reviews" className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-muted transition hover:text-text2">
          <ChevronLeft width={16} height={16} /> All reviews
        </Link>
      </div>
      <header className="pb-5 pt-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-[40px] sm:leading-[1.1]">{formatWeekLabel(week)}</h1>
      </header>

      <WeekNav basePath="/tracker/reviews" week={week} currentWeek={currentWeek} pathStyle />

      <div className="mt-5">
        <WeekSummaryCard summary={summary}>
          <ul className="relative mt-5 space-y-3.5 border-t border-line pt-5">
            {summary.progress.map((c) => (
              <li key={c.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-text2">{c.name}</span>
                  <span className={`shrink-0 tabular-nums ${c.hit ? "text-hit" : "text-muted"}`}>
                    {c.type === "hours" ? formatHours(c.actual) : c.actual} / {c.weekly_target}
                    {c.type === "hours" ? " hrs" : ""}
                    {c.hit && <CheckIcon width={13} height={13} className="ml-1 inline-block align-[-2px]" />}
                  </span>
                </div>
                <ProgressBar ratio={c.ratio} hit={c.hit} color={colors.get(c.id) ?? FALLBACK_COLOR} thin label={c.name} />
              </li>
            ))}
          </ul>
          <p className="relative mt-5 text-sm text-muted">
            Something off?{" "}
            <Link href={editHref} className="text-primary underline underline-offset-4">
              Fix this week&apos;s data
            </Link>
          </p>
        </WeekSummaryCard>
      </div>

      <section className="card mt-6 p-5 sm:p-6">
        <h2 className="mb-5 text-xl font-semibold">Reflection</h2>
        <ReviewForm key={week} week={week} review={review} />
      </section>
    </main>
  );
}
