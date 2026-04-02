import { cn } from "@workspace/ui/lib/utils";

interface DistributionBar {
  label: string;
  value: number;
  color: string;
}

interface DistributionChartProps {
  bars: DistributionBar[];
  total: number;
  height?: number;
}

export function DistributionChart({ bars, total, height = 160 }: DistributionChartProps) {
  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="flex items-end justify-center gap-4" style={{ height }}>
      {bars.map((bar) => {
        const pct = total > 0 ? Math.round((bar.value / total) * 100) : 0;
        const barHeight = total > 0 ? (bar.value / maxValue) * (height - 40) : 0;
        return (
          <div key={bar.label} className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-foreground">{bar.value}</span>
            <span className="text-[10px] font-semibold text-muted-foreground">{pct}%</span>
            <div
              className={cn("w-12 rounded-t-lg transition-all duration-500", bar.color)}
              style={{ height: Math.max(barHeight, 4) }}
            />
            <span className="text-xs font-semibold text-muted-foreground">{bar.label}</span>
          </div>
        );
      })}
    </div>
  );
}
