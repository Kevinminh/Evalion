/**
 * Loose format check for a Convex document ID string.
 *
 * Convex IDs are URL-safe base32-ish strings (~32 chars). We don't try to
 * replicate Convex's internal format — the goal is just to catch obviously
 * tampered URLs (empty strings, slashes, non-alphanumeric characters) so we
 * can show a friendly 404 instead of letting Convex reject the query.
 */
export function isValidConvexId(id: string | undefined | null): id is string {
  return typeof id === "string" && /^[a-z0-9]{10,}$/i.test(id);
}
