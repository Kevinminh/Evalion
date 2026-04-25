"use client";

import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Doc } from "@workspace/backend/convex/_generated/dataModel";

import { PastandCard, type Card } from "./pastand-card";

const SYNC_DEBOUNCE_MS = 400;

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
      return [...list, next];
    });
  }

  const list = cards ?? [];

  return (
    <>
      <div className="mine-header">
        <h2 className="mine-title">Mine påstander</h2>
        <div className="mine-actions">
          <button type="button" className="btn-add-pastand" onClick={addCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Legg til påstand
          </button>
          <button
            type="button"
            className="btn-pdf"
            onClick={onRequestPdf}
            disabled={list.length === 0}
          >
            <svg
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

      {cards === null ? (
        <div className="empty-state">Henter samlingen din …</div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          Du har ingen påstander ennå. Bruk Reddi til å lage forslag, eller legg til en påstand
          manuelt.
        </div>
      ) : (
        <div className="pastand-list">
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

      <div className="mine-footer">
        <button
          type="button"
          className="btn-add-pastand btn-icon-only"
          title="Legg til påstand"
          aria-label="Legg til påstand"
          onClick={addCard}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          type="button"
          className="btn-pdf btn-icon-only"
          title="Lag PDF"
          aria-label="Lag PDF"
          onClick={onRequestPdf}
          disabled={list.length === 0}
        >
          <svg
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
