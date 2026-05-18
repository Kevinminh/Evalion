import { cn } from "@workspace/ui/lib/utils";
import { Sprout, Target } from "lucide-react";

import type { FagPratType } from "@/lib/types";

interface ForkunnskapSelectorProps {
  value: FagPratType | null;
  onChange: (value: FagPratType) => void;
}

export function ForkunnskapSelector({ value, onChange }: ForkunnskapSelectorProps) {
  return (
    <div>
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">
        Forkunnskaper
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => onChange("intro")}
          className={cn(
            "flex flex-1 items-center gap-3 rounded-2xl border-[2.5px] bg-card px-5 py-3 text-left shadow-3d-sm transition-all hover:-translate-y-0.5",
            value === "intro"
              ? "border-turkis-400 bg-turkis-50/80 shadow-[0_3px_0_var(--color-turkis-200)]"
              : "border-neutral-300 hover:border-turkis-400 hover:bg-turkis-50/50",
          )}
        >
          <Sprout
            className={cn(
              "size-[22px] shrink-0 transition-colors",
              value === "intro" ? "text-turkis-500" : "text-muted-foreground",
            )}
          />
          <div className="flex flex-col">
            <span
              className={cn(
                "text-base font-bold transition-colors",
                value === "intro" ? "text-turkis-600" : "text-foreground",
              )}
            >
              Introduksjon
            </span>
            <span className="text-xs text-muted-foreground">
              Lite eller ingen forkunnskaper
            </span>
          </div>
        </button>

        <button
          onClick={() => onChange("summary")}
          className={cn(
            "flex flex-1 items-center gap-3 rounded-2xl border-[2.5px] bg-card px-5 py-3 text-left shadow-3d-sm transition-all hover:-translate-y-0.5",
            value === "summary"
              ? "border-amber-500 bg-amber-50 shadow-[0_3px_0_#FDE68A]"
              : "border-neutral-300 hover:border-amber-500 hover:bg-amber-50/60",
          )}
        >
          <Target
            className={cn(
              "size-[22px] shrink-0 transition-colors",
              value === "summary" ? "text-amber-600" : "text-muted-foreground",
            )}
          />
          <div className="flex flex-col">
            <span
              className={cn(
                "text-base font-bold transition-colors",
                value === "summary" ? "text-amber-700" : "text-foreground",
              )}
            >
              Oppsummering
            </span>
            <span className="text-xs text-muted-foreground">
              Noen eller gode forkunnskaper
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
