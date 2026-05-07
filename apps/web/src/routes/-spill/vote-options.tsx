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
      {STUDENT_VOTE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          disabled={disabled}
          className={cn(
            "flex-1 rounded-2xl py-3 text-[15px] font-bold text-white transition-all",
            opt.bg,
            opt.shadow,
            selected === opt.value && "outline-3 outline outline-white outline-offset-[-3px]",
            selected && selected !== opt.value && "opacity-45",
            disabled && "pointer-events-none",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
