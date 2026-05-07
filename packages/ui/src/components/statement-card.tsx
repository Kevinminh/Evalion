import { cn } from "@workspace/ui/lib/utils";
import type { CSSProperties } from "react";

interface StatementColor {
  bg: string;
  /** Optional second gradient stop. Falls back to a light tint of `bg`. */
  bg2?: string;
  border: string;
  text: string;
}

interface StatementCardProps {
  statement: { text: string };
  size?: "sm" | "lg";
  color?: StatementColor;
  /** If true, render bg as a 135° gradient (for the teacher's large card). */
  gradient?: boolean;
  className?: string;
}

export function StatementCard({
  statement,
  size = "sm",
  color,
  gradient,
  className,
}: StatementCardProps) {
  const cardStyle: CSSProperties | undefined = color
    ? {
        background: gradient
          ? `linear-gradient(135deg, ${color.bg}, ${
              color.bg2 ?? `color-mix(in srgb, ${color.bg} 70%, #ffffff)`
            })`
          : color.bg,
        borderColor: color.border,
      }
    : undefined;

  const textStyle: CSSProperties | undefined = color ? { color: color.text } : undefined;

  const isLg = size === "lg";
  const hasColor = !!color;

  return (
    <div
      className={cn(
        "mx-auto flex w-full items-center justify-center rounded-[24px]",
        hasColor ? "border-2" : "border-[1.5px] border-blue-200 bg-blue-50",
        isLg
          ? hasColor
            ? "max-w-[760px] px-10 py-8"
            : "max-w-2xl p-6"
          : "max-w-md p-5",
        className,
      )}
      style={cardStyle}
    >
      <p
        className={cn(
          "text-center font-bold",
          !hasColor && "text-foreground",
          isLg ? (hasColor ? "text-2xl leading-relaxed" : "text-lg") : "text-base",
        )}
        style={textStyle}
      >
        {statement.text}
      </p>
    </div>
  );
}
