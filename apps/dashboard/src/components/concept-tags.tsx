import { X, Plus, Sparkles } from "lucide-react";
import { useState } from "react";

import { ComingSoonButton } from "@/components/coming-soon-button";
import { LABEL_CLASS } from "@/lib/constants";

interface ConceptTagsProps {
  concepts: string[];
  onChange: (concepts: string[]) => void;
  editable?: boolean;
  showAiButton?: boolean;
}

export function ConceptTags({ concepts, onChange, editable = true, showAiButton }: ConceptTagsProps) {
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);

  const addConcept = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !concepts.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...concepts, trimmed]);
      setInputValue("");
      setShowInput(false);
    }
  };

  const removeConcept = (concept: string) => {
    onChange(concepts.filter((c) => c !== concept));
  };

  return (
    <div>
      <div className={`mb-2 flex items-center gap-2 ${LABEL_CLASS}`}>
        Viktige begreper
        {showAiButton && (
          <ComingSoonButton
            icon={<Sparkles className="size-3.5" />}
            ariaLabel="Generer begreper med AI"
            className="rounded-md p-1"
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {concepts.map((concept) => (
          <span
            key={concept}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary"
          >
            {concept}
            {editable && (
              <button
                onClick={() => removeConcept(concept)}
                aria-label={`Fjern begrep: ${concept}`}
                className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-primary/20"
              >
                <X className="size-3" />
              </button>
            )}
          </span>
        ))}
        {editable && !showInput && (
          <button
            onClick={() => { setInputValue(""); setShowInput(true); }}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-primary/30 px-3 py-1 text-sm font-medium text-primary/60 transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Plus className="size-3.5" />
            Legg til begrep
          </button>
        )}
        {editable && showInput && (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addConcept();
                if (e.key === "Escape") setShowInput(false);
              }}
              placeholder="Skriv begrep..."
              maxLength={100}
              className="w-32 rounded-full border-2 border-primary/30 bg-transparent px-3 py-1 text-sm outline-none focus:border-primary"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
