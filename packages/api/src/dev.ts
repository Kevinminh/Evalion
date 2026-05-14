import { api } from "@workspace/backend/convex/_generated/api";

export const devMutations = {
  addDummyStudents: api.dev.addDummyStudents,
  castDummyVotes: api.dev.castDummyVotes,
} as const;
