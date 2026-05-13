import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface BegrunnelseNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  label?: ReactNode;
}

export function BegrunnelseNav({ current, total, onPrev, onNext, label }: BegrunnelseNavProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrev}
        disabled={current <= 1}
        className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
      >
        <ChevronLeft className="size-5" />
      </button>
      <span className="text-sm font-semibold text-muted-foreground">
        {label ?? `${current} av ${total}`}
      </span>
      <button
        onClick={onNext}
        disabled={current >= total}
        className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
