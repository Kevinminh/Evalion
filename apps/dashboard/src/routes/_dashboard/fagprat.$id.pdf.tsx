import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fagpratsQueries } from "@workspace/api/fagprats";
import { FagPratDetailSkeleton } from "@workspace/features/components/skeletons/fagprat-detail-skeleton";
import { ErrorState } from "@workspace/ui/components/states/error-state";
import { NotFoundState } from "@workspace/ui/components/states/not-found-state";

import "@workspace/ui/styles/pdf-print.css";
import { ArrowLeft, X } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";

import type { FagPrat, FagPratId, FagPratStatement, Fasit } from "@/lib/types";

const CARDS_PER_FIRST_PAGE = 3;
const CARDS_PER_OTHER_PAGE = 4;

const FASIT_LABEL: Record<Fasit, string> = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
};

const FORKUNNSKAP_LABEL: Record<FagPrat["type"], string> = {
  intro: "Introduksjon",
  oppsummering: "Oppsummering",
};

export const Route = createFileRoute("/_dashboard/fagprat/$id/pdf")({
  component: FagPratPdfPage,
});

function FagPratPdfPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: fagprat, isPending, isError } = useQuery(fagpratsQueries.byId(id as FagPratId));

  const [title, setTitle] = useState("");
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (seeded || !fagprat) return;
    setTitle(fagprat.title);
    setSeeded(true);
  }, [fagprat, seeded]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") navigate({ to: "/min-samling" });
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  if (isPending) return <FagPratDetailSkeleton />;
  if (isError) return <ErrorState />;
  if (!fagprat) return <NotFoundState />;

  const validStatements = fagprat.statements.filter((s) => s.text.trim().length > 0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fagprat) return;
    const trimmed = title.trim() || fagprat.title;
    document.title = `${trimmed} – CO-LAB`;
    setTimeout(() => window.print(), 80);
  }

  return (
    <div className="fixed inset-y-0 right-0 left-[var(--sidebar-width)] z-40 grid grid-cols-[300px_1fr] grid-rows-[56px_1fr] bg-muted/40 font-sans max-[820px]:left-0 max-[820px]:grid-cols-[1fr] max-[820px]:grid-rows-[52px_auto_1fr] print:static print:inset-auto">
      <header className="col-span-2 flex items-center justify-between border-b border-border bg-card px-5 max-[820px]:col-span-1">
        <button
          type="button"
          onClick={() => navigate({ to: "/min-samling" })}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Tilbake
        </button>
        <h2 className="text-sm font-extrabold tracking-wide text-foreground">Lag PDF</h2>
        <button
          type="button"
          aria-label="Lukk"
          onClick={() => navigate({ to: "/min-samling" })}
          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </header>

      <aside className="col-start-1 row-start-2 overflow-y-auto border-r border-border bg-card px-6 pt-6 pb-7 max-[820px]:col-start-1 max-[820px]:row-start-2 max-[820px]:overflow-y-visible max-[820px]:border-r-0 max-[820px]:border-b max-[820px]:px-4 max-[820px]:pt-4 max-[820px]:pb-5">
        <p className="mb-4 text-sm leading-snug text-muted-foreground">
          Forhåndsvisningen oppdateres mens du skriver. Trykk «Lag PDF» for å åpne
          utskriftsdialogen.
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-bold text-foreground" htmlFor="pdf-title">
              Tittel
            </label>
            <input
              id="pdf-title"
              type="text"
              className="h-10 w-full rounded-xl border-2 border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Fag
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{fagprat.subject}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Trinn
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{fagprat.level}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Forkunnskap
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {FORKUNNSKAP_LABEL[fagprat.type]}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Påstander
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{validStatements.length}</dd>
            </div>
          </dl>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/min-samling" })}
              className="inline-flex items-center justify-center rounded-xl border-2 border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={validStatements.length === 0}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lag PDF
            </button>
          </div>
        </form>
      </aside>

      <main className="col-start-2 row-start-2 overflow-y-auto px-3 pt-8 pb-20 max-[820px]:col-start-1 max-[820px]:row-start-3 max-[820px]:px-3 max-[820px]:pt-5 max-[820px]:pb-14">
        <PdfPreview
          title={title || fagprat.title}
          fag={fagprat.subject}
          trinn={fagprat.level}
          forkunnskap={FORKUNNSKAP_LABEL[fagprat.type]}
          statements={validStatements}
        />
      </main>
    </div>
  );
}

interface PdfPreviewProps {
  title: string;
  fag: string;
  trinn: string;
  forkunnskap: string;
  statements: FagPratStatement[];
}

function PdfPreview({ title, fag, trinn, forkunnskap, statements }: PdfPreviewProps) {
  const chunks: FagPratStatement[][] = [];
  if (statements.length === 0) {
    chunks.push([]);
  } else {
    chunks.push(statements.slice(0, CARDS_PER_FIRST_PAGE));
    for (let i = CARDS_PER_FIRST_PAGE; i < statements.length; i += CARDS_PER_OTHER_PAGE) {
      chunks.push(statements.slice(i, i + CARDS_PER_OTHER_PAGE));
    }
  }
  const pageOffsets = chunks.map((_, idx) =>
    idx === 0 ? 0 : CARDS_PER_FIRST_PAGE + (idx - 1) * CARDS_PER_OTHER_PAGE,
  );

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
  }, [statements, title, fag, trinn, forkunnskap]);

  return (
    <div
      id="pdf-print-container"
      className="flex flex-col items-center gap-6 max-[820px]:w-full max-[820px]:gap-4"
    >
      {chunks.map((chunk, pageIdx) => (
        <article className="pdf-page" key={pageIdx}>
          {pageIdx === 0 && (
            <header className="pdf-page-header">
              <img className="pdf-page-logo" src="/co-lab-logo.png" alt="CO-LAB" />
              <h1 className={`pdf-page-title${title ? "" : " is-placeholder"}`}>
                {title || "Tittel"}
              </h1>
              <div className="pdf-page-meta">
                <span className="pdf-page-meta-item">{fag}</span>
                <span className="pdf-page-meta-item">{trinn}</span>
                <span className="pdf-page-meta-item">{forkunnskap}</span>
              </div>
            </header>
          )}
          <div className="pdf-cards-list">
            {chunk.map((s, cardIdx) => (
              <article className="pdf-card" key={`${pageIdx}-${cardIdx}`}>
                <span className="pdf-card-num">{(pageOffsets[pageIdx] ?? 0) + cardIdx + 1}</span>
                <div className={`pdf-fasit-box ${s.fasit}`}>{FASIT_LABEL[s.fasit]}</div>
                <p className="pdf-pastand-text">{s.text}</p>
                {s.explanation.trim() && <p className="pdf-forklaring-text">{s.explanation}</p>}
              </article>
            ))}
            {chunk.length === 0 && (
              <p className="pdf-empty-hint">Denne FagPraten har ingen påstander å skrive ut.</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
