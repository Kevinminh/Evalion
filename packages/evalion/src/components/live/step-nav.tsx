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
    <nav className="fixed right-0 bottom-0 left-0 z-40 flex h-[100px] min-h-[100px] items-center justify-center border-t-[1.5px] border-[#EEEEEE] bg-white px-6">
      <div className="flex w-full items-stretch gap-2">
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
                "flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-center transition-all",
                isActive && "bg-[#E0D4FF]",
                isInactive && !allDisabled && "hover:bg-[#F5F5F5]",
                allDisabled && "pointer-events-none cursor-not-allowed opacity-40 saturate-50",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-extrabold leading-none",
                  isActive && "text-white",
                  isCompleted && "text-white",
                  isInactive && "text-[#9E9E9E]",
                )}
                style={{
                  backgroundColor: isActive
                    ? "#6C3FC5"
                    : isCompleted
                      ? "#4CAF50"
                      : "#EEEEEE",
                }}
              >
                {step.num}
              </span>
              <span
                className={cn(
                  "text-xs font-bold leading-tight",
                  isActive && "text-[#48208B]",
                  isCompleted && "text-[#616161]",
                  isInactive && "text-[#9E9E9E]",
                )}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
