/**
 * Animation and timer durations used across the student/teacher live session UI.
 * Keep these in sync with any CSS keyframe durations in globals.css.
 */

/** One step of the pre-reveal 3→2→1 countdown. */
export const COUNTDOWN_STEP_MS = 600;

/** Total duration of the 3→2→1 countdown (3 × COUNTDOWN_STEP_MS). */
export const COUNTDOWN_TOTAL_MS = 1800;

/** Duration of the statement card "fade in" animation. */
export const CARD_IN_MS = 600;

/** Loop duration of the WaitingDots pulse animation (matches globals.css @keyframes dotPulse). */
export const WAITING_DOTS_DURATION_MS = 1400;
