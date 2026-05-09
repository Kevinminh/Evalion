import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { query, mutation } from "./_generated/server";
import { requireAuth } from "./helpers";
import { statementValidator } from "./schema";

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
    statements: v.array(statementValidator),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    // Validate string lengths
    if (args.title.length > 200) throw new Error("Title too long (max 200 characters)");
    if (args.subject.length > 100) throw new Error("Subject too long (max 100 characters)");
    if (args.level.length > 100) throw new Error("Level too long (max 100 characters)");
    if (args.concepts.length > 20) throw new Error("Too many concepts (max 20)");
    if (args.concepts.some((c) => c.length > 100))
      throw new Error("Concept too long (max 100 characters)");
    if (args.statements.length > 20) throw new Error("Too many statements (max 20)");

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
    const identity = await requireAuth(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("FagPrat not found");
    }
    if (existing.authorId !== identity.subject) {
      throw new Error("Not authorized");
    }
    // Validate string lengths on provided fields
    if (args.title !== undefined && args.title.length > 200)
      throw new Error("Title too long (max 200 characters)");
    if (args.subject !== undefined && args.subject.length > 100)
      throw new Error("Subject too long (max 100 characters)");
    if (args.level !== undefined && args.level.length > 100)
      throw new Error("Level too long (max 100 characters)");
    if (args.concepts !== undefined && args.concepts.length > 20)
      throw new Error("Too many concepts (max 20)");
    if (args.concepts?.some((c) => c.length > 100))
      throw new Error("Concept too long (max 100 characters)");
    if (args.statements !== undefined && args.statements.length > 20)
      throw new Error("Too many statements (max 20)");

    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("fagprats") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("FagPrat not found");
    }
    if (existing.authorId !== identity.subject) {
      throw new Error("Not authorized");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const duplicate = mutation({
  args: { id: v.id("fagprats") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
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
    paginationOpts: paginationOptsValidator,
    searchText: v.optional(v.string()),
    subject: v.optional(v.string()),
    level: v.optional(v.string()),
    type: v.optional(v.union(v.literal("intro"), v.literal("oppsummering"))),
    sortBy: v.optional(v.union(v.literal("relevant"), v.literal("recent"))),
  },
  handler: async (ctx, args) => {
    // Search-text branch: BM25 relevance via the search index. sortBy is ignored.
    if (args.searchText && args.searchText.trim().length > 0) {
      return await ctx.db
        .query("fagprats")
        .withSearchIndex("search_fagprats", (q) => {
          let s = q.search("title", args.searchText!).eq("visibility", "public");
          if (args.subject) s = s.eq("subject", args.subject);
          if (args.level) s = s.eq("level", args.level);
          if (args.type) s = s.eq("type", args.type);
          return s;
        })
        .paginate(args.paginationOpts);
    }

    // Browse branch: pick the most specific compound index for the active
    // filters. The _usageCount variant orders by popularity desc; the plain
    // index orders by _creationTime desc. Both via .order("desc").
    const popular = args.sortBy !== "recent";
    const queryBuilder =
      args.subject && args.level
        ? popular
          ? ctx.db
              .query("fagprats")
              .withIndex("by_visibility_subject_level_usageCount", (q) =>
                q.eq("visibility", "public").eq("subject", args.subject!).eq("level", args.level!),
              )
          : ctx.db
              .query("fagprats")
              .withIndex("by_visibility_subject_level", (q) =>
                q.eq("visibility", "public").eq("subject", args.subject!).eq("level", args.level!),
              )
        : args.subject
          ? popular
            ? ctx.db
                .query("fagprats")
                .withIndex("by_visibility_subject_usageCount", (q) =>
                  q.eq("visibility", "public").eq("subject", args.subject!),
                )
            : ctx.db
                .query("fagprats")
                .withIndex("by_visibility_subject", (q) =>
                  q.eq("visibility", "public").eq("subject", args.subject!),
                )
          : args.level
            ? popular
              ? ctx.db
                  .query("fagprats")
                  .withIndex("by_visibility_level_usageCount", (q) =>
                    q.eq("visibility", "public").eq("level", args.level!),
                  )
              : ctx.db
                  .query("fagprats")
                  .withIndex("by_visibility_level", (q) =>
                    q.eq("visibility", "public").eq("level", args.level!),
                  )
            : popular
              ? ctx.db
                  .query("fagprats")
                  .withIndex("by_visibility_usageCount", (q) => q.eq("visibility", "public"))
              : ctx.db
                  .query("fagprats")
                  .withIndex("by_visibility", (q) => q.eq("visibility", "public"));

    const result = await queryBuilder.order("desc").paginate(args.paginationOpts);

    // type has only two values and isn't in the browse indexes; post-filter
    // the page. Page sizes can be smaller than requested when type is set.
    if (args.type) {
      return { ...result, page: result.page.filter((f) => f.type === args.type) };
    }
    return result;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.storage.delete(args.storageId);
  },
});
