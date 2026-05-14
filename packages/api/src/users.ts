import { convexQuery } from "@convex-dev/react-query";

import { api } from "@workspace/backend/convex/_generated/api";

export const usersQueries = {
  me: () => convexQuery(api.users.getMe, {}),
};
