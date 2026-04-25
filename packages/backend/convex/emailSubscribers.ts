import { v } from "convex/values";

import { mutation } from "./_generated/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribeToLaunch = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (email.length === 0 || email.length > 254 || !EMAIL_REGEX.test(email)) {
      throw new Error("Ugyldig e-postadresse");
    }

    const existing = await ctx.db
      .query("emailSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      return { success: true, alreadySubscribed: true };
    }

    await ctx.db.insert("emailSubscribers", {
      email,
      source: args.source,
    });

    return { success: true, alreadySubscribed: false };
  },
});
