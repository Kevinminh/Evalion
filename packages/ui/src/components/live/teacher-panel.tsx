import { cn } from "@workspace/ui/lib/utils";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "fagprat-panel-collapsed";
const MD_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

interface TeacherPanelProps {
  children: ReactNode;
  defaultOpen?: boolean;
  footer?: ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function TeacherPanel({ children, defaultOpen = true, footer, onOpenChange }: TeacherPanelProps) {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(() => {
    // Always start collapsed on mobile
    if (typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT) return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored !== "true";
    return defaultOpen;
  });

  // Notify parent of initial state
  useEffect(() => {
    onOpenChange?.(open);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-collapse when resizing down to mobile
  useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
      onOpenChange?.(false);
    }
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
    if (!isMobile) {
      localStorage.setItem(STORAGE_KEY, next ? "false" : "true");
    }
  };

  return (
    <>
      {/* Desktop toggle button */}
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
      {/* Backdrop overlay on mobile when panel is open */}
      {isMobile && open && (
        <div className="fixed inset-0 z-10 bg-black/40 md:hidden" onClick={toggle} />
      )}
      <div
        className={cn(
          "fixed right-0 top-16 bottom-14 z-20 flex w-[85vw] max-w-[340px] flex-col border-l bg-card transition-transform duration-300 md:w-[340px]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
        {footer && <div className="shrink-0 border-t border-border p-3 sm:p-4">{footer}</div>}
      </div>
    </>
  );
}
