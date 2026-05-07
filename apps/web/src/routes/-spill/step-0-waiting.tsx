import { Professor } from "@workspace/evalion/components/live/professor";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";

interface Step0WaitingProps {
  statements?: Array<{ text: string; color?: string }>;
}

const CARD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200" },
  red: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
};

const DEFAULT_ORDER = ["blue", "orange", "purple", "yellow"];

export function Step0Waiting({ statements }: Step0WaitingProps) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <Professor size="sm" bounce />
        <div>
          <h2 className="text-lg font-bold text-foreground">Læreren velger en påstand</h2>
          <div className="flex items-center text-muted-foreground">
            Venter
            <WaitingDots />
          </div>
        </div>
      </div>

      {statements && statements.length > 0 && (
        <div className="grid w-full max-w-lg gap-3">
          {statements.map((stmt, i) => {
            const colorKey = stmt.color ?? DEFAULT_ORDER[i % DEFAULT_ORDER.length]!;
            const colors = CARD_COLORS[colorKey] ?? CARD_COLORS.blue!;
            return (
              <div
                key={i}
                className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-4 text-center`}
              >
                <p className={`text-sm font-bold ${colors.text}`}>{stmt.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
