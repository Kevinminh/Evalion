import { useEffect, useRef, useState } from "react";

import { COUNTDOWN_STEP_MS, COUNTDOWN_TOTAL_MS } from "./timings";

export function useStep4Countdown(currentStep: number | undefined) {
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);
  const countdownTriggered = useRef(false);

  useEffect(() => {
    if (currentStep !== 4) {
      countdownTriggered.current = false;
      setCountdownDone(false);
      return;
    }
    if (countdownTriggered.current) return;

    countdownTriggered.current = true;
    setShowCountdown(true);
    setCountdownNumber(3);
    setCountdownDone(false);

    const t1 = setTimeout(() => setCountdownNumber(2), COUNTDOWN_STEP_MS);
    const t2 = setTimeout(() => setCountdownNumber(1), COUNTDOWN_STEP_MS * 2);
    const t3 = setTimeout(() => {
      setShowCountdown(false);
      setCountdownDone(true);
    }, COUNTDOWN_TOTAL_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentStep]);

  return { showCountdown, countdownNumber, countdownDone };
}
