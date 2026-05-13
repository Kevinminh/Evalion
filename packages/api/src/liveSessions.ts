import { convexQuery } from "@convex-dev/react-query";
import type { ConvexHttpClient } from "convex/browser";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import type { Skip } from "./types";

export const liveSessionsQueries = {
  listByTeacher: () => convexQuery(api.liveSessions.listByTeacher, {}),
  listCurrentByTeacher: () => convexQuery(api.liveSessions.listCurrentByTeacher, {}),
  byId: (id: Id<"liveSessions"> | Skip) =>
    id === "skip"
      ? convexQuery(api.liveSessions.getById, "skip")
      : convexQuery(api.liveSessions.getById, { id }),
  sessionWithFagprat: (id: Id<"liveSessions"> | Skip) =>
    id === "skip"
      ? convexQuery(api.liveSessions.getSessionWithFagprat, "skip")
      : convexQuery(api.liveSessions.getSessionWithFagprat, { id }),
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

export const liveSessionsFetch = {
  byId: (client: ConvexHttpClient, id: Id<"liveSessions">) =>
    client.query(api.liveSessions.getById, { id }),
  byJoinCode: (client: ConvexHttpClient, joinCode: string) =>
    client.query(api.liveSessions.getByJoinCode, { joinCode }),
  sessionWithFagprat: (client: ConvexHttpClient, id: Id<"liveSessions">) =>
    client.query(api.liveSessions.getSessionWithFagprat, { id }),
};
