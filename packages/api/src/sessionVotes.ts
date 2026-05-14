import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import { SKIP, type Skip } from "./types";

export const sessionVotesQueries = {
  bySessionStatement: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    convexQuery(
      api.liveSessions.getVotes,
      sessionId === SKIP ? SKIP : { sessionId, statementIndex },
    ),
  analytics: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    convexQuery(
      api.liveSessions.getVoteAnalytics,
      sessionId === SKIP ? SKIP : { sessionId, statementIndex },
    ),
};

export const sessionVotesMutations = {
  cast: api.liveSessions.castVote,
} as const;
