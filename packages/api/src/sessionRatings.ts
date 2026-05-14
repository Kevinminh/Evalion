import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import { SKIP, type Skip } from "./types";

export const sessionRatingsQueries = {
  bySessionStatement: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    convexQuery(
      api.liveSessions.getRatings,
      sessionId === SKIP ? SKIP : { sessionId, statementIndex },
    ),
};

export const sessionRatingsMutations = {
  submit: api.liveSessions.submitRating,
} as const;
