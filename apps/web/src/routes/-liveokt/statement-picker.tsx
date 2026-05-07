import { Professor } from "@workspace/evalion/components/live/professor";
import { STATEMENT_COLORS_HEX } from "@workspace/evalion/lib/constants";
import { cn } from "@workspace/ui/lib/utils";

import { COUNTDOWN_STEP_MS } from "@/lib/timings";

import { useTeacherSession } from "./teacher-session-context";

export function StatementPicker() {
  const { fagprat, selectedStatement, setSelectedStatement, usedStatements, goToStep } =
    useTeacherSession();
  const isOdd = fagprat.statements.length % 2 !== 0;

  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-10">
      <Professor size="2xl" label="Velg en påstand" className="flex-col pt-4 lg:pt-8" />
      <div className="grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {fagprat.statements.map((s, i) => {
          const isSelected = selectedStatement === i;
          const hasSomeSelected = selectedStatement !== null;
          const isLast = i === fagprat.statements.length - 1;
          const isUsed = usedStatements.has(i);
          const color = STATEMENT_COLORS_HEX[i % STATEMENT_COLORS_HEX.length];
          return (
            <button
              key={i}
              disabled={isUsed}
              onClick={() => {
                if (isUsed) return;
                setSelectedStatement(i);
                setTimeout(() => goToStep(1, i), COUNTDOWN_STEP_MS);
              }}
              style={{
                backgroundColor: color.bg,
                borderColor: color.border,
              }}
              className={cn(
                "relative rounded-2xl border-2 p-6 text-left text-base font-semibold transition-all duration-300 hover:scale-[1.03]",
                isSelected && "scale-105 ring-2 ring-primary",
                hasSomeSelected && !isSelected && "scale-[0.97] opacity-40",
                isUsed && "cursor-default opacity-40 hover:scale-100",
                isOdd && isLast && "col-span-2 mx-auto max-w-[calc(50%-12px)]",
              )}
            >
              {s.text}
              {isUsed && (
                <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary/80 text-xs text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
