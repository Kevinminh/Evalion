import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";

import { useStudentGame } from "./student-game-context";

export function Step5Explanation() {
  const { statement } = useStudentGame();
  if (!statement) return null;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <FasitBadge fasit={statement.fasit} />

      <div className="w-full max-w-md overflow-hidden rounded-2xl border-[1.5px] border-blue-200">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-5">
          <p className="text-center text-base font-bold text-foreground">{statement.text}</p>
        </div>

        <div className="bg-white p-5">
          <div className="flex gap-3">
            <div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-primary/20">
              <img
                src="/professoren.png"
                alt="Professoren"
                className="size-full object-cover"
              />
            </div>
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Forklaring
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">{statement.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
