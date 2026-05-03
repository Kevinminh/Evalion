"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "@workspace/ui/styles/pdf-print.css";
import { FAG_OPTIONS } from "./fag-options";
import type { Card, Fasit } from "./pastand-card";
import { TRINN_OPTIONS, normalizeTrinn } from "./trinn-options";

const PASTANDER_PER_FIRST_PAGE = 6;
const PASTANDER_PER_OTHER_PAGE = 4;

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

const BACK_HREF = "/lag-pastander";

const fieldLabel = "mb-[3px] block text-[12px] font-bold text-ink";

const modalInput =
  "w-full rounded-xl border-2 border-neutral-300 bg-white px-3.5 py-[11px] text-[14.5px] text-ink outline-none transition-[border-color,box-shadow] duration-150 focus:border-purple-400 focus:shadow-[0_0_0_4px_var(--color-purple-100)]";

const actionPillBase =
  "inline-flex cursor-pointer items-center justify-center rounded-full border-2 px-5 py-2.5 text-[14px] font-bold transition-all duration-150 max-[480px]:w-full";

const actionOutline = cn(
  actionPillBase,
  "border-purple-400 bg-white text-purple-700 shadow-[0_4px_0_var(--color-purple-200)]",
  "hover:-translate-y-px hover:border-purple-500 hover:bg-purple-50 hover:shadow-[0_5px_0_var(--color-purple-300)]",
  "active:translate-y-0.5 active:shadow-[0_1px_0_var(--color-purple-200)]",
);

const actionFilled = cn(
  actionPillBase,
  "border-purple-500 bg-purple-500 font-extrabold text-white shadow-[0_4px_0_var(--color-purple-700)]",
  "hover:-translate-y-px hover:border-purple-400 hover:bg-purple-400 hover:shadow-[0_5px_0_var(--color-purple-700)]",
  "active:translate-y-0.5 active:shadow-[0_1px_0_var(--color-purple-700)]",
);

const topbarBtn =
  "cursor-pointer rounded-[10px] border-0 bg-transparent px-3 py-2 text-[14px] font-bold text-ink-secondary transition-colors duration-150 hover:bg-neutral-100 hover:text-ink";

