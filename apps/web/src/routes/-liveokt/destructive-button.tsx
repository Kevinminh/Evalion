import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

interface DestructiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const BASE =
  "inline-flex items-center gap-2 rounded-xl bg-destructive px-5 py-2 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.45_0.15_25)] transition-all hover:-translate-y-px hover:shadow-[0_4px_0_oklch(0.45_0.15_25)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.45_0.15_25)]";

export function DestructiveButton({ children, className, ...rest }: DestructiveButtonProps) {
  return (
    <button type="button" {...rest} className={cn(BASE, className)}>
      {children}
    </button>
  );
}
