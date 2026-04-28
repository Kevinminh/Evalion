"use client";

export type ViewMode = "ipad" | "phone";

type ViewToggleProps = {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
  phoneDisabled: boolean;
};

const baseBtn =
  "font-[inherit] uppercase tracking-[0.5px] whitespace-nowrap rounded-xl border-0 px-3 py-2 text-[13px] font-extrabold transition-colors sm:px-5 sm:text-[15px] md:text-[16px]";

export function ViewToggle({ value, onChange, phoneDisabled }: ViewToggleProps) {
  return (
    <div className="inline-flex gap-0 rounded-2xl bg-[#E5DDD5] p-[3px]">
      <button
        type="button"
        onClick={() => onChange("ipad")}
        className={
          baseBtn +
          (value === "ipad"
            ? " bg-[#1C1A17] text-white shadow-[0_2px_6px_rgba(28,26,23,0.3)] cursor-default"
            : " bg-white text-[#5A4A3F] hover:bg-[#EDE8E0]")
        }
        aria-pressed={value === "ipad"}
      >
        Elevvisning (iPad)
      </button>
      <button
        type="button"
        onClick={() => {
          if (phoneDisabled) return;
          onChange("phone");
        }}
        disabled={phoneDisabled}
        className={
          baseBtn +
          (value === "phone"
            ? " bg-[#1C1A17] text-white shadow-[0_2px_6px_rgba(28,26,23,0.3)] cursor-default"
            : " bg-white text-[#5A4A3F] hover:bg-[#EDE8E0]") +
          (phoneDisabled && value !== "phone"
            ? " opacity-40 cursor-not-allowed hover:bg-white"
            : "")
        }
        aria-pressed={value === "phone"}
      >
        Live-statistikk for lærer
      </button>
    </div>
  );
}
