import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import { SKIP, type Skip } from "./types";

export const sessionStudentsQueries = {
  listBySession: (sessionId: Id<"liveSessions"> | Skip) =>
    convexQuery(api.liveSessions.listStudents, sessionId === SKIP ? SKIP : { sessionId }),
  byId: (id: Id<"sessionStudents">) => convexQuery(api.liveSessions.getStudent, { id }),
};

export const sessionStudentsMutations = {
  add: api.liveSessions.addStudent,
  remove: api.liveSessions.removeStudent,
  createGroups: api.liveSessions.createGroups,
  clearGroups: api.liveSessions.clearGroups,
} as const;
