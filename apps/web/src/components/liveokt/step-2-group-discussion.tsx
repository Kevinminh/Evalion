import { BackButton } from "@workspace/evalion/components/live/back-button";
import { BegrunnelseCard } from "@workspace/evalion/components/live/begrunnelse-card";
import { BreakdownRow } from "@workspace/evalion/components/live/breakdown-row";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
import { formatDecimal1 } from "@workspace/evalion/lib/format";
import { PanelCard } from "@workspace/ui/components/panel-card";
import { PanelSectionLabel } from "@workspace/ui/components/panel-section-label";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { BarChart3, Smartphone } from "lucide-react";
import { useState } from "react";

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
    avgConfidenceR1,
    avgConfidenceR1ByVote,
    selectedIdx,
    goToStep,
  } = useTeacherSession();
  const begrunnelseTab = panelTab === "default" || panelTab === "begrunnelser";
  const [showAvgBreakdown, setShowAvgBreakdown] = useState(false);

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

  const panel = (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <PanelSectionLabel>Elevsvar – Første stemmerunde</PanelSectionLabel>
      <PanelTabs
        tabs={[
          { key: "begrunnelser", label: "Begrunnelser" },
          { key: "stemmefordeling", label: "Stemmefordeling" },
        ]}
        activeTab={begrunnelseTab ? "begrunnelser" : "stemmefordeling"}
        onTabChange={setPanelTab}
      >
        {begrunnelseTab ? (
          <PanelCard gap="2">
            {highlighted ? (
              <div className="flex flex-col gap-2">
                <p className="px-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-highlight-strip-text)]">
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
                <Smartphone className="size-9 text-[var(--color-neutral-400)]" strokeWidth={1.5} />
                <p className="max-w-[240px] text-sm leading-relaxed text-[var(--color-text-ink-faint)]">
                  Trykk på begrunnelser i live-statistikken på din eksterne enhet for å fremheve
                  dem her.
                </p>
              </div>
            )}
          </PanelCard>
        ) : (
          <PanelCard>
            <div className="relative flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[var(--color-text-ink-soft)]">
                Gjennomsnittlig sikkerhet:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-extrabold leading-none tabular-nums text-[var(--color-turkis-500)]">
                  {formatDecimal1(avgConfidenceR1)}
                </span>
                <button
                  type="button"
                  aria-label="Vis sikkerhet fordelt på kategori"
                  aria-pressed={showAvgBreakdown}
                  onClick={() => setShowAvgBreakdown((s) => !s)}
                  className={
                    "flex size-8 items-center justify-center rounded-xl border-[1.5px] border-[var(--color-divider-soft)] text-[var(--color-text-ink-faint)] transition-colors " +
                    (showAvgBreakdown
                      ? "bg-[var(--color-divider-soft)] text-[var(--color-text-ink-soft)]"
                      : "bg-white hover:bg-[var(--color-divider-soft)]")
                  }
                >
                  <BarChart3 className="size-4" strokeWidth={2} />
                </button>
              </div>
              {showAvgBreakdown && (
                <div className="absolute top-full right-0 z-10 mt-2 flex min-w-[160px] flex-col gap-1.5 rounded-xl border-[1.5px] border-[var(--color-divider-soft)] bg-white p-3 shadow-[var(--shadow-card-soft)]">
                  <BreakdownRow label="Sant:" value={avgConfidenceR1ByVote.sant} />
                  <BreakdownRow label="Delvis sant:" value={avgConfidenceR1ByVote.delvis} />
                  <BreakdownRow label="Usant:" value={avgConfidenceR1ByVote.usant} />
                </div>
              )}
            </div>
            <div className="h-px bg-[var(--color-divider-soft)]" />
            <div className="flex-1 min-h-0 py-2">
              <DistributionChart
                key={`s${selectedIdx}-discussion`}
                bars={voteBars}
                total={totalVotes}
              />
            </div>
          </PanelCard>
        )}
      </PanelTabs>
    </div>
  );

  return { main, panel, panelFooter: null };
}
