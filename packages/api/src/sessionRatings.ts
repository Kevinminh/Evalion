import { convexQuery } from "@convex-dev/react-query";
import type { ConvexHttpClient } from "convex/browser";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import type { Skip } from "./types";

export const sessionRatingsQueries = {
  bySessionStatement: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    sessionId === "skip"
      ? convexQuery(api.liveSessions.getRatings, "skip")
      : convexQuery(api.liveSessions.getRatings, { sessionId, statementIndex }),
};

export const sessionRatingsMutations = {
  submit: api.liveSessions.submitRating,
} as const;

export const sessionRatingsFetch = {
  bySessionStatement: (
    client: ConvexHttpClient,
    sessionId: Id<"liveSessions">,
    statementIndex: number,
  ) => client.query(api.liveSessions.getRatings, { sessionId, statementIndex }),
};
