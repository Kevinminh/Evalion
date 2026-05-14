import { api } from "@workspace/backend/convex/_generated/api";

export const emailSubscribersMutations = {
  subscribeToLaunch: api.emailSubscribers.subscribeToLaunch,
} as const;
