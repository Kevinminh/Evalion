import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

interface ProfessorProps {
  size?: "xs" | "sm" | "lg";
  text?: ReactNode;
  label?: string;
  animate?: boolean;
  className?: string;
}

const sizeConfig = {
  xs: "size-12",
  sm: "size-24",
  lg: "size-[220px]",
};

export function Professor({
  size = "sm",
  text,
  label,
  animate = true,
  className,
}: ProfessorProps) {
  const container = sizeConfig[size];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <img
          src="/professoren.png"
          alt="Professoren"
          className={cn("rounded-full object-cover", container)}
        />
        {label && (
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        )}
      </div>
      {text && (
        <div className="relative flex items-center">
          <div
            className="absolute -left-2 size-0 border-8 border-transparent border-r-white"
            style={{ filter: "drop-shadow(-1px 0 0 var(--border))" }}
          />
          <div
            className={cn(
              "rounded-2xl border border-border bg-white px-5 py-4",
              animate && "animate-[fadeInUp_0.5s_ease_0.2s_both]",
            )}
          >
            <p className="text-base font-medium italic text-foreground/80">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
