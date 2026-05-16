import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;
    return {
      email: user.email,
      name: user.name,
      role: user.role ?? "user",
    };
  },
});
