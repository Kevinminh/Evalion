import { cn } from "@workspace/ui/lib/utils";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

const STORAGE_KEY = "fagprat-panel-collapsed";
const MD_BREAKPOINT = 768;
const PANEL_WIDTH_PX = 340;
const TOPBAR_HEIGHT_PX = 64; // matches sm:h-16 on SessionTopBar
const STEPNAV_HEIGHT_PX = 56; // matches the bottom step nav

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
}

export function TeacherPanel({
  children,
  defaultOpen = true,
  footer,
  onOpenChange,
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

  const desktopToggleStyle: CSSProperties = {
    position: "fixed",
    right: open ? PANEL_WIDTH_PX : 0,
    top: "5rem",
    zIndex: 30,
    padding: "0.5rem",
    background: "var(--card)",
    border: "1.5px solid var(--border)",
    borderRight: "none",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    color: "var(--muted-foreground)",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
    transition: "right 0.3s ease, background 0.2s ease",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const mobileToggleStyle: CSSProperties = {
    position: "fixed",
    right: "0.75rem",
    bottom: "4rem",
    zIndex: 30,
    width: 40,
    height: 40,
    borderRadius: 9999,
    background: "var(--card)",
    border: "1px solid var(--border)",
    color: "var(--muted-foreground)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const backdropStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 10,
    background: "rgba(0,0,0,0.4)",
  };

  const panelStyle: CSSProperties = {
    position: "fixed",
    right: 0,
    top: TOPBAR_HEIGHT_PX,
    bottom: STEPNAV_HEIGHT_PX,
    zIndex: 20,
    width: isMobile ? "85vw" : PANEL_WIDTH_PX,
    maxWidth: PANEL_WIDTH_PX,
    background: "var(--card)",
    borderLeft: "1px solid var(--border)",
    transform: open ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      {/* Desktop toggle */}
      <button
        onClick={toggle}
        aria-label={open ? "Skjul panel" : "Vis panel"}
        className={cn("hidden md:inline-flex")}
        style={desktopToggleStyle}
      >
        {open ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
      </button>
      {/* Mobile toggle */}
      <button
        onClick={toggle}
        aria-label={open ? "Skjul panel" : "Vis panel"}
        className={cn("md:hidden")}
        style={mobileToggleStyle}
      >
        {open ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
      </button>
      {/* Backdrop on mobile when open */}
      {isMobile && open && (
        <div className={cn("md:hidden")} style={backdropStyle} onClick={toggle} />
      )}
      <div style={panelStyle}>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
        {footer && <div className="shrink-0 border-t border-border p-3 sm:p-4">{footer}</div>}
      </div>
    </>
  );
}
