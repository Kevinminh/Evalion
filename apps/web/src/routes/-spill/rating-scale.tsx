import { cn } from "@workspace/ui/lib/utils";

const SCALE_VALUES = [1, 2, 3, 4, 5] as const;
type ScaleValue = (typeof SCALE_VALUES)[number];

const RATING_CLASSES: Record<ScaleValue, string> = {
  1: "bg-red-400",
  2: "bg-orange-400",
  3: "bg-yellow-400",
  4: "bg-lime-400",
  5: "bg-green-500",
};

const UNSELECTED =
  "border-2 border-neutral-200 bg-white text-foreground shadow-[0_4px_0_theme(colors.neutral.300)]";

const CONFIDENCE_SELECTED =
  "translate-y-0.5 border-2 border-primary bg-primary text-white shadow-[0_2px_0_var(--color-primary-700,theme(colors.purple.700))]";

interface RatingScaleProps {
  selected: number | null;
  onSelect: (value: number) => void;
  variant?: "confidence" | "rating";
  disabled?: boolean;
}

export function RatingScale({
  selected,
  onSelect,
  variant = "confidence",
  disabled,
}: RatingScaleProps) {
  return (
    <div className="flex gap-2">
      {SCALE_VALUES.map((n) => {
        const isSelected = selected === n;
        const selectedClass =
          variant === "rating"
            ? `${RATING_CLASSES[n]} translate-y-0.5 text-white shadow-[0_2px_0_rgba(0,0,0,0.2)]`
            : CONFIDENCE_SELECTED;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onSelect(n)}
            disabled={disabled}
            className={cn(
              "flex flex-1 items-center justify-center rounded-2xl py-3 text-[15px] font-bold transition-all",
              isSelected ? selectedClass : UNSELECTED,
              disabled && "pointer-events-none opacity-50",
            )}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
