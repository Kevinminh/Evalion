import { convexQuery } from "@convex-dev/react-query";
import type { ConvexHttpClient } from "convex/browser";

import { api } from "@workspace/backend/convex/_generated/api";

export const aiPromptsQueries = {
  reddiSystemPrompt: () => convexQuery(api.aiPrompts.getReddiSystemPrompt, {}),
};

export const aiPromptsMutations = {
  updateReddiSystemPrompt: api.aiPrompts.updateReddiSystemPrompt,
} as const;

export const aiPromptsFetch = {
  reddiSystemPrompt: (client: ConvexHttpClient) =>
    client.query(api.aiPrompts.getReddiSystemPrompt, {}),
};
