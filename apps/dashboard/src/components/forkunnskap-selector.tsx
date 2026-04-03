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
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onChange("intro")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            value === "intro"
              ? "border-teal-400 bg-teal-50 shadow-[0_0_12px_rgba(43,188,179,0.2)]"
              : "border-border hover:border-teal-200 hover:bg-teal-50/50",
          )}
        >
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full",
              value === "intro" ? "bg-teal-100 text-teal-600" : "bg-muted text-muted-foreground",
            )}
          >
            <Sprout className="size-5" />
          </div>
          <span
            className={cn(
              "text-sm font-bold",
              value === "intro" ? "text-teal-700" : "text-foreground",
            )}
          >
            Introduksjon
          </span>
          <span className="text-xs text-muted-foreground text-center">
            Elevene har ikke lært om emnet ennå
          </span>
        </button>

        <button
          onClick={() => onChange("oppsummering")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            value === "oppsummering"
              ? "border-amber-400 bg-amber-50 shadow-[0_0_12px_rgba(217,119,6,0.2)]"
              : "border-border hover:border-amber-200 hover:bg-amber-50/50",
          )}
        >
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full",
              value === "oppsummering"
                ? "bg-amber-100 text-amber-600"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Target className="size-5" />
          </div>
          <span
            className={cn(
              "text-sm font-bold",
              value === "oppsummering" ? "text-amber-700" : "text-foreground",
            )}
          >
            Oppsummering
          </span>
          <span className="text-xs text-muted-foreground text-center">
            Elevene har allerede lært om emnet
          </span>
        </button>
      </div>
    </div>
  );
}
