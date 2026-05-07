import { useConvex, useConvexAuth } from "convex/react";
import { useEffect } from "react";

// Workaround: ConvexProviderWithAuth never calls clearAuth() for users who were
// never authenticated. With expectAuth: true the Convex client blocks all
// queries until setAuth/clearAuth is called. This component bridges the gap for
// guest users (students joining via code) by calling clearAuth() explicitly.
export function ClearAuthForGuests() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const client = useConvex();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      client.clearAuth();
    }
  }, [isLoading, isAuthenticated, client]);
  return null;
}
