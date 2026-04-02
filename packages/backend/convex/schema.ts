import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  fagprats: defineTable({
    title: v.string(),
    subject: v.string(),
    level: v.string(),
    type: v.union(v.literal("intro"), v.literal("oppsummering")),
    concepts: v.array(v.string()),
    statements: v.array(
      v.object({
        text: v.string(),
        fasit: v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis")),
        explanation: v.string(),
      }),
    ),
    visibility: v.union(v.literal("public"), v.literal("private")),
    usageCount: v.number(),
    authorId: v.string(),
    authorName: v.string(),
  })
    .index("by_author", ["authorId"])
    .index("by_visibility", ["visibility"])
    .index("by_subject", ["subject"]),

  liveSessions: defineTable({
    fagpratId: v.id("fagprats"),
    teacherId: v.string(),
    joinCode: v.string(),
    status: v.union(v.literal("lobby"), v.literal("active"), v.literal("ended")),
    currentStep: v.number(),
    currentStatementIndex: v.optional(v.number()),
    groupsEnabled: v.boolean(),
    groupCount: v.number(),
    transcriptionEnabled: v.boolean(),
    selfEvalEnabled: v.boolean(),
  })
    .index("by_joinCode", ["joinCode"])
    .index("by_teacher", ["teacherId"]),

  sessionStudents: defineTable({
    sessionId: v.id("liveSessions"),
    name: v.string(),
    avatarColor: v.string(),
    groupIndex: v.optional(v.number()),
  }).index("by_session", ["sessionId"]),

  sessionVotes: defineTable({
    sessionId: v.id("liveSessions"),
    studentId: v.id("sessionStudents"),
    statementIndex: v.number(),
    round: v.number(),
    vote: v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis")),
  }).index("by_session_statement", ["sessionId", "statementIndex"]),
});
