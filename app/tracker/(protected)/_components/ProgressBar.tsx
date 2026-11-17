export function ProgressBar({ value, target, hit }: { value: number; target: number; hit: boolean }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 100;
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-surface2"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={target}
      aria-valuenow={Math.round(value * 10) / 10}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${hit ? "bg-accent" : "bg-purple"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
