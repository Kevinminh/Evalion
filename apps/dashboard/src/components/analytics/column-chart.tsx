import { cn } from "@workspace/ui/lib/utils";

interface ColumnItem {
  label: string;
  count: number;
  pct: number;
  colorClass: string;
  isCorrect?: boolean;
  delta?: { count: number; pct: number };
}

interface ColumnChartProps {
  items: ColumnItem[];
}

export function ColumnChart({ items }: ColumnChartProps) {
  const maxPct = Math.max(...items.map((i) => i.pct), 1);

  return (
    <div className="flex items-end justify-center gap-4 px-2 pt-3 pb-1">
      {items.map((item) => {
        const height = Math.max((item.pct / maxPct) * 100, 15);
        return (
          <div
            key={item.label}
            className="flex flex-1 flex-col items-center gap-1"
            style={{ maxWidth: 110 }}
          >
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                item.isCorrect && "font-extrabold text-amber-700",
              )}
            >
              {item.count} stk
            </span>
            <div className="relative w-full overflow-hidden rounded-lg bg-neutral-100" style={{ height: 100 }}>
              <div
                className={cn(
                  "absolute bottom-0 w-full rounded-b-lg flex items-center justify-center transition-all duration-400",
                  item.colorClass,
                )}
                style={{ height: `${height}%`, minHeight: 20 }}
              >
                <span
                  className={cn(
                    "text-xs font-semibold text-muted-foreground",
                    item.colorClass === "bg-delvis" && "font-extrabold text-white",
                  )}
                >
                  {item.pct}%
                </span>
              </div>
            </div>
            <span
              className={cn(
                "text-[11px] font-semibold text-muted-foreground",
                item.isCorrect && "font-extrabold text-amber-700",
              )}
            >
              {item.label}
            </span>
            {item.delta && (
              <span
                className={cn(
                  "text-[10px] font-bold tabular-nums",
                  item.delta.count > 0 && item.isCorrect
                    ? "text-sant"
                    : item.delta.count < 0 && item.isCorrect
                      ? "text-usant"
                      : "text-muted-foreground",
                )}
              >
                {item.delta.count > 0 ? "+" : ""}
                {item.delta.count} stk ({item.delta.pct > 0 ? "+" : ""}
                {item.delta.pct}%)
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
