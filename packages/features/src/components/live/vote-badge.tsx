import type { Fasit } from "@workspace/features/lib/types";
import { cn } from "@workspace/ui/lib/utils";

type Variant = "pale" | "solid";
type Size = "sm" | "md";

interface VoteBadgeProps {
  vote: Fasit;
  /** `pale` = light bg + dark text (mockup `.badge-*`). `solid` = saturated bg + white text. */
  variant?: Variant;
  /** Override the default Norwegian label. */
  label?: string;
  size?: Size;
  className?: string;
}

const DEFAULT_LABEL: Record<Fasit, string> = {
  sant: "Sant",
  delvis: "Delvis",
  usant: "Usant",
};

const PALE: Record<Fasit, string> = {
  sant: "bg-[var(--color-sant-bg)] text-[var(--color-sant)]",
  delvis: "bg-[var(--color-delvis-bg)] text-[var(--color-delvis)]",
  usant: "bg-[var(--color-usant-bg)] text-[var(--color-usant)]",
};

const SOLID: Record<Fasit, string> = {
  sant: "bg-[var(--color-fasit-correct-text)] text-white",
  delvis: "bg-[var(--color-vote-delvis)] text-white",
  usant: "bg-[var(--color-usant)] text-white",
};

export function VoteBadge({
  vote,
  variant = "pale",
  label,
  size = "md",
  className,
}: VoteBadgeProps) {
  const variantClasses = variant === "solid" ? SOLID[vote] : PALE[vote];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold uppercase tracking-[0.05em]",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        variantClasses,
        className,
      )}
    >
      {label ?? DEFAULT_LABEL[vote]}
    </span>
  );
}
