import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useMutation } from "convex/react";
import { Pencil, Globe, Lock, Plus } from "lucide-react";
import { useState, useEffect } from "react";

import { FagPratDetailSkeleton } from "@workspace/ui/components/skeletons/fagprat-detail-skeleton";
import { ConceptTags } from "@/components/concept-tags";
import { ForkunnskapSelector } from "@/components/forkunnskap-selector";
import { StatementEditor } from "@/components/statement-editor";
import { fagpratQueries, api } from "@/lib/convex";
import type { FagPratId } from "@/lib/types";

export const Route = createFileRoute("/_dashboard/fagprat/$id/rediger")({
  component: EditFagPratPage,
});

function EditFagPratPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: fagprat, isPending } = useQuery(fagpratQueries.getById(id as FagPratId));
  const updateFagPrat = useMutation(api.fagprats.update);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [fag, setFag] = useState("");
  const [trinn, setTrinn] = useState("");
  const [forkunnskap, setForkunnskap] = useState<"intro" | "oppsummering" | null>(null);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [statements, setStatements] = useState<
    { statement: string; fasit: "sant" | "usant" | "delvis"; explanation: string }[]
  >([]);

  // Sync local state when data loads
  useEffect(() => {
    if (fagprat) {
      setTitle(fagprat.title);
      setFag(fagprat.subject);
      setTrinn(fagprat.level);
      setForkunnskap(fagprat.type);
      setConcepts(fagprat.concepts);
      setVisibility(fagprat.visibility);
      setStatements(
        fagprat.statements.map((s) => ({
          statement: s.text,
          fasit: s.fasit,
          explanation: s.explanation,
        })),
      );
    }
  }, [fagprat]);

  if (isPending) {
    return <FagPratDetailSkeleton />;
  }

  if (!fagprat) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">FagPrat ikke funnet.</p>
      </div>
    );
  }

  const updateStatement = (
    index: number,
    field: "statement" | "fasit" | "explanation",
    value: string,
  ) => {
    const updated = [...statements];
    updated[index] = { ...updated[index], [field]: value };
    setStatements(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);
      setStatements((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const handleSave = async () => {
    await updateFagPrat({
      id: fagprat._id,
      title,
      subject: fag,
      level: trinn,
      type: forkunnskap ?? undefined,
      concepts,
      visibility,
      statements: statements.map((s) => ({
        text: s.statement,
        fasit: s.fasit,
        explanation: s.explanation,
      })),
    });
    navigate({ to: "/fagprat/$id", params: { id } });
  };

  return (
    <div className="max-w-[900px]">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-4 mb-6 flex items-center justify-between border-b bg-background px-4 py-4 sm:-mx-6 sm:mb-8 md:-mx-10 md:px-10">
        <h2 className="text-lg font-extrabold text-foreground sm:text-xl">Rediger FagPrat</h2>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate({ to: "/fagprat/$id", params: { id } })}>
            Avbryt
          </Button>
          <Button onClick={handleSave}>Lagre</Button>
        </div>
      </div>

      {/* Metadata card */}
      <div className="relative mb-8 max-w-[600px] rounded-2xl border-[1.5px] border-border bg-card p-4 sm:p-6">
        {!editing ? (
          /* Read mode */
          <>
            <button
              onClick={() => setEditing(true)}
              className="absolute right-4 top-4 rounded-lg border-2 border-primary/30 p-2 text-primary transition-all hover:border-primary/60 hover:bg-primary/5"
            >
              <Pencil className="size-4" />
            </button>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {fag}
              </span>
              <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {trinn}
              </span>
            </div>
            <h3 className="mb-1 flex items-center gap-2 text-lg font-extrabold text-foreground">
              {title}
              {visibility === "public" ? (
                <Globe className="size-4 text-muted-foreground" />
              ) : (
                <Lock className="size-4 text-muted-foreground" />
              )}
            </h3>
            <div className="mt-4">
              <ConceptTags concepts={concepts} onChange={setConcepts} editable={false} />
            </div>
          </>
        ) : (
          /* Edit mode */
          <>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tittel
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border-2 border-input bg-background px-4 py-2.5 text-base font-bold outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
              />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-foreground">
                  Fag
                </label>
                <select
                  value={fag}
                  onChange={(e) => setFag(e.target.value)}
                  className="w-full appearance-none rounded-xl border-2 border-input bg-card px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                >
                  <option value="Naturfag">Naturfag</option>
                  <option value="Matematikk">Matematikk</option>
                  <option value="Samfunnsfag">Samfunnsfag</option>
                  <option value="Norsk">Norsk</option>
                  <option value="Engelsk">Engelsk</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-foreground">
                  Trinn
                </label>
                <select
                  value={trinn}
                  onChange={(e) => setTrinn(e.target.value)}
                  className="w-full appearance-none rounded-xl border-2 border-input bg-card px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                >
                  <option value="8. trinn">8. trinn</option>
                  <option value="9. trinn">9. trinn</option>
                  <option value="10. trinn">10. trinn</option>
                  <option value="VG1">VG1</option>
                  <option value="VG2">VG2</option>
                  <option value="VG3">VG3</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <ConceptTags concepts={concepts} onChange={setConcepts} />
            </div>
            <ForkunnskapSelector value={forkunnskap} onChange={setForkunnskap} />
            <div className="mt-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Synlighet
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setVisibility("public")}
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all",
                    visibility === "public"
                      ? "border-primary/40 bg-primary/5 text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  <Globe className="size-4" /> Offentlig
                </button>
                <button
                  onClick={() => setVisibility("private")}
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all",
                    visibility === "private"
                      ? "border-primary/40 bg-primary/5 text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  <Lock className="size-4" /> Privat
                </button>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Avbryt
              </Button>
              <Button size="sm" onClick={() => setEditing(false)}>
                Ferdig
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Statements */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-foreground">Påstander</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setStatements([...statements, { statement: "", fasit: "sant", explanation: "" }])
          }
        >
          <Plus className="size-4" />
          Legg til påstand
        </Button>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={statements.map((_, i) => i)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {statements.map((stmt, i) => (
              <StatementEditor
                key={i}
                id={i}
                index={i}
                statement={stmt.statement}
                fasit={stmt.fasit}
                explanation={stmt.explanation}
                onStatementChange={(v) => updateStatement(i, "statement", v)}
                onFasitChange={(v) => updateStatement(i, "fasit", v)}
                onExplanationChange={(v) => updateStatement(i, "explanation", v)}
                onDelete={() => setStatements(statements.filter((_, j) => j !== i))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
