import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { ConceptTags } from "@/components/concept-tags";
import { ForkunnskapSelector } from "@/components/forkunnskap-selector";
import { StatementEditor } from "@/components/statement-editor";

export const Route = createFileRoute("/_dashboard/lag-fagprat")({
  component: LagFagPratPage,
});

interface StatementDraft {
  statement: string;
  fasit: "sant" | "usant" | "delvis";
  explanation: string;
}

function LagFagPratPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [concepts, setConcepts] = useState<string[]>([]);
  const [fag, setFag] = useState("");
  const [trinn, setTrinn] = useState("");
  const [forkunnskap, setForkunnskap] = useState<"intro" | "oppsummering" | null>(null);
  const [statements, setStatements] = useState<StatementDraft[]>([]);

  const addStatement = () => {
    setStatements([...statements, { statement: "", fasit: "sant", explanation: "" }]);
  };

  const updateStatement = (index: number, field: keyof StatementDraft, value: string) => {
    const updated = [...statements];
    updated[index] = { ...updated[index], [field]: value };
    setStatements(updated);
  };

  const removeStatement = (index: number) => {
    setStatements(statements.filter((_, i) => i !== index));
  };

  const canProceed = title.trim() && fag && trinn && forkunnskap;

  return (
    <div className="max-w-[900px]">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-10 mb-8 flex items-center justify-between border-b bg-background px-10 py-4">
        <h1 className="text-2xl font-extrabold text-foreground">Lag en FagPrat</h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate({ to: "/" })}>
            Avbryt
          </Button>
          <Button
            disabled={!canProceed}
            onClick={() => navigate({ to: "/lagre-fagprat" })}
          >
            Neste
          </Button>
        </div>
      </div>

      {/* Title card */}
      <div className="mb-6 rounded-2xl border-[1.5px] border-border bg-card p-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Gi FagPraten en tittel..."
          className="mb-4 w-full border-none bg-transparent text-xl font-extrabold text-foreground outline-none placeholder:text-muted-foreground/40"
        />
        <ConceptTags concepts={concepts} onChange={setConcepts} />
      </div>

      {/* Metadata card */}
      <div className="mb-6 rounded-2xl border-[1.5px] border-border bg-card p-6">
        <div className="mb-6 grid grid-cols-2 gap-4">
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
              <option value="Naturfag">Naturfag</option>
              <option value="Matematikk">Matematikk</option>
              <option value="Samfunnsfag">Samfunnsfag</option>
              <option value="Norsk">Norsk</option>
              <option value="Engelsk">Engelsk</option>
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
              <option value="8. trinn">8. trinn</option>
              <option value="9. trinn">9. trinn</option>
              <option value="10. trinn">10. trinn</option>
              <option value="VG1">VG1</option>
              <option value="VG2">VG2</option>
              <option value="VG3">VG3</option>
            </select>
          </div>
        </div>

        <ForkunnskapSelector value={forkunnskap} onChange={setForkunnskap} />
      </div>

      {/* REDDI button */}
      <div className="mb-8">
        <button
          disabled={!fag || !trinn}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary via-teal-500 to-accent px-6 py-4 text-base font-bold text-white shadow-lg transition-all disabled:opacity-40 disabled:saturate-50"
        >
          <Sparkles className="size-5" />
          Lag påstander med REDDI
        </button>
        {(!fag || !trinn) && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Velg fag og trinn for å bruke REDDI
          </p>
        )}
      </div>

      {/* Manual statements */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground">Påstander</h2>
          <Button variant="outline" size="sm" onClick={addStatement}>
            <Plus className="size-4" />
            Legg til påstand
          </Button>
        </div>
        <div className="space-y-4">
          {statements.map((stmt, i) => (
            <StatementEditor
              key={i}
              index={i}
              statement={stmt.statement}
              fasit={stmt.fasit}
              explanation={stmt.explanation}
              onStatementChange={(v) => updateStatement(i, "statement", v)}
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
      </div>
    </div>
  );
}
