import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

type ProfessorSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface ProfessorProps {
  size?: ProfessorSize;
  text?: ReactNode;
  textSize?: "sm" | "base";
  label?: string;
  animate?: boolean;
  bordered?: boolean;
  bounce?: boolean;
  className?: string;
}

const sizeConfig: Record<ProfessorSize, string> = {
  xs: "size-12",
  sm: "size-20",
  md: "size-24",
  lg: "size-28",
  xl: "size-32",
  "2xl": "size-[220px]",
};

export function Professor({
  size = "md",
  text,
  textSize = "base",
  label,
  animate = true,
  bordered = false,
  bounce = false,
  className,
}: ProfessorProps) {
  const container = sizeConfig[size];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <img
          src="/professoren.png"
          alt="Professoren"
          className={cn(
            "rounded-full object-cover",
            container,
            bordered && "border-[3px] border-primary/20",
            bounce && "animate-[gentle-bounce_3s_ease-in-out_infinite]",
          )}
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
            <p
              className={cn(
                "font-medium italic text-foreground/80",
                textSize === "sm" ? "text-sm" : "text-base",
              )}
            >
              {text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
