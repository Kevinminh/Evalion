import { cn } from "@workspace/ui/lib/utils";

interface ExplanationCardProps {
  statementText: string;
  explanation: string | null | undefined;
  /** "md" for student/iPad surfaces, "lg" for teacher/TV surfaces. */
  size?: "md" | "lg";
  className?: string;
}

const SIZE = {
  md: { quotePad: "p-5", bodyPad: "p-5", quoteText: "text-base", avatar: "size-12" },
  lg: { quotePad: "p-6", bodyPad: "p-6", quoteText: "text-lg", avatar: "size-16" },
} as const;

export function ExplanationCard({
  statementText,
  explanation,
  size = "md",
  className,
}: ExplanationCardProps) {
  const s = SIZE[size];
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-primary/20 shadow-sm",
        className,
      )}
    >
      <div className={cn("bg-gradient-to-br from-primary/10 to-primary/5", s.quotePad)}>
        <p className={cn("text-center font-bold text-foreground", s.quoteText)}>{statementText}</p>
      </div>
      <div className={cn("bg-white", s.bodyPad)}>
        <div className="flex gap-3">
          <div
            className={cn(
              "shrink-0 overflow-hidden rounded-full border-2 border-primary/20",
              s.avatar,
            )}
          >
            <img src="/professoren.png" alt="Professoren" className="size-full object-cover" />
          </div>
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary/70">
              Forklaring
            </div>
            <p className="text-sm leading-relaxed text-foreground/85">{explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
