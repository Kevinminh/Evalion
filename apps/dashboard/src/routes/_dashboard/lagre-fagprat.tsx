import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { parseDraftJson } from "@workspace/evalion/lib/draft-utils";
import { useMutation } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { ConceptTags } from "@/components/concept-tags";
import { NotFoundState } from "@/components/not-found-state";
import { VisibilityToggle } from "@/components/visibility-toggle";
import { api } from "@/lib/convex";
import { LABEL_CLASS } from "@/lib/constants";
import type { Visibility } from "@/lib/types";

const searchSchema = z.object({
  draft: z.string().catch(""),
});

export const Route = createFileRoute("/_dashboard/lagre-fagprat")({
  validateSearch: searchSchema,
  component: LagreFagPratPage,
});

function LagreFagPratPage() {
  const navigate = useNavigate();
  const { draft: draftJson } = Route.useSearch();
  const createFagPrat = useMutation(api.fagprats.create);

  const draft = parseDraftJson(draftJson);

  const [title, setTitle] = useState(draft?.title ?? "");
  const [concepts, setConcepts] = useState<string[]>(draft?.concepts ?? []);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const id = await createFagPrat({
        title: title || draft.title,
        subject: draft.subject,
        level: draft.level,
        type: draft.type,
        concepts,
        statements: draft.statements,
        visibility,
      });
      navigate({ to: "/fagprat/$id", params: { id } });
    } catch {
      toast.error("Kunne ikke lagre FagPraten. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) {
    return <NotFoundState message="Ingen FagPrat-data funnet. Gå tilbake og lag en FagPrat først." />;
  }

  return (
    <div className="max-w-[700px]">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/lag-fagprat", search: { draft: "" } })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Tilbake
          </button>
          <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">Fullfør FagPraten</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Lagrer..." : "Lagre"}
        </Button>
      </div>

      {/* Title card */}
      <div className="rounded-2xl border-[1.5px] border-border bg-card p-4 sm:p-6">
        {/* Title input */}
        <div className="mb-6">
          <label className={`mb-2 block ${LABEL_CLASS}`}>
            Tittel
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Gi FagPraten en tittel..."
            className="w-full rounded-xl border-2 border-input bg-muted/30 px-4 py-3 text-lg font-extrabold text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary focus:bg-card focus:ring-3 focus:ring-primary/20 sm:text-xl"
          />
        </div>

        {/* Concepts */}
        <div className="mb-6">
          <ConceptTags concepts={concepts} onChange={setConcepts} />
        </div>

        {/* Visibility */}
        <VisibilityToggle value={visibility} onChange={setVisibility} showDescription />
      </div>
    </div>
  );
}
