import { cn } from "@workspace/ui/lib/utils";

interface ConfidenceScaleProps {
  selected: number | null;
  onSelect: (level: number) => void;
  disabled?: boolean;
}

export function ConfidenceScale({ selected, onSelect, disabled }: ConfidenceScaleProps) {
  return (
    <div className="flex gap-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onSelect(n)}
          disabled={disabled}
          className={cn(
            "flex flex-1 items-center justify-center rounded-2xl py-3 text-[15px] font-bold transition-all",
            selected === n
              ? "translate-y-0.5 border-2 border-primary bg-primary text-white shadow-[0_2px_0_var(--color-primary-700,theme(colors.purple.700))]"
              : "border-2 border-neutral-200 bg-white text-foreground shadow-[0_4px_0_theme(colors.neutral.300)]",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
