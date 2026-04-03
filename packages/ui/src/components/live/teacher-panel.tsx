import { cn } from "@workspace/ui/lib/utils";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "fagprat-panel-collapsed";

interface TeacherPanelProps {
  children: ReactNode;
  defaultOpen?: boolean;
  footer?: ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function TeacherPanel({ children, defaultOpen = true, footer, onOpenChange }: TeacherPanelProps) {
  const [open, setOpen] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored !== "true";
    return defaultOpen;
  });

  // Notify parent of initial state
  useEffect(() => {
    onOpenChange?.(open);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
    localStorage.setItem(STORAGE_KEY, next ? "false" : "true");
  };

  return (
    <>
      <button
        onClick={toggle}
        className="fixed right-0 top-20 z-30 hidden rounded-l-lg border border-r-0 border-border bg-card p-2 text-muted-foreground shadow-sm transition-all hover:bg-muted md:block"
        style={{ right: open ? "340px" : "0px" }}
      >
        {open ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
      </button>
      {/* Mobile toggle button */}
      <button
        onClick={toggle}
        className="fixed right-3 bottom-16 z-30 flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-md md:hidden"
      >
        {open ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
      </button>
      <div
        className={cn(
          "fixed right-0 top-16 bottom-14 z-20 flex w-full flex-col border-l bg-card transition-transform duration-300 sm:w-[80vw] md:w-[340px]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
        {footer && <div className="shrink-0 border-t border-border p-3 sm:p-4">{footer}</div>}
      </div>
    </>
  );
}
