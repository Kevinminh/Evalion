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

// ── Interfaces ──────────────────────────────────────────────────────────────
export interface FagPratStatement {
  text: string;
  fasit: Fasit;
  explanation: string;
}

export interface FagPratDraft {
  title: string;
  concepts: string[];
  subject: string;
  level: string;
  type: FagPratType;
  statements: FagPratStatement[];
}
