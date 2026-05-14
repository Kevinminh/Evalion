import type { Fasit } from "@workspace/api/types";
import { cn } from "@workspace/ui/lib/utils";

const FASIT_CONFIG: Record<Fasit, { label: string; bg: string }> = {
  sant: { label: "SANT", bg: "bg-sant" },
  usant: { label: "USANT", bg: "bg-usant" },
  delvis: { label: "DELVIS SANT", bg: "bg-delvis" },
};

const SIZE_CLASS = {
  sm: "px-3 py-0.5 text-xs",
  md: "px-4 py-1 text-xs",
  lg: "px-8 py-2.5 text-2xl shadow-lg",
} as const;

interface FasitBadgeProps {
  fasit: Fasit;
  animated?: boolean;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}

export function FasitBadge({
  fasit,
  animated = false,
  size = "md",
  className,
}: FasitBadgeProps) {
  const { label, bg } = FASIT_CONFIG[fasit];

  return (
    <span
      className={cn(
        "inline-block rounded-full font-extrabold uppercase tracking-wider text-white",
        SIZE_CLASS[size],
        bg,
        animated && "animate-fasit-pulse",
        className,
      )}
    >
      {label}
    </span>
  );
}
