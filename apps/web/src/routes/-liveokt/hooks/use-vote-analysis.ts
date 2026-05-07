import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { useMemo } from "react";

import { buildVoteBars, type VoteBar } from "@/lib/vote-bars";

interface VoteAnalysisInput {
  votes: Doc<"sessionVotes">[];
  analytics:
    | {
        correctR2: number;
        totalR2: number;
        wrongToRight: number;
        rightToWrong: number;
      }
    | undefined;
  step: number;
}

export interface VoteAnalysis {
  r2Votes: Doc<"sessionVotes">[];
  activeRoundVotes: Doc<"sessionVotes">[];
  voteBars: VoteBar[];
  totalVotes: number;
  r2CorrectCount: number;
  r2Total: number;
  changedToCorrect: number;
  changedToIncorrect: number;
}

export function useVoteAnalysis({ votes, analytics, step }: VoteAnalysisInput): VoteAnalysis {
  return useMemo(() => {
    const r1: Doc<"sessionVotes">[] = [];
    const r2: Doc<"sessionVotes">[] = [];
    for (const v of votes) {
      if (v.round === 1) r1.push(v);
      else if (v.round === 2) r2.push(v);
    }
    const activeRoundVotes = step <= 2 ? r1 : r2;

    return {
      r2Votes: r2,
      activeRoundVotes,
      voteBars: buildVoteBars(activeRoundVotes),
      totalVotes: activeRoundVotes.length,
      r2CorrectCount: analytics?.correctR2 ?? 0,
      r2Total: analytics?.totalR2 ?? 0,
      changedToCorrect: analytics?.wrongToRight ?? 0,
      changedToIncorrect: analytics?.rightToWrong ?? 0,
    };
  }, [votes, analytics, step]);
}
