import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { parseDraftJson } from "@workspace/evalion/lib/draft-utils";
import {
  toStatementPayload,
  toStatementsWithId,
  useStatements,
} from "@workspace/evalion/hooks/use-statements";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { ConceptTags } from "@/components/concept-tags";
import { CustomDropdown } from "@/components/custom-dropdown";
import { ForkunnskapSelector } from "@/components/forkunnskap-selector";
import { ReddiModal } from "@/components/reddi-modal";
import { StatementEditor } from "@/components/statement-editor";
import { VisibilityToggle } from "@/components/visibility-toggle";
import { api } from "@/lib/convex";
import { LABEL_CLASS, SUBJECT_OPTIONS, LEVEL_OPTIONS } from "@/lib/constants";
import type { FagPratType, Visibility } from "@/lib/types";

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
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState("");
  const [concepts, setConcepts] = useState<string[]>([]);
  const [fag, setFag] = useState("");
  const [trinn, setTrinn] = useState("");
  const [forkunnskap, setForkunnskap] = useState<FagPratType | null>(null);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [reddiOpen, setReddiOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const createFagPrat = useMutation(api.fagprats.create);
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
    if (draft.visibility) setVisibility(draft.visibility);
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
      visibility,
    });

  const handleReddiSubmit = (topic: string) => {
    setReddiOpen(false);
    navigate({
      to: "/velg-pastander",
      search: { draft: buildDraftJson(), statements: "", topic },
    });
  };

  const canProceed = fag && trinn && forkunnskap && statements.length > 0;
  const reddiReady = fag && trinn && forkunnskap;

  const handleNext = () => {
    setStep(2);
  };

  const handleSave = async () => {
    if (!forkunnskap) return;
    setSaving(true);
    try {
      const id = await createFagPrat({
        title: title.trim(),
        subject: fag,
        level: trinn,
        type: forkunnskap,
        concepts,
        statements: toStatementPayload(statements),
        visibility,
      });
      navigate({ to: "/fagprat/$id", params: { id } });
    } catch {
      toast.error("Kunne ikke lagre FagPraten. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  };

  if (step === 2) {
    return (
      <div className="max-w-[900px]">
        {/* Page header (non-sticky per design) */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Fullfør FagPraten</h1>
          <div className="flex shrink-0 items-center gap-3">
            <Button variant="outline" onClick={() => setStep(1)} disabled={saving}>
              Tilbake
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || saving}>
              {saving ? "Lagrer..." : "Lagre"}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border-[1.5px] border-border bg-card p-6 shadow-sm sm:p-8">
          {/* Tittel */}
          <div className="mb-6">
            <label className={`mb-2 block ${LABEL_CLASS}`}>
              Tittel på din FagPrat
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="F.eks. Newtons lover, Fotosyntesen..."
              className="w-full rounded-xl border-[1.5px] border-border bg-muted/30 px-4 py-3 text-lg font-extrabold text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary focus:bg-card focus:ring-3 focus:ring-primary/20 sm:text-xl"
            />
          </div>

          {/* Viktige begreper */}
          <div className="mb-6">
            <ConceptTags concepts={concepts} onChange={setConcepts} showAiButton />
          </div>

          {/* Synlighet */}
          <VisibilityToggle value={visibility} onChange={setVisibility} showDescription />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px]">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-4 mb-8 flex items-center justify-between border-b bg-background px-4 py-4 sm:-mx-6 md:-mx-10 md:px-10">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Lag en FagPrat</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate({ to: "/" })}>
            Avbryt
          </Button>
          <Button disabled={!canProceed} onClick={handleNext}>
            Neste
          </Button>
        </div>
      </div>

      {/* Metadata card */}
      <div className="mb-8 rounded-2xl border-[1.5px] border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
          <CustomDropdown
            label="Fag"
            value={fag}
            onChange={setFag}
            placeholder="Velg fag"
            options={SUBJECT_OPTIONS}
          />
          <CustomDropdown
            label="Trinn"
            value={trinn}
            onChange={setTrinn}
            placeholder="Velg trinn"
            options={LEVEL_OPTIONS}
          />
        </div>

        <ForkunnskapSelector value={forkunnskap} onChange={setForkunnskap} />
      </div>

      <ReddiModal open={reddiOpen} onClose={() => setReddiOpen(false)} onSubmit={handleReddiSubmit} />

      {/* Mine påstander */}
      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-foreground">Mine påstander</h2>
          <div className="flex items-center gap-3">
            <div className="group relative">
              <button
                disabled={!reddiReady}
                onClick={() => setReddiOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100/40 px-5 py-2 text-sm font-bold text-purple-600 transition-all hover:-translate-y-px hover:border-purple-500 hover:from-purple-100 hover:to-purple-50 hover:shadow-sm disabled:translate-y-0 disabled:cursor-default disabled:opacity-45 disabled:saturate-[0.7]"
              >
                <img src="/reddi.png" alt="Reddi" className="size-4" />
                Lag påstander med REDDI
              </button>
              {!reddiReady && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background shadow-md group-hover:block">
                  Velg fag, trinn og forkunnskaper for å bruke REDDI
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={addStatement}>
              <Plus className="size-4" />
              Legg til påstand
            </Button>
          </div>
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
