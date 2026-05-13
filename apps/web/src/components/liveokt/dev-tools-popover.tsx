import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { isValidConvexId } from "@workspace/features/lib/convex-id";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { useMutation } from "convex/react";
import { Users, Vote, Wrench } from "lucide-react";
import { toast } from "sonner";

import { api, liveSessionQueries } from "@/lib/convex";
import { parseSessionId } from "@/lib/route-params";

const DUMMY_BATCH_SIZE = 10;

export function DevToolsPopover() {
  if (!import.meta.env.DEV) return null;

  return <DevToolsPopoverInner />;
}

function DevToolsPopoverInner() {
  const params = useParams({ strict: false });
  const rawSessionId = params.sessionId;
  const rawStep = params.step;

  // Supply "skip" when the session id isn't usable so the underlying Convex
  // subscription is skipped entirely. Hooks must still run unconditionally.
  const sessionIdArg = isValidConvexId(rawSessionId) ? parseSessionId(rawSessionId) : "skip";
  const step = rawStep && /^\d+$/.test(rawStep) ? Number(rawStep) : 0;

  const { data: session } = useQuery(liveSessionQueries.getById(sessionIdArg));
  const addDummyStudents = useMutation(api.dev.addDummyStudents);
  const castDummyVotes = useMutation(api.dev.castDummyVotes);

  if (sessionIdArg === "skip") return null;
  const sessionId = sessionIdArg;

  const isVotingStep = step === 1 || step === 3;
  const round = step === 3 ? 2 : 1;
  const canAddStudents = session?.status === "lobby" || session?.status === "active";

  const handleAddStudents = async () => {
    try {
      const ids = await addDummyStudents({ sessionId, count: DUMMY_BATCH_SIZE });
      toast.success(`La til ${ids.length} dummy-elever`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunne ikke legge til dummy-elever");
    }
  };

  const handleCastVotes = async () => {
    const statementIndex = session?.currentStatementIndex;
    if (statementIndex === undefined) {
      toast.error("Ingen påstand valgt enda");
      return;
    }
    try {
      const result = await castDummyVotes({
        sessionId,
        statementIndex,
        round,
      });
      if (result.dummyCount === 0) {
        toast.error("Ingen dummy-elever i økten enda");
        return;
      }
      toast.success(
        `Trigget ${result.inserted} stemmer (runde ${round}) for ${result.dummyCount} dummy-elever`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunne ikke trigge dummy-stemmer");
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" size="sm" aria-label="Dev-verktøy">
              <Wrench className="size-4" />
              Dev
            </Button>
          }
        />
        <PopoverContent side="top" align="start" className="w-64">
          <PopoverHeader>
            <PopoverTitle>Dev-verktøy</PopoverTitle>
          </PopoverHeader>
          <Button
            variant="outline"
            size="sm"
            disabled={!canAddStudents}
            onClick={handleAddStudents}
          >
            <Users className="size-4" />
            Legg til 10 dummy-elever
          </Button>
          {isVotingStep && (
            <Button variant="outline" size="sm" onClick={handleCastVotes}>
              <Vote className="size-4" />
              Trigger dummy-stemmer
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
