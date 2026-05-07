import { cn } from "@workspace/ui/lib/utils";

const options = [
  {
    value: "sant" as const,
    label: "Sant",
    bg: "bg-sant",
  },
  {
    value: "delvis" as const,
    label: "Delvis sant",
    bg: "bg-delvis",
  },
  {
    value: "usant" as const,
    label: "Usant",
    bg: "bg-usant",
  },
] as const;

interface VoteButtonsProps {
  selected: "sant" | "usant" | "delvis" | null;
  onVote: (value: "sant" | "usant" | "delvis") => void;
  disabled?: boolean;
}

export function VoteButtons({ selected, onVote, disabled }: VoteButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        const isDimmed = selected !== null && selected !== opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onVote(opt.value)}
            disabled={disabled}
            aria-pressed={isSelected}
            className={cn(
              "rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition-all duration-150 ease-out",
              "shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]",
              "active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.18)]",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40",
              opt.bg,
              isSelected && "ring-4 ring-white/70 scale-[1.04]",
              isDimmed && "opacity-55 scale-[0.97]",
              disabled && "pointer-events-none opacity-70",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
