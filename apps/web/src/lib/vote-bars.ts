import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import type { Fasit } from "@workspace/evalion/lib/types";

export interface VoteBar {
  label: string;
  value: number;
  color: string;
  key: Fasit;
}

export function buildVoteBars(votes: Doc<"sessionVotes">[]): VoteBar[] {
  const counts: Record<Fasit, number> = { sant: 0, usant: 0, delvis: 0 };
  for (const v of votes) counts[v.vote]++;
  return [
    { label: "Sant", value: counts.sant, color: "bg-sant", key: "sant" },
    { label: "Delvis sant", value: counts.delvis, color: "bg-delvis", key: "delvis" },
    { label: "Usant", value: counts.usant, color: "bg-usant", key: "usant" },
  ];
}
