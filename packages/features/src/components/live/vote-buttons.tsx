import { STUDENT_VOTE_OPTIONS, VOTE_BUTTON_3D_CLASSES } from "@workspace/features/lib/constants";
import type { Fasit } from "@workspace/api/types";
import { cn } from "@workspace/ui/lib/utils";

interface VoteButtonsProps {
  selected: Fasit | null;
  onVote: (value: Fasit) => void;
  disabled?: boolean;
}

export function VoteButtons({ selected, onVote, disabled }: VoteButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {STUDENT_VOTE_OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        const isDimmed = selected !== null && !isSelected;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onVote(opt.value)}
            disabled={disabled}
            aria-pressed={isSelected}
            className={cn(
              "rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition-all duration-150 ease-out",
              VOTE_BUTTON_3D_CLASSES,
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
