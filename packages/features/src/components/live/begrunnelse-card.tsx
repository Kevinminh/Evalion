import type { Fasit } from "@workspace/features/lib/types";
import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";

import { VoteBadge } from "./vote-badge";

interface BegrunnelseCardProps {
  text: string;
  vote?: Fasit;
  highlighted?: boolean;
  className?: string;
  onDismiss?: () => void;
}

export function BegrunnelseCard({
  text,
  vote,
  highlighted = false,
  className,
  onDismiss,
}: BegrunnelseCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-l-none rounded-r-xl border-l-[3px] bg-[var(--color-highlight-strip-bg)] px-5 py-4 text-base font-medium leading-relaxed text-[var(--color-text-ink-strong)]",
        highlighted
          ? "border-l-[var(--color-purple-400)]"
          : "border-l-[var(--color-highlight-strip)]",
        onDismiss && "pr-10",
        className,
      )}
    >
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fjern fra fremhevet"
          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
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
    </div>
  );
}
