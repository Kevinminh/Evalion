import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./helpers";

// Duplicated from packages/features/src/lib/feature-flags.ts so the backend
// has no dependency on @workspace/features (which itself depends on the
// backend). Keep this list in sync with FEATURE_FLAGS over there.
const KNOWN_KEYS: ReadonlyArray<string> = ["liveokt.dummyData"];

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("featureFlags").collect();
    const byKey = new Map(rows.map((r) => [r.key, r.enabled]));
    return KNOWN_KEYS.map((key) => ({
      key,
      enabled: byKey.get(key) ?? false,
    }));
  },
});

export const isEnabled = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db
      .query("featureFlags")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    return row?.enabled ?? false;
  },
});

export const setEnabled = mutation({
  args: { key: v.string(), enabled: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (!KNOWN_KEYS.includes(args.key)) {
      throw new Error(`Ukjent feature flag: ${args.key}`);
    }

    const identity = await ctx.auth.getUserIdentity();
    const updatedBy = identity?.subject;

    const existing = await ctx.db
      .query("featureFlags")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        enabled: args.enabled,
        updatedAt: Date.now(),
        updatedBy,
      });
      return existing._id;
    }
    return await ctx.db.insert("featureFlags", {
      key: args.key,
      enabled: args.enabled,
      updatedAt: Date.now(),
      updatedBy,
    });
  },
});
