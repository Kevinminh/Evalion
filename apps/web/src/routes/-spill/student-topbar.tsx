interface StudentTopbarProps {
  studentName: string;
  fagpratTitle?: string;
  currentStep?: number;
  totalSteps?: number;
  stepLabel?: string;
}

export function StudentTopbar({
  studentName,
  fagpratTitle,
  currentStep,
  totalSteps = 6,
  stepLabel,
}: StudentTopbarProps) {
  return (
    <div className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-3 min-w-0">
        <img src="/fagprat-logo.png" alt="FagPrat" className="h-7 shrink-0 object-contain" />
        {fagpratTitle && (
          <>
            <div className="h-5 w-px shrink-0 bg-neutral-300" />
            <span className="truncate text-sm font-bold text-foreground">{fagpratTitle}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
          {studentName}
        </span>
        {currentStep !== undefined && (
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {stepLabel ?? `Steg ${currentStep} av ${totalSteps}`}
          </span>
        )}
      </div>
    </div>
  );
}
