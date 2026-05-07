import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { Professor } from "@workspace/evalion/components/live/professor";
import { RatingChart } from "@workspace/evalion/components/live/rating-chart-live";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { ArrowRight } from "lucide-react";

import { DestructiveButton } from "./destructive-button";
import { PrimaryActionButton } from "./primary-action-button";
import type { TeacherStep } from "./teacher-step";
import { useTeacherSession } from "./teacher-session-context";

export function useStep6(): TeacherStep {
  const {
    statement,
    fagprat,
    selectedIdx,
    usedStatements,
    markStatementUsed,
    goToStep,
    endSession,
    ratingDistribution,
    avgRating,
  } = useTeacherSession();

  const main = (
    <div className="flex flex-col items-center gap-8 pt-8">
      {statement && <FasitBadge fasit={statement.fasit} />}
      {statement && <StatementCard statement={statement} size="lg" />}
      <Professor size="md" text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå." />
    </div>
  );

  const panel = <RatingChart distribution={ratingDistribution} average={avgRating} />;

  const unusedCount =
    fagprat.statements.length - usedStatements.size - (usedStatements.has(selectedIdx) ? 0 : 1);
  const hasMoreStatements = unusedCount > 0;

  const panelFooter = (
    <div className="flex gap-2">
      {hasMoreStatements && (
        <PrimaryActionButton
          className="flex-1"
          onClick={() => {
            markStatementUsed(selectedIdx);
            goToStep(0);
          }}
        >
          Neste påstand
          <ArrowRight className="size-4" />
        </PrimaryActionButton>
      )}
      <DestructiveButton className="flex-1" onClick={endSession}>
        Avslutt
      </DestructiveButton>
    </div>
  );

  return { main, panel, panelFooter };
}
