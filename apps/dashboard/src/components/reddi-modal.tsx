import { Button } from "@workspace/ui/components/button";
import { Modal } from "@workspace/ui/components/modal";
import { useState } from "react";

import { LABEL_CLASS, TEXTAREA_CLASS } from "@/lib/constants";

interface ReddiModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (topic: string) => void;
}

const steps = [
  { num: 1, label: "Beskriv tema" },
  { num: 2, label: "Velg påstander" },
  { num: 3, label: "Fullfør" },
];

export function ReddiModal({ open, onClose, onSubmit }: ReddiModalProps) {
  const [topic, setTopic] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      {/* Reddi robot + badge */}
        <div className="mb-4 flex items-center gap-3">
          <img src="/reddi.png" alt="Reddi" className="size-12 rounded-full object-cover" />
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            AI-assistent
          </span>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-2xl font-extrabold text-foreground">
          Lag påstander med REDDI
        </h2>

        {/* Description */}
        <p className="mb-6 text-sm text-muted-foreground">
          Beskriv temaet du vil lage påstander om, så genererer REDDI forslag til sant-, usant- og
          delvis sant-påstander som du kan velge mellom.
        </p>

        {/* 3-step indicator */}
        <div className="mb-6 flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                {step.num}
              </div>
              <span className="text-sm font-semibold text-muted-foreground">{step.label}</span>
              {i < steps.length - 1 && (
                <div className="mx-2 h-px w-8 bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div className="mb-6">
          <label className={`mb-1.5 block ${LABEL_CLASS}`}>
            Hva skal påstandene handle om?
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="f.eks. fotosyntese, Newtons lover, brøkregning..."
            className={`min-h-24 ${TEXTAREA_CLASS}`}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button disabled={!topic.trim()} onClick={() => onSubmit(topic.trim())}>
            Generer påstander
          </Button>
        </div>
    </Modal>
  );
}
