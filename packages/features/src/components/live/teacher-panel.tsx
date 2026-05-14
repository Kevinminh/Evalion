import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

const STORAGE_KEY = "fagprat-panel-collapsed";
const MD_BREAKPOINT = 768;
const PANEL_WIDTH_PX = 340;
const TOPBAR_HEIGHT_PX = 80;
const STEPNAV_HEIGHT_PX = 100;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT,
  );

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
  /** Pulse the toggle when the panel is closed to hint that a panel exists. */
  attentionWhenClosed?: boolean;
  /** When this flips from false to true, the panel auto-collapses (matches the
   * mockup behavior on steg 1/3 where starting the timer focuses the main
   * area). The teacher can re-open the panel manually. */
  forceCollapse?: boolean;
  /** Transition-keyed push of a desired open/closed state. Whenever `key`
   * changes, the panel applies `open` if it differs from the current state.
   * Used to auto-flip the panel on step transitions. */
  forceState?: { open: boolean; key: number | string };
}

export function TeacherPanel({
  children,
  defaultOpen = true,
  footer,
  onOpenChange,
  attentionWhenClosed = false,
  forceCollapse = false,
  forceState,
}: TeacherPanelProps) {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT) return false;
    if (forceState) return forceState.open;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored !== "true";
    return defaultOpen;
  });

  useEffect(() => {
    onOpenChange?.(open);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
      onOpenChange?.(false);
    }
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (forceCollapse && open) {
      setOpen(false);
      onOpenChange?.(false);
      if (!isMobile) localStorage.setItem(STORAGE_KEY, "true");
    }
  }, [forceCollapse]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!forceState) return;
    if (forceState.open === open) return;
    setOpen(forceState.open);
    onOpenChange?.(forceState.open);
    if (!isMobile) localStorage.setItem(STORAGE_KEY, forceState.open ? "false" : "true");
  }, [forceState?.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
    if (!isMobile) {
      localStorage.setItem(STORAGE_KEY, next ? "false" : "true");
    }
  };

  const shouldPulse = !open && attentionWhenClosed;

  // Toggle dimensions: default 28×64; pulses to 42×80 when attention-flipped
  // (matches `.panel-toggle.flipped` styling in the demo HTML).
  // State-driven dimensions/transitions stay inline; static layout uses Tailwind.
  const desktopToggleStyle: CSSProperties = {
    right: open ? PANEL_WIDTH_PX : 0,
    width: shouldPulse ? 42 : 28,
    height: shouldPulse ? 80 : 64,
    transition:
      "right 0.35s ease, width 0.2s ease, height 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
    boxShadow: shouldPulse ? "var(--shadow-panel-pulse)" : "var(--shadow-panel-rest)",
    animation: shouldPulse ? "panel-tab-attention 2.4s ease-in-out infinite" : undefined,
  };

  const panelStyle: CSSProperties = {
    top: TOPBAR_HEIGHT_PX,
    bottom: STEPNAV_HEIGHT_PX,
    width: open ? (isMobile ? "85vw" : PANEL_WIDTH_PX) : 0,
    maxWidth: PANEL_WIDTH_PX,
    transition: "width 0.35s ease, opacity 0.25s ease",
  };

  const Icon = open ? ChevronRight : ChevronLeft;

  return (
    <>
      {/* Desktop toggle */}
      <button
        onClick={toggle}
        aria-label={open ? "Skjul panel" : "Vis panel"}
        title="Skjul/vis lærerpanel"
        className={cn(
          "fixed top-1/2 z-30 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-[14px] border-[1.5px] border-r-0 p-0 md:inline-flex",
          shouldPulse
            ? "border-[var(--color-purple-500)] bg-[var(--color-purple-500)] text-[var(--color-neutral-0)]"
            : "border-[var(--color-divider-soft)] bg-[var(--color-neutral-50)] text-[var(--color-purple-500)]",
        )}
        style={desktopToggleStyle}
      >
        <Icon className={shouldPulse ? "size-5" : "size-4"} strokeWidth={2.5} />
      </button>
      {/* Backdrop on mobile when open */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-10 bg-[var(--color-overlay-dark)] md:hidden"
          onClick={toggle}
        />
      )}
      <div
        className={cn(
          "fixed right-0 z-20 flex flex-col overflow-hidden border-l-[1.5px] border-[var(--color-divider-soft)] bg-[var(--color-neutral-50)]",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={panelStyle}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-4">{children}</div>
        {footer && (
          <div className="shrink-0 border-t-[1.5px] border-[var(--color-divider-soft)] p-4">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
