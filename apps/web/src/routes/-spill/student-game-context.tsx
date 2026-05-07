import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import type { FagPratStatement, Fasit } from "@workspace/evalion/lib/types";
import { useMutation } from "convex/react";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { api } from "@/lib/convex";

type Round = 0 | 1 | 2;

export interface StudentGameValue {
  session: Doc<"liveSessions">;
  fagprat: Doc<"fagprats">;
  student: Doc<"sessionStudents">;
  students: Doc<"sessionStudents">[];

  statement: FagPratStatement | undefined;
  statementIndex: number;
  currentStep: number;
  round: Round;
  hasVoted: boolean;
  groupMembers: Doc<"sessionStudents">[];

  castVote: (args: { round: 1 | 2; vote: Fasit; confidence: number }) => Promise<unknown>;
  submitBegrunnelse: (args: { round: 1 | 2; text: string }) => Promise<unknown>;
  submitRating: (rating: number) => Promise<unknown>;
  removeStudent: () => Promise<unknown>;
}

const StudentGameContext = createContext<StudentGameValue | null>(null);

export function useStudentGame(): StudentGameValue {
  const ctx = useContext(StudentGameContext);
  if (!ctx) {
    throw new Error("useStudentGame must be used inside StudentGameProvider");
  }
  return ctx;
}

interface StudentGameProviderProps {
  student: Doc<"sessionStudents">;
  session: Doc<"liveSessions">;
  fagprat: Doc<"fagprats">;
  students: Doc<"sessionStudents">[];
  votes: Doc<"sessionVotes">[];
  children: ReactNode;
}

export function StudentGameProvider({
  student,
  session,
  fagprat,
  students,
  votes,
  children,
}: StudentGameProviderProps) {
  const castVoteMutation = useMutation(api.liveSessions.castVote);
  const submitRatingMutation = useMutation(api.liveSessions.submitRating);
  const submitBegrunnelseMutation = useMutation(api.liveSessions.submitBegrunnelse);
  const removeStudentMutation = useMutation(api.liveSessions.removeStudent);

  const value = useMemo<StudentGameValue>(() => {
    const sessionId = session._id;
    const studentId = student._id;
    const statementIndex = session.currentStatementIndex ?? 0;
    const currentStep = session.currentStep ?? -1;
    const round: Round = currentStep === 1 ? 1 : currentStep === 3 ? 2 : 0;

    const existingVote = votes.find(
      (v) => v.studentId === studentId && v.round === round,
    );
    const hasVoted = !!existingVote;

    const groupMembers =
      student.groupIndex !== undefined
        ? students.filter(
            (s) => s.groupIndex === student.groupIndex && s._id !== student._id,
          )
        : [];

    const statement = fagprat.statements[statementIndex];

    return {
      session,
      fagprat,
      student,
      students,
      statement,
      statementIndex,
      currentStep,
      round,
      hasVoted,
      groupMembers,
      castVote: ({ round: r, vote, confidence }) =>
        castVoteMutation({ sessionId, studentId, statementIndex, round: r, vote, confidence }),
      submitBegrunnelse: ({ round: r, text }) =>
        submitBegrunnelseMutation({ sessionId, studentId, statementIndex, round: r, text }),
      submitRating: (rating) =>
        submitRatingMutation({ sessionId, studentId, statementIndex, rating }),
      removeStudent: () => removeStudentMutation({ id: studentId }),
    };
  }, [
    session,
    fagprat,
    student,
    students,
    votes,
    castVoteMutation,
    submitBegrunnelseMutation,
    submitRatingMutation,
    removeStudentMutation,
  ]);

  return <StudentGameContext.Provider value={value}>{children}</StudentGameContext.Provider>;
}
