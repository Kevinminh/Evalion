import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Users, Pencil, MoreVertical, Sprout, Target, FolderPlus } from "lucide-react";

import { getFagPrat } from "@/data/fagprat-data";
import { StatementTable } from "@/components/statement-table";

export const Route = createFileRoute("/_dashboard/fagprat/$id")({
  component: FagPratPreviewPage,
});

function FagPratPreviewPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const fagprat = getFagPrat(id);

  if (!fagprat) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">FagPrat ikke funnet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px]">
      {/* Back link */}
      <button
        onClick={() => navigate({ to: "/min-samling" })}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Tilbake
      </button>

      {/* Header */}
      <div className="mb-1 flex items-start justify-between">
        <h1 className="text-3xl font-extrabold text-foreground">{fagprat.title}</h1>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => navigate({ to: "/liveokt/$id", params: { id } })}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-3 text-sm font-bold text-white shadow-[0_3px_0_theme(colors.teal.700)] transition-all hover:-translate-y-px hover:bg-teal-300 hover:shadow-[0_4px_0_theme(colors.teal.700)] active:translate-y-0.5 active:shadow-[0_1px_0_theme(colors.teal.700)]"
          >
            <Users className="size-4" />
            Start liveøkt
          </button>
          <button
            onClick={() => navigate({ to: "/fagprat/$id/rediger", params: { id } })}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-card px-5 py-3 text-sm font-bold text-primary transition-all hover:border-primary/60 hover:bg-primary/5"
          >
            <Pencil className="size-4" />
            Endre
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-3 text-sm font-bold text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5">
            <FolderPlus className="size-4" />
            Min samling
          </button>
          <button className="inline-flex items-center gap-1 rounded-xl border-2 border-border px-4 py-3 text-sm font-bold text-muted-foreground transition-all hover:border-muted-foreground/50 hover:bg-muted">
            <MoreVertical className="size-4" />
            Mer
          </button>
        </div>
      </div>

      {/* Meta tags */}
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-block rounded-full border-[1.5px] border-muted-foreground/30 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
          {fagprat.subject}
        </span>
        <span className="inline-block rounded-full border-[1.5px] border-muted-foreground/30 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
          {fagprat.level}
        </span>
        {fagprat.type === "intro" ? (
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-500">
            <Sprout className="size-3.5" />
          </span>
        ) : (
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600">
            <Target className="size-3.5" />
          </span>
        )}
      </div>

      {/* Begreper */}
      <div className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Viktige begreper
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {fagprat.concepts.map((concept) => (
          <span
            key={concept}
            className="inline-block rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary"
          >
            {concept}
          </span>
        ))}
      </div>

      {/* Statements table */}
      <StatementTable statements={fagprat.statements} />
    </div>
  );
}
