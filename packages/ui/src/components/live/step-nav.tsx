import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { label: "Velg påstand" },
  { label: "1. stemmerunde" },
  { label: "Diskusjon" },
  { label: "2. stemmerunde" },
  { label: "Fasit" },
  { label: "Forklaring" },
  { label: "Egenvurdering" },
];

interface StepNavProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepNav({ currentStep, onStepClick }: StepNavProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-center gap-2 border-t bg-card px-6 py-3">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        return (
          <button
            key={i}
            onClick={() => onStepClick(i)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
              isActive && "bg-primary/10 text-primary",
              isCompleted && "text-[#4CAF50]",
              !isActive && !isCompleted && "text-muted-foreground/50",
            )}
          >
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                isActive && "bg-primary text-primary-foreground",
                isCompleted && "bg-[#4CAF50] text-white",
                !isActive && !isCompleted && "bg-muted text-muted-foreground/60",
              )}
            >
              {isCompleted ? <Check className="size-3.5" /> : i}
            </span>
            <span className="hidden lg:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
