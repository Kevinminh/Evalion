import { useMemo } from "react";

interface RatingAnalytics {
  avgRating: number;
  ratingDistribution: { score: number; count: number }[];
}

export interface RatingStats {
  ratingDistribution: { score: number; count: number }[];
  avgRating: number | undefined;
}

const EMPTY_DISTRIBUTION = [1, 2, 3, 4, 5].map((score) => ({ score, count: 0 }));

export function useRatingStats(analytics: RatingAnalytics | undefined): RatingStats {
  return useMemo(
    () => ({
      ratingDistribution: analytics?.ratingDistribution ?? EMPTY_DISTRIBUTION,
      avgRating: analytics && analytics.avgRating > 0 ? analytics.avgRating : undefined,
    }),
    [analytics],
  );
}
