import type { Doc, Id } from "@workspace/backend/convex/_generated/dataModel";

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

// ── Interfaces ──────────────────────────────────────────────────────────────
export interface FagPratStatement {
  text: string;
  fasit: Fasit;
  explanation: string;
  color?: StatementColorName;
  begrunnelse?: string;
}
