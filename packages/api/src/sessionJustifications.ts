import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import { SKIP, type Skip } from "./types";

export const sessionJustificationsQueries = {
  bySessionStatement: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    convexQuery(
      api.liveSessions.getJustifications,
      sessionId === SKIP ? SKIP : { sessionId, statementIndex },
    ),
  mine: (
    sessionId: Id<"liveSessions"> | Skip,
    studentId: Id<"sessionStudents">,
    statementIndex: number,
  ) =>
    convexQuery(
      api.liveSessions.getMyJustifications,
      sessionId === SKIP ? SKIP : { sessionId, studentId, statementIndex },
    ),
};

export const sessionJustificationsMutations = {
  submit: api.liveSessions.submitJustification,
  highlight: api.liveSessions.highlightJustification,
  reorder: api.liveSessions.reorderHighlights,
} as const;
