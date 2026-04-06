import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { RouteErrorBoundary } from "@workspace/ui/components/route-error-boundary";
import { FagPratDetailSkeleton } from "@workspace/ui/components/skeletons/fagprat-detail-skeleton";
import {
  toStatementPayload,
  toStatementsWithId,
  useStatements,
} from "@workspace/ui/hooks/use-statements";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/components/error-state";
import { MetadataCard } from "@/components/metadata-card";
import { NotFoundState } from "@/components/not-found-state";
import { StatementEditor } from "@/components/statement-editor";
import { api, fagpratQueries } from "@/lib/convex";
import type { FagPratId, FagPratType, Visibility } from "@/lib/types";

export const Route = createFileRoute("/_dashboard/fagprat/$id/rediger")({
  component: EditFagPratPage,
  errorComponent: RouteErrorBoundary,
});

function EditFagPratPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: fagprat, isPending, isError } = useQuery(fagpratQueries.getById(id as FagPratId));
  const updateFagPrat = useMutation(api.fagprats.update);

  const [title, setTitle] = useState("");
  const [fag, setFag] = useState("");
  const [trinn, setTrinn] = useState("");
  const [forkunnskap, setForkunnskap] = useState<FagPratType | null>(null);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const {
    statements,
    setStatements,
    addStatement,
    updateStatement,
    removeStatement,
    handleDragEnd,
  } = useStatements();

  // Sync local state only on first load or when navigating to a different fagprat
  const initializedForId = useRef<string | null>(null);
  useEffect(() => {
    if (fagprat && initializedForId.current !== id) {
      initializedForId.current = id;
      setTitle(fagprat.title);
      setFag(fagprat.subject);
      setTrinn(fagprat.level);
      setForkunnskap(fagprat.type);
      setConcepts(fagprat.concepts);
      setVisibility(fagprat.visibility);
      setStatements(toStatementsWithId(fagprat.statements));
    }
  }, [fagprat, id, setStatements]);

  if (isPending) {
    return <FagPratDetailSkeleton />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (!fagprat) {
    return <NotFoundState />;
  }

  const handleSave = async () => {
    try {
      await updateFagPrat({
        id: fagprat._id,
        title,
        subject: fag,
        level: trinn,
        type: forkunnskap ?? undefined,
        concepts,
        visibility,
        statements: toStatementPayload(statements),
      });
      navigate({ to: "/fagprat/$id", params: { id } });
    } catch {
      toast.error("Kunne ikke lagre endringene. Prøv igjen.");
    }
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

      <MetadataCard
        title={title}
        onTitleChange={setTitle}
        subject={fag}
        onSubjectChange={setFag}
        level={trinn}
        onLevelChange={setTrinn}
        type={forkunnskap}
        onTypeChange={setForkunnskap}
        concepts={concepts}
        onConceptsChange={setConcepts}
        visibility={visibility}
        onVisibilityChange={setVisibility}
      />

      {/* Statements */}
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
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
