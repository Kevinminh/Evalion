import type { Doc, Id } from "@workspace/backend/convex/_generated/dataModel";

export type { Doc, Id };

// ── Document types ──────────────────────────────────────────────────────────
export type FagPrat = Doc<"fagprats">;
export type FagPratId = Id<"fagprats">;

// Lightweight projection used for list views (e.g. min-samling cards).
// Mirrors what fagprats.listByAuthor returns.
export interface FagPratSummary {
  _id: FagPratId;
  _creationTime: number;
  title: string;
  subject: string;
  level: string;
  type: FagPratType;
  visibility: Visibility;
  usageCount: number;
  authorName: string;
  updatedAt: number | undefined;
  statementsCount: number;
}
export type LiveSession = Doc<"liveSessions">;
export type SessionStudent = Doc<"sessionStudents">;

// ── Domain unions ───────────────────────────────────────────────────────────
export type Fasit = "sant" | "usant" | "delvis";
export type FagPratType = "intro" | "oppsummering";
export type Visibility = "public" | "private";
export type StatementColorName = "yellow" | "blue" | "orange" | "purple" | "red";

/**
 * Sentinel passed instead of args to opt the underlying Convex subscription
 * out entirely — `enabled: false` on the wrapping useQuery does NOT close
 * the WebSocket subscription, only short-circuits the queryFn execution.
 */
export const SKIP = "skip" as const;
export type Skip = typeof SKIP;

// ── Interfaces ──────────────────────────────────────────────────────────────
export interface FagPratStatement {
  text: string;
  fasit: Fasit;
  explanation: string;
  color?: StatementColorName;
  begrunnelse?: string;
}
