import { v } from "convex/values";

import { internalQuery, mutation, query } from "./_generated/server";
import { requireAdmin } from "./helpers";

const REDDI_SYSTEM_KEY = "reddi.system";
const MAX_PROMPT_LENGTH = 20000;

export const getReddiSystemPromptInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("aiPrompts")
      .withIndex("by_key", (q) => q.eq("key", REDDI_SYSTEM_KEY))
      .unique();
    return row?.content ?? null;
  },
});

export const getReddiSystemPrompt = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const row = await ctx.db
      .query("aiPrompts")
      .withIndex("by_key", (q) => q.eq("key", REDDI_SYSTEM_KEY))
      .unique();
    return row?.content ?? null;
  },
});

export const updateReddiSystemPrompt = mutation({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (args.content.trim().length === 0) {
      throw new Error("Prompten kan ikke være tom.");
    }
    if (args.content.length > MAX_PROMPT_LENGTH) {
      throw new Error(`Prompten er for lang (maks ${MAX_PROMPT_LENGTH} tegn).`);
    }

    const identity = await ctx.auth.getUserIdentity();
    const updatedBy = identity?.subject;

    const existing = await ctx.db
      .query("aiPrompts")
      .withIndex("by_key", (q) => q.eq("key", REDDI_SYSTEM_KEY))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        updatedAt: Date.now(),
        updatedBy,
      });
      return existing._id;
    }
    return await ctx.db.insert("aiPrompts", {
      key: REDDI_SYSTEM_KEY,
      content: args.content,
      updatedAt: Date.now(),
      updatedBy,
    });
  },
});
