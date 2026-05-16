import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Globe, Lock, Pencil, Sprout, Target } from "lucide-react";
import { useId, useState } from "react";

import { ConceptTags } from "@/components/concept-tags";
import { CustomDropdown } from "@/components/custom-dropdown";
import { ForkunnskapSelector } from "@/components/forkunnskap-selector";
import { VisibilityToggle } from "@/components/visibility-toggle";
import { LABEL_CLASS, LEVEL_OPTIONS, SUBJECT_OPTIONS } from "@/lib/constants";
import type { FagPratType, Visibility } from "@/lib/types";

interface MetadataCardProps {
  title: string;
  onTitleChange: (value: string) => void;
  subject: string;
  onSubjectChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  type: FagPratType | null;
  onTypeChange: (value: FagPratType | null) => void;
  concepts: string[];
  onConceptsChange: (value: string[]) => void;
  visibility: Visibility;
  onVisibilityChange: (value: Visibility) => void;
}

export function MetadataCard({
  title,
  onTitleChange,
  subject,
  onSubjectChange,
  level,
  onLevelChange,
  type,
  onTypeChange,
  concepts,
  onConceptsChange,
  visibility,
  onVisibilityChange,
}: MetadataCardProps) {
  const [editing, setEditing] = useState(false);
  const titleId = useId();

  return (
    <div
      className={cn(
        "relative mb-8 rounded-2xl border-[1.5px] border-border bg-card p-4 sm:p-6",
        !editing && "max-w-[600px]",
      )}
    >
      {!editing ? (
        <>
          <button
            onClick={() => setEditing(true)}
            aria-label="Rediger metadata"
            className="absolute right-4 top-4 rounded-full border-2 border-primary/30 p-2 text-primary transition-all hover:border-primary/60 hover:bg-primary/5"
          >
            <Pencil className="size-4" />
          </button>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {subject}
            </span>
            <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {level}
            </span>
            {type === "intro" && (
              <span
                className="inline-flex size-7 items-center justify-center rounded-full border border-turkis-200 bg-turkis-50 text-turkis-500"
                title="Introduksjon"
              >
                <Sprout className="size-3.5" />
              </span>
            )}
            {type === "oppsummering" && (
              <span
                className="inline-flex size-7 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600"
                title="Oppsummering"
              >
                <Target className="size-3.5" />
              </span>
            )}
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
            <ConceptTags concepts={concepts} onChange={onConceptsChange} editable={false} />
          </div>
        </>
      ) : (
        <>
          <div className="mb-5">
            <label htmlFor={titleId} className={`mb-2 block ${LABEL_CLASS}`}>
              Tittel på din FagPrat
            </label>
            <input
              id={titleId}
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full rounded-xl border-[1.5px] border-border bg-muted/30 px-4 py-3 text-lg font-extrabold text-foreground outline-none transition-colors focus:border-primary focus:bg-card focus:ring-3 focus:ring-primary/20 sm:text-xl"
            />
          </div>
          <div className="mb-5">
            <VisibilityToggle value={visibility} onChange={onVisibilityChange} showDescription />
          </div>
          <div className="mb-5 grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
            <CustomDropdown
              label="Fag"
              value={subject}
              onChange={onSubjectChange}
              placeholder="Velg fag"
              options={SUBJECT_OPTIONS}
            />
            <CustomDropdown
              label="Trinn"
              value={level}
              onChange={onLevelChange}
              placeholder="Velg trinn"
              options={LEVEL_OPTIONS}
            />
          </div>
          <div className="mb-5">
            <ForkunnskapSelector value={type} onChange={onTypeChange} />
          </div>
          <div className="mb-2">
            <ConceptTags concepts={concepts} onChange={onConceptsChange} />
          </div>
          <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Avbryt
            </Button>
            <Button size="sm" onClick={() => setEditing(false)}>
              Oppdater
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
