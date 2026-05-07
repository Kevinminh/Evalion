import { cn } from "@workspace/ui/lib/utils";
import { Quote } from "lucide-react";

interface BegrunnelseCardProps {
  text: string;
  studentName?: string;
  highlighted?: boolean;
  className?: string;
}

export function BegrunnelseCard({
  text,
  studentName,
  highlighted = false,
  className,
}: BegrunnelseCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-5 transition-shadow duration-300",
        highlighted
          ? "border-primary/40 bg-primary/8 shadow-[0_0_0_3px_rgba(108,63,197,0.18),_0_8px_24px_rgba(108,63,197,0.18)]"
          : "border-primary/15 bg-primary/[0.04] shadow-sm",
        className,
      )}
    >
      <Quote
        aria-hidden
        className="absolute right-4 top-3 size-5 text-primary/30"
        strokeWidth={1.5}
      />
      <p className="pr-6 text-sm leading-relaxed text-foreground/85">{text}</p>
      {studentName && (
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          — {studentName}
        </p>
      )}
    </div>
  );
}
