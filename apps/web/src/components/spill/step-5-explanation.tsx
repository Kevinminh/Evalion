import { ExplanationCard } from "@workspace/evalion/components/live/explanation-card";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";

import { useStudentGame } from "./student-game-context";

export function Step5Explanation() {
  const { statement } = useStudentGame();
  if (!statement) return null;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <FasitBadge fasit={statement.fasit} />
      <div className="w-full max-w-md">
        <ExplanationCard statementText={statement.text} explanation={statement.explanation} />
      </div>
    </div>
  );
}
