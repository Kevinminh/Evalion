import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "@workspace/backend/convex/_generated/api";
import { cn } from "@workspace/ui/lib/utils";
import { useAction } from "convex/react";
import { AlertTriangle, ArrowLeft, ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const Route = createFileRoute("/_dashboard/velg-pastander")({
  validateSearch: (search: Record<string, unknown>) => ({
    statements: (search.statements as string) ?? "",
    draft: (search.draft as string) ?? "",
    topic: (search.topic as string) ?? "",
  }),
  component: VelgPastanderPage,
});

interface Statement {
  id: string;
  text: string;
  fasit: "sant" | "usant" | "delvis";
  explanation: string;
}

function SkeletonColumn({ title, headerBg, headerText, borderTopColor }: {
  title: string;
  headerBg: string;
  headerText: string;
  borderTopColor: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border-[1.5px] border-border bg-card p-4",
        "border-t-4",
        borderTopColor,
      )}
    >
      <div
        className={cn(
          "mb-4 rounded-xl px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider",
          headerBg,
          headerText,
        )}
      >
        {title}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl border-2 border-border bg-muted/30 p-4">
            <div className="mb-2 h-3 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatementColumn({
  title,
  statements,
  selected,
  onToggle,
  headerBg,
  headerText,
  selectedBorder,
  selectedGlow,
  borderTopColor,
}: {
  title: string;
  statements: Statement[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  headerBg: string;
  headerText: string;
  selectedBorder: string;
  selectedGlow: string;
  borderTopColor: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border-[1.5px] border-border bg-card p-4",
        "border-t-4",
        borderTopColor,
      )}
    >
      <div
        className={cn(
          "mb-4 rounded-xl px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider",
          headerBg,
          headerText,
        )}
      >
        {title}
      </div>
      <div className="space-y-3">
        {statements.map((stmt) => {
          const isSelected = selected.has(stmt.id);
          return (
            <button
              key={stmt.id}
              onClick={() => onToggle(stmt.id)}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left text-sm leading-relaxed transition-all",
                isSelected
                  ? `${selectedBorder} ${selectedGlow} bg-card`
                  : "border-border bg-muted/30 hover:border-muted-foreground/30 hover:bg-muted/60",
              )}
            >
              {stmt.text}
            </button>
          );
        })}
        {statements.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Ingen påstander i denne kategorien
          </p>
        )}
      </div>
    </div>
  );
}

