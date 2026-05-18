export interface RoundDistribution {
  sant: number;
  usant: number;
  delvis: number;
  total: number;
  santPct: number;
  usantPct: number;
  delvisPct: number;
}

export interface ConfidenceData {
  avgConfidence: number;
  confidenceDistribution: Array<{ level: number; count: number }>;
  confidenceByVote: { sant: number; usant: number; delvis: number };
}

import type { Id } from "@workspace/backend/convex/_generated/dataModel";

export interface JustificationRef {
  _id: Id<"sessionJustifications">;
  text: string;
  highlighted: boolean;
}

export interface StudentData {
  studentId: string;
  name: string;
  avatarColor: string;
  round1: { vote: string; confidence: number | null; correct: boolean } | null;
  round2: { vote: string; confidence: number | null; correct: boolean } | null;
  justificationR1: JustificationRef | null;
  justificationR2: JustificationRef | null;
  rating: number | null;
}

import { resolveStatementHex } from "@workspace/features/lib/constants";

interface StatementGradient {
  background: string;
  text: string;
}

/** Statement gradient for the analytics card. Matches the teacher's StatementCard
 * on the regular screen (uses the shared STATEMENT_COLORS_HEX palette with a 135°
 * gradient between `bg` and `bg2`). Falls back to the statement index when the
 * statement has no explicit color, same as the regular screen. */
export function getStatementGradient(
  color: string | undefined,
  statementIndex: number,
): StatementGradient {
  const c = resolveStatementHex(color, statementIndex);
  return {
    background: `linear-gradient(135deg, ${c.bg}, ${c.bg2})`,
    text: c.text,
  };
}
