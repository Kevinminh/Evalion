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

const statementValidator = v.object({
  text: v.string(),
  fasit: v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis")),
  explanation: v.string(),
  color: v.optional(
    v.union(
      v.literal("yellow"),
      v.literal("blue"),
      v.literal("orange"),
      v.literal("purple"),
      v.literal("red"),
    ),
  ),
  begrunnelse: v.optional(v.string()),
  image: v.optional(v.id("_storage")),
  explanationImage: v.optional(v.id("_storage")),
});

export const create = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    level: v.string(),
    type: v.union(v.literal("intro"), v.literal("oppsummering")),
    concepts: v.array(v.string()),
    statements: v.array(statementValidator),
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
      updatedAt: Date.now(),
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
    statements: v.optional(v.array(statementValidator)),
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
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
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

export const duplicate = mutation({
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
    const {
      _id: _removedId,
      _creationTime: _removedTime,
      authorId: _removedAuthor,
      authorName: _removedName,
      usageCount: _removedCount,
      updatedAt: _removedUpdated,
      ...data
    } = existing;
    return await ctx.db.insert("fagprats", {
      ...data,
      visibility: "private",
      usageCount: 0,
      authorId: identity.subject,
      authorName: identity.name ?? "Ukjent",
      updatedAt: Date.now(),
    });
  },
});

export const search = query({
  args: {
    searchText: v.optional(v.string()),
    subject: v.optional(v.string()),
    level: v.optional(v.string()),
    type: v.optional(v.union(v.literal("intro"), v.literal("oppsummering"))),
    sortBy: v.optional(v.union(v.literal("relevant"), v.literal("recent"))),
  },
  handler: async (ctx, args) => {
    if (args.searchText && args.searchText.trim().length > 0) {
      let searchQuery = ctx.db
        .query("fagprats")
        .withSearchIndex("search_fagprats", (q) => {
          let s = q.search("title", args.searchText!);
          s = s.eq("visibility", "public");
          if (args.subject) s = s.eq("subject", args.subject);
          if (args.level) s = s.eq("level", args.level);
          if (args.type) s = s.eq("type", args.type);
          return s;
        });
      return await searchQuery.collect();
    }
    // No search text — browse with filters
    const results = await ctx.db
      .query("fagprats")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();
    let filtered = results;
    if (args.subject) filtered = filtered.filter((f) => f.subject === args.subject);
    if (args.level) filtered = filtered.filter((f) => f.level === args.level);
    if (args.type) filtered = filtered.filter((f) => f.type === args.type);
    if (args.sortBy === "recent") {
      filtered.sort((a, b) => b._creationTime - a._creationTime);
    } else {
      filtered.sort((a, b) => b.usageCount - a.usageCount);
    }
    return filtered;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    await ctx.storage.delete(args.storageId);
  },
});
