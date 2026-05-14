import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import { SKIP, type Skip } from "./types";

export const sessionBegrunnelserQueries = {
  bySessionStatement: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    convexQuery(
      api.liveSessions.getBegrunnelser,
      sessionId === SKIP ? SKIP : { sessionId, statementIndex },
    ),
  mine: (
    sessionId: Id<"liveSessions"> | Skip,
    studentId: Id<"sessionStudents">,
    statementIndex: number,
  ) =>
    convexQuery(
      api.liveSessions.getMyBegrunnelser,
      sessionId === SKIP ? SKIP : { sessionId, studentId, statementIndex },
    ),
};

export const sessionBegrunnelserMutations = {
  submit: api.liveSessions.submitBegrunnelse,
  highlight: api.liveSessions.highlightBegrunnelse,
} as const;
