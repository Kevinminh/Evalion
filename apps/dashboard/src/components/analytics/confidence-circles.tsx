// Class strings declared inline (not imported from packages/evalion constants)
// so Tailwind sees the literal color utilities and generates the corresponding
// CSS rules. See memory: packages/evalion is not in @source.
const LEVEL_COLORS: Record<number, { border: string; text: string }> = {
  1: { border: "border-red-500", text: "text-red-500" },
  2: { border: "border-orange-500", text: "text-orange-500" },
  3: { border: "border-yellow-500", text: "text-yellow-600" },
  4: { border: "border-green-400", text: "text-green-500" },
  5: { border: "border-green-700", text: "text-green-700" },
};

interface ConfidenceCirclesProps {
  distribution: Array<{ level: number; count: number }>;
}

export function ConfidenceCircles({ distribution }: ConfidenceCirclesProps) {
  return (
    <div className="flex justify-center gap-5">
      {distribution.map((d) => {
        const colors = LEVEL_COLORS[d.level];
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
