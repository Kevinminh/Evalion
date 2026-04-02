import { cn } from "@workspace/ui/lib/utils";

const options = [
  {
    value: "sant" as const,
    label: "Sant",
    bg: "bg-[#4CAF50]",
    hover: "hover:bg-[#43A047]",
    glow: "shadow-[0_0_20px_rgba(76,175,80,0.4)]",
  },
  {
    value: "usant" as const,
    label: "Usant",
    bg: "bg-[#EF5350]",
    hover: "hover:bg-[#E53935]",
    glow: "shadow-[0_0_20px_rgba(239,83,80,0.4)]",
  },
  {
    value: "delvis" as const,
    label: "Delvis sant",
    bg: "bg-[#FF9800]",
    hover: "hover:bg-[#FB8C00]",
    glow: "shadow-[0_0_20px_rgba(255,152,0,0.4)]",
  },
] as const;

interface VoteButtonsProps {
  selected: "sant" | "usant" | "delvis" | null;
  onVote: (value: "sant" | "usant" | "delvis") => void;
}

export function VoteButtons({ selected, onVote }: VoteButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onVote(opt.value)}
          className={cn(
            "rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition-all",
            opt.bg,
            opt.hover,
            selected === opt.value
              ? `scale-105 ${opt.glow} shadow-[0_4px_0_rgba(0,0,0,0.2)]`
              : "shadow-[0_3px_0_rgba(0,0,0,0.15)]",
            selected && selected !== opt.value && "opacity-50 scale-95",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
