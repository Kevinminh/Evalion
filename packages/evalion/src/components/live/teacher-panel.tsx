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
}

export function TeacherPanel({
  children,
  defaultOpen = true,
  footer,
  onOpenChange,
  attentionWhenClosed = false,
}: TeacherPanelProps) {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT) return false;
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
  const desktopToggleStyle: CSSProperties = {
    position: "fixed",
    right: open ? PANEL_WIDTH_PX : 0,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 30,
    width: shouldPulse ? 42 : 28,
    height: shouldPulse ? 80 : 64,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    border: "1.5px solid",
    borderColor: shouldPulse ? "var(--color-purple-500)" : "var(--color-divider-soft)",
    borderRight: "none",
    background: shouldPulse ? "var(--color-purple-500)" : "var(--color-bg-tertiary)",
    color: shouldPulse ? "#fff" : "var(--color-purple-500)",
    transition:
      "right 0.35s ease, width 0.2s ease, height 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    boxShadow: shouldPulse ? "var(--shadow-panel-pulse)" : "var(--shadow-panel-rest)",
    animation: shouldPulse ? "panel-tab-attention 2.4s ease-in-out infinite" : undefined,
  };

  const backdropStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 10,
    background: "var(--color-overlay-dark)",
  };

  const panelStyle: CSSProperties = {
    position: "fixed",
    right: 0,
    top: TOPBAR_HEIGHT_PX,
    bottom: STEPNAV_HEIGHT_PX,
    zIndex: 20,
    width: open ? (isMobile ? "85vw" : PANEL_WIDTH_PX) : 0,
    maxWidth: PANEL_WIDTH_PX,
    background: "var(--color-bg-tertiary)",
    borderLeft: "1.5px solid var(--color-divider-soft)",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    overflow: "hidden",
    transition: "width 0.35s ease, opacity 0.25s ease",
    display: "flex",
    flexDirection: "column",
  };

  const Icon = open ? ChevronRight : ChevronLeft;

  return (
    <>
      {/* Desktop toggle */}
      <button
        onClick={toggle}
        aria-label={open ? "Skjul panel" : "Vis panel"}
        title="Skjul/vis lærerpanel"
        className={cn("hidden md:inline-flex")}
        style={desktopToggleStyle}
      >
        <Icon
          className={shouldPulse ? "size-5" : "size-4"}
          strokeWidth={2.5}
        />
      </button>
      {/* Backdrop on mobile when open */}
      {isMobile && open && (
        <div className={cn("md:hidden")} style={backdropStyle} onClick={toggle} />
      )}
      <div style={panelStyle}>
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 px-4 py-4">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t-[1.5px] border-[var(--color-divider-soft)] p-4">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
