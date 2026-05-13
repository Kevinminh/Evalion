import { convexQuery } from "@convex-dev/react-query";
import type { ConvexHttpClient } from "convex/browser";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import type { Skip } from "./types";

export const sessionStudentsQueries = {
  listBySession: (sessionId: Id<"liveSessions"> | Skip) =>
    sessionId === "skip"
      ? convexQuery(api.liveSessions.listStudents, "skip")
      : convexQuery(api.liveSessions.listStudents, { sessionId }),
  byId: (id: Id<"sessionStudents"> | Skip) =>
    id === "skip"
      ? convexQuery(api.liveSessions.getStudent, "skip")
      : convexQuery(api.liveSessions.getStudent, { id }),
};

export const sessionStudentsMutations = {
  add: api.liveSessions.addStudent,
  remove: api.liveSessions.removeStudent,
  createGroups: api.liveSessions.createGroups,
  clearGroups: api.liveSessions.clearGroups,
} as const;

export const sessionStudentsFetch = {
  listBySession: (client: ConvexHttpClient, sessionId: Id<"liveSessions">) =>
    client.query(api.liveSessions.listStudents, { sessionId }),
  byId: (client: ConvexHttpClient, id: Id<"sessionStudents">) =>
    client.query(api.liveSessions.getStudent, { id }),
};
