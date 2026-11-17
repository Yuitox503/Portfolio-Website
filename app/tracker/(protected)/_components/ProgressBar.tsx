import { HIT_COLOR } from "@/lib/ui";

type Props = { ratio: number; hit: boolean; color: string; label?: string; thin?: boolean };

export function ProgressBar({ ratio, hit, color, label, thin }: Props) {
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-white/[0.06] ${thin ? "h-1.5" : "h-2"}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-soft"
        style={{ width: `${pct}%`, background: hit ? HIT_COLOR : color }}
      />
    </div>
  );
}
