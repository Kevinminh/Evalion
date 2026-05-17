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
  rating: number | null;
}

export type StatementColorName = "yellow" | "blue" | "orange" | "purple" | "red";

interface StatementGradient {
  background: string;
  text: string;
}

const STATEMENT_GRADIENTS: Record<StatementColorName, StatementGradient> = {
  yellow: { background: "linear-gradient(135deg, #FFFDE7, #FFF8C4)", text: "#8D6E00" },
  blue: { background: "linear-gradient(135deg, #E3F1FC, #D0E8FA)", text: "#2C5F8A" },
  orange: { background: "linear-gradient(135deg, #FFF3E0, #FFE8CC)", text: "#B35C00" },
  purple: { background: "linear-gradient(135deg, #F3EEFF, #E8E0F4)", text: "#6A1B9A" },
  red: { background: "linear-gradient(135deg, #FFEBEE, #FFCDD2)", text: "#B71C1C" },
};

/** Mockup-aligned statement gradient for the analytics statement card. */
export function getStatementGradient(color: StatementColorName | undefined): StatementGradient {
  return STATEMENT_GRADIENTS[color ?? "purple"];
}
