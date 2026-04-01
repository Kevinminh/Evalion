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
});
