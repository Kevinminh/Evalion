import { Button } from "@workspace/ui/components/button";
import { Globe, Lock, Pencil } from "lucide-react";
import { useState } from "react";

import { ConceptTags } from "@/components/concept-tags";
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

/**
 * Metadata panel for the FagPrat edit page. Toggles between a compact
 * read view (title + subject/level badges + edit button) and an expanded
 * edit form.
 */
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

  return (
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
              {subject}
            </span>
            <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {level}
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
            <ConceptTags concepts={concepts} onChange={onConceptsChange} editable={false} />
          </div>
        </>
      ) : (
        /* Edit mode */
        <>
          <div className="mb-4">
            <label className={`mb-1.5 block ${LABEL_CLASS}`}>Tittel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full rounded-xl border-2 border-input bg-background px-4 py-2.5 text-base font-bold outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
            />
          </div>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={`mb-1.5 block ${LABEL_CLASS} text-foreground`}>Fag</label>
              <select
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-input bg-card px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
              >
                {SUBJECT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`mb-1.5 block ${LABEL_CLASS} text-foreground`}>Trinn</label>
              <select
                value={level}
                onChange={(e) => onLevelChange(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-input bg-card px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <ConceptTags concepts={concepts} onChange={onConceptsChange} />
          </div>
          <ForkunnskapSelector value={type} onChange={onTypeChange} />
          <div className="mt-4">
            <VisibilityToggle value={visibility} onChange={onVisibilityChange} />
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
  );
}
