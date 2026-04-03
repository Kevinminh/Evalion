import type { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Returns the current user's identity or throws "Not authenticated".
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}
