import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { num: 1, label: "Første stemmerunde" },
  { num: 2, label: "Diskusjon" },
  { num: 3, label: "Andre stemmerunde" },
  { num: 4, label: "Vise fasit" },
  { num: 5, label: "Professorens forklaring" },
  { num: 6, label: "Egenvurdering" },
];

interface StepNavProps {
  currentStep: number;
  completedSteps?: number[];
  onStepClick: (step: number) => void;
}

export function StepNav({ currentStep, completedSteps = [], onStepClick }: StepNavProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-center gap-3 border-t bg-card px-6 py-3">
      {steps.map((step) => {
        const isActive = step.num === currentStep;
        const isCompleted = completedSteps.includes(step.num);
        const isInactive = !isActive && !isCompleted;
        return (
          <button
            key={step.num}
            onClick={() => onStepClick(step.num)}
            disabled={isInactive}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
              isActive && "bg-primary/10 text-primary",
              isCompleted && "cursor-pointer text-[#4CAF50]",
              isInactive && "pointer-events-none text-muted-foreground/45 opacity-45",
            )}
          >
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                isActive && "bg-primary text-primary-foreground",
                isCompleted && "bg-[#4CAF50] text-white",
                isInactive && "bg-muted text-muted-foreground/60",
              )}
            >
              {isCompleted ? <Check className="size-3.5" /> : step.num}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
