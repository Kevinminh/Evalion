import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

type Variant = "primary" | "sant";

interface PrimaryActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_2px_0_oklch(0.35_0.16_295)] hover:-translate-y-px",
  sant: "bg-sant text-white shadow-[0_3px_0_oklch(0.45_0.14_142)] hover:-translate-y-0.5 hover:shadow-[0_5px_0_oklch(0.45_0.14_142)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.45_0.14_142)]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all";

export function PrimaryActionButton({
  children,
  className,
  variant = "primary",
  fullWidth,
  ...rest
}: PrimaryActionButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(BASE, VARIANTS[variant], fullWidth && "w-full", className)}
    >
      {children}
    </button>
  );
}
