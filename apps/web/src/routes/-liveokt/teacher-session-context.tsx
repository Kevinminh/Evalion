import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { api } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import type { TimerControls } from "@/lib/use-timer-controls";
import { useTimerControls } from "@/lib/use-timer-controls";
import { buildVoteBars, type VoteBar } from "@/lib/vote-bars";

type Statement = Doc<"fagprats">["statements"][number];

export interface TeacherSessionValue {
  // Identity
  sessionId: Id<"liveSessions">;
  step: number;

  // Data
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

  // Derived
  selectedIdx: number;
  statement: Statement | undefined;
  r2Votes: Doc<"sessionVotes">[];
  activeRoundVotes: Doc<"sessionVotes">[];
  voteBars: VoteBar[];
  totalVotes: number;
  r2CorrectCount: number;
  r2Total: number;
  changedToCorrect: number;
  changedToIncorrect: number;
  ratingDistribution: { score: number; count: number }[];
  avgRating: number | undefined;

  // Ephemeral UI state
  selectedStatement: number | null;
  setSelectedStatement: (n: number | null) => void;
  panelTab: string;
  setPanelTab: (s: string) => void;
  begrunnelseIdx: number;
  setBegrunnelseIdx: (updater: (i: number) => number) => void;
  recording: boolean;
  setRecording: (b: boolean) => void;
  recordElapsed: number;
  panelOpen: boolean;
  setPanelOpen: (b: boolean) => void;
  completedSteps: number[];
  markStepCompleted: (n: number) => void;
  resetCompletedSteps: () => void;
  usedStatements: Set<number>;
  markStatementUsed: (n: number) => void;
  resetUsedStatements: () => void;

  // Mutations
  goToStep: (n: number) => Promise<void>;
  endSession: () => Promise<void>;
  highlightBegrunnelse: (b: Doc<"sessionBegrunnelser">) => Promise<unknown>;

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
  analytics: TeacherSessionValue["analytics"];
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
  const [panelTab, setPanelTab] = useState("default");
  const [begrunnelseIdx, setBegrunnelseIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordElapsed, setRecordElapsed] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [usedStatements, setUsedStatements] = useState<Set<number>>(new Set());

  const updateStepMutation = useMutation(api.liveSessions.updateStep);
  const endSessionMutation = useMutation(api.liveSessions.end);
  const highlightBegrunnelseMutation = useMutation(api.liveSessions.highlightBegrunnelse);
  const timer = useTimerControls(sessionId, session);

  // Recording timer
  useEffect(() => {
    if (!recording) {
      setRecordElapsed(0);
      return;
    }
    const interval = setInterval(() => setRecordElapsed((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [recording]);

  const selectedIdx = selectedStatement ?? session.currentStatementIndex ?? 0;

  // Reset panel tab and begrunnelse index when step or statement changes
  useEffect(() => {
    setPanelTab("default");
    setBegrunnelseIdx(0);
  }, [step, selectedIdx]);

  const value = useMemo<TeacherSessionValue>(() => {
    const statement = fagprat.statements[selectedIdx];

    const r1: typeof votes = [];
    const r2: typeof votes = [];
    for (const v of votes) {
      if (v.round === 1) r1.push(v);
      else if (v.round === 2) r2.push(v);
    }
    const activeRoundVotes = step <= 2 ? r1 : r2;

    const r2CorrectCount = analytics?.correctR2 ?? 0;
    const r2Total = analytics?.totalR2 ?? 0;
    const changedToCorrect = analytics?.wrongToRight ?? 0;
    const changedToIncorrect = analytics?.rightToWrong ?? 0;
    const ratingDistribution =
      analytics?.ratingDistribution ?? [1, 2, 3, 4, 5].map((score) => ({ score, count: 0 }));
    const avgRating = analytics && analytics.avgRating > 0 ? analytics.avgRating : undefined;

    const goToStep = async (n: number) => {
      if (n === 0) {
        setCompletedSteps([]);
        setSelectedStatement(null);
      }
      if (step > 0 && step < n) {
        setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
      }
      await updateStepMutation({
        id: sessionId,
        step: n,
        ...(n === 0 ? {} : { statementIndex: selectedIdx }),
      });
      await navigateToStep(n);
    };

    const endSession = async () => {
      await endSessionMutation({ id: sessionId });
      onSessionEnded();
    };

    return {
      sessionId,
      step,
      session,
      fagprat,
      students,
      votes,
      analytics,
      begrunnelser,

      selectedIdx,
      statement,
      r2Votes: r2,
      activeRoundVotes,
      voteBars: buildVoteBars(activeRoundVotes),
      totalVotes: activeRoundVotes.length,
      r2CorrectCount,
      r2Total,
      changedToCorrect,
      changedToIncorrect,
      ratingDistribution,
      avgRating,

      selectedStatement,
      setSelectedStatement,
      panelTab,
      setPanelTab,
      begrunnelseIdx,
      setBegrunnelseIdx,
      recording,
      setRecording,
      recordElapsed,
      panelOpen,
      setPanelOpen,
      completedSteps,
      markStepCompleted: (n) =>
        setCompletedSteps((prev) => (prev.includes(n) ? prev : [...prev, n])),
      resetCompletedSteps: () => setCompletedSteps([]),
      usedStatements,
      markStatementUsed: (n) => setUsedStatements((prev) => new Set(prev).add(n)),
      resetUsedStatements: () => setUsedStatements(new Set()),

      goToStep,
      endSession,
      highlightBegrunnelse: (b) =>
        highlightBegrunnelseMutation({ id: b._id, highlighted: !b.highlighted }),

      timer,
    };
  }, [
    sessionId,
    step,
    session,
    fagprat,
    students,
    votes,
    analytics,
    begrunnelser,
    selectedIdx,
    selectedStatement,
    panelTab,
    begrunnelseIdx,
    recording,
    recordElapsed,
    panelOpen,
    completedSteps,
    usedStatements,
    timer,
    updateStepMutation,
    endSessionMutation,
    highlightBegrunnelseMutation,
    navigateToStep,
    onSessionEnded,
  ]);

  return (
    <TeacherSessionContext.Provider value={value}>{children}</TeacherSessionContext.Provider>
  );
}
