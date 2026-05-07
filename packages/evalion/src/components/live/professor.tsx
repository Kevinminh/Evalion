import { cn } from "@workspace/ui/lib/utils";
import type { CSSProperties, ReactNode } from "react";

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
  imgClassName?: string;
}

const sizePx: Record<ProfessorSize, number> = {
  xs: 48,
  sm: 80,
  md: 96,
  lg: 112,
  xl: 128,
  "2xl": 220,
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
  imgClassName,
}: ProfessorProps) {
  const px = sizePx[size];
  const imgStyle: CSSProperties = {
    width: px,
    height: px,
    flexShrink: 0,
    ...(bordered
      ? {
          borderWidth: 3,
          borderStyle: "solid",
          borderColor: "color-mix(in srgb, var(--primary) 20%, transparent)",
        }
      : {}),
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <img
          src="/professoren.png"
          alt="Professoren"
          className={cn(
            "rounded-full object-cover",
            bounce && "animate-[gentle-bounce_3s_ease-in-out_infinite]",
            imgClassName,
          )}
          style={imgStyle}
        />
        {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
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
