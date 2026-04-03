import { cn } from "@workspace/ui/lib/utils";
import { Globe, Lock } from "lucide-react";

import type { Visibility } from "@/lib/types";

interface VisibilityToggleProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
  showDescription?: boolean;
}

export function VisibilityToggle({ value, onChange, showDescription = false }: VisibilityToggleProps) {
  return (
    <div>
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Synlighet
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onChange("public")}
          className={cn(
            "flex flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
            value === "public"
              ? "border-primary/40 bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-muted-foreground/30",
          )}
        >
          <Globe className="size-5 shrink-0" />
          <span className="text-sm font-semibold">Offentlig</span>
        </button>
        <button
          onClick={() => onChange("private")}
          className={cn(
            "flex flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
            value === "private"
              ? "border-primary/40 bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-muted-foreground/30",
          )}
        >
          <Lock className="size-5 shrink-0" />
          <span className="text-sm font-semibold">Privat</span>
        </button>
      </div>
      {showDescription && (
        <p className="mt-2 text-sm text-muted-foreground">
          {value === "public"
            ? "Alle kan finne og bruke denne FagPraten"
            : "Bare du kan se og bruke denne FagPraten"}
        </p>
      )}
    </div>
  );
}
