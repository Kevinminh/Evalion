import { fagpratsQueries } from "@workspace/api/fagprats";
import { liveSessionsQueries } from "@workspace/api/liveSessions";
import { sessionBegrunnelserQueries } from "@workspace/api/sessionBegrunnelser";
import { sessionRatingsQueries } from "@workspace/api/sessionRatings";
import { sessionStudentsQueries } from "@workspace/api/sessionStudents";
import { sessionVotesQueries } from "@workspace/api/sessionVotes";

export { api } from "@workspace/backend/convex/_generated/api";
export type { Id } from "@workspace/api/types";

// Backwards-compat aliases for legacy call sites. New code should import the
// wrapper modules from @workspace/api/<module> directly.
export const fagpratQueries = {
  getById: fagpratsQueries.byId,
};

export const liveSessionQueries = {
  getById: liveSessionsQueries.byId,
  getByJoinCode: liveSessionsQueries.byJoinCode,
  listStudents: sessionStudentsQueries.listBySession,
  getStudent: sessionStudentsQueries.byId,
  getVotes: sessionVotesQueries.bySessionStatement,
  getRatings: sessionRatingsQueries.bySessionStatement,
  getVoteAnalytics: sessionVotesQueries.analytics,
  getBegrunnelser: sessionBegrunnelserQueries.bySessionStatement,
  getMyBegrunnelser: sessionBegrunnelserQueries.mine,
};
