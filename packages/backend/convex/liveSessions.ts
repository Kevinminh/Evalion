import { v } from "convex/values";

import { query, mutation } from "./_generated/server";
import { requireAuth, requireSessionOwner, validateStatementIndex } from "./helpers";

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

const AVATAR_EMOJIS = [
  "🦊", "🐸", "🦁", "🐼", "🐰", "🦋", "🐬", "🦉", "🐧", "🐢",
  "🦎", "🦩", "🐋", "🦜", "🐙", "🐝", "🦈", "🐨", "🦔", "🐾",
  "🦒", "🐶", "🐱", "🐻", "🐵", "🐯",
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

    // Deduplicate fagprat lookups to avoid redundant queries
    const uniqueFagpratIds = [...new Set(ended.map((s) => s.fagpratId))];
    const fagpratEntries = await Promise.all(
      uniqueFagpratIds.map(async (id) => [id, await ctx.db.get(id)] as const),
    );
    const fagpratMap = new Map(fagpratEntries);

    // Batch-fetch all students for ended sessions and count by session
    const allStudents = await Promise.all(
      ended.map((session) =>
        ctx.db
          .query("sessionStudents")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .collect(),
      ),
    );
    const studentCountMap = new Map<string, number>();
    for (let i = 0; i < ended.length; i++) {
      studentCountMap.set(ended[i]!._id, allStudents[i]!.length);
    }

    return ended.map((session) => ({
      ...session,
      fagpratTitle: fagpratMap.get(session.fagpratId)?.title ?? "Slettet FagPrat",
      studentCount: studentCountMap.get(session._id) ?? 0,
    }));
  },
});

