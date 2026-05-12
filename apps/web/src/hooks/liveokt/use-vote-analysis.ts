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

export interface ConfidenceLevelCount {
  level: 1 | 2 | 3 | 4 | 5;
  count: number;
}

export interface VoteAnalysis {
  r1Votes: Doc<"sessionVotes">[];
  r2Votes: Doc<"sessionVotes">[];
  activeRoundVotes: Doc<"sessionVotes">[];
  voteBars: VoteBar[];
  totalVotes: number;
  r2CorrectCount: number;
  r2Total: number;
  changedToCorrect: number;
  changedToIncorrect: number;
  totalChanged: number;
  avgConfidenceR1?: number;
  avgConfidenceR2?: number;
  avgConfidenceR2ByVote: {
    sant?: number;
    delvis?: number;
    usant?: number;
  };
  confidenceR1: ConfidenceLevelCount[];
  confidenceR2: ConfidenceLevelCount[];
}

function avgConfidence(votes: Doc<"sessionVotes">[]): number | undefined {
  const withConf = votes.filter((v) => typeof v.confidence === "number");
  if (withConf.length === 0) return undefined;
  return withConf.reduce((sum, v) => sum + (v.confidence ?? 0), 0) / withConf.length;
}

function confidenceDistribution(votes: Doc<"sessionVotes">[]): ConfidenceLevelCount[] {
  const counts: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const v of votes) {
    const c = v.confidence;
    if (typeof c === "number" && c >= 1 && c <= 5) {
      counts[c as 1 | 2 | 3 | 4 | 5]++;
    }
  }
  return [1, 2, 3, 4, 5].map((level) => ({
    level: level as 1 | 2 | 3 | 4 | 5,
    count: counts[level as 1 | 2 | 3 | 4 | 5],
  }));
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

    const r1ByStudent = new Map(r1.map((v) => [v.studentId, v.vote]));
    let totalChanged = 0;
    for (const r2Vote of r2) {
      const r1Vote = r1ByStudent.get(r2Vote.studentId);
      if (r1Vote !== undefined && r1Vote !== r2Vote.vote) totalChanged++;
    }

    return {
      r1Votes: r1,
      r2Votes: r2,
      activeRoundVotes,
      voteBars: buildVoteBars(activeRoundVotes),
      totalVotes: activeRoundVotes.length,
      r2CorrectCount: analytics?.correctR2 ?? 0,
      r2Total: analytics?.totalR2 ?? 0,
      changedToCorrect: analytics?.wrongToRight ?? 0,
      changedToIncorrect: analytics?.rightToWrong ?? 0,
      totalChanged,
      avgConfidenceR1: avgConfidence(r1),
      avgConfidenceR2: avgConfidence(r2),
      avgConfidenceR2ByVote: {
        sant: avgConfidence(r2.filter((v) => v.vote === "sant")),
        delvis: avgConfidence(r2.filter((v) => v.vote === "delvis")),
        usant: avgConfidence(r2.filter((v) => v.vote === "usant")),
      },
      confidenceR1: confidenceDistribution(r1),
      confidenceR2: confidenceDistribution(r2),
    };
  }, [votes, analytics, step]);
}
