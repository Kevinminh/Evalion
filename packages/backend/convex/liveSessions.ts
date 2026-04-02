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

export const listByTeacher = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const sessions = await ctx.db
      .query("liveSessions")
      .withIndex("by_teacher", (q) => q.eq("teacherId", identity.subject))
      .order("desc")
      .collect();

    const ended = sessions.filter((s) => s.status === "ended");

    return await Promise.all(
      ended.map(async (session) => {
        const fagprat = await ctx.db.get(session.fagpratId);
        const students = await ctx.db
          .query("sessionStudents")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .collect();
        return {
          ...session,
          fagpratTitle: fagprat?.title ?? "Slettet FagPrat",
          studentCount: students.length,
        };
      }),
    );
  },
});

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

export const getStudent = query({
  args: { id: v.id("sessionStudents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addStudent = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmedName = args.name.trim();
    if (!trimmedName || trimmedName.length > 30) {
      throw new Error("Name must be 1-30 characters");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    if (session.status !== "lobby" && session.status !== "active") {
      throw new Error("Session is not accepting new students");
    }

    const students = await ctx.db
      .query("sessionStudents")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const avatarColor = AVATAR_COLORS[students.length % AVATAR_COLORS.length];

    return await ctx.db.insert("sessionStudents", {
      sessionId: args.sessionId,
      name: trimmedName,
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
    // Prevent duplicate votes for same student/statement/round
    const existing = await ctx.db
      .query("sessionVotes")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .filter((q) =>
        q.and(q.eq(q.field("studentId"), args.studentId), q.eq(q.field("round"), args.round)),
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("sessionVotes", args);
  },
});

// ── Timer mutations ──

export const startTimer = mutation({
  args: { id: v.id("liveSessions"), duration: v.number() },
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
      timerDuration: args.duration,
      timerStartedAt: Date.now(),
      timerPausedAt: undefined,
      timerRemainingAtPause: undefined,
    });
  },
});

export const pauseTimer = mutation({
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
    if (!session.timerStartedAt || session.timerPausedAt) return;
    const elapsed = (Date.now() - session.timerStartedAt) / 1000;
    const remaining = Math.max(0, (session.timerDuration ?? 0) - elapsed);
    await ctx.db.patch(args.id, {
      timerPausedAt: Date.now(),
      timerRemainingAtPause: remaining,
    });
  },
});

export const stopTimer = mutation({
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
    await ctx.db.patch(args.id, {
      timerDuration: undefined,
      timerStartedAt: undefined,
      timerPausedAt: undefined,
      timerRemainingAtPause: undefined,
    });
  },
});

// ── Vote analytics ──

export const getVoteAnalytics = query({
  args: {
    sessionId: v.id("liveSessions"),
    statementIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;
    const fagprat = await ctx.db.get(session.fagpratId);
    const fasit = fagprat?.statements[args.statementIndex]?.fasit;

    const allVotes = await ctx.db
      .query("sessionVotes")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .collect();

    const round1Votes = allVotes.filter((v) => v.round === 1);
    const round2Votes = allVotes.filter((v) => v.round === 2);

    const distribution = (votes: typeof allVotes) => {
      const sant = votes.filter((v) => v.vote === "sant").length;
      const usant = votes.filter((v) => v.vote === "usant").length;
      const delvis = votes.filter((v) => v.vote === "delvis").length;
      const total = votes.length;
      return {
        sant,
        usant,
        delvis,
        total,
        santPct: total ? Math.round((sant / total) * 100) : 0,
        usantPct: total ? Math.round((usant / total) * 100) : 0,
        delvisPct: total ? Math.round((delvis / total) * 100) : 0,
      };
    };

    // R1 vs R2 changes
    const r1ByStudent = new Map(round1Votes.map((v) => [v.studentId, v.vote]));
    const r2ByStudent = new Map(round2Votes.map((v) => [v.studentId, v.vote]));
    let correctR2 = 0;
    let wrongToRight = 0;
    let rightToWrong = 0;

    for (const [studentId, r2Vote] of r2ByStudent) {
      const r1Vote = r1ByStudent.get(studentId);
      const r2Correct = r2Vote === fasit;
      const r1Correct = r1Vote === fasit;
      if (r2Correct) correctR2++;
      if (r1Vote && !r1Correct && r2Correct) wrongToRight++;
      if (r1Vote && r1Correct && !r2Correct) rightToWrong++;
    }

    // Ratings
    const ratings = await ctx.db
      .query("sessionRatings")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .collect();
    const avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    return {
      round1: distribution(round1Votes),
      round2: distribution(round2Votes),
      fasit,
      correctR2,
      totalR2: round2Votes.length,
      wrongToRight,
      rightToWrong,
      avgRating: Math.round(avgRating * 10) / 10,
      ratingDistribution: [1, 2, 3, 4, 5].map((score) => ({
        score,
        count: ratings.filter((r) => r.rating === score).length,
      })),
    };
  },
});

export const getRatings = query({
  args: {
    sessionId: v.id("liveSessions"),
    statementIndex: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessionRatings")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .collect();
  },
});

// ── Begrunnelser ──

export const submitBegrunnelse = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    studentId: v.id("sessionStudents"),
    statementIndex: v.number(),
    round: v.number(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmed = args.text.trim();
    if (!trimmed) throw new Error("Begrunnelse cannot be empty");

    const existing = await ctx.db
      .query("sessionBegrunnelser")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .filter((q) =>
        q.and(q.eq(q.field("studentId"), args.studentId), q.eq(q.field("round"), args.round)),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { text: trimmed });
      return existing._id;
    }
    return await ctx.db.insert("sessionBegrunnelser", {
      sessionId: args.sessionId,
      studentId: args.studentId,
      statementIndex: args.statementIndex,
      round: args.round,
      text: trimmed,
    });
  },
});

export const getBegrunnelser = query({
  args: {
    sessionId: v.id("liveSessions"),
    statementIndex: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessionBegrunnelser")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .collect();
  },
});

export const highlightBegrunnelse = mutation({
  args: {
    id: v.id("sessionBegrunnelser"),
    highlighted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const begrunnelse = await ctx.db.get(args.id);
    if (!begrunnelse) throw new Error("Begrunnelse not found");

    // Clear any other highlighted begrunnelse for the same statement
    if (args.highlighted) {
      const others = await ctx.db
        .query("sessionBegrunnelser")
        .withIndex("by_session_statement", (q) =>
          q
            .eq("sessionId", begrunnelse.sessionId)
            .eq("statementIndex", begrunnelse.statementIndex),
        )
        .filter((q) => q.eq(q.field("highlighted"), true))
        .collect();
      for (const other of others) {
        await ctx.db.patch(other._id, { highlighted: false });
      }
    }
    await ctx.db.patch(args.id, { highlighted: args.highlighted });
  },
});

// ── Rating mutations ──

export const submitRating = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    studentId: v.id("sessionStudents"),
    statementIndex: v.number(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Prevent duplicate ratings
    const existing = await ctx.db
      .query("sessionRatings")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { rating: args.rating });
      return existing._id;
    }

    return await ctx.db.insert("sessionRatings", args);
  },
});
