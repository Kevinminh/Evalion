import { convexQuery } from "@convex-dev/react-query";
import type { ConvexHttpClient } from "convex/browser";

import { api } from "@workspace/backend/convex/_generated/api";

export const usersQueries = {
  me: () => convexQuery(api.users.getMe, {}),
};

export const usersFetch = {
  me: (client: ConvexHttpClient) => client.query(api.users.getMe, {}),
};
