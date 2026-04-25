import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";

const FASIT_CONFIG: Record<Fasit, { label: string; bg: string }> = {
  sant: { label: "SANT", bg: "bg-sant" },
  usant: { label: "USANT", bg: "bg-usant" },
  delvis: { label: "DELVIS SANT", bg: "bg-delvis" },
};

interface FasitBadgeProps {
  fasit: Fasit;
  animated?: boolean;
  className?: string;
}

export function FasitBadge({ fasit, animated = false, className }: FasitBadgeProps) {
  const { label, bg } = FASIT_CONFIG[fasit];

  return (
    <span
      className={cn(
        "inline-block rounded-full px-4 py-1 text-xs font-bold uppercase text-white",
        bg,
        animated && "animate-[badge-bounce_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]",
        className,
      )}
    >
      {label}
    </span>
  );
}
