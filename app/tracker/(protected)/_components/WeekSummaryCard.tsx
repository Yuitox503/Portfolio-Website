import type { WeekSummary } from "@/lib/progress";
import { weekMood } from "@/lib/progress";
import { FALLBACK_COLOR, HIT_COLOR } from "@/lib/ui";

type Props = { summary: WeekSummary; footnote?: React.ReactNode; children?: React.ReactNode };

/** Overall week percent, targets hit, and one meter segment per target. */
export function WeekSummaryCard({ summary, footnote, children }: Props) {
  const { percent, score, total, progress } = summary;
  const allHit = total > 0 && score === total;
  return (
    <section className="card p-5 sm:p-6" aria-label="Week summary">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="num text-[56px] font-semibold leading-none tracking-tight">
            {percent}
            <span className="ml-0.5 text-2xl font-medium text-muted">%</span>
          </p>
          <p className="mt-2 text-sm text-muted">overall</p>
        </div>
        <div className="text-right">
          <p className="num text-3xl font-semibold leading-none">
            <span className={allHit ? "text-hit" : "text-text"}>{score}</span>
            <span className="text-dim"> / {total}</span>
          </p>
          <p className="mt-2 text-sm text-muted">targets hit</p>
        </div>
      </div>

      {/* One segment per target, filled to its completion; pale yellow once hit. */}
      <div className="mt-5 flex gap-1.5" role="img" aria-label={`Week ${percent}% complete`}>
        {(progress.length ? progress : [null]).map((c, i) => (
          <span key={c?.id ?? i} className="h-2 flex-1 overflow-hidden rounded-full bg-surface2">
            {c && (
              <span
                className="block h-full rounded-full transition-[width] duration-700 ease-soft"
                style={{ width: `${Math.round(c.ratio * 100)}%`, background: c.hit ? HIT_COLOR : FALLBACK_COLOR }}
              />
            )}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-text2">{weekMood(percent)}</p>

      {footnote && <div className="mt-4 border-t border-line pt-4 text-sm text-muted">{footnote}</div>}
      {children}
    </section>
  );
}
