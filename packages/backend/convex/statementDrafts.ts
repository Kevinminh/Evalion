import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

const MAX_STATEMENTS = 50;
const MAX_TEXT_LENGTH = 1000;

const fasitValidator = v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis"));

const statementValidator = v.object({
  clientId: v.string(),
  text: v.string(),
  fasit: v.optional(fasitValidator),
  explanation: v.string(),
});

const typeValidator = v.union(v.literal("intro"), v.literal("summary"));

function isEmptyStatement(p: {
  text: string;
  explanation: string;
  fasit?: "sant" | "usant" | "delvis";
}) {
  return p.text.trim() === "" && p.explanation.trim() === "" && p.fasit === undefined;
}

function validateStatements(statements: { text: string; explanation: string }[]) {
  if (statements.length > MAX_STATEMENTS) {
    throw new Error(`For mange påstander (maks ${MAX_STATEMENTS}).`);
  }
  for (const p of statements) {
    if (p.text.length > MAX_TEXT_LENGTH) {
      throw new Error("Påstand-tekst er for lang.");
    }
    if (p.explanation.length > MAX_TEXT_LENGTH) {
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
      .query("statementDrafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const setStatements = mutation({
  args: { statements: v.array(statementValidator) },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    validateStatements(args.statements);
    const existing = await ctx.db
      .query("statementDrafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        statements: args.statements,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    return await ctx.db.insert("statementDrafts", {
      userId: identity.subject,
      statements: args.statements,
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
        explanation: v.string(),
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
      explanation: s.explanation,
    }));

    const existing = await ctx.db
      .query("statementDrafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existing) {
      const kept = existing.statements.filter((p) => !isEmptyStatement(p));
      const merged = [...kept, ...additions];
      validateStatements(merged);
      await ctx.db.patch(existing._id, {
        statements: merged,
        updatedAt: now,
      });
      return existing._id;
    }

    validateStatements(additions);
    return await ctx.db.insert("statementDrafts", {
      userId: identity.subject,
      statements: additions,
      updatedAt: now,
    });
  },
});

export const setLastParams = mutation({
  args: {
    lastSubject: v.optional(v.string()),
    lastLevel: v.optional(v.string()),
    lastType: v.optional(typeValidator),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const existing = await ctx.db
      .query("statementDrafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        lastSubject: args.lastSubject,
        lastLevel: args.lastLevel,
        lastType: args.lastType,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    return await ctx.db.insert("statementDrafts", {
      userId: identity.subject,
      statements: [],
      lastSubject: args.lastSubject,
      lastLevel: args.lastLevel,
      lastType: args.lastType,
      updatedAt: Date.now(),
    });
  },
});
