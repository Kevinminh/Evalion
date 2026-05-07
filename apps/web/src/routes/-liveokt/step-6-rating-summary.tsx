import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { Professor } from "@workspace/evalion/components/live/professor";
import { RatingChart } from "@workspace/evalion/components/live/rating-chart-live";
import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import type { ReactNode } from "react";

type Statement = Doc<"fagprats">["statements"][number];

interface Step6MainProps {
  statementCard: ReactNode;
  statement: Statement | undefined;
}

export function Step6Main({ statementCard, statement }: Step6MainProps) {
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      {statement && <FasitBadge fasit={statement.fasit} />}
      {statementCard}
      <Professor size="md" text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå." />
    </div>
  );
}

interface Step6PanelProps {
  ratingDistribution: { score: number; count: number }[];
  avgRating: number | undefined;
}

export function Step6Panel({ ratingDistribution, avgRating }: Step6PanelProps) {
  return <RatingChart distribution={ratingDistribution} average={avgRating} />;
}
