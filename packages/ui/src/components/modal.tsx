"use client";

import { cn } from "@workspace/ui/lib/utils";
import { type ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Tailwind classes applied to the centered card. Defaults to a max-width-lg rounded card. */
  className?: string;
  /** Tailwind classes applied to the fullscreen overlay backdrop. */
  overlayClassName?: string;
  /** Disable closing by clicking the backdrop. */
  disableBackdropClose?: boolean;
  /** Disable closing on Escape key. */
  disableEscapeClose?: boolean;
}

/**
 * Lightweight modal: fixed overlay + centered card + ESC and backdrop-click handlers.
 * Renders nothing when `open` is false.
 *
 * For form-style dialogs with focus trapping and accessibility, prefer AlertDialog/Sheet.
 */
export function Modal({
  open,
  onClose,
  children,
  className,
  overlayClassName,
  disableBackdropClose = false,
  disableEscapeClose = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || disableEscapeClose) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, disableEscapeClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
        overlayClassName,
      )}
      onClick={(e) => {
        if (disableBackdropClose) return;
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className={cn("w-full max-w-lg rounded-2xl bg-card p-8 shadow-xl", className)}>
        {children}
      </div>
    </div>
  );
}
