import { convexQuery } from "@convex-dev/react-query";
import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

// Pass "skip" instead of an Id to opt the underlying Convex subscription out
// entirely — `enabled: false` on the wrapping useQuery does NOT prevent the
// WebSocket subscription, only the queryFn execution.
type Skip = "skip";

export const fagpratQueries = {
  getById: (id: Id<"fagprats"> | Skip) =>
    id === "skip"
      ? convexQuery(api.fagprats.getById, "skip")
      : convexQuery(api.fagprats.getById, { id }),
};

export const liveSessionQueries = {
  getById: (id: Id<"liveSessions"> | Skip) =>
    id === "skip"
      ? convexQuery(api.liveSessions.getById, "skip")
      : convexQuery(api.liveSessions.getById, { id }),
  getByJoinCode: (joinCode: string) => convexQuery(api.liveSessions.getByJoinCode, { joinCode }),
  listStudents: (sessionId: Id<"liveSessions"> | Skip) =>
    sessionId === "skip"
      ? convexQuery(api.liveSessions.listStudents, "skip")
      : convexQuery(api.liveSessions.listStudents, { sessionId }),
  getStudent: (id: Id<"sessionStudents">) => convexQuery(api.liveSessions.getStudent, { id }),
  getVotes: (sessionId: Id<"liveSessions"> | Skip, statementIndex: number) =>
    sessionId === "skip"
      ? convexQuery(api.liveSessions.getVotes, "skip")
      : convexQuery(api.liveSessions.getVotes, { sessionId, statementIndex }),
  getRatings: (sessionId: Id<"liveSessions">, statementIndex: number) =>
    convexQuery(api.liveSessions.getRatings, { sessionId, statementIndex }),
  getVoteAnalytics: (sessionId: Id<"liveSessions">, statementIndex: number) =>
    convexQuery(api.liveSessions.getVoteAnalytics, { sessionId, statementIndex }),
  getBegrunnelser: (sessionId: Id<"liveSessions">, statementIndex: number) =>
    convexQuery(api.liveSessions.getBegrunnelser, { sessionId, statementIndex }),
  getMyBegrunnelser: (
    sessionId: Id<"liveSessions">,
    studentId: Id<"sessionStudents">,
    statementIndex: number,
  ) =>
    convexQuery(api.liveSessions.getMyBegrunnelser, {
      sessionId,
      studentId,
      statementIndex,
    }),
};

export { api };
export type { Id };
