import { LEVEL_CIRCLE_COLORS } from "@workspace/evalion/lib/constants";

interface ConfidenceCirclesProps {
  distribution: Array<{ level: number; count: number }>;
}

export function ConfidenceCircles({ distribution }: ConfidenceCirclesProps) {
  return (
    <div className="flex justify-center gap-5">
      {distribution.map((d) => {
        const colors = LEVEL_CIRCLE_COLORS[d.level];
        return (
          <div key={d.level} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex size-[30px] items-center justify-center rounded-full border-[2.5px] text-[11px] font-extrabold ${colors?.border ?? "border-neutral-300"} ${colors?.text ?? "text-neutral-500"}`}
            >
              {d.level}
            </div>
            <span className="text-sm font-extrabold text-foreground">{d.count} stk</span>
          </div>
        );
      })}
    </div>
  );
}
