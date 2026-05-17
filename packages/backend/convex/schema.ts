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
  // ── FagPrats (question sets) ──
  // A FagPrat is a teacher-authored deck of statements (text + fasit +
  // explanation). Created and managed from the dashboard; consumed by the live
  // game; also shown in the public demo on landing. Source-of-truth content
  // that exists independently of any live session.
  fagprats: defineTable({
    title: v.string(),
    subject: v.string(),
    level: v.string(),
    type: v.union(v.literal("intro"), v.literal("summary")),
    concepts: v.array(v.string()),
    statements: v.array(statementValidator),
    visibility: v.union(v.literal("public"), v.literal("private")),
    usageCount: v.number(),
    authorId: v.string(),
    authorName: v.string(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_author", ["authorId"])
    .index("by_author_updatedAt", ["authorId", "updatedAt"])
    .index("by_visibility", ["visibility"])
    .index("by_visibility_subject", ["visibility", "subject"])
    .index("by_visibility_level", ["visibility", "level"])
    .index("by_visibility_subject_level", ["visibility", "subject", "level"])
    .index("by_visibility_usageCount", ["visibility", "usageCount"])
    .index("by_visibility_subject_usageCount", ["visibility", "subject", "usageCount"])
    .index("by_visibility_level_usageCount", ["visibility", "level", "usageCount"])
    .index("by_visibility_subject_level_usageCount", [
      "visibility",
      "subject",
      "level",
      "usageCount",
    ])
    .searchIndex("search_fagprats", {
      searchField: "title",
      filterFields: ["subject", "level", "type", "visibility"],
    }),

  // ── Live game session ──
  // One classroom run of a FagPrat. The teacher launches a session from the
  // dashboard; students join via a 6-char joinCode on the web app and play
  // through the 6 steps. `liveSessions` holds the session-level state;
  // `sessionStudents` / `sessionVotes` / `sessionRatings` /
  // `sessionJustifications` are per-student records scoped by `sessionId`.
  // All four child tables are cascade-deleted when the session is removed.
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
    .index("by_teacher", ["teacherId"])
    .index("by_fagprat", ["fagpratId"]),

  sessionStudents: defineTable({
    sessionId: v.id("liveSessions"),
    name: v.string(),
    avatarColor: v.string(),
    avatarEmoji: v.optional(v.string()),
    groupIndex: v.optional(v.number()),
    isDummy: v.optional(v.boolean()),
  }).index("by_session", ["sessionId"]),

  sessionVotes: defineTable({
    sessionId: v.id("liveSessions"),
    studentId: v.id("sessionStudents"),
    statementIndex: v.number(),
    round: v.number(),
    vote: v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis")),
    confidence: v.optional(v.number()),
  })
    .index("by_session_statement", ["sessionId", "statementIndex"])
    .index("by_session_statement_student_round", [
      "sessionId",
      "statementIndex",
      "studentId",
      "round",
    ]),

  sessionRatings: defineTable({
    sessionId: v.id("liveSessions"),
    studentId: v.id("sessionStudents"),
    statementIndex: v.number(),
    rating: v.number(),
  })
    .index("by_session_statement", ["sessionId", "statementIndex"])
    .index("by_session_statement_student", ["sessionId", "statementIndex", "studentId"]),

  sessionJustifications: defineTable({
    sessionId: v.id("liveSessions"),
    studentId: v.id("sessionStudents"),
    statementIndex: v.number(),
    round: v.number(),
    text: v.string(),
    highlighted: v.optional(v.boolean()),
  })
    .index("by_session_statement", ["sessionId", "statementIndex"])
    .index("by_session_statement_student_round", [
      "sessionId",
      "statementIndex",
      "studentId",
      "round",
    ])
    .index("by_session_student", ["sessionId", "studentId"]),

  // ── Påstandsgenerator (standalone landing-only tool) ──
  // Used by the `/lag-pastander` and `/velg-pastander` routes on the landing
  // app. Lets a teacher generate a quick batch of påstander via AI and export
  // them as PDF, without going through the full FagPrat flow. One draft per
  // user (auto-saved). Completely independent of `liveSessions` and `fagprats`.
  statementDrafts: defineTable({
    userId: v.string(),
    statements: v.array(
      v.object({
        clientId: v.string(),
        text: v.string(),
        fasit: v.optional(v.union(v.literal("sant"), v.literal("usant"), v.literal("delvis"))),
        explanation: v.string(),
      }),
    ),
    lastSubject: v.optional(v.string()),
    lastLevel: v.optional(v.string()),
    lastType: v.optional(v.union(v.literal("intro"), v.literal("summary"))),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ── Marketing / waitlist ──
  // Captures from the landing site's newsletter / waitlist form.
  emailSubscribers: defineTable({
    email: v.string(),
    source: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // ── Admin / infrastructure ──
  // Editable system prompts for the AI generator (admins can override the
  // default prompt baked into `reddi.ts`), and feature flags controlled from
  // the admin UI.
  aiPrompts: defineTable({
    key: v.string(),
    content: v.string(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  }).index("by_key", ["key"]),

  featureFlags: defineTable({
    key: v.string(),
    enabled: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  }).index("by_key", ["key"]),
});
