"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";

export type Fasit = "sant" | "usant" | "delvis";

export type Card = {
  clientId: string;
  text: string;
  fasit?: Fasit;
  forklaring: string;
};

const FASIT_OPTIONS: { value: Fasit; label: string }[] = [
  { value: "sant", label: "Sant" },
  { value: "delvis", label: "Delvis sant" },
  { value: "usant", label: "Usant" },
];

const FASIT_SELECTED_CLASSES: Record<Fasit, string> = {
  sant: "border-sant bg-sant-bg text-[#2e7d32]",
  usant: "border-usant bg-usant-bg text-[#c62828]",
  delvis: "border-delvis bg-delvis-bg text-[#e65100]",
};

const fieldTextarea =
  "w-full min-h-0 flex-1 resize-none overflow-hidden rounded-xl border-[1.5px] border-neutral-200 bg-neutral-50 px-3.5 py-[11px] text-[14.5px] leading-[1.4] text-ink outline-none transition-[border-color,box-shadow] duration-150 focus:border-purple-400 focus:shadow-[0_0_0_4px_var(--color-purple-100)]";

const toolBtn =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-1.5 text-ink-tertiary transition-colors duration-150";

function autoGrow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export function PastandCard({
  card,
  index,
  total,
  onChange,
  onDelete,
  onReorder,
}: {
  card: Card;
  index: number;
  total: number;
  onChange: (patch: Partial<Card>) => void;
  onDelete: () => void;
  onReorder: (toIndex: number) => void;
}) {
  const [reorderOpen, setReorderOpen] = useState(false);
  const reorderRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const forklaringRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    autoGrow(textRef.current);
  }, [card.text]);
  useEffect(() => {
    autoGrow(forklaringRef.current);
  }, [card.forklaring]);

  useEffect(() => {
    if (!reorderOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!reorderRef.current) return;
      if (!reorderRef.current.contains(e.target as Node)) setReorderOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setReorderOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [reorderOpen]);

  return (
    <article
      className="rounded-[18px] border-[1.5px] border-neutral-200 bg-white px-5 pt-3.5 pb-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
      data-clientid={card.clientId}
    >
      <div className="mb-3 flex items-center gap-1.5">
        <span className="mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-purple-500 text-[13px] font-extrabold text-white">
          {index + 1}
        </span>
        <div className="relative ml-auto" ref={reorderRef}>
          <button
            type="button"
            className={cn(toolBtn, "hover:bg-neutral-100 hover:text-ink-secondary")}
            title="Endre rekkefølge"
            aria-label="Endre rekkefølge"
            onClick={(e) => {
              e.stopPropagation();
              setReorderOpen((v) => !v);
            }}
          >
            <svg
              className="size-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="7 10 12 5 17 10" />
              <polyline points="7 14 12 19 17 14" />
            </svg>
          </button>
          {reorderOpen && (
            <div className="absolute top-[calc(100%+6px)] right-0 z-50 max-h-[260px] min-w-[150px] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <div className="px-2.5 pt-1.5 pb-1 text-[11px] font-extrabold tracking-[0.05em] text-ink-tertiary uppercase">
                Flytt til
              </div>
              {Array.from({ length: total }).map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={cn(
                    "block w-full cursor-pointer rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[13.5px] text-ink transition-colors duration-150",
                    i === index
                      ? "cursor-default bg-purple-100 font-bold text-purple-700 hover:bg-purple-100"
                      : "hover:bg-purple-50",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (i !== index) {
                      onReorder(i);
                    }
                    setReorderOpen(false);
                  }}
                  disabled={i === index}
                >
                  Posisjon {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className={cn(toolBtn, "hover:bg-[#ffebee] hover:text-[#ef5350]")}
          title="Slett påstand"
          aria-label="Slett påstand"
          onClick={onDelete}
        >
          <svg
            className="size-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      <div className="mb-3">
        <label className="mb-[3px] block text-[12px] font-bold text-ink">Påstand</label>
        <textarea
          ref={textRef}
          className={fieldTextarea}
          rows={1}
          placeholder="Skriv en påstand…"
          value={card.text}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="mb-[3px] block text-[12px] font-bold text-ink">Fasit</label>
        <div className="flex flex-wrap gap-2 max-[560px]:w-full">
          {FASIT_OPTIONS.map((opt) => {
            const selected = card.fasit === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                className={cn(
                  "cursor-pointer rounded-full border-2 px-4 py-[7px] text-[13.5px] font-bold transition-all duration-150 max-[560px]:flex-1 max-[560px]:text-center",
                  selected
                    ? FASIT_SELECTED_CLASSES[opt.value]
                    : "border-neutral-300 bg-white text-ink-secondary hover:border-neutral-400",
                )}
                onClick={() =>
                  onChange({ fasit: selected ? undefined : opt.value })
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-[3px] block text-[12px] font-bold text-ink">Forklaring</label>
        <textarea
          ref={forklaringRef}
          className={fieldTextarea}
          rows={1}
          placeholder="Forklar hvorfor svaret er riktig…"
          value={card.forklaring}
          onChange={(e) => onChange({ forklaring: e.target.value })}
        />
      </div>
    </article>
  );
}
