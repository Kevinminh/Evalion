import { cn } from "@workspace/ui/lib/utils";

interface ExplanationCardColor {
  bg: string;
  bg2: string;
  border: string;
  text: string;
}

interface ExplanationCardProps {
  statementText: string;
  explanation: string | null | undefined;
  /** Statement-color palette (from resolveStatementHex). Falls back to a
   * primary-purple gradient when omitted. */
  color?: ExplanationCardColor;
  /** "md" for student/iPad surfaces, "lg" for teacher/TV surfaces. */
  size?: "md" | "lg";
  className?: string;
}

const SIZE = {
  md: { quotePad: "p-5", bodyPad: "p-5", quoteText: "text-base", avatar: "size-16" },
  lg: { quotePad: "p-6", bodyPad: "p-6", quoteText: "text-lg", avatar: "size-20" },
} as const;

export function ExplanationCard({
  statementText,
  explanation,
  color,
  size = "md",
  className,
}: ExplanationCardProps) {
  const s = SIZE[size];
  const quoteStyle = color
    ? {
        background: `linear-gradient(135deg, ${color.bg}, ${color.bg2})`,
        color: color.text,
      }
    : undefined;
  return (
    <div
      style={color ? { borderColor: color.border } : undefined}
      className={cn(
        "w-full overflow-hidden rounded-2xl border-2 shadow-sm",
        !color && "border-primary/20",
        className,
      )}
    >
      <div
        style={quoteStyle}
        className={cn(!color && "bg-gradient-to-br from-primary/10 to-primary/5", s.quotePad)}
      >
        <p className={cn("text-center font-bold", s.quoteText, !color && "text-foreground")}>
          {statementText}
        </p>
      </div>
      <div className={cn("bg-white", s.bodyPad)}>
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "shrink-0 overflow-hidden rounded-full border-[2.5px] border-primary/20 bg-[var(--color-bg-tertiary)]",
              s.avatar,
            )}
          >
            <img src="/professoren.png" alt="Professoren" className="size-full object-cover" />
          </div>
          <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
        </div>
      </div>
    </div>
  );
}
