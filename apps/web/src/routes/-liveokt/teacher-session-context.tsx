import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { Id } from "@/lib/convex";
import type { TimerControls } from "@/lib/use-timer-controls";
import { useTimerControls } from "@/lib/use-timer-controls";

import { usePanelState } from "./hooks/use-panel-state";
import { useRatingStats, type RatingStats } from "./hooks/use-rating-stats";
import { useRecording, type RecordingState } from "./hooks/use-recording";
import { useSessionMutations, type SessionMutations } from "./hooks/use-session-mutations";
import { useVoteAnalysis, type VoteAnalysis } from "./hooks/use-vote-analysis";

type Statement = Doc<"fagprats">["statements"][number];

export interface TeacherSessionValue
  extends VoteAnalysis,
    RatingStats,
    RecordingState,
    SessionMutations {
  sessionId: Id<"liveSessions">;
  step: number;
  session: Doc<"liveSessions">;
  fagprat: Doc<"fagprats">;
  students: Doc<"sessionStudents">[];
  begrunnelser: Doc<"sessionBegrunnelser">[] | undefined;

  selectedIdx: number;
  statement: Statement | undefined;
  selectedStatement: number | null;
  setSelectedStatement: (n: number | null) => void;

  panelOpen: boolean;
  setPanelOpen: (b: boolean) => void;
  panelTab: string;
  setPanelTab: (s: string) => void;
  begrunnelseIdx: number;
  setBegrunnelseIdx: (updater: (i: number) => number) => void;

  timer: TimerControls;
}

const TeacherSessionContext = createContext<TeacherSessionValue | null>(null);

export function useTeacherSession(): TeacherSessionValue {
  const ctx = useContext(TeacherSessionContext);
  if (!ctx) {
    throw new Error("useTeacherSession must be used inside TeacherSessionProvider");
  }
  return ctx;
}

interface TeacherSessionProviderProps {
  sessionId: Id<"liveSessions">;
  step: number;
  session: Doc<"liveSessions">;
  fagprat: Doc<"fagprats">;
  students: Doc<"sessionStudents">[];
  votes: Doc<"sessionVotes">[];
  analytics:
    | {
        correctR2: number;
        totalR2: number;
        wrongToRight: number;
        rightToWrong: number;
        avgRating: number;
        ratingDistribution: { score: number; count: number }[];
      }
    | undefined;
  begrunnelser: Doc<"sessionBegrunnelser">[] | undefined;
  navigateToStep: (n: number) => Promise<void>;
  onSessionEnded: () => void;
  children: ReactNode;
}

export function TeacherSessionProvider({
  sessionId,
  step,
  session,
  fagprat,
  students,
  votes,
  analytics,
  begrunnelser,
  navigateToStep,
  onSessionEnded,
  children,
}: TeacherSessionProviderProps) {
  const [selectedStatement, setSelectedStatement] = useState<number | null>(null);
  const selectedIdx = selectedStatement ?? session.currentStatementIndex ?? 0;
  const statement = fagprat.statements[selectedIdx];

  const voteAnalysis = useVoteAnalysis({ votes, analytics, step });
  const ratingStats = useRatingStats(analytics);
  const recording = useRecording();
  const panelState = usePanelState(step, selectedIdx);
  const timer = useTimerControls(sessionId, session);

  const onResetStatement = useCallback(() => setSelectedStatement(null), []);
  const mutations = useSessionMutations({
    sessionId,
    step,
    selectedIdx,
    navigateToStep,
    onSessionEnded,
    onResetStatement,
  });

  const value = useMemo<TeacherSessionValue>(
    () => ({
      sessionId,
      step,
      session,
      fagprat,
      students,
      begrunnelser,
      selectedIdx,
      statement,
      selectedStatement,
      setSelectedStatement,
      timer,
      ...voteAnalysis,
      ...ratingStats,
      ...recording,
      ...panelState,
      ...mutations,
    }),
    [
      sessionId,
      step,
      session,
      fagprat,
      students,
      begrunnelser,
      selectedIdx,
      statement,
      selectedStatement,
      timer,
      voteAnalysis,
      ratingStats,
      recording,
      panelState,
      mutations,
    ],
  );

  return (
    <TeacherSessionContext.Provider value={value}>{children}</TeacherSessionContext.Provider>
  );
}
