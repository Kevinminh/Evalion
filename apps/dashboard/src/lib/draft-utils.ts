import type { FagPratDraft } from "@/lib/types";

export function parseDraftJson(json: string): FagPratDraft | null {
  try {
    return json ? (JSON.parse(json) as FagPratDraft) : null;
  } catch {
    return null;
  }
}
