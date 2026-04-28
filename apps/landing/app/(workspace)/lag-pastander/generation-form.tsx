"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { api } from "@workspace/backend/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";

import { authClient } from "../../lib/auth-client";

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

const DEFAULT_MODEL = "gpt-4o";

type Provider = "openai" | "anthropic";

const MODELS_BY_PROVIDER: Record<Provider, readonly string[]> = {
  openai: ["gpt-4o", "gpt-4o-mini"],
  anthropic: ["claude-opus-4-7", "claude-sonnet-4-6", "claude-haiku-4-5"],
};

type Forkunnskap = "intro" | "oppsummering";

const fieldLabel = "mb-[3px] block text-xs font-bold text-ink";

export function GenerationForm({
  initialFag,
  initialTrinn,
  initialForkunnskap,
}: {
  initialFag: string;
  initialTrinn: string;
  initialForkunnskap?: Forkunnskap;
}) {
  const router = useRouter();
  const setLastParams = useMutation(api.pastandDrafts.setLastParams);
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  const [fag, setFag] = useState(initialFag);
  const [trinn, setTrinn] = useState(initialTrinn);
  const [forkunnskap, setForkunnskap] = useState<Forkunnskap | "">(initialForkunnskap ?? "");
  const [tema, setTema] = useState("");
  const [provider, setProvider] = useState<Provider>("openai");
  const [model, setModel] = useState<string>(DEFAULT_MODEL);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    if (!initialFag && !initialTrinn && !initialForkunnskap) return;
    seededRef.current = true;
    if (initialFag) setFag(initialFag);
    if (initialTrinn) setTrinn(initialTrinn);
    if (initialForkunnskap) setForkunnskap(initialForkunnskap);
  }, [initialFag, initialTrinn, initialForkunnskap]);

  const temaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    autoGrow(temaRef.current);
  }, [tema]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!fag) return setError("Velg fag.");
    if (!trinn) return setError("Velg trinn.");
    if (!forkunnskap) return setError("Velg forkunnskaper.");
    const trimmedTema = tema.trim();
    if (!trimmedTema) return setError("Skriv inn et tema.");

    setSubmitting(true);
    void setLastParams({
      lastFag: fag,
      lastTrinn: trinn,
      lastForkunnskap: forkunnskap,
    }).catch(() => {
      // Non-critical; URL params are the source of truth.
    });

    const params = new URLSearchParams({
      fag,
      trinn,
      type: forkunnskap,
      tema: trimmedTema,
    });
    if (isAdmin && model !== DEFAULT_MODEL) {
      params.set("model", model);
    }
    router.push(`/velg-pastander?${params.toString()}`);
  }

  function handleProviderChange(next: Provider) {
    setProvider(next);
    setModel(MODELS_BY_PROVIDER[next][0] ?? DEFAULT_MODEL);
  }

  return (
    <form
      className="relative rounded-[22px] border-[2.5px] border-dashed border-purple-300 bg-purple-50 px-[22px] pt-3.5 pb-4 max-[560px]:px-[18px] max-[560px]:pt-5 max-[560px]:pb-[22px]"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="mb-4 flex flex-row-reverse items-center justify-center gap-4 border-b-[1.5px] border-dashed border-purple-300 pb-2.5 max-[560px]:flex-col-reverse max-[560px]:gap-2.5 max-[560px]:text-center">
        <img
          className="block size-[105px] shrink-0 object-contain drop-shadow-[0_6px_16px_rgba(108,63,197,0.22)] animate-[workspace-bounce-gentle_3s_ease-in-out_infinite] max-[560px]:size-20"
          src="/assets/Reddi.png"
          alt="Reddi"
        />
        <div className="min-w-0 text-left max-[560px]:text-center">
          <ol className="m-0 flex list-none flex-col gap-[7px] p-0">
            <li className="flex items-center gap-[9px]">
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 border-purple-500 bg-transparent text-xs font-extrabold text-purple-700">
                1
              </span>
              <span className="text-[13px] font-semibold leading-[1.25] text-ink max-[560px]:text-[12.5px]">
                Fyll ut alle feltene nedenfor
              </span>
            </li>
            <li className="flex items-center gap-[9px]">
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 border-purple-500 bg-transparent text-xs font-extrabold text-purple-700">
                2
              </span>
              <span className="text-[13px] font-semibold leading-[1.25] text-ink max-[560px]:text-[12.5px]">
                Reddi lager 9 gode forslag
              </span>
            </li>
            <li className="flex items-center gap-[9px]">
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 border-purple-500 bg-transparent text-xs font-extrabold text-purple-700">
                3
              </span>
              <span className="text-[13px] font-semibold leading-[1.25] text-ink max-[560px]:text-[12.5px]">
                Velg påstandene du vil bruke
              </span>
            </li>
          </ol>
        </div>
      </div>

      {isAdmin && (
        <div
          className="mb-3.5 grid grid-cols-2 gap-2.5 max-[560px]:grid-cols-1"
          data-admin-only
        >
          <div>
            <label className={fieldLabel} htmlFor="provider">
              Admin: Leverandør
            </label>
            <Select
              value={provider}
              onValueChange={(v) => handleProviderChange((v ?? "openai") as Provider)}
            >
              <SelectTrigger id="provider" className="w-full">
                <SelectValue placeholder="Velg leverandør" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={fieldLabel} htmlFor="model">
              Admin: Modell
            </label>
            <Select value={model} onValueChange={(v) => setModel(v ?? DEFAULT_MODEL)}>
              <SelectTrigger id="model" className="w-full">
                <SelectValue placeholder="Velg modell" />
              </SelectTrigger>
              <SelectContent>
                {MODELS_BY_PROVIDER[provider].map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="mb-3.5 grid grid-cols-2 gap-2.5 max-[560px]:grid-cols-1">
        <div>
          <label className={fieldLabel} htmlFor="fag">
            Fag
          </label>
          <Select value={fag} onValueChange={(v) => setFag(v ?? "")}>
            <SelectTrigger id="fag" className="w-full">
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
        <div>
          <label className={fieldLabel} htmlFor="trinn">
            Trinn
          </label>
          <Select value={trinn} onValueChange={(v) => setTrinn(v ?? "")}>
            <SelectTrigger id="trinn" className="w-full">
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
      </div>

      <div className="mb-3.5">
        <div className={fieldLabel}>Forkunnskaper</div>
        <div className="flex gap-2 max-[560px]:flex-col">
          <ForkunnskapButton
            kind="intro"
            title="Introduksjon"
            desc="Lite forkunnskap"
            selected={forkunnskap === "intro"}
            onClick={() => setForkunnskap("intro")}
          />
          <ForkunnskapButton
            kind="oppsummering"
            title="Oppsummering"
            desc="Gode forkunnskaper"
            selected={forkunnskap === "oppsummering"}
            onClick={() => setForkunnskap("oppsummering")}
          />
        </div>
      </div>

      <div className="mb-3.5">
        <label className={fieldLabel} htmlFor="tema">
          Tema
        </label>
        <textarea
          ref={temaRef}
          className="block min-h-0 w-full resize-none overflow-hidden rounded-xl border-[1.5px] border-neutral-300 bg-white px-3.5 py-[11px] text-[14.5px] leading-[1.4] text-ink outline-none transition-[border-color,box-shadow] duration-150 focus:border-purple-400 focus:shadow-[0_0_0_4px_var(--color-purple-100)]"
          id="tema"
          rows={1}
          placeholder="F.eks. Newtons lover, brøkregning…"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          required
        />
      </div>

      <div className="mt-0.5 flex justify-center">
        <button
          type="submit"
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-purple-500 px-6 py-[9px] text-[15px] font-extrabold text-white shadow-[0_4px_0_var(--color-purple-700)] transition-[background-color,transform,box-shadow] duration-150 not-disabled:hover:-translate-y-px not-disabled:hover:bg-purple-400 not-disabled:hover:shadow-[0_5px_0_var(--color-purple-700)] not-disabled:active:translate-y-0.5 not-disabled:active:shadow-[0_1px_0_var(--color-purple-700)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={submitting}
        >
          {submitting ? "Sender Reddi i sving …" : "Lag påstander ✨"}
        </button>
      </div>

      {error && (
        <p
          className="mt-2.5 rounded-[10px] bg-[#ffebee] px-3 py-2 text-[13px] font-semibold text-[#b71c1c]"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
}

function ForkunnskapButton({
  kind,
  title,
  desc,
  selected,
  onClick,
}: {
  kind: "intro" | "oppsummering";
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  const isIntro = kind === "intro";
  const baseBtn =
    "flex flex-1 cursor-pointer items-center gap-[9px] rounded-xl border-2 bg-white px-[11px] py-2 text-left shadow-[0_2px_0_rgba(0,0,0,0.06)] transition-all duration-150 min-w-0 active:translate-y-px";
  const variantBtn = isIntro
    ? cn(
        "hover:-translate-y-px hover:border-sage-400 hover:bg-sage-50",
        selected && "border-sage-400 bg-sage-50 shadow-[0_3px_0_var(--color-sage-200)]",
        !selected && "border-neutral-300",
      )
    : cn(
        "hover:-translate-y-px hover:border-[#f59e0b] hover:bg-[#fffbeb]",
        selected && "border-[#f59e0b] bg-[#fffbeb] shadow-[0_3px_0_#fde68a]",
        !selected && "border-neutral-300",
      );
  const iconColor = selected
    ? isIntro
      ? "text-sage-500"
      : "text-[#d97706]"
    : "text-ink-tertiary";
  const titleColor = selected
    ? isIntro
      ? "text-sage-600"
      : "text-[#b45309]"
    : "text-ink";

  return (
    <button type="button" className={cn(baseBtn, variantBtn)} onClick={onClick}>
      {isIntro ? (
        <svg
          className={cn(
            "size-[18px] shrink-0 transition-colors duration-150",
            iconColor,
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="22" x2="12" y2="11" />
          <path d="M12 15c-2-2-6-2-7-1s0 4 3 5" />
          <path d="M12 12c2-2 6-2 7-1s0 4-3 5" />
          <line x1="4" y1="22" x2="20" y2="22" />
        </svg>
      ) : (
        <svg
          className={cn(
            "size-[18px] shrink-0 transition-colors duration-150",
            iconColor,
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      )}
      <div className="flex min-w-0 flex-col">
        <div className={cn("text-[13px] font-bold leading-[1.15]", titleColor)}>
          {title}
        </div>
        <div className="mt-px text-[10.5px] leading-[1.3] text-ink-tertiary">{desc}</div>
      </div>
    </button>
  );
}

function autoGrow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}
