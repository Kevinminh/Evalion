import { ExplanationCard } from "@workspace/evalion/components/live/explanation-card";
import { FasitBadgeOverlay } from "@workspace/evalion/components/live/fasit-badge-overlay";
import { resolveStatementStudentHex } from "@workspace/evalion/lib/constants";

import { useStudentGame } from "./student-game-context";

export function Step5Explanation() {
  const { statement, statementIndex } = useStudentGame();
  if (!statement) return null;

  const color = resolveStatementStudentHex(statement.color, statementIndex);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <FasitBadgeOverlay fasit={statement.fasit} className="max-w-md">
        <ExplanationCard
          statementText={statement.text}
          explanation={statement.explanation}
          color={color}
        />
      </FasitBadgeOverlay>
    </div>
  );
}
