import type { FagPratDraft } from "@workspace/ui/lib/types";

/**
 * Safely parse a FagPrat draft from a JSON string.
 * Returns null if the JSON is empty, malformed, or doesn't match the
 * expected shape (statements must be an array if present).
 */
export function parseDraftJson(json: string | undefined | null): FagPratDraft | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object") return null;
    const draft = parsed as Partial<FagPratDraft>;
    if (draft.statements !== undefined && !Array.isArray(draft.statements)) {
      return null;
    }
    return parsed as FagPratDraft;
  } catch {
    return null;
  }
}
