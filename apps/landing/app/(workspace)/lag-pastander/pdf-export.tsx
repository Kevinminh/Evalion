"use client";

import { useEffect, useRef, useState } from "react";

import type { Card, Fasit } from "./pastand-card";

const FAG_OPTIONS = ["Naturfag", "Matematikk", "Samfunnsfag", "Norsk", "Engelsk", "KRLE"];
const TRINN_OPTIONS = [
  "5. trinn",
  "6. trinn",
  "7. trinn",
  "8. trinn",
  "9. trinn",
  "10. trinn",
  "VG1",
  "VG2",
  "VG3",
];

type Forkunnskap = "intro" | "oppsummering";

const FORKUNNSKAP_LABEL: Record<Forkunnskap, string> = {
  intro: "Introduksjon",
  oppsummering: "Oppsummering",
};

const FASIT_LABEL: Record<Fasit, string> = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
};

export function PdfExport({
  pastander,
  defaultFag,
  defaultTrinn,
  defaultForkunnskap,
  onClose,
}: {
  pastander: Card[];
  defaultFag: string;
  defaultTrinn: string;
  defaultForkunnskap?: Forkunnskap;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [fag, setFag] = useState(defaultFag);
  const [trinn, setTrinn] = useState(defaultTrinn);
  const [forkunnskap, setForkunnskap] = useState<Forkunnskap | "">(defaultForkunnskap ?? "");
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return setError("Skriv inn en tittel.");
    if (!fag) return setError("Velg fag.");
    if (!trinn) return setError("Velg trinn.");
    if (!forkunnskap) return setError("Velg forkunnskaper.");

    const valid = pastander.filter(
      (p) => p.text.trim().length > 0 && (p.fasit === "sant" || p.fasit === "usant" || p.fasit === "delvis"),
    );
    if (valid.length === 0) {
      return setError(
        "Legg til minst én påstand med tekst og fasit før du lager PDF.",
      );
    }

    buildPrintContainer(trimmedTitle, fag, trinn, FORKUNNSKAP_LABEL[forkunnskap], valid);
    document.title = `${trimmedTitle} – CO-LAB`;
    onClose();
    setTimeout(() => window.print(), 80);
  }

  return (
    <div className="pdf-modal" role="dialog" aria-modal="true" aria-labelledby="pdf-modal-title">
      <div className="pdf-modal-backdrop" onClick={onClose} />
      <div className="pdf-modal-content">
        <h3 className="pdf-modal-title" id="pdf-modal-title">
          Lag PDF
        </h3>
        <p className="pdf-modal-sub">Alle felt må fylles ut før du kan eksportere.</p>
        <form onSubmit={handleSubmit}>
          <div className="pdf-modal-field">
            <label className="field-label" htmlFor="pdf-title-input">
              Tittel
            </label>
            <input
              ref={titleRef}
              id="pdf-title-input"
              type="text"
              className="pdf-modal-input"
              placeholder="F.eks. Den norske velferdsstaten"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="pdf-modal-field">
            <label className="field-label" htmlFor="pdf-fag-input">
              Fag
            </label>
            <select
              id="pdf-fag-input"
              className="pdf-modal-select"
              value={fag}
              onChange={(e) => setFag(e.target.value)}
              required
            >
              <option value="" disabled>
                Velg fag
              </option>
              {FAG_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="pdf-modal-field">
            <label className="field-label" htmlFor="pdf-trinn-input">
              Trinn
            </label>
            <select
              id="pdf-trinn-input"
              className="pdf-modal-select"
              value={trinn}
              onChange={(e) => setTrinn(e.target.value)}
              required
            >
              <option value="" disabled>
                Velg trinn
              </option>
              {TRINN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="pdf-modal-field">
            <label className="field-label">Forkunnskaper</label>
            <div className="pdf-forkunnskap-choice" role="radiogroup" aria-label="Forkunnskaper">
              <button
                type="button"
                className={forkunnskap === "intro" ? "selected" : undefined}
                onClick={() => setForkunnskap("intro")}
              >
                Introduksjon
              </button>
              <button
                type="button"
                className={forkunnskap === "oppsummering" ? "selected" : undefined}
                onClick={() => setForkunnskap("oppsummering")}
              >
                Oppsummering
              </button>
            </div>
          </div>

          {error && (
            <p className="pdf-modal-error" role="alert">
              {error}
            </p>
          )}

          <div className="pdf-modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Avbryt
            </button>
            <button type="submit" className="btn-primary-pdf">
              Lag PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildPrintContainer(
  title: string,
  fag: string,
  trinn: string,
  forkunnskap: string,
  pastander: Card[],
) {
  let container = document.getElementById("pdf-print-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "pdf-print-container";
    container.setAttribute("aria-hidden", "true");
    document.body.appendChild(container);
  }

  const chunks: Card[][] = [];
  for (let i = 0; i < pastander.length; i += 3) {
    chunks.push(pastander.slice(i, i + 3));
  }

  container.innerHTML = chunks
    .map((chunk, pageIdx) => {
      const cardsHtml = chunk
        .map((p, cardIdx) => {
          const num = pageIdx * 3 + cardIdx + 1;
          const fasit = (p.fasit ?? "sant") as Fasit;
          const fasitLabel = FASIT_LABEL[fasit];
          const forklaringHtml = p.forklaring.trim()
            ? `<p class="pdf-forklaring-text">${escapeHtml(p.forklaring)}</p>`
            : "";
          return `
            <article class="pdf-card">
              <span class="pdf-card-num">${num}</span>
              <div class="pdf-fasit-box ${fasit}">${fasitLabel}</div>
              <p class="pdf-pastand-text">${escapeHtml(p.text)}</p>
              ${forklaringHtml}
            </article>`;
        })
        .join("");
      return `
        <article class="pdf-page">
          <header class="pdf-page-header">
            <img class="pdf-page-logo" src="/assets/CO-LAB (Hoved) - uten skygge.png" alt="CO-LAB">
            <h1 class="pdf-page-title">${escapeHtml(title)}</h1>
            <div class="pdf-page-meta">
              <span class="pdf-page-meta-item">${escapeHtml(fag)}</span>
              <span class="pdf-page-meta-item">${escapeHtml(trinn)}</span>
              <span class="pdf-page-meta-item">${escapeHtml(forkunnskap)}</span>
            </div>
          </header>
          <div class="pdf-cards-list">${cardsHtml}</div>
        </article>`;
    })
    .join("");
}
