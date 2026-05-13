import { liveSessionsMutations } from "@workspace/api/liveSessions";
import { sessionBegrunnelserMutations } from "@workspace/api/sessionBegrunnelser";
import type { Id } from "@workspace/api/types";
import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseSessionMutationsArgs {
  sessionId: Id<"liveSessions">;
  step: number;
  selectedIdx: number;
  navigateToStep: (n: number) => Promise<void>;
  onSessionEnded: () => void;
  onResetStatement: () => void;
}

export interface SessionMutations {
  goToStep: (n: number, statementIndexOverride?: number) => Promise<void>;
  endSession: () => Promise<void>;
  highlightBegrunnelse: (b: Doc<"sessionBegrunnelser">) => Promise<unknown>;
  markStatementUsed: (n: number) => void;
  usedStatements: Set<number>;
  completedSteps: number[];
}

export function useSessionMutations({
  sessionId,
  step,
  selectedIdx,
  navigateToStep,
  onSessionEnded,
  onResetStatement,
}: UseSessionMutationsArgs): SessionMutations {
  const updateStepMutation = useMutation(liveSessionsMutations.updateStep);
  const endSessionMutation = useMutation(liveSessionsMutations.end);
  const highlightBegrunnelseMutation = useMutation(sessionBegrunnelserMutations.highlight);

  const [usedStatements, setUsedStatements] = useState<Set<number>>(new Set());

  const completedSteps = step > 0 ? Array.from({ length: step - 1 }, (_, i) => i + 1) : [];

  const goToStep = useCallback(
    async (n: number, statementIndexOverride?: number) => {
      if (n === 0) {
        onResetStatement();
      }
      const targetIndex = statementIndexOverride ?? selectedIdx;
      try {
        await updateStepMutation({
          id: sessionId,
          step: n,
          ...(n === 0 ? {} : { statementIndex: targetIndex }),
        });
        await navigateToStep(n);
      } catch {
        toast.error("Kunne ikke bytte steg. Prøv igjen.");
      }
    },
    [sessionId, step, selectedIdx, navigateToStep, onResetStatement, updateStepMutation],
  );

  const endSession = useCallback(async () => {
    try {
      await endSessionMutation({ id: sessionId });
      onSessionEnded();
    } catch {
      toast.error("Kunne ikke avslutte økten. Prøv igjen.");
    }
  }, [sessionId, endSessionMutation, onSessionEnded]);

  const highlightBegrunnelse = useCallback(
    (b: Doc<"sessionBegrunnelser">) =>
      highlightBegrunnelseMutation({ id: b._id, highlighted: !b.highlighted }),
    [highlightBegrunnelseMutation],
  );

  const markStatementUsed = useCallback(
    (n: number) => setUsedStatements((prev) => new Set(prev).add(n)),
    [],
  );

  return {
    goToStep,
    endSession,
    highlightBegrunnelse,
    markStatementUsed,
    usedStatements,
    completedSteps,
  };
}
