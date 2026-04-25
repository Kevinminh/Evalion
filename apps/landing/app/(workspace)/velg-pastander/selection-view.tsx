"use client";

import { useAction, useMutation } from "convex/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@workspace/backend/convex/_generated/api";

type Fasit = "sant" | "usant" | "delvis";

type GeneratedStatement = {
  id: string;
  text: string;
  fasit: Fasit;
  explanation: string;
};

type GenerationParams = {
  topic: string;
  subject: string;
  level: string;
  type: "intro" | "oppsummering";
};

function readParams(searchParams: URLSearchParams): GenerationParams | null {
  const fag = searchParams.get("fag")?.trim();
  const trinn = searchParams.get("trinn")?.trim();
  const tema = searchParams.get("tema")?.trim();
  const type = searchParams.get("type");
  if (!fag || !trinn || !tema) return null;
  if (type !== "intro" && type !== "oppsummering") return null;
  return { subject: fag, level: trinn, topic: tema, type };
}

export function SelectionView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const generate = useAction(api.reddi.generateStatements);
  const append = useMutation(api.pastandDrafts.appendStatements);

  const [statements, setStatements] = useState<GeneratedStatement[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const params = readParams(searchParams);
  const lastKeyRef = useRef<string>("");

  const runGeneration = useCallback(async () => {
    if (!params) return;
    setLoading(true);
    setError(null);
    setStatements(null);
    setSelected(new Set());
    try {
      const result = await generate(params);
      setStatements(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }, [generate, params]);

  useEffect(() => {
    if (!params) {
      setLoading(false);
      return;
    }
    const key = `${params.subject}|${params.level}|${params.type}|${params.topic}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;
    void runGeneration();
  }, [params, runGeneration]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleAdd() {
    if (!statements || selected.size === 0 || submitting) return;
    setSubmitting(true);
    try {
      const chosen = statements
        .filter((s) => selected.has(s.id))
        .map((s) => ({ text: s.text, fasit: s.fasit, forklaring: s.explanation }));
      await append({ statements: chosen });
      router.push("/lag-pastander");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke lagre påstandene.");
      setSubmitting(false);
    }
  }

  if (!params) {
    return (
      <main className="velg-page">
        <div className="velg-error" role="status">
          <h2>Mangler input</h2>
          <p>Du må fylle ut skjemaet før Reddi kan lage påstander.</p>
          <Link href="/lag-pastander" className="velg-error-retry">
            Tilbake til skjemaet
          </Link>
        </div>
      </main>
    );
  }

  const totalSelected = selected.size;
  const addLabel =
    totalSelected > 0
      ? `Legg til ${totalSelected} påstand${totalSelected === 1 ? "" : "er"}`
      : "Legg til påstander";

  const sant = statements?.filter((s) => s.fasit === "sant") ?? [];
  const usant = statements?.filter((s) => s.fasit === "usant") ?? [];
  const delvis = statements?.filter((s) => s.fasit === "delvis") ?? [];

  return (
    <div className={loading ? "velg-page--loading" : undefined}>
      <Link href="/lag-pastander" className="velg-back-link">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Tilbake
      </Link>

      <main className="velg-page">
        <div className="velg-page-header">
          <div>
            <h1 className="velg-page-title">Velg påstander</h1>
            <p className="velg-page-subtitle">
              Påstandene du velger blir lagt til under &laquo;Mine påstander&raquo; med tilhørende
              fasit og forklaring.
            </p>
          </div>
          <button
            type="button"
            className="velg-regenerate-btn"
            onClick={runGeneration}
            disabled={loading}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Lag nye påstander
          </button>
        </div>

        {loading && (
          <div className="reddi-loading" role="status" aria-live="polite">
            <img className="reddi-loading-avatar" src="/assets/Reddi.png" alt="Reddi" />
            <div className="reddi-loading-title">
              Reddi lager påstandene
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
            <div className="reddi-loading-subtitle">
              Innholdet er generert av AI og kan inneholde feil.
              <br />
              Husk å bruke faglig skjønn!
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="velg-error" role="alert">
            <h2>Reddi støtte på et problem</h2>
            <p>{error}</p>
            <button type="button" className="velg-error-retry" onClick={runGeneration}>
              Prøv igjen
            </button>
          </div>
        )}

        {!loading && !error && statements && (
          <div className="category-sections">
            <CategoryStrip kind="sant" label="Sant" items={sant} selected={selected} onToggle={toggleSelect} />
            <CategoryStrip kind="usant" label="Usant" items={usant} selected={selected} onToggle={toggleSelect} />
            <CategoryStrip kind="delvis" label="Delvis sant" items={delvis} selected={selected} onToggle={toggleSelect} />
          </div>
        )}
      </main>

      <div className="velg-bottom-bar">
        <div className="velg-bottom-bar-inner">
          <div className="velg-reddi-attribution">
            <img src="/assets/Reddi.png" alt="Reddi" />
            <span className="velg-reddi-attribution-text">Foreslått av Reddi</span>
          </div>
          <button
            type="button"
            className={`velg-add-btn${totalSelected > 0 ? " active" : ""}`}
            onClick={handleAdd}
            disabled={totalSelected === 0 || submitting}
          >
            <span>{submitting ? "Legger til …" : addLabel}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryStrip({
  kind,
  label,
  items,
  selected,
  onToggle,
}: {
  kind: "sant" | "usant" | "delvis";
  label: string;
  items: GeneratedStatement[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={`category-strip strip-${kind}`}>
      <div className="strip-header">{label}</div>
      <div className="strip-body">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`velg-pastand-card${selected.has(item.id) ? " selected" : ""}`}
            onClick={() => onToggle(item.id)}
            title={item.explanation}
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  );
}