export const getById = query({
  args: { id: v.id("liveSessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getSessionWithFagprat = query({
  args: { id: v.id("liveSessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.id);
    if (!session) return null;
    const fagprat = await ctx.db.get(session.fagpratId);
    if (!fagprat) return null;
    const students = await ctx.db
      .query("sessionStudents")
      .withIndex("by_session", (q) => q.eq("sessionId", args.id))
      .collect();
    return {
      ...session,
      fagpratTitle: fagprat.title,
      statements: fagprat.statements,
      studentCount: students.length,
    };
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
    const identity = await requireAuth(ctx);

    if (args.groupCount < 2 || args.groupCount > 8) {
      throw new Error("Group count must be between 2 and 8");
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

    // Validate fagprat exists and increment usage count
    const fagprat = await ctx.db.get(args.fagpratId);
    if (!fagprat) {
      throw new Error("FagPrat not found");
    }
    await ctx.db.patch(args.fagpratId, {
      usageCount: (fagprat.usageCount ?? 0) + 1,
    });

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
    const identity = await requireAuth(ctx);
    const session = await ctx.db.get(args.id);
    if (!session || session.teacherId !== identity.subject) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch(args.id, {
      currentStep: args.step,
      status: "active",
      timerDuration: undefined,
      timerStartedAt: undefined,
      timerPausedAt: undefined,
      timerRemainingAtPause: undefined,
      ...(args.statementIndex !== undefined && {
        currentStatementIndex: args.statementIndex,
      }),
    });
    return args.id;
  },
});

export const end = mutation({
  args: { id: v.id("liveSessions") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const session = await ctx.db.get(args.id);
    if (!session || session.teacherId !== identity.subject) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch(args.id, { status: "ended" });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("liveSessions") },
  handler: async (ctx, args) => {
    const session = await requireSessionOwner(ctx, args.id);
    if (session.status !== "ended") {
      throw new Error("Only ended sessions can be deleted");
    }

    const [students, votes, ratings, begrunnelser] = await Promise.all([
      ctx.db.query("sessionStudents").withIndex("by_session", (q) => q.eq("sessionId", args.id)).collect(),
      ctx.db.query("sessionVotes").withIndex("by_session_statement", (q) => q.eq("sessionId", args.id)).collect(),
      ctx.db.query("sessionRatings").withIndex("by_session_statement", (q) => q.eq("sessionId", args.id)).collect(),
      ctx.db.query("sessionBegrunnelser").withIndex("by_session_statement", (q) => q.eq("sessionId", args.id)).collect(),
    ]);

    await Promise.all([
      ...students.map((s) => ctx.db.delete(s._id)),
      ...votes.map((v) => ctx.db.delete(v._id)),
      ...ratings.map((r) => ctx.db.delete(r._id)),
      ...begrunnelser.map((b) => ctx.db.delete(b._id)),
    ]);

    await ctx.db.delete(args.id);
    return args.id;
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
    const avatarEmoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];

    return await ctx.db.insert("sessionStudents", {
      sessionId: args.sessionId,
      name: trimmedName,
      avatarColor,
      avatarEmoji,
    });
  },
});

export const removeStudent = mutation({
  args: { id: v.id("sessionStudents") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.id);
    if (!student) throw new Error("Student not found");

    const identity = await ctx.auth.getUserIdentity();
    // Allow either the session teacher or the student themselves (via leave)
    if (identity) {
      const session = await ctx.db.get(student.sessionId);
      if (session && session.teacherId !== identity.subject) {
        throw new Error("Not authorized");
      }
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const createGroups = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    groupCount: v.number(),
  },
  handler: async (ctx, args) => {
    await requireSessionOwner(ctx, args.sessionId);

    if (args.groupCount < 2 || args.groupCount > 8) {
      throw new Error("Group count must be between 2 and 8");
    }

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
    confidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await validateStatementIndex(ctx, args.sessionId, args.statementIndex);

    // Verify student belongs to this session
    const student = await ctx.db.get(args.studentId);
    if (!student || student.sessionId !== args.sessionId) {
      throw new Error("Student not found in this session");
    }

    // Prevent duplicate votes for same student/statement/round
    const existing = await ctx.db
      .query("sessionVotes")
      .withIndex("by_session_statement_student_round", (q) =>
        q
          .eq("sessionId", args.sessionId)
          .eq("statementIndex", args.statementIndex)
          .eq("studentId", args.studentId)
          .eq("round", args.round),
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
    const identity = await requireAuth(ctx);
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
    const identity = await requireAuth(ctx);
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
    const identity = await requireAuth(ctx);
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

    // Single-pass vote counting by round and type + confidence
    const counts = {
      1: { sant: 0, usant: 0, delvis: 0, total: 0 },
      2: { sant: 0, usant: 0, delvis: 0, total: 0 },
    } as Record<number, { sant: number; usant: number; delvis: number; total: number }>;
    const round1Votes: typeof allVotes = [];
    const round2Votes: typeof allVotes = [];

    // Confidence tracking per round
    const confData = {
      1: { sum: 0, count: 0, buckets: [0, 0, 0, 0, 0], byVote: { sant: { sum: 0, count: 0 }, usant: { sum: 0, count: 0 }, delvis: { sum: 0, count: 0 } } },
      2: { sum: 0, count: 0, buckets: [0, 0, 0, 0, 0], byVote: { sant: { sum: 0, count: 0 }, usant: { sum: 0, count: 0 }, delvis: { sum: 0, count: 0 } } },
    } as Record<number, { sum: number; count: number; buckets: number[]; byVote: Record<string, { sum: number; count: number }> }>;

    for (const vote of allVotes) {
      const r = vote.round === 1 ? 1 : vote.round === 2 ? 2 : 0;
      if (r === 0) continue;
      if (r === 1) round1Votes.push(vote);
      else round2Votes.push(vote);
      counts[r]![vote.vote]++;
      counts[r]!.total++;
      if (vote.confidence != null && vote.confidence >= 1 && vote.confidence <= 5) {
        confData[r]!.sum += vote.confidence;
        confData[r]!.count++;
        confData[r]!.buckets[vote.confidence - 1]!++;
        confData[r]!.byVote[vote.vote]!.sum += vote.confidence;
        confData[r]!.byVote[vote.vote]!.count++;
      }
    }

    const distribution = (roundCounts: { sant: number; usant: number; delvis: number; total: number }) => {
      const { sant, usant, delvis, total } = roundCounts;
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

    const confidenceAnalytics = (rd: number) => {
      const d = confData[rd]!;
      return {
        avgConfidence: d.count ? Math.round((d.sum / d.count) * 10) / 10 : 0,
        confidenceDistribution: [1, 2, 3, 4, 5].map((level) => ({
          level,
          count: d.buckets[level - 1]!,
        })),
        confidenceByVote: {
          sant: d.byVote.sant!.count ? Math.round((d.byVote.sant!.sum / d.byVote.sant!.count) * 10) / 10 : 0,
          usant: d.byVote.usant!.count ? Math.round((d.byVote.usant!.sum / d.byVote.usant!.count) * 10) / 10 : 0,
          delvis: d.byVote.delvis!.count ? Math.round((d.byVote.delvis!.sum / d.byVote.delvis!.count) * 10) / 10 : 0,
        },
      };
    };

    // R1 vs R2 changes
    const r1ByStudent = new Map(round1Votes.map((v) => [v.studentId, v]));
    const r2ByStudent = new Map(round2Votes.map((v) => [v.studentId, v]));
    let correctR2 = 0;
    let wrongToRight = 0;
    let rightToWrong = 0;

    for (const [studentId, r2VoteDoc] of r2ByStudent) {
      const r1VoteDoc = r1ByStudent.get(studentId);
      const r2Correct = r2VoteDoc.vote === fasit;
      const r1Correct = r1VoteDoc?.vote === fasit;
      if (r2Correct) correctR2++;
      if (r1VoteDoc && !r1Correct && r2Correct) wrongToRight++;
      if (r1VoteDoc && r1Correct && !r2Correct) rightToWrong++;
    }

    // Student matrix data — per-student vote/confidence/correctness for both rounds
    const allStudents = await ctx.db
      .query("sessionStudents")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    const begrunnelser = await ctx.db
      .query("sessionBegrunnelser")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .collect();
    const begrunnelseByStudent = new Map(begrunnelser.map((b) => [`${b.studentId}:${b.round}`, b.text]));

    const studentData = allStudents.map((s) => {
      const r1 = r1ByStudent.get(s._id);
      const r2 = r2ByStudent.get(s._id);
      return {
        studentId: s._id,
        name: s.name,
        avatarColor: s.avatarColor,
        round1: r1 ? { vote: r1.vote, confidence: r1.confidence ?? null, correct: r1.vote === fasit } : null,
        round2: r2 ? { vote: r2.vote, confidence: r2.confidence ?? null, correct: r2.vote === fasit } : null,
        begrunnelseR1: begrunnelseByStudent.get(`${s._id}:1`) ?? null,
      };
    });

    // Ratings
    const ratings = await ctx.db
      .query("sessionRatings")
      .withIndex("by_session_statement", (q) =>
        q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
      )
      .collect();
    const ratingByStudent = new Map(ratings.map((r) => [r.studentId, r.rating]));
    const avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    // Single-pass rating distribution
    const ratingBuckets = [0, 0, 0, 0, 0];
    for (const r of ratings) {
      if (r.rating >= 1 && r.rating <= 5) ratingBuckets[r.rating - 1]!++;
    }

    // Enrich student data with ratings
    const studentDataWithRatings = studentData.map((s) => ({
      ...s,
      rating: ratingByStudent.get(s.studentId) ?? null,
    }));

    return {
      round1: distribution(counts[1]!),
      round2: distribution(counts[2]!),
      confidence1: confidenceAnalytics(1),
      confidence2: confidenceAnalytics(2),
      fasit,
      correctR2,
      totalR2: round2Votes.length,
      wrongToRight,
      rightToWrong,
      avgRating: Math.round(avgRating * 10) / 10,
      ratingDistribution: [1, 2, 3, 4, 5].map((score) => ({
        score,
        count: ratingBuckets[score - 1]!,
      })),
      students: studentDataWithRatings,
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
    if (trimmed.length > 2000) throw new Error("Begrunnelse is too long (max 2000 characters)");

    await validateStatementIndex(ctx, args.sessionId, args.statementIndex);

    // Verify student belongs to this session
    const student = await ctx.db.get(args.studentId);
    if (!student || student.sessionId !== args.sessionId) {
      throw new Error("Student not found in this session");
    }

    const existing = await ctx.db
      .query("sessionBegrunnelser")
      .withIndex("by_session_statement_student_round", (q) =>
        q
          .eq("sessionId", args.sessionId)
          .eq("statementIndex", args.statementIndex)
          .eq("studentId", args.studentId)
          .eq("round", args.round),
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
    const begrunnelse = await ctx.db.get(args.id);
    if (!begrunnelse) throw new Error("Begrunnelse not found");

    await requireSessionOwner(ctx, begrunnelse.sessionId);

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

    await validateStatementIndex(ctx, args.sessionId, args.statementIndex);

    // Verify student belongs to this session
    const student = await ctx.db.get(args.studentId);
    if (!student || student.sessionId !== args.sessionId) {
      throw new Error("Student not found in this session");
    }

    // Prevent duplicate ratings
    const existing = await ctx.db
      .query("sessionRatings")
      .withIndex("by_session_statement_student", (q) =>
        q
          .eq("sessionId", args.sessionId)
          .eq("statementIndex", args.statementIndex)
          .eq("studentId", args.studentId),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { rating: args.rating });
      return existing._id;
    }

    return await ctx.db.insert("sessionRatings", args);
  },
});
