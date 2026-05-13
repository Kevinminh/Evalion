import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "@workspace/backend/convex/_generated/api";
import { FEATURE_FLAG_LIST } from "@workspace/features/lib/feature-flags";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { EmptyStateMessage } from "@workspace/ui/components/empty-state-message";
import { Switch } from "@workspace/ui/components/switch";
import { useMutation } from "convex/react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { data: me, isPending: meLoading } = useQuery(convexQuery(api.users.getMe, {}));

  if (meLoading) {
    return (
      <EmptyStateMessage>
        <p className="text-muted-foreground">Laster…</p>
      </EmptyStateMessage>
    );
  }

  if (me?.role !== "admin") {
    return (
      <EmptyStateMessage>
        <p className="font-heading text-2xl font-medium">Du har ikke tilgang</p>
        <p className="text-muted-foreground">
          Denne siden er kun tilgjengelig for administratorer.
        </p>
        <Button render={<Link to="/" />} variant="outline" size="sm">
          Tilbake
        </Button>
      </EmptyStateMessage>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const { data: flags } = useQuery(convexQuery(api.featureFlags.list, {}));
  const setEnabled = useMutation(api.featureFlags.setEnabled);

  const flagState = new Map((flags ?? []).map((f) => [f.key, f.enabled]));

  const handleToggle = async (key: string, label: string, next: boolean) => {
    try {
      await setEnabled({ key, enabled: next });
      toast.success(
        next ? `Skrudde på ${label.toLowerCase()}` : `Skrudde av ${label.toLowerCase()}`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunne ikke oppdatere flagget");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-6 text-primary" />
        <div>
          <h1 className="font-heading text-2xl font-medium">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Skru funksjonsflagg av og på for hele plattformen.
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">Funksjonsflagg</h2>
        <div className="flex flex-col gap-3">
          {FEATURE_FLAG_LIST.map((flag) => {
            const enabled = flagState.get(flag.key) ?? false;
            return (
              <Card key={flag.key} size="sm">
                <CardHeader>
                  <CardTitle>{flag.label}</CardTitle>
                  <CardDescription>{flag.description}</CardDescription>
                  <CardAction>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(next) => handleToggle(flag.key, flag.label, next)}
                      aria-label={`Skru ${flag.label} ${enabled ? "av" : "på"}`}
                    />
                  </CardAction>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
