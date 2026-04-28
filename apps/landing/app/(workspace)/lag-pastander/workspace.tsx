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
    <main className="mx-auto box-border grid h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] w-full max-w-[1180px] flex-1 grid-cols-1 items-start gap-7 overflow-hidden px-6 pt-6 pb-4 max-[1040px]:h-auto max-[1040px]:max-h-none max-[1040px]:gap-7 max-[1040px]:overflow-visible max-[1040px]:px-6 max-[1040px]:pt-6 max-[1040px]:pb-12 min-[1041px]:grid-cols-[448px_1fr] min-[1041px]:gap-12">
      <aside className="max-h-full min-h-0 self-stretch overflow-y-auto max-[1040px]:max-h-none max-[1040px]:self-auto max-[1040px]:overflow-y-visible">
        <GenerationForm
          initialFag={draft?.lastFag ?? ""}
          initialTrinn={draft?.lastTrinn ?? ""}
          initialForkunnskap={draft?.lastForkunnskap}
        />
      </aside>

      <section className="flex h-full min-h-0 min-w-0 flex-col self-stretch overflow-hidden max-[1040px]:h-auto max-[1040px]:overflow-visible">
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
