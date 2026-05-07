import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import type { FagPratStatement, Fasit } from "@workspace/evalion/lib/types";
import { useMutation } from "convex/react";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { api } from "@/lib/convex";

import { phaseFromSession, phaseRound, type StudentPhase } from "./student-phase";

export interface StudentGameValue {
  session: Doc<"liveSessions">;
  fagprat: Doc<"fagprats">;
  student: Doc<"sessionStudents">;
  students: Doc<"sessionStudents">[];

  statement: FagPratStatement | undefined;
  statementIndex: number;
  phase: StudentPhase;
  hasVoted: boolean;
  groupMembers: Doc<"sessionStudents">[];

  castVote: (args: { vote: Fasit; confidence: number }) => Promise<unknown>;
  submitBegrunnelse: (args: { text: string }) => Promise<unknown>;
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
    const phase = phaseFromSession(session);
    const round = phaseRound(phase);

    const existingVote = votes.find((v) => v.studentId === studentId && v.round === round);
    const hasVoted = !!existingVote;

    const groupMembers =
      student.groupIndex !== undefined
        ? students.filter((s) => s.groupIndex === student.groupIndex && s._id !== student._id)
        : [];

    const statement = fagprat.statements[statementIndex];

    return {
      session,
      fagprat,
      student,
      students,
      statement,
      statementIndex,
      phase,
      hasVoted,
      groupMembers,
      castVote: ({ vote, confidence }) => {
        const r = phaseRound(phase);
        if (r === 0) {
          return Promise.reject(new Error("Cannot cast a vote outside of a vote phase"));
        }
        return castVoteMutation({
          sessionId,
          studentId,
          statementIndex,
          round: r,
          vote,
          confidence,
        });
      },
      submitBegrunnelse: ({ text }) => {
        const r = phaseRound(phase);
        if (r === 0) {
          return Promise.reject(new Error("Cannot submit begrunnelse outside of a vote phase"));
        }
        return submitBegrunnelseMutation({
          sessionId,
          studentId,
          statementIndex,
          round: r,
          text,
        });
      },
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
