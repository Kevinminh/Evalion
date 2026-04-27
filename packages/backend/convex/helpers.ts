import type { ActionCtx, QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { authComponent } from "./auth";

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

/**
 * Throws "Not authorized" unless the current user has role "admin".
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const user = await authComponent.getAuthUser(ctx);
  if (!user || user.role !== "admin") {
    throw new Error("Not authorized");
  }
  return user;
}

/**
 * Verifies the authenticated user is the teacher who owns the session.
 * Returns the session document.
 */
export async function requireSessionOwner(ctx: MutationCtx, sessionId: Id<"liveSessions">) {
  const identity = await requireAuth(ctx);
  const session = await ctx.db.get(sessionId);
  if (!session || session.teacherId !== identity.subject) {
    throw new Error("Not authorized");
  }
  return session;
}

/**
 * Validates that a statementIndex is within bounds for a given fagprat.
 */
export async function validateStatementIndex(
  ctx: QueryCtx | MutationCtx,
  sessionId: Id<"liveSessions">,
  statementIndex: number,
) {
  if (!Number.isInteger(statementIndex) || statementIndex < 0) {
    throw new Error("Invalid statement index");
  }
  const session = await ctx.db.get(sessionId);
  if (!session) throw new Error("Session not found");
  const fagprat = await ctx.db.get(session.fagpratId);
  if (!fagprat) throw new Error("FagPrat not found");
  if (statementIndex >= fagprat.statements.length) {
    throw new Error("Statement index out of bounds");
  }
  return { session, fagprat };
}
