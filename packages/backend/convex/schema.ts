import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const statementValidator = v.object({
  text: v.string(),
  fasit: v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis")),
  explanation: v.string(),
  color: v.optional(
    v.union(
      v.literal("yellow"),
      v.literal("blue"),
      v.literal("orange"),
      v.literal("purple"),
      v.literal("red"),
    ),
  ),
  begrunnelse: v.optional(v.string()),
  image: v.optional(v.id("_storage")),
  explanationImage: v.optional(v.id("_storage")),
});

export default defineSchema({
  fagprats: defineTable({
    title: v.string(),
    subject: v.string(),
    level: v.string(),
    type: v.union(v.literal("intro"), v.literal("oppsummering")),
    concepts: v.array(v.string()),
    statements: v.array(statementValidator),
    visibility: v.union(v.literal("public"), v.literal("private")),
    usageCount: v.number(),
    authorId: v.string(),
    authorName: v.string(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_author", ["authorId"])
    .index("by_visibility", ["visibility"])
    .index("by_visibility_subject", ["visibility", "subject"])
    .index("by_visibility_level", ["visibility", "level"])
    .index("by_visibility_subject_level", ["visibility", "subject", "level"])
    .index("by_subject", ["subject"])
    .searchIndex("search_fagprats", {
      searchField: "title",
      filterFields: ["subject", "level", "type", "visibility"],
    }),

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
    timerDuration: v.optional(v.number()),
    timerStartedAt: v.optional(v.number()),
    timerPausedAt: v.optional(v.number()),
    timerRemainingAtPause: v.optional(v.number()),
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
  })
    .index("by_session_statement", ["sessionId", "statementIndex"])
    .index("by_session_statement_student_round", ["sessionId", "statementIndex", "studentId", "round"]),

  sessionRatings: defineTable({
    sessionId: v.id("liveSessions"),
    studentId: v.id("sessionStudents"),
    statementIndex: v.number(),
    rating: v.number(),
  })
    .index("by_session_statement", ["sessionId", "statementIndex"])
    .index("by_session_statement_student", ["sessionId", "statementIndex", "studentId"]),

  sessionBegrunnelser: defineTable({
    sessionId: v.id("liveSessions"),
    studentId: v.id("sessionStudents"),
    statementIndex: v.number(),
    round: v.number(),
    text: v.string(),
    highlighted: v.optional(v.boolean()),
  })
    .index("by_session_statement", ["sessionId", "statementIndex"])
    .index("by_session_statement_student_round", ["sessionId", "statementIndex", "studentId", "round"])
    .index("by_session_student", ["sessionId", "studentId"]),
});
