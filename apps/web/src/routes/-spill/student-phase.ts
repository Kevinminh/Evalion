import type { Doc } from "@workspace/backend/convex/_generated/dataModel";

export type StudentPhase =
  | { kind: "lobby" }
  | { kind: "waiting" }
  | { kind: "vote"; round: 1 }
  | { kind: "discussion" }
  | { kind: "revote"; round: 2 }
  | { kind: "reveal" }
  | { kind: "explanation" }
  | { kind: "rating" }
  | { kind: "ended" };

export function phaseFromSession(session: Doc<"liveSessions">): StudentPhase {
  if (session.status === "lobby") return { kind: "lobby" };
  if (session.status === "ended") return { kind: "ended" };

  switch (session.currentStep) {
    case 0:
      return { kind: "waiting" };
    case 1:
      return { kind: "vote", round: 1 };
    case 2:
      return { kind: "discussion" };
    case 3:
      return { kind: "revote", round: 2 };
    case 4:
      return { kind: "reveal" };
    case 5:
      return { kind: "explanation" };
    case 6:
      return { kind: "rating" };
    default:
      return { kind: "waiting" };
  }
}

// Map a phase back to the numeric step the topbar/step nav expects to display.
export function phaseStepNumber(phase: StudentPhase): number {
  switch (phase.kind) {
    case "lobby":
    case "ended":
    case "waiting":
      return 0;
    case "vote":
      return 1;
    case "discussion":
      return 2;
    case "revote":
      return 3;
    case "reveal":
      return 4;
    case "explanation":
      return 5;
    case "rating":
      return 6;
  }
}

export function phaseRound(phase: StudentPhase): 1 | 2 | 0 {
  if (phase.kind === "vote") return 1;
  if (phase.kind === "revote") return 2;
  return 0;
}
