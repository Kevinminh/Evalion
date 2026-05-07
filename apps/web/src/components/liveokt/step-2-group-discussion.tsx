import { BackButton } from "@workspace/evalion/components/live/back-button";
import { BegrunnelseCard } from "@workspace/evalion/components/live/begrunnelse-card";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { Smartphone } from "lucide-react";

import type { TeacherStep } from "@/types/teacher-step";

import { useTeacherSession } from "./teacher-session-context";

export function useStep2(): TeacherStep {
  const {
    statement,
    panelTab,
    setPanelTab,
    begrunnelser,
    students,
    voteBars,
    totalVotes,
    activeRoundVotes,
    selectedIdx,
    goToStep,
  } = useTeacherSession();
  const begrunnelseTab = panelTab === "default" || panelTab === "begrunnelser";

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <TeacherStepLayout
      top={
        <div className="flex w-full items-center justify-between">
          <BackButton onClick={() => goToStep(0)} />
        </div>
      }
      statement={
        statement && (
          <StatementCard statement={statement} size="lg" color={statementColor} gradient />
        )
      }
      professor={
        <Professor
          size="md"
          bordered
          animate
          textSize="lg"
          text="Diskuter med læringspartneren din. Forklar hva du tenker og lytt til hva den andre mener."
        />
      }
    />
  );

  const highlighted = begrunnelser?.find((b) => b.highlighted) ?? null;
  const highlightedStudent = highlighted
    ? students.find((s) => s._id === highlighted.studentId)
    : undefined;
  const highlightedVote = highlighted
    ? activeRoundVotes.find((v) => v.studentId === highlighted.studentId)?.vote
    : undefined;

  const withConfidence = activeRoundVotes.filter((v) => typeof v.confidence === "number");
  const avgConfidence = withConfidence.length
    ? withConfidence.reduce((sum, v) => sum + (v.confidence ?? 0), 0) / withConfidence.length
    : null;

  const panel = (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <p className="shrink-0 px-1 text-xs font-bold uppercase tracking-[0.08em] text-[#616161]">
        Elevsvar – Første stemmerunde
      </p>
      <PanelTabs
        tabs={[
          { key: "begrunnelser", label: "Begrunnelser" },
          { key: "stemmefordeling", label: "Stemmefordeling" },
        ]}
        activeTab={begrunnelseTab ? "begrunnelser" : "stemmefordeling"}
        onTabChange={setPanelTab}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-2xl bg-white p-3 shadow-[0_4px_6px_rgba(0,0,0,0.07),0_2px_4px_rgba(0,0,0,0.04)]">
          {begrunnelseTab ? (
            highlighted ? (
              <div className="flex flex-col gap-2">
                <p className="px-1 text-xs font-bold uppercase tracking-[0.08em] text-[#6C3FC5]">
                  Fremhevet
                </p>
                <BegrunnelseCard
                  text={highlighted.text}
                  studentName={highlightedStudent?.name}
                  vote={highlightedVote}
                  highlighted
                />
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 text-center">
                <Smartphone className="size-9 text-[#E0E0E0]" strokeWidth={1.5} />
                <p className="max-w-[240px] text-sm leading-relaxed text-[#9E9E9E]">
                  Trykk på begrunnelser i live-statistikken på din eksterne enhet for å fremheve
                  dem her.
                </p>
              </div>
            )
          ) : (
            <div className="flex h-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="flex-1 text-sm font-semibold text-[#616161]">
                  Gjennomsnittlig sikkerhet:
                </span>
                <span className="font-mono text-xl font-extrabold leading-none tabular-nums text-[#1FA89F]">
                  {avgConfidence !== null ? avgConfidence.toFixed(1).replace(".", ",") : "–"}
                </span>
              </div>
              <div className="h-px bg-[#EEEEEE]" />
              <div className="flex-1 min-h-0 py-2">
                <DistributionChart
                  key={`s${selectedIdx}-discussion`}
                  bars={voteBars}
                  total={totalVotes}
                  correctKey={statement?.fasit}
                />
              </div>
            </div>
          )}
        </div>
      </PanelTabs>
    </div>
  );

  return { main, panel, panelFooter: null };
}
