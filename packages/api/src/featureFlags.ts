import { convexQuery } from "@convex-dev/react-query";
import type { ConvexHttpClient } from "convex/browser";

import { api } from "@workspace/backend/convex/_generated/api";

import type { Skip } from "./types";

export const featureFlagsQueries = {
  list: () => convexQuery(api.featureFlags.list, {}),
  isEnabled: (key: string | Skip) =>
    key === "skip"
      ? convexQuery(api.featureFlags.isEnabled, "skip")
      : convexQuery(api.featureFlags.isEnabled, { key }),
};

export const featureFlagsMutations = {
  setEnabled: api.featureFlags.setEnabled,
} as const;

export const featureFlagsFetch = {
  list: (client: ConvexHttpClient) => client.query(api.featureFlags.list, {}),
  isEnabled: (client: ConvexHttpClient, key: string) =>
    client.query(api.featureFlags.isEnabled, { key }),
};
