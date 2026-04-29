"use client";

export type ViewMode = "tv" | "ipad" | "phone";

type ViewToggleProps = {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
  phoneDisabled: boolean;
  /** When true, render a 3-way toggle including TV (Lærervisning). Used by the
   *  standalone mobile layout where only one device is visible at a time. */
  showTv?: boolean;
  /** Extra classes for the outer wrapper. */
  className?: string;
};

const baseBtn =
  "font-[inherit] uppercase tracking-[0.5px] whitespace-nowrap rounded-xl border-0 px-3 py-2 text-[11px] font-extrabold transition-colors sm:px-4 sm:text-[13px] md:text-[15px]";

const activeCls =
  " bg-[#1C1A17] text-white shadow-[0_2px_6px_rgba(28,26,23,0.3)] cursor-default";
const inactiveCls = " bg-white text-[#5A4A3F] hover:bg-[#EDE8E0]";

export function ViewToggle({
  value,
  onChange,
  phoneDisabled,
  showTv = false,
  className = "",
}: ViewToggleProps) {
  // When the toggle does not show TV, treat a "tv" value as "ipad" for display.
  const displayValue: "ipad" | "phone" =
    value === "phone" ? "phone" : "ipad";

  return (
    <div
      className={
        "inline-flex max-w-full gap-0 overflow-hidden rounded-2xl bg-[#E5DDD5] p-[3px] " +
        className
      }
      role="tablist"
      aria-label="Bytt enhetsvisning"
    >
      {showTv ? (
        <button
          type="button"
          role="tab"
          onClick={() => onChange("tv")}
          aria-selected={value === "tv"}
          className={baseBtn + (value === "tv" ? activeCls : inactiveCls)}
        >
          Lærer (TV)
        </button>
      ) : null}
      <button
        type="button"
        role="tab"
        onClick={() => onChange("ipad")}
        aria-selected={!showTv ? displayValue === "ipad" : value === "ipad"}
        className={
          baseBtn +
          ((!showTv ? displayValue === "ipad" : value === "ipad")
            ? activeCls
            : inactiveCls)
        }
      >
        {showTv ? "Elev (iPad)" : "Elevvisning (iPad)"}
      </button>
      <button
        type="button"
        role="tab"
        onClick={() => {
          if (phoneDisabled) return;
          onChange("phone");
        }}
        disabled={phoneDisabled}
        aria-selected={value === "phone"}
        className={
          baseBtn +
          (value === "phone" ? activeCls : inactiveCls) +
          (phoneDisabled && value !== "phone"
            ? " cursor-not-allowed opacity-40 hover:bg-white"
            : "")
        }
      >
        {showTv ? "Statistikk" : "Live-statistikk for lærer"}
      </button>
    </div>
  );
}
