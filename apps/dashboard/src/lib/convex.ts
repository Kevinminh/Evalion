import { convexQuery } from "@convex-dev/react-query";
import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import type { FagPratType } from "@/lib/types";

export const fagpratQueries = {
  list: () => convexQuery(api.fagprats.list, {}),
  getById: (id: Id<"fagprats">) => convexQuery(api.fagprats.getById, { id }),
  listByAuthor: () => convexQuery(api.fagprats.listByAuthor, {}),
  search: (args: {
    searchText?: string;
    subject?: string;
    level?: string;
    type?: FagPratType;
    sortBy?: "relevant" | "recent";
  }) => convexQuery(api.fagprats.search, args),
};

export const liveSessionQueries = {
  listByTeacher: () => convexQuery(api.liveSessions.listByTeacher, {}),
};

export { api };
export type { Id };
