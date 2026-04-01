import { Minus, Plus } from "lucide-react";

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
}

export function Stepper({ value, min, max, onChange, label }: StepperProps) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
      <div className="inline-flex items-center rounded-xl border-2 border-border">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
        >
          <Minus className="size-4" />
        </button>
        <span className="min-w-[40px] text-center text-base font-bold text-foreground">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
