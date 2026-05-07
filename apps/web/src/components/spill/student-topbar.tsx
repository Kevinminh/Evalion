import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

interface StudentTopbarProps {
  studentName: string;
  fagpratTitle?: string;
  currentStep?: number;
  totalSteps?: number;
  stepLabel?: string;
  onLeave?: () => void;
  /** Slot rendered between the nickname pill and the step badge. */
  rightSlot?: ReactNode;
}

export function StudentTopbar({
  studentName,
  fagpratTitle,
  currentStep,
  totalSteps = 6,
  stepLabel,
  onLeave,
  rightSlot,
}: StudentTopbarProps) {
  return (
    <div className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-3 min-w-0">
        <img src="/co-lab-logo.png" alt="CO-LAB" className="h-7 shrink-0 object-contain" />
        {fagpratTitle && (
          <>
            <div className="h-5 w-px shrink-0 bg-neutral-300" />
            <span className="truncate text-sm font-bold text-foreground">{fagpratTitle}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary sm:text-xs">
          {studentName}
        </span>
        {rightSlot}
        {currentStep !== undefined && (
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground sm:text-xs">
            {stepLabel ?? `Steg ${currentStep} av ${totalSteps}`}
          </span>
        )}
        {onLeave && (
          <button
            onClick={onLeave}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Forlat spill"
          >
            <LogOut className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
