import { v } from "convex/values";

import { query, mutation } from "./_generated/server";

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const AVATAR_COLORS = [
  "bg-purple-400",
  "bg-teal-400",
  "bg-pink-400",
  "bg-green-500",
  "bg-orange-400",
  "bg-blue-400",
  "bg-red-400",
  "bg-indigo-400",
];

// ── Session queries ──

export const getById = query({
  args: { id: v.id("liveSessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByJoinCode = query({
  args: { joinCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("liveSessions")
      .withIndex("by_joinCode", (q) => q.eq("joinCode", args.joinCode))
      .first();
  },
});

// ── Session mutations ──

export const create = mutation({
  args: {
    fagpratId: v.id("fagprats"),
    groupsEnabled: v.boolean(),
    groupCount: v.number(),
    transcriptionEnabled: v.boolean(),
    selfEvalEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Generate unique join code
    let joinCode = generateJoinCode();
    let existing = await ctx.db
      .query("liveSessions")
      .withIndex("by_joinCode", (q) => q.eq("joinCode", joinCode))
      .first();
    while (existing) {
      joinCode = generateJoinCode();
      existing = await ctx.db
        .query("liveSessions")
        .withIndex("by_joinCode", (q) => q.eq("joinCode", joinCode))
        .first();
    }

    // Increment usage count on the fagprat
    const fagprat = await ctx.db.get(args.fagpratId);
    if (fagprat) {
      await ctx.db.patch(args.fagpratId, {
        usageCount: (fagprat.usageCount ?? 0) + 1,
      });
    }

    return await ctx.db.insert("liveSessions", {
      ...args,
      teacherId: identity.subject,
      joinCode,
      status: "lobby",
      currentStep: 0,
    });
  },
});

export const updateStep = mutation({
  args: {
    id: v.id("liveSessions"),
    step: v.number(),
    statementIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const session = await ctx.db.get(args.id);
    if (!session || session.teacherId !== identity.subject) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch(args.id, {
      currentStep: args.step,
      status: "active",
      ...(args.statementIndex !== undefined && {
        currentStatementIndex: args.statementIndex,
      }),
    });
  },
});

export const end = mutation({
  args: { id: v.id("liveSessions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const session = await ctx.db.get(args.id);
    if (!session || session.teacherId !== identity.subject) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch(args.id, { status: "ended" });
  },
});

// ── Student queries & mutations ──

export const listStudents = query({
  args: { sessionId: v.id("liveSessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessionStudents")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const addStudent = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const students = await ctx.db
      .query("sessionStudents")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const avatarColor = AVATAR_COLORS[students.length % AVATAR_COLORS.length];

    return await ctx.db.insert("sessionStudents", {
      sessionId: args.sessionId,
      name: args.name,
      avatarColor,
    });
  },
});

export const removeStudent = mutation({
  args: { id: v.id("sessionStudents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const createGroups = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    groupCount: v.number(),
  },
  handler: async (ctx, args) => {
    const students = await ctx.db
      .query("sessionStudents")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Shuffle students
    const shuffled = [...students];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!];
    }

    // Assign group indices
    for (let i = 0; i < shuffled.length; i++) {
      await ctx.db.patch(shuffled[i]!._id, {
        groupIndex: i % args.groupCount,
      });
    }
  },
});

// ── Vote queries & mutations ──

export const getVotes = query({
  args: {
    sessionId: v.id("liveSessions"),
    statementIndex: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessionVotes")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .collect();
  },
});

export const castVote = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    studentId: v.id("sessionStudents"),
    statementIndex: v.number(),
    round: v.number(),
    vote: v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessionVotes", args);
  },
});
