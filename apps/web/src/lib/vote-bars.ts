import type { Doc } from "@workspace/backend/convex/_generated/dataModel";

export interface VoteBar {
  label: string;
  value: number;
  color: string;
}

export function buildVoteBars(votes: Doc<"sessionVotes">[]): VoteBar[] {
  const counts = { sant: 0, usant: 0, delvis: 0 };
  for (const v of votes) counts[v.vote]++;
  return [
    { label: "Sant", value: counts.sant, color: "bg-sant" },
    { label: "Usant", value: counts.usant, color: "bg-usant" },
    { label: "Delvis", value: counts.delvis, color: "bg-delvis" },
  ];
}
