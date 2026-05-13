import { convexQuery } from "@convex-dev/react-query";
import type { ConvexHttpClient } from "convex/browser";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import type { Skip } from "./types";

export const sessionVotesQueries = {
  bySessionStatement: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    sessionId === "skip"
      ? convexQuery(api.liveSessions.getVotes, "skip")
      : convexQuery(api.liveSessions.getVotes, { sessionId, statementIndex }),
  analytics: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    sessionId === "skip"
      ? convexQuery(api.liveSessions.getVoteAnalytics, "skip")
      : convexQuery(api.liveSessions.getVoteAnalytics, { sessionId, statementIndex }),
};

export const sessionVotesMutations = {
  cast: api.liveSessions.castVote,
} as const;

export const sessionVotesFetch = {
  bySessionStatement: (
    client: ConvexHttpClient,
    sessionId: Id<"liveSessions">,
    statementIndex: number,
  ) => client.query(api.liveSessions.getVotes, { sessionId, statementIndex }),
  analytics: (
    client: ConvexHttpClient,
    sessionId: Id<"liveSessions">,
    statementIndex: number,
  ) => client.query(api.liveSessions.getVoteAnalytics, { sessionId, statementIndex }),
};
