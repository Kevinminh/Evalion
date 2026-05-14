/** Paused-state branch must come first — `pausedAt` overrides the running countdown. */
export function computeRemainingSeconds(
  duration: number | undefined,
  startedAt: number | undefined,
  pausedAt: number | undefined,
  remainingAtPause: number | undefined,
): number {
  if (pausedAt && remainingAtPause !== undefined) {
    return Math.max(0, Math.floor(remainingAtPause));
  }
  if (startedAt && duration !== undefined) {
    return Math.max(0, Math.floor(duration - (Date.now() - startedAt) / 1000));
  }
  return 0;
}
