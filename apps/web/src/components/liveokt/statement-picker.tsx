import { STATEMENT_COLORS_HEX } from "@workspace/evalion/lib/constants";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";
import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";

import { COUNTDOWN_STEP_MS } from "@/lib/timings";

import { useTeacherSession } from "./teacher-session-context";

export function StatementPicker() {
  const { fagprat, selectedStatement, setSelectedStatement, usedStatements, goToStep } =
    useTeacherSession();
  const count = fagprat.statements.length;
  const isOdd = count % 2 !== 0;
  const isSmallCount = count <= 4;
  const hasSomeSelected = selectedStatement !== null;

  return (
    <div className="flex min-h-full w-full flex-1 flex-col items-center justify-center gap-8 py-4 lg:flex-row lg:justify-evenly lg:gap-12">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <img
          src="/professoren.png"
          alt="Professoren"
          className="size-32 rounded-full border-[5px] border-primary/20 bg-muted object-cover sm:size-40 lg:size-[180px] xl:size-[220px]"
        />
        <span className="text-base font-semibold text-muted-foreground">Velg en påstand</span>
        <WaitingDots />
      </div>

      <div className="grid w-full max-w-[900px] shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {fagprat.statements.map((s, i) => {
          const isSelected = selectedStatement === i;
          const isLast = i === count - 1;
          const isUsed = usedStatements.has(i);
          const color = STATEMENT_COLORS_HEX[i % STATEMENT_COLORS_HEX.length]!;
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
                color: color.text,
              }}
              className={cn(
                "relative flex items-center justify-center rounded-2xl border-2 text-center font-semibold leading-relaxed transition-all duration-300",
                isSmallCount
                  ? "min-h-[130px] px-6 py-5 text-base"
                  : "min-h-[110px] px-5 py-4 text-sm",
                "hover:scale-[1.03] hover:shadow-lg",
                isSelected && "scale-105 shadow-xl",
                hasSomeSelected && !isSelected && "scale-[0.97] opacity-40",
                isUsed && "cursor-default opacity-40 hover:scale-100 hover:shadow-none",
                isOdd && isLast && "col-span-1 sm:col-span-2 sm:mx-auto sm:max-w-[calc(50%-12px)]",
              )}
            >
              {s.text}
              {isUsed && (
                <span
                  aria-label="Brukt"
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-[0_2px_0_rgba(0,0,0,0.12)]"
                >
                  <Check className="size-4" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
