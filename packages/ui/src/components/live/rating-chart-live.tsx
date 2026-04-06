interface RatingDistribution {
  score: number;
  count: number;
}

interface RatingChartProps {
  distribution: RatingDistribution[];
  average?: number;
}

const BAR_COLORS = [
  "var(--usant)",
  "var(--delvis)",
  "var(--chart-4)",
  "var(--chart-2)",
  "var(--sant)",
];

export function RatingChart({ distribution, average }: RatingChartProps) {
  const total = distribution.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {average !== undefined && (
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Gjennomsnitt
          </div>
          <p className="text-3xl font-extrabold text-foreground">{average.toFixed(1)}</p>
        </div>
      )}
      <div className="flex items-end justify-center gap-3" style={{ height: 180 }}>
        {distribution.map((d, i) => {
          const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
          const barHeight = total > 0 ? (d.count / maxCount) * 120 : 0;
          return (
            <div key={d.score} className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-foreground">{d.count}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{pct}%</span>
              <div
                className="w-10 rounded-t-lg transition-all duration-500"
                style={{
                  height: Math.max(barHeight, 4),
                  backgroundColor: BAR_COLORS[i] ?? BAR_COLORS[0],
                }}
              />
              <span className="text-sm font-bold text-foreground">{d.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
