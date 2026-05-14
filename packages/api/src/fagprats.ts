import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import { SKIP, type FagPratType, type Skip } from "./types";

type SearchArgs = {
  searchText?: string;
  subject?: string;
  level?: string;
  type?: FagPratType;
  sortBy?: "relevant" | "recent";
};

export const fagpratsQueries = {
  list: () => convexQuery(api.fagprats.list, {}),
  listByAuthor: () => convexQuery(api.fagprats.listByAuthor, {}),
  byId: (id: Id<"fagprats"> | Skip) =>
    convexQuery(api.fagprats.getById, id === SKIP ? SKIP : { id }),
  search: (args: SearchArgs) => convexQuery(api.fagprats.search, args),
};

export const fagpratsMutations = {
  create: api.fagprats.create,
  update: api.fagprats.update,
  remove: api.fagprats.remove,
  duplicate: api.fagprats.duplicate,
  generateUploadUrl: api.fagprats.generateUploadUrl,
  deleteFile: api.fagprats.deleteFile,
} as const;
