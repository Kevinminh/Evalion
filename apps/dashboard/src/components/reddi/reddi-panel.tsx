import { api } from "@workspace/backend/convex/_generated/api";
import { cn } from "@workspace/ui/lib/utils";
import { useAction } from "convex/react";
import { AlertTriangle, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { SkeletonColumn } from "@/components/reddi/skeleton-column";
import { StatementColumn, type StatementColumnConfig } from "@/components/reddi/statement-column";
import type { Fasit, FagPratType } from "@/lib/types";

interface Statement {
  id: string;
  text: string;
  fasit: Fasit;
  explanation: string;
}

type ChosenStatement = { text: string; fasit: Fasit; explanation: string };

interface ReddiPanelProps {
  subject: string;
  level: string;
  type: FagPratType;
  topic: string;
  onClose: () => void;
  onAdd: (chosen: ChosenStatement[]) => void;
}

const COLUMN_CONFIG: Record<Fasit, StatementColumnConfig> = {
  sant: {
    title: "Sant",
    headerBg: "bg-sant-bg",
    headerText: "text-sant",
    headerBorderBottom: "border-b-[#81C784]",
    selectedBorder: "border-sant",
    selectedRing: "shadow-[0_0_0_2px_#C8E6C9]",
  },
  usant: {
    title: "Usant",
    headerBg: "bg-usant-bg",
    headerText: "text-usant",
    headerBorderBottom: "border-b-[#EF9A9A]",
    selectedBorder: "border-usant",
    selectedRing: "shadow-[0_0_0_2px_#FFCDD2]",
  },
  delvis: {
    title: "Delvis sant",
    headerBg: "bg-delvis-bg",
    headerText: "text-[#E65100]",
    headerBorderBottom: "border-b-[#FFCC80]",
    selectedBorder: "border-[#FB8C00]",
    selectedRing: "shadow-[0_0_0_2px_#FFE0B2]",
  },
};

export function ReddiPanel({ subject, level, type, topic, onClose, onAdd }: ReddiPanelProps) {
  const generate = useAction(api.reddi.generateStatements);

  const [allStatements, setAllStatements] = useState<Statement[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const handleGenerate = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setAllStatements([]);
    setSelected(new Set());
    try {
      const result = await generate({ topic, subject, level, type });
      if (requestIdRef.current !== requestId) return;
      setAllStatements(result);
    } catch (e) {
      if (requestIdRef.current !== requestId) return;
      setError(e instanceof Error ? e.message : "Noe gikk galt. Prøv igjen.");
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [topic, subject, level, type, generate]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    const chosen = allStatements
      .filter((s) => selected.has(s.id))
      .map((s) => ({ text: s.text, fasit: s.fasit, explanation: s.explanation }));
    onAdd(chosen);
  };

  const santStatements = allStatements.filter((s) => s.fasit === "sant");
  const usantStatements = allStatements.filter((s) => s.fasit === "usant");
  const delvisStatements = allStatements.filter((s) => s.fasit === "delvis");

  const showColumns = !loading && allStatements.length > 0;

  return (
    <>
      <div className="pb-24">
        {/* Back link */}
        <button
          onClick={onClose}
          className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Tilbake
        </button>

        {/* Page header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-3xl font-extrabold text-foreground">Velg påstander</h1>
            <p className="text-sm text-muted-foreground">
              Velg påstandene du vil ha med — REDDI lager forklaringene automatisk.
            </p>
          </div>
          {showColumns && (
            <button
              onClick={handleGenerate}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border-[1.5px] border-neutral-200 px-4 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:border-neutral-300 hover:text-foreground"
            >
              <RefreshCw className="size-4" />
              Generer nye
            </button>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="size-5 shrink-0 text-destructive" />
            <p className="flex-1 text-sm font-medium text-destructive">{error}</p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground transition-opacity hover:opacity-90"
            >
              <RefreshCw className="size-4" />
              Prøv igjen
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonColumn {...COLUMN_CONFIG.sant} />
            <SkeletonColumn {...COLUMN_CONFIG.usant} />
            <SkeletonColumn {...COLUMN_CONFIG.delvis} />
          </div>
        )}

        {/* Statement columns */}
        {showColumns && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatementColumn
              {...COLUMN_CONFIG.sant}
              statements={santStatements}
              selected={selected}
              onToggle={toggle}
            />
            <StatementColumn
              {...COLUMN_CONFIG.usant}
              statements={usantStatements}
              selected={selected}
              onToggle={toggle}
            />
            <StatementColumn
              {...COLUMN_CONFIG.delvis}
              statements={delvisStatements}
              selected={selected}
              onToggle={toggle}
            />
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed right-0 bottom-0 left-0 z-30 border-t-[1.5px] border-neutral-200 bg-card px-8 py-4 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:left-[220px]">
        <div className="mx-auto flex max-w-[900px] items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/reddi.png" alt="Reddi" className="size-11 object-contain" />
            <span className="text-base font-bold text-muted-foreground">Foreslått av REDDI</span>
          </div>
          <button
            disabled={selected.size === 0}
            onClick={handleAdd}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all",
              selected.size > 0
                ? "cursor-pointer bg-purple-500 shadow-[0_4px_0_var(--color-purple-700)] hover:-translate-y-0.5 hover:bg-purple-400 hover:shadow-[0_6px_0_var(--color-purple-700)] active:translate-y-0.5 active:shadow-[0_2px_0_var(--color-purple-700)]"
                : "cursor-not-allowed bg-neutral-300",
            )}
          >
            Legg til {selected.size} {selected.size === 1 ? "påstand" : "påstander"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </>
  );
}
