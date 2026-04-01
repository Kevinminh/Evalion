import { cn } from "@workspace/ui/lib/utils";

const fasitStyles = {
  sant: "bg-[#E8F5E9] text-[#4CAF50]",
  usant: "bg-[#FFEBEE] text-[#EF5350]",
  delvis: "bg-[#FFF3E0] text-[#E65100]",
} as const;

const fasitLabels = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
} as const;

export function FasitBadge({ fasit }: { fasit: "sant" | "usant" | "delvis" }) {
  return (
    <span
      className={cn(
        "inline-block rounded-lg px-3 py-1 text-xs font-extrabold uppercase tracking-wide",
        fasitStyles[fasit],
      )}
    >
      {fasitLabels[fasit]}
    </span>
  );
}
