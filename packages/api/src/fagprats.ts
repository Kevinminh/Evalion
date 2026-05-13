import { convexQuery } from "@convex-dev/react-query";
import type { ConvexHttpClient } from "convex/browser";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import type { Skip } from "./types";

type SearchArgs = {
  searchText?: string;
  subject?: string;
  level?: string;
  type?: "intro" | "oppsummering";
  sortBy?: "relevant" | "recent";
};

export const fagpratsQueries = {
  list: () => convexQuery(api.fagprats.list, {}),
  listByAuthor: () => convexQuery(api.fagprats.listByAuthor, {}),
  byId: (id: Id<"fagprats"> | Skip) =>
    id === "skip"
      ? convexQuery(api.fagprats.getById, "skip")
      : convexQuery(api.fagprats.getById, { id }),
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

export const fagpratsFetch = {
  list: (client: ConvexHttpClient) => client.query(api.fagprats.list, {}),
  listByAuthor: (client: ConvexHttpClient) => client.query(api.fagprats.listByAuthor, {}),
  byId: (client: ConvexHttpClient, id: Id<"fagprats">) =>
    client.query(api.fagprats.getById, { id }),
  search: (client: ConvexHttpClient, args: SearchArgs) =>
    client.query(api.fagprats.search, args),
};
