import { createClient } from "@convex-dev/better-auth";
import type { GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { anyApi, type FunctionReference } from "convex/server";

import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query, type MutationCtx } from "./_generated/server";
import authConfig from "./auth.config";
import schema from "./betterAuth/schema";

async function deleteUserOwnedData(ctx: MutationCtx, userId: string) {
  const sessions = await ctx.db
    .query("liveSessions")
    .withIndex("by_teacher", (q) => q.eq("teacherId", userId))
    .collect();

  for (const session of sessions) {
    const sessionId = session._id;

    const students = await ctx.db
      .query("sessionStudents")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .collect();
    for (const student of students) {
      await ctx.db.delete(student._id);
    }

    const votes = await ctx.db
      .query("sessionVotes")
      .withIndex("by_session_statement", (q) => q.eq("sessionId", sessionId))
      .collect();
    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    const ratings = await ctx.db
      .query("sessionRatings")
      .withIndex("by_session_statement", (q) => q.eq("sessionId", sessionId))
      .collect();
    for (const rating of ratings) {
      await ctx.db.delete(rating._id);
    }

    const begrunnelser = await ctx.db
      .query("sessionBegrunnelser")
      .withIndex("by_session_statement", (q) => q.eq("sessionId", sessionId))
      .collect();
    for (const b of begrunnelser) {
      await ctx.db.delete(b._id);
    }

    await ctx.db.delete(sessionId);
  }

  const fagprats = await ctx.db
    .query("fagprats")
    .withIndex("by_author", (q) => q.eq("authorId", userId))
    .collect();
  for (const fagprat of fagprats) {
    await ctx.db.delete(fagprat._id);
  }

  const drafts = await ctx.db
    .query("pastandDrafts")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  for (const draft of drafts) {
    await ctx.db.delete(draft._id);
  }
}

export const authComponent = createClient<DataModel, typeof schema>(components.betterAuth, {
  local: { schema },
  verbose: false,
  triggers: {
    user: {
      onDelete: async (ctx, doc) => {
        await deleteUserOwnedData(ctx as MutationCtx, doc._id);
      },
    },
  },
  authFunctions: {
    onDelete: anyApi.auth.onDelete as FunctionReference<
      "mutation",
      "internal",
      { model: string; doc: Record<string, unknown> }
    >,
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

export const { getAuthUser } = authComponent.clientApi();

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const trustedOrigins = process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(",") : [];

  return {
    appName: "Evalion",
    baseURL: process.env.SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false,
        },
      },
      deleteUser: {
        enabled: true,
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    trustedOrigins,
    advanced: process.env.COOKIE_DOMAIN
      ? { crossSubDomainCookies: { enabled: true, domain: process.env.COOKIE_DOMAIN } }
      : undefined,
    plugins: [convex({ authConfig })],
  } satisfies BetterAuthOptions;
};

export const options = createAuthOptions({} as GenericCtx<DataModel>);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity;
  },
});
