import { Check } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface DistributionBar {
  label: string;
  value: number;
  color: string;
  /** Bar key to compare against the chart's `correctKey` (e.g. the fasit). */
  key?: string;
}

interface DistributionChartProps {
  bars: DistributionBar[];
  total: number;
  height?: number;
  /** Marks the bar whose `key` matches as the correct answer (✓ + bold). */
  correctKey?: string;
}

export function DistributionChart({
  bars,
  total,
  height = 160,
  correctKey,
}: DistributionChartProps) {
  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="flex items-end justify-center gap-4" style={{ height }}>
      {bars.map((bar) => {
        const pct = total > 0 ? Math.round((bar.value / total) * 100) : 0;
        const barHeight = total > 0 ? (bar.value / maxValue) * (height - 40) : 0;
        const isCorrect = correctKey !== undefined && bar.key === correctKey;
        return (
          <div key={bar.label} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "tabular-nums",
                isCorrect
                  ? "text-sm font-extrabold text-foreground"
                  : "text-xs font-bold text-foreground",
              )}
            >
              {bar.value}
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">
              {pct}%
            </span>
            <div
              className={cn(
                "rounded-t-lg",
                bar.color,
                isCorrect ? "w-14 ring-2 ring-sant ring-offset-1" : "w-12",
              )}
              style={{
                height: Math.max(barHeight, 4),
                transition: "height 600ms cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
            />
            <span
              className={cn(
                "inline-flex items-center gap-1",
                isCorrect ? "text-xs font-extrabold text-sant" : "text-xs font-semibold text-muted-foreground",
              )}
            >
              {isCorrect && <Check className="size-3" strokeWidth={3} />}
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
