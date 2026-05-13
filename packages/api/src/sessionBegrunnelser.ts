import { convexQuery } from "@convex-dev/react-query";
import type { ConvexHttpClient } from "convex/browser";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import type { Skip } from "./types";

export const sessionBegrunnelserQueries = {
  bySessionStatement: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    sessionId === "skip"
      ? convexQuery(api.liveSessions.getBegrunnelser, "skip")
      : convexQuery(api.liveSessions.getBegrunnelser, { sessionId, statementIndex }),
  mine: (
    sessionId: Id<"liveSessions"> | Skip,
    studentId: Id<"sessionStudents">,
    statementIndex: number,
  ) =>
    sessionId === "skip"
      ? convexQuery(api.liveSessions.getMyBegrunnelser, "skip")
      : convexQuery(api.liveSessions.getMyBegrunnelser, {
          sessionId,
          studentId,
          statementIndex,
        }),
};

export const sessionBegrunnelserMutations = {
  submit: api.liveSessions.submitBegrunnelse,
  highlight: api.liveSessions.highlightBegrunnelse,
} as const;

export const sessionBegrunnelserFetch = {
  bySessionStatement: (
    client: ConvexHttpClient,
    sessionId: Id<"liveSessions">,
    statementIndex: number,
  ) => client.query(api.liveSessions.getBegrunnelser, { sessionId, statementIndex }),
};
