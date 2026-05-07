import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { api } from "./convex";
import type { Id } from "./convex";

export interface TimerControls {
  duration: number | undefined;
  startedAt: number | undefined;
  pausedAt: number | undefined;
  remainingAtPause: number | undefined;
  onStart: (duration: number) => void;
  onPause: () => void;
  onStop: () => void;
}

export function useTimerControls(
  sessionId: Id<"liveSessions">,
  session: Doc<"liveSessions"> | null | undefined,
): TimerControls {
  const startTimerMutation = useMutation(api.liveSessions.startTimer);
  const pauseTimerMutation = useMutation(api.liveSessions.pauseTimer);
  const stopTimerMutation = useMutation(api.liveSessions.stopTimer);

  return {
    duration: session?.timerDuration,
    startedAt: session?.timerStartedAt,
    pausedAt: session?.timerPausedAt,
    remainingAtPause: session?.timerRemainingAtPause,
    onStart: (d) => {
      startTimerMutation({ id: sessionId, duration: d });
    },
    onPause: () => {
      pauseTimerMutation({ id: sessionId });
    },
    onStop: () => {
      stopTimerMutation({ id: sessionId });
    },
  };
}
