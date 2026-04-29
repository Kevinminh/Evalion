"use client";

import { useAction, useMutation } from "convex/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@workspace/backend/convex/_generated/api";

import { BottomBar } from "./bottom-bar";
import { CategoryStrip } from "./category-strip";
import { LoadingState } from "./loading-state";
import type { GeneratedStatement } from "./types";

type Model =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "claude-opus-4-7"
  | "claude-sonnet-4-6"
  | "claude-haiku-4-5";

const ALLOWED_MODELS: readonly Model[] = [
  "gpt-4o",
  "gpt-4o-mini",
  "claude-opus-4-7",
  "claude-sonnet-4-6",
  "claude-haiku-4-5",
];

type GenerationParams = {
  topic: string;
  subject: string;
  level: string;
  type: "intro" | "oppsummering";
  model?: Model;
};

function readParams(searchParams: URLSearchParams): GenerationParams | null {
  const fag = searchParams.get("fag")?.trim();
  const trinn = searchParams.get("trinn")?.trim();
  const tema = searchParams.get("tema")?.trim();
  const type = searchParams.get("type");
  if (!fag || !trinn || !tema) return null;
  if (type !== "intro" && type !== "oppsummering") return null;
  const rawModel = searchParams.get("model");
  const model =
    rawModel && (ALLOWED_MODELS as readonly string[]).includes(rawModel)
      ? (rawModel as Model)
      : undefined;
  return { subject: fag, level: trinn, topic: tema, type, ...(model ? { model } : {}) };
}

const PAGE_BASE = "mx-auto max-w-[1100px] px-6 pt-24 pb-32";
const ERROR_BOX =
  "mx-auto mt-8 max-w-[540px] rounded-[18px] border-[1.5px] border-[#f5c0c0] bg-white p-7 text-center shadow-[0_8px_28px_rgba(229,57,53,0.08)]";
const ERROR_RETRY =
  "inline-flex items-center gap-2 rounded-full border-none bg-purple-500 px-[22px] py-2.5 font-[var(--font-family-body)] text-sm font-bold text-white shadow-[0_4px_0_var(--color-purple-700)] transition-[background,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-purple-400 hover:shadow-[0_5px_0_var(--color-purple-700)] cursor-pointer";

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
    const key = `${params.subject}|${params.level}|${params.type}|${params.topic}|${params.model ?? ""}`;
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
      <main className={PAGE_BASE}>
        <div className={ERROR_BOX} role="status">
          <h2 className="mb-2 text-lg font-extrabold text-ink">
            Mangler input
          </h2>
          <p className="mb-[18px] text-sm leading-relaxed text-ink-secondary">
            Du må fylle ut skjemaet før Reddi kan lage påstander.
          </p>
          <Link href="/lag-pastander" className={ERROR_RETRY}>
            Tilbake til skjemaet
          </Link>
        </div>
      </main>
    );
  }

  const totalSelected = selected.size;
  const sant = statements?.filter((s) => s.fasit === "sant") ?? [];
  const usant = statements?.filter((s) => s.fasit === "usant") ?? [];
  const delvis = statements?.filter((s) => s.fasit === "delvis") ?? [];

  return (
    <div>
      {!loading && (
        <Link
          href="/lag-pastander"
          className="absolute top-[92px] left-[max(24px,calc((100vw-1180px)/2-6px))] z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-ink-secondary transition-[background,color] duration-150 hover:bg-black/5 hover:text-ink"
        >
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
      )}

      <main
        className={
          loading
            ? "mx-auto flex min-h-[calc(100svh-64px)] max-w-[1100px] items-center justify-center px-6"
            : PAGE_BASE
        }
      >
        {loading ? (
          <LoadingState />
        ) : (
          <>
            <div className="mb-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-1 text-[26px] font-extrabold text-ink">
                  Velg påstander
                </h1>
                <p className="m-0 text-sm text-ink-secondary">
                  Påstandene du velger blir lagt til under &laquo;Mine påstander&raquo; med
                  tilhørende fasit og forklaring.
                </p>
              </div>
              <button
                type="button"
                onClick={runGeneration}
                className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-neutral-300 bg-white px-[18px] py-2.5 font-[var(--font-family-body)] text-sm font-bold text-ink-secondary transition-[background,border-color,color,transform] duration-150 hover:-translate-y-px hover:border-neutral-400 hover:bg-neutral-50 hover:text-ink active:translate-y-px"
              >
                <svg
                  className="size-4"
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

            {error && (
              <div className={ERROR_BOX} role="alert">
                <h2 className="mb-2 text-lg font-extrabold text-ink">
                  Reddi støtte på et problem
                </h2>
                <p className="mb-[18px] text-sm leading-relaxed text-ink-secondary">
                  {error}
                </p>
                <button type="button" className={ERROR_RETRY} onClick={runGeneration}>
                  Prøv igjen
                </button>
              </div>
            )}

            {!error && statements && (
              <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
                <CategoryStrip
                  kind="sant"
                  label="Sant"
                  items={sant}
                  selected={selected}
                  onToggle={toggleSelect}
                />
                <CategoryStrip
                  kind="usant"
                  label="Usant"
                  items={usant}
                  selected={selected}
                  onToggle={toggleSelect}
                />
                <CategoryStrip
                  kind="delvis"
                  label="Delvis sant"
                  items={delvis}
                  selected={selected}
                  onToggle={toggleSelect}
                />
              </div>
            )}
          </>
        )}
      </main>

      {!loading && (
        <BottomBar totalSelected={totalSelected} submitting={submitting} onAdd={handleAdd} />
      )}
    </div>
  );
}
