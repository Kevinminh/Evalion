import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Globe, Lock } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { ConceptTags } from "@/components/concept-tags";
import { cn } from "@workspace/ui/lib/utils";

export const Route = createFileRoute("/_dashboard/lagre-fagprat")({
  component: LagreFagPratPage,
});

function LagreFagPratPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [concepts, setConcepts] = useState<string[]>(["Drivhuseffekt", "CO₂", "Fossil energi"]);
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  return (
    <div className="max-w-[700px]">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/lag-fagprat" })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Tilbake
          </button>
          <h1 className="text-2xl font-extrabold text-foreground">Fullfør FagPraten</h1>
        </div>
        <Button onClick={() => navigate({ to: "/min-samling" })}>
          Lagre
        </Button>
      </div>

      {/* Title card */}
      <div className="rounded-2xl border-[1.5px] border-border bg-card p-6">
        {/* Title input */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tittel
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Gi FagPraten en tittel..."
            className="w-full rounded-xl border-2 border-input bg-muted/30 px-4 py-3 text-xl font-extrabold text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary focus:bg-card focus:ring-3 focus:ring-primary/20"
          />
        </div>

        {/* Concepts */}
        <div className="mb-6">
          <ConceptTags concepts={concepts} onChange={setConcepts} />
        </div>

        {/* Visibility */}
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Synlighet
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setVisibility("public")}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                visibility === "public"
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-muted-foreground/30",
              )}
            >
              <Globe className="size-5 shrink-0" />
              <span className="text-sm font-semibold">Offentlig</span>
            </button>
            <button
              onClick={() => setVisibility("private")}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                visibility === "private"
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-muted-foreground/30",
              )}
            >
              <Lock className="size-5 shrink-0" />
              <span className="text-sm font-semibold">Privat</span>
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {visibility === "public"
              ? "Alle kan finne og bruke denne FagPraten"
              : "Bare du kan se og bruke denne FagPraten"}
          </p>
        </div>
      </div>
    </div>
  );
}
