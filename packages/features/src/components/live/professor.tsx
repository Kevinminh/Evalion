import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

type ProfessorSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface ProfessorProps {
  size?: ProfessorSize;
  text?: ReactNode;
  textSize?: "sm" | "base" | "lg";
  label?: string;
  animate?: boolean;
  bordered?: boolean;
  bounce?: boolean;
  className?: string;
  imgClassName?: string;
}

const sizeClass: Record<ProfessorSize, string> = {
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
  textSize = "lg",
  label,
  animate = true,
  bordered = false,
  bounce = false,
  className,
  imgClassName,
}: ProfessorProps) {
  return (
    <div className={cn("flex w-full justify-center", className)}>
      <div className={cn("flex items-center gap-4", text && "w-full max-w-[640px]")}>
        <div className="flex shrink-0 flex-col items-center gap-2">
          <img
            src="/professoren.png"
            alt="Professoren"
            className={cn(
              "shrink-0 rounded-full object-cover",
              sizeClass[size],
              bordered &&
                "border-[3px] border-[var(--color-primary-200)] bg-[var(--color-bg-tertiary)]",
              bounce && "animate-[gentle-bounce_3s_ease-in-out_infinite]",
              imgClassName,
            )}
          />
          {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
        </div>
        {text && (
          <div className="relative min-w-0 flex-1">
            <div
              className="absolute top-1/2 -left-[10px] size-0 -translate-y-1/2 border-y-[10px] border-r-[10px] border-y-transparent border-r-[var(--color-neutral-0)] [filter:var(--shadow-chevron-soft)]"
            />
            <div
              className={cn(
                "rounded-2xl border-[1.5px] border-[var(--color-divider-soft)] bg-white px-6 py-5 shadow-[var(--shadow-card-soft)]",
                animate && "animate-[fadeInUp_0.5s_ease_0.2s_both]",
              )}
            >
              <p
                className={cn(
                  "text-center font-medium leading-relaxed text-[var(--color-text-ink-strong)]",
                  textSize === "sm" && "text-sm",
                  textSize === "base" && "text-base",
                  textSize === "lg" && "text-xl",
                )}
              >
                {text}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
