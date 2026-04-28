"use client";

import type { Fasit, GeneratedStatement } from "./types";

const STRIP_HEADER: Record<Fasit, string> = {
  sant: "border-b-[3px] border-[#4caf50] bg-[#c8e6c9] text-[#1b5e20]",
  usant: "border-b-[3px] border-[#e53935] bg-[#ffcdd2] text-[#b71c1c]",
  delvis: "border-b-[3px] border-[#fb8c00] bg-[#ffe0b2] text-[#b04a00]",
};

const STRIP_SELECTED: Record<Fasit, string> = {
  sant: "border-sant bg-neutral-0 shadow-[0_0_0_2px_#c8e6c9]",
  usant: "border-usant bg-neutral-0 shadow-[0_0_0_2px_#ffcdd2]",
  delvis: "border-delvis bg-neutral-0 shadow-[0_0_0_2px_#ffe0b2]",
};

type Props = {
  kind: Fasit;
  label: string;
  items: GeneratedStatement[];
  selected: Set<string>;
  onToggle: (id: string) => void;
};

export function CategoryStrip({ kind, label, items, selected, onToggle }: Props) {
  return (
    <div className="overflow-hidden rounded-[var(--workspace-radius-2xl)] border-[1.5px] border-neutral-200 bg-neutral-0 shadow-[var(--shadow-sm)]">
      <div
        className={`flex items-center justify-center px-6 py-3.5 text-[15px] font-extrabold tracking-[0.01em] ${STRIP_HEADER[kind]}`}
      >
        {label}
      </div>
      <div className="flex flex-col gap-3 p-3.5">
        {items.map((item) => {
          const isSelected = selected.has(item.id);
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onToggle(item.id)}
              title={item.explanation}
              className={
                "select-none cursor-pointer rounded-[var(--workspace-radius-xl)] border-[1.5px] px-4 py-3.5 text-left font-[var(--font-family-body)] text-sm leading-relaxed text-ink transition-all duration-150 " +
                (isSelected
                  ? STRIP_SELECTED[kind]
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100")
              }
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
