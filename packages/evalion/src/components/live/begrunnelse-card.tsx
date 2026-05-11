import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";

import { VoteBadge } from "./vote-badge";

interface BegrunnelseCardProps {
  text: string;
  studentName?: string;
  vote?: Fasit;
  highlighted?: boolean;
  className?: string;
}

export function BegrunnelseCard({
  text,
  studentName,
  vote,
  highlighted = false,
  className,
}: BegrunnelseCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-l-none rounded-r-xl border-l-[3px] bg-[var(--color-highlight-strip-bg)] px-5 py-4 text-base font-medium leading-relaxed text-[var(--color-text-ink-strong)]",
        highlighted
          ? "border-l-[var(--color-purple-400)]"
          : "border-l-[var(--color-highlight-strip)]",
        className,
      )}
    >
      {vote && (
        <VoteBadge
          vote={vote}
          variant="solid"
          size="sm"
          label={vote === "delvis" ? "Delvis sant" : undefined}
          className="mb-2"
        />
      )}
      <p className="italic leading-relaxed text-[var(--color-text-ink-strong)]">«{text}»</p>
      {studentName && (
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-ink-faint)]">
          — {studentName}
        </p>
      )}
    </div>
  );
}
