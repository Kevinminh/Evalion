import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";

const FASIT_CONFIG: Record<Fasit, { label: string; bg: string }> = {
  sant: { label: "SANT", bg: "bg-sant" },
  usant: { label: "USANT", bg: "bg-usant" },
  delvis: { label: "DELVIS SANT", bg: "bg-delvis" },
};

const SIZE_CLASS = {
  sm: "px-3 py-0.5 text-xs",
  md: "px-4 py-1 text-xs",
  lg: "px-6 py-2 text-base",
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
        "inline-block rounded-full font-bold uppercase text-white shadow-sm",
        SIZE_CLASS[size],
        bg,
        className,
      )}
      style={{
        letterSpacing: "0.05em",
        animation: animated
          ? "fasit-pulse 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both"
          : undefined,
      }}
    >
      {label}
    </span>
  );
}
