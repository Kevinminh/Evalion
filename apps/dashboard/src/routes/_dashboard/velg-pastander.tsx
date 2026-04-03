import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

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
  const { statements: statementsJson, draft: draftJson } = Route.useSearch();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Parse statements from search params
  let allStatements: Statement[] = [];
  try {
    if (statementsJson) {
      allStatements = JSON.parse(statementsJson) as Statement[];
    }
  } catch {
    // Invalid JSON
  }

  // Show empty state if no statements were generated
  if (allStatements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-4 text-lg font-semibold text-foreground">
          Ingen påstander ble generert
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Gå tilbake og prøv igjen med REDDI.
        </p>
        <button
          onClick={() => navigate({ to: "/lag-fagprat", search: { draft: draftJson } })}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <ArrowLeft className="size-4" />
          Tilbake
        </button>
      </div>
    );
  }

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

      <h1 className="mb-2 text-3xl font-extrabold text-foreground">Velg påstander</h1>
      <p className="mb-8 text-base text-muted-foreground">
        Velg hvilke påstander du vil inkludere i FagPraten
      </p>

      {/* 3-column grid */}
      <div className="mb-24 grid grid-cols-3 gap-6">
        <StatementColumn
          title="Sant"
          statements={santStatements}
          selected={selected}
          onToggle={toggle}
          headerBg="bg-sant-bg"
          headerText="text-sant"
          selectedBorder="border-sant"
          selectedGlow="shadow-[0_0_12px_color-mix(in_oklch,var(--sant)_25%,transparent)]"
          borderTopColor="border-t-sant"
        />
        <StatementColumn
          title="Usant"
          statements={usantStatements}
          selected={selected}
          onToggle={toggle}
          headerBg="bg-usant-bg"
          headerText="text-usant"
          selectedBorder="border-usant"
          selectedGlow="shadow-[0_0_12px_color-mix(in_oklch,var(--usant)_25%,transparent)]"
          borderTopColor="border-t-usant"
        />
        <StatementColumn
          title="Delvis sant"
          statements={delvisStatements}
          selected={selected}
          onToggle={toggle}
          headerBg="bg-delvis-bg"
          headerText="text-delvis"
          selectedBorder="border-delvis"
          selectedGlow="shadow-[0_0_12px_color-mix(in_oklch,var(--delvis)_25%,transparent)]"
          borderTopColor="border-t-delvis"
        />
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed right-0 bottom-0 left-[220px] z-20 flex items-center justify-between border-t bg-card px-8 py-4">
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
