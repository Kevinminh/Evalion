import type { Doc, Id } from "@workspace/backend/convex/_generated/dataModel";

export type { Doc, Id };

// ── Document types ──────────────────────────────────────────────────────────
export type FagPrat = Doc<"fagprats">;
export type FagPratId = Id<"fagprats">;
export type LiveSession = Doc<"liveSessions">;
export type SessionStudent = Doc<"sessionStudents">;

// ── Domain unions ───────────────────────────────────────────────────────────
export type Fasit = "sant" | "usant" | "delvis";
export type FagPratType = "intro" | "oppsummering";
export type Visibility = "public" | "private";
export type StatementColorName = "yellow" | "blue" | "orange" | "purple" | "red";

// Pass "skip" instead of an Id to opt the underlying Convex subscription out
// entirely — `enabled: false` on the wrapping useQuery does NOT prevent the
// WebSocket subscription, only the queryFn execution.
export type Skip = "skip";

// ── Interfaces ──────────────────────────────────────────────────────────────
export interface FagPratStatement {
  text: string;
  fasit: Fasit;
  explanation: string;
  color?: StatementColorName;
  begrunnelse?: string;
}

export interface FagPratDraft {
  title: string;
  concepts: string[];
  subject: string;
  level: string;
  type: FagPratType;
  statements: FagPratStatement[];
}
