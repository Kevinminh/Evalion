import { cn } from "@workspace/ui/lib/utils";

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
  const allDisabled = currentStep === 0;
  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 flex w-full items-stretch gap-2 border-t border-border/80 bg-card px-4 py-2 sm:h-[100px] sm:px-6 sm:py-3">
      {steps.map((step) => {
        const isActive = step.num === currentStep;
        const isCompleted = completedSteps.includes(step.num);
        const isInactive = !isActive && !isCompleted;
        return (
          <button
            key={step.num}
            type="button"
            onClick={() => onStepClick(step.num)}
            disabled={allDisabled}
            className={cn(
              "flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-center transition-all sm:py-3",
              isActive && "bg-primary/10",
              isInactive && !allDisabled && "hover:bg-muted/60",
              allDisabled && "pointer-events-none cursor-not-allowed opacity-40 saturate-50",
            )}
          >
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-sm font-extrabold sm:size-8",
                isActive && "bg-primary text-primary-foreground",
                isCompleted && "text-white",
                isInactive && "bg-muted text-muted-foreground",
              )}
              style={isCompleted ? { backgroundColor: "#4CAF50" } : undefined}
            >
              {step.num}
            </span>
            <span
              className={cn(
                "text-[11px] font-bold leading-tight sm:text-xs",
                isActive && "text-primary",
                isCompleted && "text-foreground/80",
                isInactive && "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