function VelgPastanderPage() {
  const navigate = useNavigate();
  const { statements: statementsJson, draft: draftJson, topic } = Route.useSearch();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allStatements, setAllStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useAction(api.reddi.generateStatements);

  // Parse draft to extract context for AI generation
  let draftSubject = "";
  let draftLevel = "";
  let draftType: "intro" | "oppsummering" = "intro";
  try {
    if (draftJson) {
      const draft = JSON.parse(draftJson) as {
        subject?: string;
        level?: string;
        type?: "intro" | "oppsummering";
      };
      draftSubject = draft.subject ?? "";
      draftLevel = draft.level ?? "";
      draftType = draft.type ?? "intro";
    }
  } catch {
    // Invalid JSON
  }

  const handleGenerate = useCallback(async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    setAllStatements([]);
    setSelected(new Set());
    try {
      const result = await generate({
        topic,
        subject: draftSubject,
        level: draftLevel,
        type: draftType,
      });
      setAllStatements(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }, [topic, draftSubject, draftLevel, draftType, generate]);

  // Generate statements on mount if we have a topic
  useEffect(() => {
    if (topic) {
      handleGenerate();
    } else if (statementsJson) {
      // Parse pre-existing statements from search params
      try {
        setAllStatements(JSON.parse(statementsJson) as Statement[]);
      } catch {
        // Invalid JSON
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const santStatements = allStatements.filter((s) => s.fasit === "sant");
  const usantStatements = allStatements.filter((s) => s.fasit === "usant");
  const delvisStatements = allStatements.filter((s) => s.fasit === "delvis");

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddStatements = () => {
    const selectedStatements = allStatements.filter((s) => selected.has(s.id));

    // Parse existing draft or create empty one
    let draft: Record<string, unknown> = {};
    try {
      if (draftJson) {
        draft = JSON.parse(draftJson) as Record<string, unknown>;
      }
    } catch {
      // Invalid JSON
    }

    // Merge selected statements into draft
    const existingStatements =
      (draft.statements as Array<{ text: string; fasit: string; explanation: string }>) ?? [];
    const newStatements = [
      ...existingStatements,
      ...selectedStatements.map((s) => ({
        text: s.text,
        fasit: s.fasit,
        explanation: s.explanation,
      })),
    ];

    draft.statements = newStatements;

    navigate({
      to: "/lag-fagprat",
      search: { draft: JSON.stringify(draft) },
    });
  };

  const columnConfig = {
    sant: {
      title: "Sant",
      headerBg: "bg-sant-bg",
      headerText: "text-sant",
      selectedBorder: "border-sant",
      selectedGlow: "shadow-[0_0_12px_color-mix(in_oklch,var(--sant)_25%,transparent)]",
      borderTopColor: "border-t-sant",
    },
    usant: {
      title: "Usant",
      headerBg: "bg-usant-bg",
      headerText: "text-usant",
      selectedBorder: "border-usant",
      selectedGlow: "shadow-[0_0_12px_color-mix(in_oklch,var(--usant)_25%,transparent)]",
      borderTopColor: "border-t-usant",
    },
    delvis: {
      title: "Delvis sant",
      headerBg: "bg-delvis-bg",
      headerText: "text-delvis",
      selectedBorder: "border-delvis",
      selectedGlow: "shadow-[0_0_12px_color-mix(in_oklch,var(--delvis)_25%,transparent)]",
      borderTopColor: "border-t-delvis",
    },
  };

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate({ to: "/lag-fagprat", search: { draft: draftJson } })}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Tilbake
      </button>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            Velg påstander
          </h1>
          <p className="text-base text-muted-foreground">
            Velg hvilke påstander du vil inkludere i FagPraten
          </p>
        </div>
        {topic && !loading && allStatements.length > 0 && (
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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

      {/* Loading indicator + skeleton */}
      {loading && (
        <>
          <div className="mb-6 flex items-center gap-4 rounded-2xl border-[1.5px] border-primary/20 bg-primary/5 p-5">
            <img src="/reddi.png" alt="Reddi" className="size-10 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">REDDI genererer påstander...</p>
              <p className="text-xs text-muted-foreground">
                Lager 9 påstander tilpasset {topic ? `«${topic}»` : "temaet ditt"}
              </p>
            </div>
            <Sparkles className="size-5 animate-pulse text-primary" />
          </div>
          <div className="mb-24 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <SkeletonColumn {...columnConfig.sant} />
            <SkeletonColumn {...columnConfig.usant} />
            <SkeletonColumn {...columnConfig.delvis} />
          </div>
        </>
      )}

      {/* Statement columns */}
      {!loading && allStatements.length > 0 && (
        <div className="mb-24 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <StatementColumn
            {...columnConfig.sant}
            statements={santStatements}
            selected={selected}
            onToggle={toggle}
          />
          <StatementColumn
            {...columnConfig.usant}
            statements={usantStatements}
            selected={selected}
            onToggle={toggle}
          />
          <StatementColumn
            {...columnConfig.delvis}
            statements={delvisStatements}
            selected={selected}
            onToggle={toggle}
          />
        </div>
      )}

      {/* Empty state when no topic and no statements */}
      {!loading && !error && allStatements.length === 0 && (
        <div className="mb-24 rounded-2xl border-2 border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">Ingen påstander å vise</p>
        </div>
      )}

      {/* Fixed bottom bar */}
      <div className="fixed right-0 bottom-0 left-0 z-20 flex items-center justify-between border-t bg-card px-4 py-3 sm:px-8 sm:py-4 md:left-[220px]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          <span className="font-semibold">Foreslått av REDDI</span>
        </div>
        <button
          disabled={selected.size === 0}
          onClick={handleAddStatements}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all",
            selected.size > 0
              ? "bg-primary text-primary-foreground shadow-[0_3px_0_oklch(0.35_0.16_295)] hover:-translate-y-0.5"
              : "bg-muted text-muted-foreground",
          )}
        >
          Legg til {selected.size} {selected.size === 1 ? "påstand" : "påstander"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
