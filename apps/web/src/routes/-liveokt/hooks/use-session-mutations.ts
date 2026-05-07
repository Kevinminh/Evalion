import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/convex";
import type { Id } from "@/lib/convex";

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
  const updateStepMutation = useMutation(api.liveSessions.updateStep);
  const endSessionMutation = useMutation(api.liveSessions.end);
  const highlightBegrunnelseMutation = useMutation(api.liveSessions.highlightBegrunnelse);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [usedStatements, setUsedStatements] = useState<Set<number>>(new Set());

  const goToStep = useCallback(
    async (n: number, statementIndexOverride?: number) => {
      if (n === 0) {
        setCompletedSteps([]);
        onResetStatement();
      }
      if (step > 0 && step < n) {
        setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
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
