import { cn } from "@workspace/ui/lib/utils";

import { FASIT_STYLES, FASIT_LABELS } from "@/lib/fasit-config";
import type { Fasit } from "@/lib/types";

export function FasitBadge({ fasit }: { fasit: Fasit }) {
  return (
    <span
      className={cn(
        "inline-block rounded-lg px-3 py-1 text-xs font-extrabold uppercase tracking-wide",
        FASIT_STYLES[fasit],
      )}
    >
      {FASIT_LABELS[fasit]}
    </span>
  );
}
