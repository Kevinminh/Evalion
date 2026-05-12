import { ExplanationCard } from "@workspace/evalion/components/live/explanation-card";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { resolveStatementStudentHex } from "@workspace/evalion/lib/constants";

import { useStudentGame } from "./student-game-context";

export function Step5Explanation() {
  const { statement, statementIndex } = useStudentGame();
  if (!statement) return null;

  const color = resolveStatementStudentHex(statement.color, statementIndex);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative w-full max-w-md">
        <div className="absolute left-1/2 -top-1 z-10 -translate-x-1/2 -translate-y-[65%]">
          <FasitBadge fasit={statement.fasit} size="lg" />
        </div>
        <ExplanationCard
          statementText={statement.text}
          explanation={statement.explanation}
          color={color}
        />
      </div>
    </div>
  );
}