export function PdfExport() {
  const router = useRouter();
  const draft = useQuery(api.pastandDrafts.get);

  const [title, setTitle] = useState("");
  const [fag, setFag] = useState("");
  const [trinn, setTrinn] = useState("");
  const [forkunnskap, setForkunnskap] = useState<Forkunnskap | "">("");
  const [error, setError] = useState<string | null>(null);

  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    if (draft === undefined) return;
    seededRef.current = true;
    setFag(draft?.lastFag ?? "");
    setTrinn(normalizeTrinn(draft?.lastTrinn ?? ""));
    setForkunnskap(draft?.lastForkunnskap ?? "");
  }, [draft]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") router.push(BACK_HREF);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router]);

  const pastander = draft?.pastander ?? [];
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
    <div
      className="grid h-[calc(100vh-64px)] w-full grid-cols-[360px_1fr] grid-rows-[56px_1fr] bg-[#dde2de] font-sans max-[820px]:h-auto max-[820px]:min-h-[calc(100vh-64px)] max-[820px]:grid-cols-[1fr] max-[820px]:grid-rows-[52px_auto_1fr] max-[820px]:overflow-x-hidden"
      role="region"
      aria-labelledby="pdf-export-heading"
    >
      <header className="col-span-2 flex items-center justify-between border-b border-neutral-200 bg-white px-[18px] max-[820px]:col-span-1 max-[480px]:px-3">
        <Link
          href={BACK_HREF}
          className={cn(topbarBtn, "max-[480px]:px-2 max-[480px]:py-1.5 max-[480px]:text-[13px]")}
        >
          ← Tilbake
        </Link>
        <h2
          id="pdf-export-heading"
          className="text-[15px] font-extrabold tracking-[0.02em] text-ink max-[480px]:text-sm"
        >
          Lag PDF
        </h2>
        <Link href={BACK_HREF} className={cn(topbarBtn, "px-3 py-1.5 text-base")} aria-label="Lukk">
          ✕
        </Link>
      </header>

      <aside className="col-start-1 row-start-2 overflow-y-auto border-r border-neutral-200 bg-white px-[22px] pt-[22px] pb-7 max-[820px]:col-start-1 max-[820px]:row-start-2 max-[820px]:max-h-none max-[820px]:overflow-y-visible max-[820px]:border-r-0 max-[820px]:border-b max-[820px]:px-4 max-[820px]:pt-4 max-[820px]:pb-5">
        <p className="mb-[18px] text-[13px] leading-[1.45] text-ink-secondary">
          Fyll inn detaljene – forhåndsvisningen oppdateres mens du skriver.
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label className={fieldLabel} htmlFor="pdf-title-input">
              Tittel
            </label>
            <input
              id="pdf-title-input"
              type="text"
              className={modalInput}
              placeholder="F.eks. Den norske velferdsstaten"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <label className={fieldLabel} htmlFor="pdf-fag-input">
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
          <div className="mt-3">
            <label className={fieldLabel} htmlFor="pdf-trinn-input">
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
          <div className="mt-3">
            <label className={fieldLabel}>Forkunnskaper</label>
            <div
              className="flex gap-2 max-[480px]:flex-col"
              role="radiogroup"
              aria-label="Forkunnskaper"
            >
              <ForkunnskapChoice
                selected={forkunnskap === "intro"}
                onClick={() => setForkunnskap("intro")}
              >
                Introduksjon
              </ForkunnskapChoice>
              <ForkunnskapChoice
                selected={forkunnskap === "oppsummering"}
                onClick={() => setForkunnskap("oppsummering")}
              >
                Oppsummering
              </ForkunnskapChoice>
            </div>
          </div>

          {error && (
            <p
              className="mt-3 rounded-[10px] bg-[#ffebee] px-3 py-2 text-[13px] font-semibold text-[#b71c1c]"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="mt-[22px] flex justify-end gap-2.5 max-[480px]:flex-col-reverse max-[480px]:items-stretch">
            <Link href={BACK_HREF} className={actionOutline}>
              Avbryt
            </Link>
            <button type="submit" className={actionFilled}>
              Lag PDF
            </button>
          </div>
        </form>
      </aside>

      <main className="col-start-2 row-start-2 overflow-y-auto px-6 pt-8 pb-20 max-[820px]:col-start-1 max-[820px]:row-start-3 max-[820px]:overflow-x-hidden max-[820px]:overflow-y-visible max-[820px]:px-3 max-[820px]:pt-5 max-[820px]:pb-[60px]">
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

function ForkunnskapChoice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex-1 cursor-pointer rounded-xl border-2 bg-white px-3.5 py-2.5 text-[14px] font-bold transition-[background-color,border-color,color] duration-150 hover:border-purple-300",
        selected
          ? "border-purple-500 bg-purple-50 text-purple-700"
          : "border-neutral-300 text-ink-secondary",
      )}
      onClick={onClick}
    >
      {children}
    </button>
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
  if (pastander.length === 0) {
    chunks.push([]);
  } else {
    chunks.push(pastander.slice(0, PASTANDER_PER_FIRST_PAGE));
    for (let i = PASTANDER_PER_FIRST_PAGE; i < pastander.length; i += PASTANDER_PER_OTHER_PAGE) {
      chunks.push(pastander.slice(i, i + PASTANDER_PER_OTHER_PAGE));
    }
  }
  const pages = chunks;
  const pageOffsets = chunks.map((_, idx) =>
    idx === 0 ? 0 : PASTANDER_PER_FIRST_PAGE + (idx - 1) * PASTANDER_PER_OTHER_PAGE,
  );

  // Auto-shrink card text when the rendered content overflows the fixed-height
  // card box. Runs after each render so it re-measures whenever påstander, the
  // header, or layout (e.g. mobile scale recalc) changes.
  useLayoutEffect(() => {
    const container = document.getElementById("pdf-print-container");
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(".pdf-card");
    cards.forEach((card) => {
      const text = card.querySelector<HTMLElement>(".pdf-pastand-text");
      const forklar = card.querySelector<HTMLElement>(".pdf-forklaring-text");
      if (text) text.style.fontSize = "";
      if (forklar) forklar.style.fontSize = "";
      let scale = 1;
      while (card.scrollHeight > card.clientHeight + 0.5 && scale > 0.55) {
        scale -= 0.05;
        if (text) text.style.fontSize = `${(11.5 * scale).toFixed(2)}pt`;
        if (forklar) forklar.style.fontSize = `${(10 * scale).toFixed(2)}pt`;
      }
    });
  }, [pastander, title, fag, trinn, forkunnskap]);

  return (
    <div
      id="pdf-print-container"
      className="flex flex-col items-center gap-6 max-[820px]:w-full max-[820px]:gap-4"
    >
      {pages.map((chunk, pageIdx) => (
        <article className="pdf-page" key={pageIdx}>
          {pageIdx === 0 && (
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
          )}
          <div className="pdf-cards-list">
            {chunk.map((p, cardIdx) => {
              const fasit = p.fasit as Fasit;
              return (
                <article className="pdf-card" key={p.clientId}>
                  <span className="pdf-card-num">{(pageOffsets[pageIdx] ?? 0) + cardIdx + 1}</span>
                  <div className={`pdf-fasit-box ${fasit}`}>{FASIT_LABEL[fasit]}</div>
                  <p className="pdf-pastand-text">{p.text}</p>
                  {p.forklaring.trim() && <p className="pdf-forklaring-text">{p.forklaring}</p>}
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
