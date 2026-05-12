import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  /** Pulse 3 times to draw the teacher's attention (used on step 6 once rating is in). */
  pulse?: boolean;
}

export function BackButton({ onClick, pulse }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      style={pulse ? { animation: "back-button-pulse 1.4s ease-in-out 3 forwards" } : undefined}
      className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border-[1.5px] border-[var(--color-vote-empty-fill)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--color-text-ink-soft)] transition-all hover:border-[var(--color-neutral-400)] hover:bg-white/60 hover:text-[var(--color-text-ink-strong)]"
    >
      <ChevronLeft className="size-4" strokeWidth={2.5} />
      Alle påstander
    </button>
  );
}
