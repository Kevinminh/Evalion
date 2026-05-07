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
}

const FASIT_BAR_BG: Record<string, string> = {
  Sant: "bg-sant",
  "Delvis sant": "bg-delvis",
  Delvis: "bg-delvis",
  Usant: "bg-usant",
};

const FASIT_TEXT: Record<string, string> = {
  Sant: "text-sant",
  "Delvis sant": "text-delvis",
  Delvis: "text-delvis",
  Usant: "text-usant",
};

export function ColumnChart({ items }: ColumnChartProps) {
  const maxPct = Math.max(...items.map((i) => i.pct), 1);

  return (
    <div className="flex items-end justify-center gap-4 px-2 pt-3 pb-1">
      {items.map((item) => {
        const height = (item.pct / maxPct) * 100;
        const colored = item.isCorrect;
        const barClass = colored ? (FASIT_BAR_BG[item.label] ?? "bg-sant") : "bg-neutral-300";
        const textColor = colored ? (FASIT_TEXT[item.label] ?? "text-sant") : "text-muted-foreground";
        return (
          <div
            key={item.label}
            className="flex flex-1 flex-col items-center gap-1"
            style={{ maxWidth: 110 }}
          >
            <span
              className={cn(
                "text-xs font-semibold",
                textColor,
                colored && "font-extrabold",
              )}
            >
              {item.count} stk
            </span>
            <div className="relative w-full overflow-hidden rounded-lg bg-neutral-100" style={{ height: 100 }}>
              <div
                className={cn(
                  "absolute bottom-0 w-full rounded-b-lg flex items-center justify-center transition-all duration-400",
                  barClass,
                )}
                style={{ height: `${height}%`, minHeight: 2 }}
              >
                <span
                  className={cn(
                    "text-xs font-semibold",
                    colored ? "text-white font-extrabold" : "text-muted-foreground",
                  )}
                >
                  {item.pct}%
                </span>
              </div>
            </div>
            <span
              className={cn(
                "text-[11px] font-semibold",
                textColor,
                colored && "font-extrabold",
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
