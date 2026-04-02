import { cn } from "@workspace/ui/lib/utils";

const FASIT_CONFIG = {
  sant: { label: "SANT", bg: "bg-sant" },
  usant: { label: "USANT", bg: "bg-usant" },
  delvis: { label: "DELVIS SANT", bg: "bg-delvis" },
} as const;

interface FasitBadgeProps {
  answer: "sant" | "usant" | "delvis";
  animated?: boolean;
  className?: string;
}

export function FasitBadge({ answer, animated = false, className }: FasitBadgeProps) {
  const { label, bg } = FASIT_CONFIG[answer];

  return (
    <span
      className={cn(
        "inline-block rounded-full px-8 py-2.5 text-lg font-extrabold uppercase text-white",
        bg,
        animated && "animate-[badge-bounce_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]",
        className,
      )}
    >
      {label}
    </span>
  );
}
