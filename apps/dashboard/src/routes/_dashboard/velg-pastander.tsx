import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

export const Route = createFileRoute("/_dashboard/velg-pastander")({
  component: VelgPastanderPage,
});

interface MockStatement {
  id: string;
  text: string;
}

const mockSant: MockStatement[] = [
  { id: "s1", text: "Drivhuseffekten er en naturlig prosess som gjør jorda beboelig." },
  { id: "s2", text: "Fossile brånsler er dannet av organisk materiale over millioner av år." },
  { id: "s3", text: "CO₂ er den viktigste menneskeskapte klimagassen." },
  { id: "s4", text: "Fornybar energi inkluderer sol, vind og vannkraft." },
  { id: "s5", text: "Parisavtalen har som mål å begrense global oppvarming til 1,5°C." },
];

const mockUsant: MockStatement[] = [
  { id: "u1", text: "Klimaendringer skyldes kun naturlige prosesser." },
  { id: "u2", text: "Norge påvirker ikke klimaet fordi vi er et lite land." },
  { id: "u3", text: "Drivhuseffekten er utelukkende skadelig." },
  { id: "u4", text: "Fornybar energi kan erstatte all fossil energi over natten." },
  { id: "u5", text: "Ozonlaget og drivhuseffekten er det samme." },
];

const mockDelvis: MockStatement[] = [
  { id: "d1", text: "Elbiler er helt utslippsfrie." },
  { id: "d2", text: "Planting av trær er den beste løsningen mot klimaendringer." },
  { id: "d3", text: "Kjernekraft er en fornybar energikilde." },
  { id: "d4", text: "Klimaendringer rammer alle land likt." },
  { id: "d5", text: "Resirkulering alene kan løse avfallsproblemet." },
];

function StatementColumn({
  title,
  statements,
  selected,
  onToggle,
  headerBg,
  headerText,
  selectedBorder,
  selectedGlow,
}: {
  title: string;
  statements: MockStatement[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  headerBg: string;
  headerText: string;
  selectedBorder: string;
  selectedGlow: string;
}) {
  return (
    <div className="flex flex-col">
      <div className={cn("mb-4 rounded-xl px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider", headerBg, headerText)}>
        {title}
      </div>
      <div className="space-y-3">
        {statements.map((stmt) => {
          const isSelected = selected.has(stmt.id);
          return (
            <button
              key={stmt.id}
              onClick={() => onToggle(stmt.id)}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left text-sm leading-relaxed transition-all",
                isSelected
                  ? `${selectedBorder} ${selectedGlow} bg-card`
                  : "border-border bg-muted/30 hover:border-muted-foreground/30 hover:bg-muted/60",
              )}
            >
              {stmt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VelgPastanderPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate({ to: "/lag-fagprat" })}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Tilbake
      </button>

      <h1 className="mb-2 text-3xl font-extrabold text-foreground">Velg påstander</h1>
      <p className="mb-8 text-base text-muted-foreground">
        Velg hvilke påstander du vil inkludere i FagPraten
      </p>

      {/* 3-column grid */}
      <div className="mb-24 grid grid-cols-3 gap-6">
        <StatementColumn
          title="Sant"
          statements={mockSant}
          selected={selected}
          onToggle={toggle}
          headerBg="bg-[#E8F5E9]"
          headerText="text-[#4CAF50]"
          selectedBorder="border-[#4CAF50]"
          selectedGlow="shadow-[0_0_12px_rgba(76,175,80,0.25)]"
        />
        <StatementColumn
          title="Usant"
          statements={mockUsant}
          selected={selected}
          onToggle={toggle}
          headerBg="bg-[#FFEBEE]"
          headerText="text-[#EF5350]"
          selectedBorder="border-[#EF5350]"
          selectedGlow="shadow-[0_0_12px_rgba(239,83,80,0.25)]"
        />
        <StatementColumn
          title="Delvis sant"
          statements={mockDelvis}
          selected={selected}
          onToggle={toggle}
          headerBg="bg-[#FFF3E0]"
          headerText="text-[#E65100]"
          selectedBorder="border-[#E65100]"
          selectedGlow="shadow-[0_0_12px_rgba(230,81,0,0.25)]"
        />
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed right-0 bottom-0 left-[220px] z-20 flex items-center justify-between border-t bg-card px-8 py-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-semibold">Foreslått av REDDI</span>
        </div>
        <button
          disabled={selected.size === 0}
          onClick={() => navigate({ to: "/lagre-fagprat", search: { draft: "" } })}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all",
            selected.size > 0
              ? "bg-primary text-primary-foreground shadow-[0_3px_0_oklch(0.35_0.16_295)] hover:-translate-y-0.5"
              : "bg-muted text-muted-foreground",
          )}
        >
          Legg til {selected.size} {selected.size === 1 ? "påstand" : "påstander"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
