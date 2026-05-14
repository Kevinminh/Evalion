import { liveSessionsMutations } from "@workspace/api/liveSessions";
import type { Id } from "@workspace/api/types";
import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useMemo } from "react";

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
  const startTimerMutation = useMutation(liveSessionsMutations.startTimer);
  const pauseTimerMutation = useMutation(liveSessionsMutations.pauseTimer);
  const stopTimerMutation = useMutation(liveSessionsMutations.stopTimer);

  const onStart = useCallback(
    (d: number) => {
      startTimerMutation({ id: sessionId, duration: d });
    },
    [sessionId, startTimerMutation],
  );
  const onPause = useCallback(() => {
    pauseTimerMutation({ id: sessionId });
  }, [sessionId, pauseTimerMutation]);
  const onStop = useCallback(() => {
    stopTimerMutation({ id: sessionId });
  }, [sessionId, stopTimerMutation]);

  return useMemo(
    () => ({
      duration: session?.timerDuration,
      startedAt: session?.timerStartedAt,
      pausedAt: session?.timerPausedAt,
      remainingAtPause: session?.timerRemainingAtPause,
      onStart,
      onPause,
      onStop,
    }),
    [
      session?.timerDuration,
      session?.timerStartedAt,
      session?.timerPausedAt,
      session?.timerRemainingAtPause,
      onStart,
      onPause,
      onStop,
    ],
  );
}
