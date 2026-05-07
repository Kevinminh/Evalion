import { STATEMENT_COLORS_STUDENT_HEX } from "@workspace/evalion/lib/constants";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";

import { useStudentGame } from "./student-game-context";

export function Step0Waiting() {
  const { fagprat } = useStudentGame();
  const statements = fagprat.statements ?? [];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <img
          src="/professoren.png"
          alt="Professoren"
          className="size-20 rounded-full border-[3px] border-primary/20 bg-muted object-cover sm:size-24 md:size-28 animate-[gentle-bounce_3s_ease-in-out_infinite]"
        />
        <span className="text-xs font-semibold text-muted-foreground">Venter på læreren</span>
        <WaitingDots />
      </div>

      {statements.length > 0 && (
        <div className="grid w-full max-w-md gap-3 sm:max-w-sm sm:flex-1">
          {statements.map((stmt, i) => {
            const color = STATEMENT_COLORS_STUDENT_HEX[i % STATEMENT_COLORS_STUDENT_HEX.length]!;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: color.bg,
                  borderColor: color.border,
                  color: color.text,
                }}
                className="flex min-h-[64px] items-center justify-center rounded-xl border-2 px-4 py-3 text-center text-sm font-semibold leading-relaxed transition-all"
              >
                {stmt.text}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
