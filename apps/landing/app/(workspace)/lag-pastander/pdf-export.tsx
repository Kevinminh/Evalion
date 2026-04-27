"use client";

import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validPastander = pastander.filter(
    (p) =>
      p.text.trim().length > 0 &&
      (p.fasit === "sant" || p.fasit === "usant" || p.fasit === "delvis"),
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return setError("Skriv inn en tittel.");
    if (!fag) return setError("Velg fag.");
    if (!trinn) return setError("Velg trinn.");
    if (!forkunnskap) return setError("Velg forkunnskaper.");
    if (validPastander.length === 0) {
      return setError("Legg til minst én påstand med tekst og fasit før du lager PDF.");
    }

    document.title = `${trimmedTitle} – CO-LAB`;
    setTimeout(() => window.print(), 80);
  }

  return (
    <div className="pdf-export-screen" role="dialog" aria-modal="true" aria-labelledby="pdf-export-heading">
      <header className="pdf-export-topbar">
        <button type="button" className="pdf-export-back" onClick={onClose}>
          ← Tilbake
        </button>
        <h2 id="pdf-export-heading" className="pdf-export-heading">
          Lag PDF
        </h2>
        <button type="button" className="pdf-export-close" onClick={onClose} aria-label="Lukk">
          ✕
        </button>
      </header>

      <aside className="pdf-export-sidebar">
        <p className="pdf-modal-sub">Fyll inn detaljene – forhåndsvisningen oppdateres mens du skriver.</p>
        <form onSubmit={handleSubmit}>
          <div className="pdf-modal-field">
            <label className="field-label" htmlFor="pdf-title-input">
              Tittel
            </label>
            <input
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
            <Select value={fag} onValueChange={(v) => setFag(v ?? "")}>
              <SelectTrigger id="pdf-fag-input" className="w-full">
                <SelectValue placeholder="Velg fag" />
              </SelectTrigger>
              <SelectContent>
                {FAG_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pdf-modal-field">
            <label className="field-label" htmlFor="pdf-trinn-input">
              Trinn
            </label>
            <Select value={trinn} onValueChange={(v) => setTrinn(v ?? "")}>
              <SelectTrigger id="pdf-trinn-input" className="w-full">
                <SelectValue placeholder="Velg trinn" />
              </SelectTrigger>
              <SelectContent>
                {TRINN_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      </aside>

      <main className="pdf-export-canvas">
        <PdfPagesPreview
          title={title}
          fag={fag}
          trinn={trinn}
          forkunnskap={forkunnskap ? FORKUNNSKAP_LABEL[forkunnskap] : ""}
          pastander={validPastander}
        />
      </main>
    </div>
  );
}

function PdfPagesPreview({
  title,
  fag,
  trinn,
  forkunnskap,
  pastander,
}: {
  title: string;
  fag: string;
  trinn: string;
  forkunnskap: string;
  pastander: Card[];
}) {
  const chunks: Card[][] = [];
  for (let i = 0; i < pastander.length; i += 3) {
    chunks.push(pastander.slice(i, i + 3));
  }
  const pages = chunks.length > 0 ? chunks : [[]];

  return (
    <div id="pdf-print-container">
      {pages.map((chunk, pageIdx) => (
        <article className="pdf-page" key={pageIdx}>
          <header className="pdf-page-header">
            <img
              className="pdf-page-logo"
              src="/assets/CO-LAB (Hoved) - uten skygge.png"
              alt="CO-LAB"
            />
            <h1 className={`pdf-page-title${title ? "" : " is-placeholder"}`}>
              {title || "Tittel"}
            </h1>
            <div className="pdf-page-meta">
              <span className={`pdf-page-meta-item${fag ? "" : " is-placeholder"}`}>
                {fag || "Fag"}
              </span>
              <span className={`pdf-page-meta-item${trinn ? "" : " is-placeholder"}`}>
                {trinn || "Trinn"}
              </span>
              <span className={`pdf-page-meta-item${forkunnskap ? "" : " is-placeholder"}`}>
                {forkunnskap || "Forkunnskap"}
              </span>
            </div>
          </header>
          <div className="pdf-cards-list">
            {chunk.map((p, cardIdx) => {
              const fasit = p.fasit as Fasit;
              return (
                <article className="pdf-card" key={p.clientId}>
                  <span className="pdf-card-num">{pageIdx * 3 + cardIdx + 1}</span>
                  <div className={`pdf-fasit-box ${fasit}`}>{FASIT_LABEL[fasit]}</div>
                  <p className="pdf-pastand-text">{p.text}</p>
                  {p.forklaring.trim() && (
                    <p className="pdf-forklaring-text">{p.forklaring}</p>
                  )}
                </article>
              );
            })}
            {chunk.length === 0 && (
              <p className="pdf-empty-hint">
                Ingen gyldige påstander enda. Legg til tekst og velg fasit for å se
                forhåndsvisningen.
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
