import { cn } from "@workspace/ui/lib/utils";

import { formatDecimal1 } from "../../lib/format";

interface BreakdownRowProps {
  label: string;
  value: number | undefined;
  layout?: "spread" | "inline";
}

export function BreakdownRow({ label, value, layout = "spread" }: BreakdownRowProps) {
  return (
    <div
      className={cn(
        "flex items-center font-semibold",
        layout === "spread" ? "justify-between gap-4 text-sm" : "gap-2 text-xs",
      )}
    >
      <span className="text-[var(--color-text-ink-soft)]">{label}</span>
      <span className="font-mono font-bold tabular-nums text-[var(--color-text-ink-strong)]">
        {value === undefined ? "–" : formatDecimal1(value)}
      </span>
    </div>
  );
}
