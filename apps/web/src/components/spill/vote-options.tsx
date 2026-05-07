import { STUDENT_VOTE_OPTIONS } from "@workspace/evalion/lib/constants";
import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";

interface VoteOptionsProps {
  selected: Fasit | null;
  onSelect: (vote: Fasit) => void;
  disabled?: boolean;
}

export function VoteOptions({ selected, onSelect, disabled }: VoteOptionsProps) {
  return (
    <div className={cn("flex gap-3", selected && "has-selection")}>
      {STUDENT_VOTE_OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        const isDimmed = selected !== null && !isSelected;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            disabled={disabled}
            aria-pressed={isSelected}
            className={cn(
              "flex-1 rounded-2xl py-3 text-[15px] font-bold text-white transition-all duration-150 ease-out",
              "shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]",
              "active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.18)]",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40",
              opt.bg,
              opt.shadow,
              isSelected && "outline-3 outline outline-white outline-offset-[-3px] scale-[1.04]",
              isDimmed && "opacity-50 scale-[0.97]",
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
