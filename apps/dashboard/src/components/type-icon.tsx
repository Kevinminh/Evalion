import { Sprout, Target } from "lucide-react";

import type { FagPratType } from "@/lib/types";

export function TypeIcon({ type }: { type: FagPratType }) {
  if (type === "intro") {
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-500">
        <Sprout className="size-3.5" />
      </span>
    );
  }
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600">
      <Target className="size-3.5" />
    </span>
  );
}
