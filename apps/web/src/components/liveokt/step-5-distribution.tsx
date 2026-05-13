import { BackButton } from "@workspace/evalion/components/live/back-button";
import { BegrunnelseCard } from "@workspace/evalion/components/live/begrunnelse-card";
import { FasitBadgeOverlay } from "@workspace/evalion/components/live/fasit-badge-overlay";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
import { percentage } from "@workspace/evalion/lib/format";
import { PanelCard } from "@workspace/ui/components/panel-card";
import { PanelSectionLabel } from "@workspace/ui/components/panel-section-label";

import { cssVars } from "@/lib/css-vars";
import type { TeacherStep } from "@/types/teacher-step";
import { useTeacherSession } from "./teacher-session-context";

export function useStep5(): TeacherStep {
  const { statement, r2CorrectCount, r2Total, begrunnelser, selectedIdx, goToStep } =
    useTeacherSession();
  const highlightedBegrunnelse = begrunnelser?.find((b) => b.highlighted);

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);
  const correctPct = percentage(r2CorrectCount, r2Total);

  const main = (
    <div className="flex h-full min-h-0 w-full flex-col items-center px-8 py-5">
      <div className="flex w-full">
        <BackButton onClick={() => goToStep(0)} />
      </div>
      <div className="flex-1" />
      {statement && (
        <FasitBadgeOverlay
          fasit={statement.fasit}
          className="max-w-[760px] animate-[fadeInUp_0.5s_ease_0.2s_both]"
        >
          <div
            style={cssVars({
              "--c-border": statementColor.border,
              "--c-bg": statementColor.bg,
              "--c-bg2": statementColor.bg2,
              "--c-text": statementColor.text,
            })}
            className="w-full overflow-hidden rounded-2xl border-2 border-[var(--c-border)] shadow-lg"
          >
            <div className="border-b-[1.5px] border-[var(--c-border)] bg-[linear-gradient(135deg,var(--c-bg),var(--c-bg2))] px-8 pt-8 pb-6 text-center">
              <p className="text-2xl font-bold leading-relaxed text-[var(--c-text)]">
                {statement.text}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white px-6 py-4">
              <img
                src="/professoren.png"
                alt="Professoren"
                className="size-24 shrink-0 rounded-full border-[3px] border-[var(--color-professor-border)] bg-[var(--color-bg-tertiary)] object-cover"
              />
              <p className="flex-1 text-base font-medium leading-relaxed text-[var(--color-text-ink-strong)]">
                {statement.explanation}
              </p>
            </div>
          </div>
        </FasitBadgeOverlay>
      )}
      <div className="flex-[2]" />
      <div className="flex-[1.5]" />
    </div>
  );

  const panel = (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <PanelSectionLabel>Professorens forklaring</PanelSectionLabel>
      <PanelCard>
        {/* Antall riktig */}
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-fasit-correct-bg)] px-3 py-2">
          <span className="shrink-0 font-mono text-xl font-extrabold leading-none tabular-nums text-[var(--color-fasit-correct-text)]">
            {r2CorrectCount}/{r2Total}
          </span>
          <div className="flex min-w-0 flex-col gap-px">
            <span className="text-xs font-semibold text-[var(--color-text-ink-soft)]">
              svarte riktig ({correctPct}%)
            </span>
          </div>
        </div>

        <PanelSectionLabel className="mt-2">Fremhevet begrunnelse</PanelSectionLabel>

        {highlightedBegrunnelse ? (
          <BegrunnelseCard text={highlightedBegrunnelse.text} highlighted />
        ) : (
          <div className="rounded-l-none rounded-r-xl border-l-[3px] border-[var(--color-highlight-strip)] bg-[var(--color-highlight-strip-bg)] px-5 py-4 text-base font-medium italic leading-relaxed text-[var(--color-text-ink-faint)]">
            Ingen fremhevet begrunnelse ennå.
          </div>
        )}
      </PanelCard>
    </div>
  );

  return { main, panel, panelFooter: null };
}
