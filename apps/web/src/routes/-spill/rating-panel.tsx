import { cn } from "@workspace/ui/lib/utils";

const RATING_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
];

export function RatingPanel({
  ratingSent,
  onRate,
}: {
  ratingSent: boolean;
  onRate: (rating: number) => Promise<void>;
}) {
  if (ratingSent) {
    return (
      <div className="rounded-xl bg-primary/10 px-6 py-3">
        <p className="text-sm font-bold text-primary">Takk!</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onRate(n)}
          className={cn(
            "rounded-xl px-5 py-3 text-lg font-bold text-white transition-all active:scale-95",
            RATING_COLORS[n - 1],
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
