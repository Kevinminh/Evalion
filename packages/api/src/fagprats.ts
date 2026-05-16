import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import { SKIP, type Skip } from "./types";

export const fagpratsQueries = {
  list: () => convexQuery(api.fagprats.list, {}),
  listByAuthor: () => convexQuery(api.fagprats.listByAuthor, {}),
  byId: (id: Id<"fagprats"> | Skip) =>
    convexQuery(api.fagprats.getById, id === SKIP ? SKIP : { id }),
};

export const fagpratsMutations = {
  create: api.fagprats.create,
  update: api.fagprats.update,
  remove: api.fagprats.remove,
  duplicate: api.fagprats.duplicate,
  setVisibility: api.fagprats.setVisibility,
  generateUploadUrl: api.fagprats.generateUploadUrl,
} as const;
