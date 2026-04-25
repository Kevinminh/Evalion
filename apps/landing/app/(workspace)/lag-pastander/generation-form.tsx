"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { api } from "@workspace/backend/convex/_generated/api";

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

  const [fag, setFag] = useState(initialFag);
  const [trinn, setTrinn] = useState(initialTrinn);
  const [forkunnskap, setForkunnskap] = useState<Forkunnskap | "">(initialForkunnskap ?? "");
  const [tema, setTema] = useState("");
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
    router.push(`/velg-pastander?${params.toString()}`);
  }

  return (
    <form className="gen-box" onSubmit={handleSubmit} noValidate>
      <div className="gen-intro">
        <img className="gen-intro-reddi" src="/assets/Reddi.png" alt="Reddi" />
        <div className="gen-intro-text">
          <ol className="gen-steps">
            <li className="gen-step">
              <span className="gen-step-num">1</span>
              <span className="gen-step-text">Fyll ut alle feltene nedenfor</span>
            </li>
            <li className="gen-step">
              <span className="gen-step-num">2</span>
              <span className="gen-step-text">Reddi lager 9 gode forslag</span>
            </li>
            <li className="gen-step">
              <span className="gen-step-num">3</span>
              <span className="gen-step-text">Velg påstandene du vil bruke</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="gen-row">
        <div>
          <label className="field-label" htmlFor="fag">
            Fag
          </label>
          <select
            className="field-select"
            id="fag"
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
        <div>
          <label className="field-label" htmlFor="trinn">
            Trinn
          </label>
          <select
            className="field-select"
            id="trinn"
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
      </div>

      <div className="gen-single">
        <div className="field-label">Forkunnskaper</div>
        <div className="forkunnskap-row">
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

      <div className="gen-single">
        <label className="field-label" htmlFor="tema">
          Tema
        </label>
        <textarea
          ref={temaRef}
          className="field-textarea"
          id="tema"
          rows={1}
          placeholder="F.eks. Newtons lover, fotosyntese, brøkregning…"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          required
        />
      </div>

      <div className="gen-footer">
        <button type="submit" className="generate-btn" disabled={submitting}>
          {submitting ? "Sender Reddi i sving …" : "Lag påstander ✨"}
        </button>
      </div>

      {error && (
        <p className="gen-error" role="alert">
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
  return (
    <button
      type="button"
      className={`forkunnskap-btn${selected ? " selected" : ""}`}
      data-forkunnskap={kind}
      onClick={onClick}
    >
      {kind === "intro" ? (
        <svg
          className="forkunnskap-icon"
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
          className="forkunnskap-icon"
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
      <div className="forkunnskap-text">
        <div className="forkunnskap-title">{title}</div>
        <div className="forkunnskap-desc">{desc}</div>
      </div>
    </button>
  );
}

function autoGrow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}
