"use client";

import { useQuery } from "convex/react";
import { useState } from "react";

import { api } from "@workspace/backend/convex/_generated/api";

import { GenerationForm } from "./generation-form";
import { MinePastanderList } from "./mine-pastander-list";
import { PdfExport } from "./pdf-export";

export function Workspace() {
  const draft = useQuery(api.pastandDrafts.get);
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <main className="lp-main">
      <aside className="lp-left">
        <GenerationForm
          initialFag={draft?.lastFag ?? ""}
          initialTrinn={draft?.lastTrinn ?? ""}
          initialForkunnskap={draft?.lastForkunnskap}
        />
      </aside>

      <section className="lp-right">
        <MinePastanderList draft={draft} onRequestPdf={() => setPdfOpen(true)} />
      </section>

      {pdfOpen && (
        <PdfExport
          pastander={draft?.pastander ?? []}
          defaultFag={draft?.lastFag ?? ""}
          defaultTrinn={draft?.lastTrinn ?? ""}
          defaultForkunnskap={draft?.lastForkunnskap}
          onClose={() => setPdfOpen(false)}
        />
      )}
    </main>
  );
}
