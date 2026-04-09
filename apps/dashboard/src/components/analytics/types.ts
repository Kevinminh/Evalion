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

export interface StudentData {
  studentId: string;
  name: string;
  avatarColor: string;
  round1: { vote: string; confidence: number | null; correct: boolean } | null;
  round2: { vote: string; confidence: number | null; correct: boolean } | null;
  begrunnelseR1: string | null;
  rating: number | null;
}
