import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";

import { SKIP, type Skip } from "./types";

export const featureFlagsQueries = {
  list: () => convexQuery(api.featureFlags.list, {}),
  isEnabled: (key: string | Skip) =>
    convexQuery(api.featureFlags.isEnabled, key === SKIP ? SKIP : { key }),
};

export const featureFlagsMutations = {
  setEnabled: api.featureFlags.setEnabled,
} as const;
