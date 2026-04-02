import type { Doc, Id } from "@workspace/backend/convex/_generated/dataModel";

export type FagPrat = Doc<"fagprats">;
export type FagPratId = Id<"fagprats">;
export type LiveSession = Doc<"liveSessions">;
export type SessionStudent = Doc<"sessionStudents">;

export interface FagPratStatement {
  text: string;
  fasit: "sant" | "usant" | "delvis";
  explanation: string;
}
