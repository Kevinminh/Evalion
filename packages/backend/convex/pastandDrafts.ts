import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

const MAX_PASTANDER = 50;
const MAX_TEXT_LENGTH = 1000;

const fasitValidator = v.union(
  v.literal("sant"),
  v.literal("usant"),
  v.literal("delvis"),
);

const pastandValidator = v.object({
  clientId: v.string(),
  text: v.string(),
  fasit: v.optional(fasitValidator),
  forklaring: v.string(),
});

const forkunnskapValidator = v.union(
  v.literal("intro"),
  v.literal("oppsummering"),
);

function isEmptyPastand(p: {
  text: string;
  forklaring: string;
  fasit?: "sant" | "usant" | "delvis";
}) {
  return p.text.trim() === "" && p.forklaring.trim() === "" && p.fasit === undefined;
}

function validatePastander(pastander: { text: string; forklaring: string }[]) {
  if (pastander.length > MAX_PASTANDER) {
    throw new Error(`For mange påstander (maks ${MAX_PASTANDER}).`);
  }
  for (const p of pastander) {
    if (p.text.length > MAX_TEXT_LENGTH) {
      throw new Error("Påstand-tekst er for lang.");
    }
    if (p.forklaring.length > MAX_TEXT_LENGTH) {
      throw new Error("Forklaring er for lang.");
    }
  }
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("pastandDrafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const setPastander = mutation({
  args: { pastander: v.array(pastandValidator) },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    validatePastander(args.pastander);
    const existing = await ctx.db
      .query("pastandDrafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        pastander: args.pastander,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    return await ctx.db.insert("pastandDrafts", {
      userId: identity.subject,
      pastander: args.pastander,
      updatedAt: Date.now(),
    });
  },
});

export const appendStatements = mutation({
  args: {
    statements: v.array(
      v.object({
        text: v.string(),
        fasit: fasitValidator,
        forklaring: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const now = Date.now();
    const additions = args.statements.map((s, i) => ({
      clientId: `${now}-${i}-${Math.random().toString(36).slice(2, 8)}`,
      text: s.text,
      fasit: s.fasit,
      forklaring: s.forklaring,
    }));

    const existing = await ctx.db
      .query("pastandDrafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existing) {
      const kept = existing.pastander.filter((p) => !isEmptyPastand(p));
      const merged = [...kept, ...additions];
      validatePastander(merged);
      await ctx.db.patch(existing._id, {
        pastander: merged,
        updatedAt: now,
      });
      return existing._id;
    }

    validatePastander(additions);
    return await ctx.db.insert("pastandDrafts", {
      userId: identity.subject,
      pastander: additions,
      updatedAt: now,
    });
  },
});

export const setLastParams = mutation({
  args: {
    lastFag: v.optional(v.string()),
    lastTrinn: v.optional(v.string()),
    lastForkunnskap: v.optional(forkunnskapValidator),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const existing = await ctx.db
      .query("pastandDrafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        lastFag: args.lastFag,
        lastTrinn: args.lastTrinn,
        lastForkunnskap: args.lastForkunnskap,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    return await ctx.db.insert("pastandDrafts", {
      userId: identity.subject,
      pastander: [],
      lastFag: args.lastFag,
      lastTrinn: args.lastTrinn,
      lastForkunnskap: args.lastForkunnskap,
      updatedAt: Date.now(),
    });
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);
    const existing = await ctx.db
      .query("pastandDrafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
