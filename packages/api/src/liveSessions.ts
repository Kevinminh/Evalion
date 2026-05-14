import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import { SKIP, type Skip } from "./types";

export const liveSessionsQueries = {
  listByTeacher: () => convexQuery(api.liveSessions.listByTeacher, {}),
  listCurrentByTeacher: () => convexQuery(api.liveSessions.listCurrentByTeacher, {}),
  byId: (id: Id<"liveSessions"> | Skip) =>
    convexQuery(api.liveSessions.getById, id === SKIP ? SKIP : { id }),
  sessionWithFagprat: (id: Id<"liveSessions"> | Skip) =>
    convexQuery(api.liveSessions.getSessionWithFagprat, id === SKIP ? SKIP : { id }),
  byJoinCode: (joinCode: string) =>
    convexQuery(api.liveSessions.getByJoinCode, { joinCode }),
};

export const liveSessionsMutations = {
  create: api.liveSessions.create,
  updateStep: api.liveSessions.updateStep,
  end: api.liveSessions.end,
  remove: api.liveSessions.remove,
  startTimer: api.liveSessions.startTimer,
  pauseTimer: api.liveSessions.pauseTimer,
  stopTimer: api.liveSessions.stopTimer,
} as const;
