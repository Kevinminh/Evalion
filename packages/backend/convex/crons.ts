import { type FunctionArgs, cronJobs } from "convex/server";

import { components, internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

// Better Auth's `session` and `verification` tables index `expiresAt` but
// don't self-evict — without this job, rows would accumulate forever.
crons.daily(
  "purge-expired-auth-rows",
  { hourUTC: 3, minuteUTC: 0 },
  internal.crons.purgeExpiredAuthRows,
);

export default crons;

type DeleteManyArgs = FunctionArgs<typeof components.betterAuth.adapter.deleteMany>;

export const purgeExpiredAuthRows = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    // The component paginates deletions to bound a single transaction. We
    // page through until no cursor comes back.
    const paginationOpts = { cursor: null, numItems: 256 };
    const sessionArgs: DeleteManyArgs = {
      input: {
        model: "session",
        where: [{ field: "expiresAt", operator: "lt", value: now }],
      },
      paginationOpts,
    };
    const verificationArgs: DeleteManyArgs = {
      input: {
        model: "verification",
        where: [{ field: "expiresAt", operator: "lt", value: now }],
      },
      paginationOpts,
    };
    await ctx.runMutation(components.betterAuth.adapter.deleteMany, sessionArgs);
    await ctx.runMutation(components.betterAuth.adapter.deleteMany, verificationArgs);
  },
});
