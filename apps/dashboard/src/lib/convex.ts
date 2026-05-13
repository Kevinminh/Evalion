import { fagpratsQueries } from "@workspace/api/fagprats";
import { liveSessionsQueries } from "@workspace/api/liveSessions";
import { sessionStudentsQueries } from "@workspace/api/sessionStudents";
import { sessionVotesQueries } from "@workspace/api/sessionVotes";

export { api } from "@workspace/backend/convex/_generated/api";
export type { Id } from "@workspace/api/types";

// Backwards-compat aliases for legacy call sites. New code should import the
// wrapper modules from @workspace/api/<module> directly.
export const fagpratQueries = {
  list: fagpratsQueries.list,
  getById: fagpratsQueries.byId,
  listByAuthor: fagpratsQueries.listByAuthor,
  search: fagpratsQueries.search,
};

export const liveSessionQueries = {
  listByTeacher: liveSessionsQueries.listByTeacher,
  listCurrentByTeacher: liveSessionsQueries.listCurrentByTeacher,
  getSessionWithFagprat: liveSessionsQueries.sessionWithFagprat,
  listStudents: sessionStudentsQueries.listBySession,
  getVoteAnalytics: sessionVotesQueries.analytics,
};
