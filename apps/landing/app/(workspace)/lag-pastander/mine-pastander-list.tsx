"use client";

import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { cn } from "@workspace/ui/lib/utils";

import { PastandCard, type Card } from "./pastand-card";

const SYNC_DEBOUNCE_MS = 400;

const btnPillBase =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-[18px] py-2.5 text-[14px] font-bold transition-all duration-150";

const btnOutline = cn(
  btnPillBase,
  "border-purple-400 bg-white text-purple-700 shadow-[0_4px_0_var(--color-purple-200)]",
  "hover:-translate-y-px hover:border-purple-500 hover:bg-purple-50 hover:shadow-[0_5px_0_var(--color-purple-300)]",
  "active:translate-y-0.5 active:shadow-[0_1px_0_var(--color-purple-200)]",
);

const btnFilled = cn(
  btnPillBase,
  "border-purple-500 bg-purple-500 text-white shadow-[0_4px_0_var(--color-purple-700)]",
  "hover:-translate-y-px hover:border-purple-400 hover:bg-purple-400 hover:shadow-[0_5px_0_var(--color-purple-700)]",
  "active:translate-y-0.5 active:shadow-[0_1px_0_var(--color-purple-700)]",
);

const btnIconOnly = "size-11 justify-center gap-0 p-0";

function newClientId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptyCard(): Card {
  return { clientId: newClientId(), text: "", forklaring: "" };
}

export function MinePastanderList({
  draft,
  onRequestPdf,
}: {
  draft: Doc<"pastandDrafts"> | null | undefined;
  onRequestPdf: () => void;
}) {
  const setPastander = useMutation(api.pastandDrafts.setPastander);

  const [cards, setCards] = useState<Card[] | null>(null);
  const skipNextSyncRef = useRef(false);
  const seededRef = useRef(false);
  const knownClientIdsRef = useRef<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollIdRef = useRef<string | null>(null);

  // Hydrate from server: seed once, then merge any newly-arrived clientIds.
  useEffect(() => {
    if (draft === undefined) return;
    if (!seededRef.current) {
      seededRef.current = true;
      const serverCards: Card[] = (draft?.pastander ?? []).map((p) => ({
        clientId: p.clientId,
        text: p.text,
        fasit: p.fasit,
        forklaring: p.forklaring,
      }));
      knownClientIdsRef.current = new Set(serverCards.map((c) => c.clientId));
      skipNextSyncRef.current = true;
      setCards(serverCards);
      return;
    }
    // Subsequent server updates — append any new clientIds we don't know about.
    if (!draft) return;
    const newOnes = draft.pastander.filter(
      (p) => !knownClientIdsRef.current.has(p.clientId),
    );
    if (newOnes.length === 0) return;
    newOnes.forEach((p) => knownClientIdsRef.current.add(p.clientId));
    skipNextSyncRef.current = true;
    setCards((prev) => [
      ...(prev ?? []),
      ...newOnes.map((p) => ({
        clientId: p.clientId,
        text: p.text,
        fasit: p.fasit,
        forklaring: p.forklaring,
      })),
    ]);
  }, [draft]);

  // Debounced sync to server.
  useEffect(() => {
    if (cards === null) return;
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      void setPastander({ pastander: cards }).catch((err) => {
        console.error("Kunne ikke lagre påstander:", err);
      });
    }, SYNC_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [cards, setPastander]);

  function updateCard(clientId: string, patch: Partial<Card>) {
    setCards((prev) =>
      (prev ?? []).map((c) => (c.clientId === clientId ? { ...c, ...patch } : c)),
    );
  }

  function deleteCard(clientId: string) {
    setCards((prev) => {
      const list = prev ?? [];
      if (list.length <= 1) {
        // Match mockup: clear fields rather than remove the last card.
        return list.map((c) =>
          c.clientId === clientId
            ? { clientId: c.clientId, text: "", forklaring: "", fasit: undefined }
            : c,
        );
      }
      knownClientIdsRef.current.delete(clientId);
      return list.filter((c) => c.clientId !== clientId);
    });
  }

  function reorderCard(fromIndex: number, toIndex: number) {
    setCards((prev) => {
      const list = [...(prev ?? [])];
      if (fromIndex < 0 || fromIndex >= list.length) return list;
      if (toIndex < 0 || toIndex >= list.length) return list;
      const [item] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, item);
      return list;
    });
  }

  function addCard() {
    setCards((prev) => {
      const list = prev ?? [];
      const next: Card = emptyCard();
      knownClientIdsRef.current.add(next.clientId);
      pendingScrollIdRef.current = next.clientId;
      return [...list, next];
    });
  }

  useEffect(() => {
    const pendingId = pendingScrollIdRef.current;
    if (!pendingId) return;
    const container = scrollRef.current;
    if (!container) return;
    const el = container.querySelector(
      `[data-clientid="${pendingId}"]`,
    ) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "end" });
    pendingScrollIdRef.current = null;
  }, [cards]);

  const list = cards ?? [];

  return (
    <>
      <div className="flex shrink-0 items-start justify-between gap-4 bg-transparent px-1 pb-4 max-[560px]:flex-col max-[560px]:items-start">
        <h2 className="text-[26px] font-extrabold text-ink">Mine påstander</h2>
        <div className="flex items-start gap-2.5">
          <button type="button" className={btnOutline} onClick={addCard}>
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Legg til påstand
          </button>
          <button
            type="button"
            className={btnFilled}
            onClick={onRequestPdf}
            disabled={list.length === 0}
          >
            <svg
              className="size-[15px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="13" y2="17" />
            </svg>
            Lag PDF
          </button>
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-1.5 pt-1.5 pr-3.5 pb-4 [scrollbar-gutter:stable] max-[1040px]:flex-none max-[1040px]:overflow-visible max-[1040px]:p-0"
        ref={scrollRef}
      >
        {cards === null ? (
          <EmptyState>Henter samlingen din …</EmptyState>
        ) : list.length === 0 ? (
          <EmptyState>
            Du har ingen påstander ennå. Bruk Reddi til å lage forslag, eller legg til en
            påstand manuelt.
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-3.5">
            {list.map((card, i) => (
              <PastandCard
                key={card.clientId}
                card={card}
                index={i}
                total={list.length}
                onChange={(patch) => updateCard(card.clientId, patch)}
                onDelete={() => deleteCard(card.clientId)}
                onReorder={(toIndex) => reorderCard(i, toIndex)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 justify-center gap-3.5 px-1 pt-3 pb-1">
        <button
          type="button"
          className={cn(btnOutline, btnIconOnly)}
          title="Legg til påstand"
          aria-label="Legg til påstand"
          onClick={addCard}
        >
          <svg
            className="size-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          type="button"
          className={cn(btnFilled, btnIconOnly)}
          title="Lag PDF"
          aria-label="Lag PDF"
          onClick={onRequestPdf}
          disabled={list.length === 0}
        >
          <svg
            className="size-[19px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="13" y2="17" />
          </svg>
        </button>
      </div>
    </>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border-[1.5px] border-dashed border-neutral-300 bg-white px-6 py-8 text-center text-[14.5px] leading-[1.5] text-ink-secondary">
      {children}
    </div>
  );
}
