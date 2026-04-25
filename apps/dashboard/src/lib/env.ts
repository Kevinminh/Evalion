export const PLAY_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : (import.meta.env.VITE_PLAY_URL ?? "https://play.evalion.no");

export const LANDING_URL = import.meta.env.DEV
  ? "http://localhost:3002"
  : "https://evalion.no";
