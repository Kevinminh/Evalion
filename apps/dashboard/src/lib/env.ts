export const PLAY_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : (import.meta.env.VITE_PLAY_URL ?? "https://play.evalion.no");
