import { cn } from "@workspace/ui/lib/utils";
import type { CSSProperties, ReactNode } from "react";

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
  textSize = "lg",
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
    backgroundColor: bordered ? "var(--color-bg-tertiary)" : undefined,
    ...(bordered
      ? {
          borderWidth: 3,
          borderStyle: "solid",
          borderColor: "var(--color-primary-200)",
        }
      : {}),
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[640px] items-center gap-4",
        className,
      )}
    >
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
        <div className="relative flex flex-1 items-center">
          <div
            className="absolute -left-[10px] size-0 border-y-[10px] border-r-[10px] border-y-transparent border-r-white"
            style={{ filter: "drop-shadow(-2px 0 1px rgba(0,0,0,0.04))" }}
          />
          <div
            className={cn(
              "flex-1 rounded-[24px] border-[1.5px] border-[#EEEEEE] bg-white px-6 py-5 shadow-[0_4px_6px_rgba(0,0,0,0.07),0_2px_4px_rgba(0,0,0,0.04)]",
              animate && "animate-[fadeInUp_0.5s_ease_0.2s_both]",
            )}
          >
            <p
              className={cn(
                "text-center font-medium leading-relaxed text-[#212121]",
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
  );
}
