import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
  plugins: [convexClient()],
});

export function signInWithGoogle() {
  authClient.signIn.social({ provider: "google", callbackURL: window.location.origin + "/" });
}
