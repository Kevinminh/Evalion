import { cn } from "@workspace/ui/lib/utils";
import { Globe, Lock } from "lucide-react";

import type { Visibility } from "@/lib/types";

interface VisibilityToggleProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
  showDescription?: boolean;
}

export function VisibilityToggle({
  value,
  onChange,
  showDescription = false,
}: VisibilityToggleProps) {
  return (
    <div>
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Synlighet
      </div>
      <div className="inline-flex overflow-hidden rounded-xl border-[1.5px] border-border">
        <button
          onClick={() => onChange("public")}
          className={cn(
            "inline-flex items-center gap-2 border-r-[1.5px] border-border px-6 py-3 text-sm font-bold transition-all",
            value === "public"
              ? "bg-primary/10 text-primary"
              : "bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          )}
        >
          <Globe className="size-4" />
          Offentlig
        </button>
        <button
          onClick={() => onChange("private")}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all",
            value === "private"
              ? "bg-primary/10 text-primary"
              : "bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          )}
        >
          <Lock className="size-4" />
          Privat
        </button>
      </div>
      {showDescription && (
        <p className="mt-2 text-xs text-muted-foreground">
          {value === "public"
            ? "Alle kan finne og bruke denne FagPraten"
            : "Bare du kan se og bruke denne FagPraten"}
        </p>
      )}
    </div>
  );
}
