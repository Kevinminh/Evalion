import { cn } from "@workspace/ui/lib/utils";

const options = [
  {
    value: "sant" as const,
    label: "Sant",
    bg: "bg-sant",
    hover: "hover:brightness-110",
    glow: "shadow-[0_0_20px_var(--sant)/40%]",
  },
  {
    value: "usant" as const,
    label: "Usant",
    bg: "bg-usant",
    hover: "hover:brightness-110",
    glow: "shadow-[0_0_20px_var(--usant)/40%]",
  },
  {
    value: "delvis" as const,
    label: "Delvis sant",
    bg: "bg-delvis",
    hover: "hover:brightness-110",
    glow: "shadow-[0_0_20px_var(--delvis)/40%]",
  },
] as const;

interface VoteButtonsProps {
  selected: "sant" | "usant" | "delvis" | null;
  onVote: (value: "sant" | "usant" | "delvis") => void;
  disabled?: boolean;
}

export function VoteButtons({ selected, onVote, disabled }: VoteButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onVote(opt.value)}
          disabled={disabled}
          className={cn(
            "rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition-all",
            opt.bg,
            opt.hover,
            selected === opt.value
              ? `scale-105 ${opt.glow} shadow-[0_4px_0_rgba(0,0,0,0.2)]`
              : "shadow-[0_3px_0_rgba(0,0,0,0.15)]",
            selected && selected !== opt.value && "opacity-50 scale-95",
            disabled && "pointer-events-none",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
