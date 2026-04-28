"use client";

import { useEffect, useRef, useState } from "react";

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
    <article className="pastand-card" data-clientid={card.clientId}>
      <div className="pastand-card-top">
        <span className="pastand-number">{index + 1}</span>
        <div className="reorder-wrap" ref={reorderRef}>
          <button
            type="button"
            className="tool-btn"
            title="Endre rekkefølge"
            aria-label="Endre rekkefølge"
            onClick={(e) => {
              e.stopPropagation();
              setReorderOpen((v) => !v);
            }}
          >
            <svg
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
            <div className="reorder-menu">
              <div className="reorder-menu-label">Flytt til</div>
              {Array.from({ length: total }).map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={`reorder-menu-item${i === index ? " current" : ""}`}
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
          className="delete-btn"
          title="Slett påstand"
          aria-label="Slett påstand"
          onClick={onDelete}
        >
          <svg
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

      <div className="pastand-field">
        <label className="mini-label">Påstand</label>
        <textarea
          ref={textRef}
          className="pastand-text"
          rows={1}
          placeholder="Skriv en påstand…"
          value={card.text}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </div>

      <div className="pastand-field">
        <label className="mini-label">Fasit</label>
        <div className="fasit-buttons">
          {FASIT_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`fasit-btn${card.fasit === opt.value ? " selected" : ""}`}
              data-fasit={opt.value}
              onClick={() =>
                onChange({ fasit: card.fasit === opt.value ? undefined : opt.value })
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pastand-field">
        <label className="mini-label">Forklaring</label>
        <textarea
          ref={forklaringRef}
          className="forklaring-text"
          rows={1}
          placeholder="Forklar hvorfor svaret er riktig…"
          value={card.forklaring}
          onChange={(e) => onChange({ forklaring: e.target.value })}
        />
      </div>
    </article>
  );
}
