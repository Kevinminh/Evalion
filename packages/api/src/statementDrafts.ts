import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";

export const statementDraftsQueries = {
  get: () => convexQuery(api.statementDrafts.get, {}),
};

export const statementDraftsMutations = {
  setStatements: api.statementDrafts.setStatements,
  appendStatements: api.statementDrafts.appendStatements,
  setLastParams: api.statementDrafts.setLastParams,
} as const;
