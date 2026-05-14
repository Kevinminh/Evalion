import { EmptyStateMessage } from "@workspace/ui/components/empty-state-message";

import { DASHBOARD_URL } from "@/lib/env";

export function SessionEndedScreen() {
  return (
    <EmptyStateMessage className="gap-4">
      <h1 className="text-xl font-extrabold text-foreground">Økten er avsluttet</h1>
      <p className="text-muted-foreground">
        Denne økten har blitt avsluttet og kan ikke fortsettes.
      </p>
      <a
        href={DASHBOARD_URL}
        className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-[0_4px_0_var(--color-primary-700)] transition-all active:translate-y-0.5"
      >
        Gå til dashboard
      </a>
    </EmptyStateMessage>
  );
}
