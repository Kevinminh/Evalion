import { v } from "convex/values";

import { mutation } from "./_generated/server";
import { validateStatementIndex } from "./helpers";

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
  "🦊",
  "🐸",
  "🦁",
  "🐼",
  "🐰",
  "🦋",
  "🐬",
  "🦉",
  "🐧",
  "🐢",
  "🦎",
  "🦩",
  "🐋",
  "🦜",
  "🐙",
  "🐝",
  "🦈",
  "🐨",
  "🦔",
  "🐾",
  "🦒",
  "🐶",
  "🐱",
  "🐻",
  "🐵",
  "🐯",
];

const DUMMY_NAMES = [
  "Emma",
  "Noah",
  "Olivia",
  "Liam",
  "Sofia",
  "Aksel",
  "Nora",
  "Oscar",
  "Ella",
  "Isak",
  "Maja",
  "Lukas",
  "Sara",
  "Filip",
  "Ingrid",
  "Jakob",
  "Frida",
  "Henrik",
  "Mia",
  "Theo",
];

const VOTE_OPTIONS = ["sant", "usant", "delvis"] as const;

const DUMMY_BEGRUNNELSER = [
  "Jeg tror dette stemmer fordi vi lærte om det i forrige uke.",
  "Jeg er ikke helt sikker, men jeg tipper at det er riktig.",
  "Læreren sa noe lignende i timen, så jeg tror det er sant.",
  "Det høres logisk ut når jeg tenker over det.",
  "Jeg har lest om dette før, men husker ikke alle detaljene.",
  "Jeg er litt usikker fordi det avhenger av situasjonen.",
  "Det stemmer i de fleste tilfeller, men ikke alltid.",
  "Jeg tror dette er feil fordi jeg har hørt noe annet.",
  "Etter å ha tenkt litt, virker dette delvis riktig.",
  "Jeg er ganske sikker på dette, det stemmer med det jeg vet.",
];

export const addDummyStudents = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    if (!Number.isInteger(args.count) || args.count < 1 || args.count > 50) {
      throw new Error("Count must be between 1 and 50");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    if (session.status !== "lobby" && session.status !== "active") {
      throw new Error("Session is not accepting new students");
    }

    const existing = await ctx.db
      .query("sessionStudents")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const dummyCount = existing.filter((s) => s.isDummy).length;
    const insertedIds: string[] = [];

    for (let i = 0; i < args.count; i++) {
      const total = existing.length + i;
      const nameIdx = dummyCount + i;
      const baseName = DUMMY_NAMES[nameIdx % DUMMY_NAMES.length]!;
      const suffix = Math.floor(nameIdx / DUMMY_NAMES.length);
      const name = suffix > 0 ? `${baseName} ${suffix + 1}` : baseName;
      const avatarColor = AVATAR_COLORS[total % AVATAR_COLORS.length]!;
      const avatarEmoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)]!;

      const groupIndex = session.groupsEnabled ? total % session.groupCount : undefined;

      const id = await ctx.db.insert("sessionStudents", {
        sessionId: args.sessionId,
        name,
        avatarColor,
        avatarEmoji,
        ...(groupIndex !== undefined && { groupIndex }),
        isDummy: true,
      });
      insertedIds.push(id);
    }

    return insertedIds;
  },
});

export const castDummyVotes = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    statementIndex: v.number(),
    round: v.number(),
  },
  handler: async (ctx, args) => {
    await validateStatementIndex(ctx, args.sessionId, args.statementIndex);

    if (args.round !== 1 && args.round !== 2) {
      throw new Error("Round must be 1 or 2");
    }

    const [students, existingVotes, existingBegrunnelser] = await Promise.all([
      ctx.db
        .query("sessionStudents")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect(),
      ctx.db
        .query("sessionVotes")
        .withIndex("by_session_statement", (q) =>
          q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
        )
        .collect(),
      ctx.db
        .query("sessionBegrunnelser")
        .withIndex("by_session_statement", (q) =>
          q.eq("sessionId", args.sessionId).eq("statementIndex", args.statementIndex),
        )
        .collect(),
    ]);
    const dummies = students.filter((s) => s.isDummy);
    const votedStudentIds = new Set(
      existingVotes.filter((v) => v.round === args.round).map((v) => v.studentId),
    );
    const begrunnelseStudentIds = new Set(
      existingBegrunnelser.filter((b) => b.round === args.round).map((b) => b.studentId),
    );

    const voteInserts: Promise<unknown>[] = [];
    const begrunnelseInserts: Promise<unknown>[] = [];
    let inserted = 0;
    for (const student of dummies) {
      if (votedStudentIds.has(student._id)) continue;
      const vote = VOTE_OPTIONS[Math.floor(Math.random() * VOTE_OPTIONS.length)]!;
      const confidence = Math.floor(Math.random() * 5) + 1;
      voteInserts.push(
        ctx.db.insert("sessionVotes", {
          sessionId: args.sessionId,
          studentId: student._id,
          statementIndex: args.statementIndex,
          round: args.round,
          vote,
          confidence,
        }),
      );
      inserted++;

      if (!begrunnelseStudentIds.has(student._id)) {
        const text = DUMMY_BEGRUNNELSER[Math.floor(Math.random() * DUMMY_BEGRUNNELSER.length)]!;
        begrunnelseInserts.push(
          ctx.db.insert("sessionBegrunnelser", {
            sessionId: args.sessionId,
            studentId: student._id,
            statementIndex: args.statementIndex,
            round: args.round,
            text,
          }),
        );
      }
    }
    await Promise.all([...voteInserts, ...begrunnelseInserts]);

    return { dummyCount: dummies.length, inserted };
  },
});
