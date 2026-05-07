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

export interface BegrunnelseRef {
  _id: Id<"sessionBegrunnelser">;
  text: string;
  highlighted: boolean;
}

export interface StudentData {
  studentId: string;
  name: string;
  avatarColor: string;
  round1: { vote: string; confidence: number | null; correct: boolean } | null;
  round2: { vote: string; confidence: number | null; correct: boolean } | null;
  begrunnelseR1: BegrunnelseRef | null;
  rating: number | null;
}
