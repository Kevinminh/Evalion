"use client";

import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [convexClient()],
});

export function signInWithGoogle(callbackPath: string = "/lag-pastander") {
  authClient.signIn.social({
    provider: "google",
    callbackURL: window.location.origin + callbackPath,
  });
}
