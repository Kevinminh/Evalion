import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { Professor } from "@workspace/evalion/components/live/professor";
import { RatingChart } from "@workspace/evalion/components/live/rating-chart-live";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { ArrowRight } from "lucide-react";

import { DestructiveButton } from "@workspace/ui/components/destructive-button";
import { PrimaryActionButton } from "@workspace/ui/components/primary-action-button";
import type { TeacherStep } from "@/types/teacher-step";
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

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <TeacherStepLayout
      top={
        statement ? (
          <div className="flex w-full justify-center">
            <FasitBadge fasit={statement.fasit} />
          </div>
        ) : undefined
      }
      statement={
        statement && (
          <StatementCard statement={statement} size="lg" color={statementColor} gradient />
        )
      }
      professor={
        <Professor
          size="md"
          bordered
          animate
          textSize="lg"
          text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå."
        />
      }
    />
  );

  const panel = (
    <RatingChart
      key={`s${selectedIdx}`}
      distribution={ratingDistribution}
      average={avgRating}
    />
  );

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
