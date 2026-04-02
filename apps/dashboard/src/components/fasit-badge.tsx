import { cn } from "@workspace/ui/lib/utils";

const fasitStyles = {
  sant: "bg-sant-bg text-sant",
  usant: "bg-usant-bg text-usant",
  delvis: "bg-delvis-bg text-delvis",
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
