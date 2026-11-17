import type { WeekSummary } from "@/lib/progress";
import { weekMood } from "@/lib/progress";
import { ProgressRing } from "./ProgressRing";

type Props = { summary: WeekSummary; footnote?: React.ReactNode; children?: React.ReactNode };

/** Overall week progress ring + score. */
export function WeekSummaryCard({ summary, footnote, children }: Props) {
  const { percent, score, total } = summary;
  return (
    <section className="card relative overflow-hidden p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-40 blur-3xl"
        style={{ background: percent >= 100 ? "rgba(158,230,184,0.35)" : "rgba(242,184,128,0.25)" }}
      />
      <div className="relative flex items-center gap-5">
        <ProgressRing percent={percent} label={`Week ${percent}% complete`}>
          <span className="font-serif text-[40px] leading-none tabular-nums">
            {percent}
            <span className="text-xl text-muted">%</span>
          </span>
          <span className="eyebrow mt-1">overall</span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Weekly score</p>
          <p className="mt-1 font-serif text-5xl leading-none tabular-nums">
            <span className={total > 0 && score === total ? "text-accent" : "text-text"}>{score}</span>
            <span className="text-dim"> / {total}</span>
          </p>
          <p className="mt-1.5 text-sm text-text2">targets hit</p>
          <p className="mt-3 font-serif text-lg italic text-amber">{weekMood(percent)}</p>
        </div>
      </div>
      {footnote && <div className="relative mt-4 border-t border-line pt-4 text-sm text-muted">{footnote}</div>}
      {children}
    </section>
  );
}
