import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { parseDraftJson } from "@workspace/ui/lib/draft-utils";
import {
  toStatementPayload,
  toStatementsWithId,
  useStatements,
} from "@workspace/ui/hooks/use-statements";
import { Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { ConceptTags } from "@/components/concept-tags";
import { ForkunnskapSelector } from "@/components/forkunnskap-selector";
import { ReddiModal } from "@/components/reddi-modal";
import { StatementEditor } from "@/components/statement-editor";
import { SUBJECT_OPTIONS, LEVEL_OPTIONS } from "@/lib/constants";
import type { FagPratType } from "@/lib/types";

const searchSchema = z.object({
  draft: z.string().catch(""),
});

export const Route = createFileRoute("/_dashboard/lag-fagprat")({
  validateSearch: searchSchema,
  component: LagFagPratPage,
});

function LagFagPratPage() {
  const navigate = useNavigate();
  const { draft: draftParam } = Route.useSearch();
  const [title, setTitle] = useState("");
  const [concepts, setConcepts] = useState<string[]>([]);
  const [fag, setFag] = useState("");
  const [trinn, setTrinn] = useState("");
  const [forkunnskap, setForkunnskap] = useState<FagPratType | null>(null);
  const [reddiOpen, setReddiOpen] = useState(false);
  const {
    statements,
    setStatements,
    addStatement,
    updateStatement,
    removeStatement,
    handleDragEnd,
  } = useStatements();

  useEffect(() => {
    if (!draftParam) return;
    const draft = parseDraftJson(draftParam);
    if (!draft) return;
    if (draft.title) setTitle(draft.title);
    if (draft.concepts) setConcepts(draft.concepts);
    if (draft.subject) setFag(draft.subject);
    if (draft.level) setTrinn(draft.level);
    if (draft.type) setForkunnskap(draft.type);
    if (draft.statements) {
      setStatements(toStatementsWithId(draft.statements));
    }
  }, [draftParam]);

  const buildDraftJson = () =>
    JSON.stringify({
      title,
      concepts,
      subject: fag,
      level: trinn,
      type: forkunnskap,
      statements: toStatementPayload(statements),
    });

  const handleReddiSubmit = (topic: string) => {
    setReddiOpen(false);
    navigate({
      to: "/velg-pastander",
      search: { draft: buildDraftJson(), statements: "", topic },
    });
  };

  const canProceed = title.trim() && fag && trinn && forkunnskap;

  const handleNext = () => {
    navigate({
      to: "/lagre-fagprat",
      search: { draft: buildDraftJson() },
    });
  };

  return (
    <div className="max-w-[900px]">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-4 mb-6 flex items-center justify-between border-b bg-background px-4 py-4 sm:-mx-6 sm:mb-8 md:-mx-10 md:px-10">
        <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">Lag en FagPrat</h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate({ to: "/" })}>
            Avbryt
          </Button>
          <Button disabled={!canProceed} onClick={handleNext}>
            Neste
          </Button>
        </div>
      </div>

      {/* Title card */}
      <div className="mb-6 rounded-2xl border-[1.5px] border-border bg-card p-4 sm:p-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Gi FagPraten en tittel..."
          className="mb-4 w-full border-none bg-transparent text-lg font-extrabold text-foreground outline-none placeholder:text-muted-foreground/40 sm:text-xl"
        />
        <ConceptTags concepts={concepts} onChange={setConcepts} />
      </div>

      {/* Metadata card */}
      <div className="mb-6 rounded-2xl border-[1.5px] border-border bg-card p-4 sm:p-6">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
              Fag
            </label>
            <select
              value={fag}
              onChange={(e) => setFag(e.target.value)}
              className="w-full appearance-none rounded-xl border-2 border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/20"
            >
              <option value="">Velg fag...</option>
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
              Trinn
            </label>
            <select
              value={trinn}
              onChange={(e) => setTrinn(e.target.value)}
              className="w-full appearance-none rounded-xl border-2 border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/20"
            >
              <option value="">Velg trinn...</option>
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <ForkunnskapSelector value={forkunnskap} onChange={setForkunnskap} />
      </div>

      {/* REDDI button */}
      <div className="mb-8">
        <button
          disabled={!fag || !trinn || !forkunnskap}
          onClick={() => setReddiOpen(true)}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary via-teal-500 to-accent px-6 py-4 text-base font-bold text-white shadow-lg transition-all disabled:opacity-40 disabled:saturate-50"
        >
          <Sparkles className="size-5" />
          Lag påstander med REDDI
        </button>
        {(!fag || !trinn || !forkunnskap) && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Velg fag, trinn og forkunnskap for å bruke REDDI
          </p>
        )}
      </div>

      <ReddiModal open={reddiOpen} onClose={() => setReddiOpen(false)} onSubmit={handleReddiSubmit} />

      {/* Manual statements */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground">Påstander</h2>
          <Button variant="outline" size="sm" onClick={addStatement}>
            <Plus className="size-4" />
            Legg til påstand
          </Button>
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={statements.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {statements.map((stmt, i) => (
                <StatementEditor
                  key={stmt.id}
                  id={stmt.id}
                  index={i}
                  text={stmt.text}
                  fasit={stmt.fasit}
                  explanation={stmt.explanation}
                  onTextChange={(v) => updateStatement(i, "text", v)}
                  onFasitChange={(v) => updateStatement(i, "fasit", v)}
                  onExplanationChange={(v) => updateStatement(i, "explanation", v)}
                  onDelete={() => removeStatement(i)}
                />
              ))}
              {statements.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
                  <p className="text-muted-foreground">
                    Bruk REDDI eller legg til påstander manuelt
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
