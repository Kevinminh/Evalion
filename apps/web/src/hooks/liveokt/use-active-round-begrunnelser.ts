import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { useMemo } from "react";

/** Filters begrunnelser to the round currently in focus on the teacher screen:
 * steps 1–2 belong to round 1, steps 3+ to round 2. Mirrors the
 * `activeRoundVotes` derivation in `useVoteAnalysis`. */
export function useActiveRoundBegrunnelser(
  begrunnelser: Doc<"sessionJustifications">[] | undefined,
  step: number,
): Doc<"sessionJustifications">[] | undefined {
  return useMemo(() => {
    if (!begrunnelser) return begrunnelser;
    const round = step <= 2 ? 1 : 2;
    return begrunnelser.filter((b) => b.round === round);
  }, [begrunnelser, step]);
}
