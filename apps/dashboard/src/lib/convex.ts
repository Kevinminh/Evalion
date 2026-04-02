import { convexQuery } from "@convex-dev/react-query";
import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

export const fagpratQueries = {
  list: () => convexQuery(api.fagprats.list, {}),
  getById: (id: Id<"fagprats">) => convexQuery(api.fagprats.getById, { id }),
  listByAuthor: () => convexQuery(api.fagprats.listByAuthor, {}),
};

export const liveSessionQueries = {
  getById: (id: Id<"liveSessions">) => convexQuery(api.liveSessions.getById, { id }),
  getByJoinCode: (joinCode: string) => convexQuery(api.liveSessions.getByJoinCode, { joinCode }),
  listStudents: (sessionId: Id<"liveSessions">) =>
    convexQuery(api.liveSessions.listStudents, { sessionId }),
  getVotes: (sessionId: Id<"liveSessions">, statementIndex: number) =>
    convexQuery(api.liveSessions.getVotes, { sessionId, statementIndex }),
};

export { api };
export type { Id };
