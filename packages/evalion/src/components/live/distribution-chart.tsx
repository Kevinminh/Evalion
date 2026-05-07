import { cn } from "@workspace/ui/lib/utils";

interface DistributionBar {
  label: string;
  value: number;
  /** Identifier for matching against `correctKey`, e.g. "sant" / "delvis" / "usant". */
  key?: string;
  /** Domain key driving the bar fill color. */
  variant?: "sant" | "delvis" | "usant";
  /** Optional Tailwind class color used as a fallback when `variant` is missing. */
  color?: string;
}

interface DistributionChartProps {
  bars: DistributionBar[];
  total: number;
  height?: number;
  /** Marks the bar whose `key` matches as the correct answer (extrabold + accent). */
  correctKey?: string;
}

const FILL_HEX: Record<string, string> = {
  sant: "#4CAF50",
  delvis: "#FF9800",
  usant: "#EF5350",
};

const CORRECT_TEXT_HEX: Record<string, string> = {
  sant: "#2E7D32",
  delvis: "#B8860B",
  usant: "#C62828",
};

export function DistributionChart({
  bars,
  total,
  height = 160,
  correctKey,
}: DistributionChartProps) {
  return (
    <div className="flex w-full" style={{ height, gap: 16 }}>
      {bars.map((bar) => {
        const pct = total > 0 ? Math.round((bar.value / total) * 100) : 0;
        const isCorrect = correctKey !== undefined && bar.key === correctKey;
        const variantKey = bar.variant ?? bar.key ?? "";
        const fill = FILL_HEX[variantKey] ?? "#9E9E9E";
        const correctText = CORRECT_TEXT_HEX[variantKey] ?? "#212121";

        return (
          <div
            key={bar.label}
            className="flex flex-1 min-h-0 flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                "text-xs leading-none tabular-nums",
                isCorrect ? "font-extrabold" : "font-bold",
              )}
              style={{ color: isCorrect ? correctText : "#212121" }}
            >
              {bar.value} stk
            </span>
            <div className="flex w-full flex-1 min-h-0 flex-col items-center justify-end rounded-xl bg-[#F5F5F5]">
              <div
                className="flex w-full items-center justify-center rounded-xl transition-[height] duration-[600ms]"
                style={{
                  backgroundColor: fill,
                  height: `${pct}%`,
                  minHeight: pct > 0 ? 0 : 0,
                }}
              >
                {pct > 0 && (
                  <span
                    className={cn(
                      "leading-none text-white tabular-nums",
                      isCorrect ? "font-extrabold" : "font-bold",
                    )}
                    style={{ fontSize: 11 }}
                  >
                    {pct}%
                  </span>
                )}
              </div>
            </div>
            <span
              className={cn(
                "text-xs leading-tight",
                isCorrect ? "font-extrabold" : "font-bold",
              )}
              style={{ color: isCorrect ? correctText : "#616161" }}
            >
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
