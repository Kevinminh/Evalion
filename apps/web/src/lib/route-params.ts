import type { TableNames } from "@workspace/backend/convex/_generated/dataModel";
import { isValidConvexId } from "@workspace/evalion/lib/convex-id";
import { notFound } from "@tanstack/react-router";

import type { Id } from "@/lib/convex";

// Convex Id<T> is a branded string type. The single sanctioned cast in this
// file keeps every other callsite in apps/web free of `as` assertions.
function asConvexId<T extends TableNames>(raw: string): Id<T> {
  // oxlint-disable-next-line typescript/consistent-type-assertions
  return raw as Id<T>;
}

export function parseConvexId<T extends TableNames>(raw: string | undefined): Id<T> {
  if (!isValidConvexId(raw)) {
    throw notFound();
  }
  return asConvexId<T>(raw);
}

export function parseSessionId(raw: string | undefined): Id<"liveSessions"> {
  return parseConvexId<"liveSessions">(raw);
}

export function parseStudentId(raw: string | undefined): Id<"sessionStudents"> {
  return parseConvexId<"sessionStudents">(raw);
}

// Placeholder Id used to satisfy convexQuery's typed args when paired with
// `enabled: false`. The queryFn never runs, so this value is never sent.
export function placeholderConvexId<T extends TableNames>(): Id<T> {
  return asConvexId<T>("placeholder");
}
