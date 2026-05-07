import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { Professor } from "@workspace/evalion/components/live/professor";
import { RatingChart } from "@workspace/evalion/components/live/rating-chart-live";
import { StatementCard } from "@workspace/ui/components/statement-card";

import { useTeacherSession } from "./teacher-session-context";

export function Step6Main() {
  const { statement } = useTeacherSession();
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      {statement && <FasitBadge fasit={statement.fasit} />}
      {statement && <StatementCard statement={statement} size="lg" />}
      <Professor size="md" text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå." />
    </div>
  );
}

export function Step6Panel() {
  const { ratingDistribution, avgRating } = useTeacherSession();
  return <RatingChart distribution={ratingDistribution} average={avgRating} />;
}
