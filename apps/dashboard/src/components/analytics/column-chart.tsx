import { cn } from "@workspace/ui/lib/utils";

interface ColumnItem {
  label: string;
  count: number;
  pct: number;
  colorClass?: string;
  isCorrect?: boolean;
  delta?: { count: number; pct: number };
}

interface ColumnChartProps {
  items: ColumnItem[];
  compact?: boolean;
  /** Stretch to fill the parent's available height. Bar height becomes raw
   * percentage (not normalized against max). Used by RoundAnalytics so the
   * Stemmefordeling chart fills its panel card vertically. */
  fill?: boolean;
}

const CORRECT_FILL: Record<string, string> = {
  Sant: "bg-[#66BB6A]",
  "Delvis sant": "bg-delvis",
  Delvis: "bg-delvis",
  Usant: "bg-[#EF5350]",
};

const CORRECT_TEXT: Record<string, string> = {
  Sant: "text-[#2E7D32]",
  "Delvis sant": "text-[#b8860b]",
  Delvis: "text-[#b8860b]",
  Usant: "text-[#C62828]",
};

const OUTSIDE_THRESHOLD = 18;

export function ColumnChart({ items, compact = false, fill = false }: ColumnChartProps) {
  const maxPct = Math.max(...items.map((i) => i.pct), 1);
  const trackHeight = compact ? 60 : 100;
  const countSize = compact ? "text-[10px]" : "text-xs";
  const labelSize = compact ? "text-[10px]" : "text-[11px]";
  const pctSize = compact ? "text-[9px]" : "text-xs";

  return (
    <div
      className={cn(
        "flex justify-center gap-4 px-2",
        fill ? "h-full min-h-0 items-stretch pt-2 pb-1" : "items-end pt-3 pb-1",
      )}
    >
      {items.map((item) => {
        // In fill mode the bar represents its raw percentage of the available
        // track. Otherwise we normalize against the largest bar so short bars
        // remain visually readable inside the fixed track height.
        const height = fill ? item.pct : (item.pct / maxPct) * 100;
        const isCorrect = !!item.isCorrect;
        const fillClass = isCorrect
          ? (CORRECT_FILL[item.label] ?? "bg-neutral-300")
          : "bg-neutral-300";
        const correctText = CORRECT_TEXT[item.label] ?? "text-muted-foreground";
        const labelText = isCorrect ? correctText : "text-muted-foreground";
        const showPctOutside = item.pct < OUTSIDE_THRESHOLD;
        return (
          <div
            key={item.label}
            className={cn(
              "flex flex-1 flex-col items-center gap-1",
              fill && "min-h-0",
            )}
            style={{ maxWidth: 110 }}
          >
            <span
              className={cn(
                "font-semibold tabular-nums whitespace-nowrap",
                countSize,
                labelText,
                isCorrect && "font-extrabold",
              )}
            >
              {item.count} stk
            </span>
            <div
              className={cn(
                "relative w-full overflow-visible rounded-[12px] bg-neutral-100",
                fill && "flex min-h-0 flex-1 flex-col justify-end",
              )}
              style={fill ? undefined : { height: trackHeight }}
            >
              <div
                className={cn(
                  "flex items-center justify-center transition-all duration-400",
                  fill
                    ? "relative w-full rounded-[12px]"
                    : "absolute bottom-0 w-full rounded-b-[8px]",
                  fillClass,
                )}
                style={{ height: `${height}%`, minHeight: fill ? 0 : 2 }}
              >
                {item.pct === 0 ? null : showPctOutside ? (
                  <span
                    className={cn(
                      "absolute left-1/2 -top-4 -translate-x-1/2 whitespace-nowrap font-semibold tabular-nums",
                      pctSize,
                      isCorrect ? cn(correctText, "font-extrabold") : "text-muted-foreground",
                    )}
                  >
                    {item.pct}%
                  </span>
                ) : (
                  <span
                    className={cn(
                      pctSize,
                      "font-semibold text-white tabular-nums",
                      isCorrect && "font-extrabold",
                    )}
                  >
                    {item.pct}%
                  </span>
                )}
              </div>
            </div>
            <span
              className={cn(
                "font-semibold whitespace-nowrap",
                labelSize,
                labelText,
                isCorrect && "font-extrabold",
              )}
            >
              {item.label}
            </span>
            {item.delta &&
              (item.delta.count === 0 ? (
                <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                  ±0 stk
                </span>
              ) : (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold tabular-nums",
                    // Green when the shift moves toward the correct answer
                    // (more votes on the right one, or fewer on a wrong one).
                    (isCorrect ? item.delta.count > 0 : item.delta.count < 0)
                      ? "bg-sant/15 text-sant"
                      : "bg-usant/15 text-usant",
                  )}
                >
                  {item.delta.count > 0 ? "+" : ""}
                  {item.delta.count} stk
                </span>
              ))}
          </div>
        );
      })}
    </div>
  );
}
