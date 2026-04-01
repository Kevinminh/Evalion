import { v } from "convex/values";

import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("fagprats")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("fagprats") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listByAuthor = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    return await ctx.db
      .query("fagprats")
      .withIndex("by_author", (q) => q.eq("authorId", identity.subject))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    level: v.string(),
    type: v.union(v.literal("intro"), v.literal("oppsummering")),
    concepts: v.array(v.string()),
    statements: v.array(
      v.object({
        text: v.string(),
        fasit: v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis")),
        explanation: v.string(),
      }),
    ),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("fagprats", {
      ...args,
      usageCount: 0,
      authorId: identity.subject,
      authorName: identity.name ?? "Ukjent",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("fagprats"),
    title: v.optional(v.string()),
    subject: v.optional(v.string()),
    level: v.optional(v.string()),
    type: v.optional(v.union(v.literal("intro"), v.literal("oppsummering"))),
    concepts: v.optional(v.array(v.string())),
    statements: v.optional(
      v.array(
        v.object({
          text: v.string(),
          fasit: v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis")),
          explanation: v.string(),
        }),
      ),
    ),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("FagPrat not found");
    }
    if (existing.authorId !== identity.subject) {
      throw new Error("Not authorized");
    }
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("fagprats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("FagPrat not found");
    }
    if (existing.authorId !== identity.subject) {
      throw new Error("Not authorized");
    }
    await ctx.db.delete(args.id);
  },
});
