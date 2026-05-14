import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";

export const pastandDraftsQueries = {
  get: () => convexQuery(api.pastandDrafts.get, {}),
};

export const pastandDraftsMutations = {
  setPastander: api.pastandDrafts.setPastander,
  appendStatements: api.pastandDrafts.appendStatements,
  setLastParams: api.pastandDrafts.setLastParams,
} as const;
