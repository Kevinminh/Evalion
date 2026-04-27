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
  const addLabel =
    totalSelected > 0
      ? `Legg til ${totalSelected} påstand${totalSelected === 1 ? "" : "er"}`
      : "Legg til påstander";

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
            ? "mx-auto flex min-h-screen max-w-[1100px] items-center justify-center px-6"
            : PAGE_BASE
        }
      >
        {!loading && (
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <h1 className="mb-1 text-[26px] font-extrabold text-ink">
                Velg påstander
              </h1>
              <p className="m-0 text-sm text-ink-secondary">
                Påstandene du velger blir lagt til under &laquo;Mine påstander&raquo; med tilhørende
                fasit og forklaring.
              </p>
            </div>
            <button
              type="button"
              onClick={runGeneration}
              disabled={loading}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-neutral-300 bg-white px-[18px] py-2.5 font-[var(--font-family-body)] text-sm font-bold text-ink-secondary transition-[background,border-color,color,transform] duration-150 hover:not-disabled:-translate-y-px hover:not-disabled:border-neutral-400 hover:not-disabled:bg-neutral-50 hover:not-disabled:text-ink active:not-disabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-55"
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
        )}

        {loading && (
          <div
            className="mx-auto mt-8 flex w-full max-w-[480px] flex-col items-center gap-4 rounded-[26px] border-[1.5px] border-purple-200 bg-[#f3eeff] px-10 pt-10 pb-11 text-center shadow-[0_16px_40px_rgba(108,63,197,0.14),0_4px_10px_rgba(0,0,0,0.04)]"
            role="status"
            aria-live="polite"
          >
            <img
              className="size-[106px] animate-workspace-bounce object-contain"
              src="/assets/Reddi.png"
              alt="Reddi"
            />
            <div className="text-xl font-extrabold leading-[1.3] text-ink">
              Reddi lager påstandene
              <span className="inline-block animate-[blink_1.4s_ease-in-out_infinite] opacity-25">
                .
              </span>
              <span className="inline-block animate-[blink_1.4s_ease-in-out_infinite] opacity-25 [animation-delay:0.2s]">
                .
              </span>
              <span className="inline-block animate-[blink_1.4s_ease-in-out_infinite] opacity-25 [animation-delay:0.4s]">
                .
              </span>
            </div>
            <div className="max-w-[360px] text-sm leading-relaxed text-ink-secondary">
              Innholdet er generert av AI og kan inneholde feil.
              <br />
              Husk å bruke faglig skjønn!
            </div>
          </div>
        )}

        {!loading && error && (
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

        {!loading && !error && statements && (
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
      </main>

      {!loading && (
        <div className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t-[1.5px] border-neutral-200 bg-neutral-0 px-8 py-4 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex max-w-[900px] items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/assets/Reddi.png" alt="Reddi" className="size-11 object-contain" />
              <span className="text-[15px] font-bold text-ink-secondary">
                Laget av Reddi
              </span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={totalSelected === 0 || submitting}
              className={
                "inline-flex items-center gap-2 rounded-[var(--workspace-radius-xl)] border-none px-6 py-3 font-[var(--font-family-body)] text-sm font-bold text-white transition-all duration-150 disabled:opacity-70 " +
                (totalSelected > 0
                  ? "cursor-pointer bg-purple-500 shadow-[0_4px_0_var(--color-purple-700)] hover:not-disabled:-translate-y-0.5 hover:not-disabled:bg-purple-400 hover:not-disabled:shadow-[0_6px_0_var(--color-purple-700),var(--shadow-glow-primary)] active:not-disabled:translate-y-0.5 active:not-disabled:shadow-[0_2px_0_var(--color-purple-700)]"
                  : "cursor-not-allowed bg-neutral-300")
              }
            >
              <span>{submitting ? "Legger til …" : addLabel}</span>
              <svg
                className="size-4"
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
      )}
    </div>
  );
}

const STRIP_HEADER: Record<Fasit, string> = {
  sant: "border-b-[3px] border-[#4caf50] bg-[#c8e6c9] text-[#1b5e20]",
  usant: "border-b-[3px] border-[#e53935] bg-[#ffcdd2] text-[#b71c1c]",
  delvis: "border-b-[3px] border-[#fb8c00] bg-[#ffe0b2] text-[#b04a00]",
};

const STRIP_SELECTED: Record<Fasit, string> = {
  sant: "border-sant bg-neutral-0 shadow-[0_0_0_2px_#c8e6c9]",
  usant: "border-usant bg-neutral-0 shadow-[0_0_0_2px_#ffcdd2]",
  delvis: "border-delvis bg-neutral-0 shadow-[0_0_0_2px_#ffe0b2]",
};

function CategoryStrip({
  kind,
  label,
  items,
  selected,
  onToggle,
}: {
  kind: Fasit;
  label: string;
  items: GeneratedStatement[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--workspace-radius-2xl)] border-[1.5px] border-neutral-200 bg-neutral-0 shadow-[var(--shadow-sm)]">
      <div
        className={`flex items-center justify-center px-6 py-3.5 text-[15px] font-extrabold tracking-[0.01em] ${STRIP_HEADER[kind]}`}
      >
        {label}
      </div>
      <div className="flex flex-col gap-3 p-3.5">
        {items.map((item) => {
          const isSelected = selected.has(item.id);
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onToggle(item.id)}
              title={item.explanation}
              className={
                "select-none cursor-pointer rounded-[var(--workspace-radius-xl)] border-[1.5px] px-4 py-3.5 text-left font-[var(--font-family-body)] text-sm leading-relaxed text-ink transition-all duration-150 " +
                (isSelected
                  ? STRIP_SELECTED[kind]
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100")
              }
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
