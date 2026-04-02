# Cross-App Game Launch Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the entire live session experience (lobby + 7-step game) from dashboard.evalion.no to play.evalion.no, with the dashboard only handling session setup, and build a complete student game experience on play.evalion.no.

**Architecture:** Separate route trees for teacher (authenticated, `/liveokt/$sessionId/...`) and student (anonymous, `/delta`, `/spill/$studentId`) on the web app. Dashboard redirects to play app after session creation. Shared live UI components live in `packages/ui`. Real-time sync via Convex live queries.

**Tech Stack:** TanStack Start/Router, React 19, Convex, Better Auth, Tailwind CSS 4, qrcode.react

**Spec:** `docs/superpowers/specs/2026-04-02-cross-app-game-flow-design.md`

---

## File Structure

### New files:
- `packages/ui/src/components/live/session-top-bar.tsx` — Shared top bar (refactored with onExit callback)
- `packages/ui/src/components/live/step-nav.tsx` — Shared step navigation
- `packages/ui/src/components/live/teacher-panel.tsx` — Shared teacher panel
- `packages/ui/src/components/live/vote-buttons.tsx` — Shared vote buttons
- `packages/ui/src/components/live/timer-card.tsx` — Shared timer
- `packages/ui/src/components/live/distribution-chart.tsx` — Shared chart
- `apps/web/src/lib/convex.ts` — Convex query helpers for web app
- `apps/web/src/lib/types.ts` — Shared types for web app
- `apps/web/src/routes/delta.tsx` — Student name entry page
- `apps/web/src/routes/spill.$studentId.tsx` — Student reactive game view
- `apps/web/src/routes/liveokt.$sessionId.tsx` — Teacher lobby
- `apps/web/src/routes/liveokt.$sessionId.steg.$step.tsx` — Teacher game steps

### Modified files:
- `packages/backend/convex/liveSessions.ts` — Add getStudent query
- `apps/dashboard/src/routes/liveokt.$id.tsx` — Redirect to play URL
- `apps/dashboard/src/routes/liveokt.$id.lobby.tsx` — Update shared component imports
- `apps/dashboard/src/routes/liveokt.$id.steg.$step.tsx` — Update shared component imports
- `apps/dashboard/.env.example` — Add VITE_PLAY_URL
- `apps/web/src/routes/index.tsx` — Add game code submit handler
- `apps/web/package.json` — Add qrcode.react
- `pnpm-workspace.yaml` — Add qrcode.react to catalog

### Deleted files:
- `apps/dashboard/src/components/live/session-top-bar.tsx`
- `apps/dashboard/src/components/live/step-nav.tsx`
- `apps/dashboard/src/components/live/teacher-panel.tsx`
- `apps/dashboard/src/components/live/vote-buttons.tsx`
- `apps/dashboard/src/components/live/timer-card.tsx`
- `apps/dashboard/src/components/live/distribution-chart.tsx`

---

## Task 1: Backend — Add getStudent Query

**Files:**
- Modify: `packages/backend/convex/liveSessions.ts`

- [ ] **Step 1: Add getStudent query**

Add this query after the existing `listStudents` query (around line 174):

```typescript
export const getStudent = query({
  args: { id: v.id("sessionStudents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

- [ ] **Step 2: Verify the backend compiles**

Run: `cd /Users/kevinminh/Developer/evalion && npx convex dev --once --typecheck=enable 2>&1 | tail -5`

Expected: No errors. The function should appear in the generated API.

- [ ] **Step 3: Commit**

```bash
git add packages/backend/convex/liveSessions.ts
git commit -m "feat: add getStudent query for student game view"
```

---

## Task 2: Move Live Components to packages/ui

**Files:**
- Create: `packages/ui/src/components/live/session-top-bar.tsx`
- Create: `packages/ui/src/components/live/step-nav.tsx`
- Create: `packages/ui/src/components/live/teacher-panel.tsx`
- Create: `packages/ui/src/components/live/vote-buttons.tsx`
- Create: `packages/ui/src/components/live/timer-card.tsx`
- Create: `packages/ui/src/components/live/distribution-chart.tsx`

The UI package exports via `"./components/*": "./src/components/*.tsx"` which supports nested paths, so `@workspace/ui/components/live/session-top-bar` resolves to `./src/components/live/session-top-bar.tsx`.

**Important:** `SessionTopBar` currently imports `useNavigate` from `@tanstack/react-router` and hardcodes navigation to `/min-samling`. Since the shared UI package shouldn't depend on router, refactor it to accept an `onExit` callback prop instead.

- [ ] **Step 1: Create the live components directory**

```bash
mkdir -p packages/ui/src/components/live
```

- [ ] **Step 2: Create session-top-bar.tsx (refactored)**

Create `packages/ui/src/components/live/session-top-bar.tsx`:

```tsx
import { X } from "lucide-react";

interface SessionTopBarProps {
  title: string;
  onExit?: () => void;
  children?: React.ReactNode;
}

export function SessionTopBar({ title, onExit, children }: SessionTopBarProps) {
  return (
    <div className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Evalion" className="h-8 object-contain" />
        <div className="h-6 w-px bg-border" />
        <span className="text-sm font-bold text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {onExit && (
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-destructive/30 px-4 py-2 text-sm font-bold text-destructive transition-all hover:bg-destructive/10"
          >
            <X className="size-4" />
            Avslutt
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create step-nav.tsx**

Create `packages/ui/src/components/live/step-nav.tsx`:

```tsx
import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { label: "Velg påstand" },
  { label: "1. stemmerunde" },
  { label: "Diskusjon" },
  { label: "2. stemmerunde" },
  { label: "Fasit" },
  { label: "Forklaring" },
  { label: "Egenvurdering" },
];

interface StepNavProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepNav({ currentStep, onStepClick }: StepNavProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-center gap-2 border-t bg-card px-6 py-3">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        return (
          <button
            key={i}
            onClick={() => onStepClick(i)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
              isActive && "bg-primary/10 text-primary",
              isCompleted && "text-[#4CAF50]",
              !isActive && !isCompleted && "text-muted-foreground/50",
            )}
          >
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                isActive && "bg-primary text-primary-foreground",
                isCompleted && "bg-[#4CAF50] text-white",
                !isActive && !isCompleted && "bg-muted text-muted-foreground/60",
              )}
            >
              {isCompleted ? <Check className="size-3.5" /> : i}
            </span>
            <span className="hidden lg:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create teacher-panel.tsx**

Create `packages/ui/src/components/live/teacher-panel.tsx`:

```tsx
import { cn } from "@workspace/ui/lib/utils";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState, type ReactNode } from "react";

interface TeacherPanelProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function TeacherPanel({ children, defaultOpen = true }: TeacherPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-0 top-20 z-30 rounded-l-lg border border-r-0 border-border bg-card p-2 text-muted-foreground shadow-sm transition-all hover:bg-muted"
        style={{ right: open ? "340px" : "0px" }}
      >
        {open ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
      </button>
      <div
        className={cn(
          "fixed right-0 top-16 bottom-14 z-20 w-[340px] overflow-y-auto border-l bg-card transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="p-5">{children}</div>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Create vote-buttons.tsx**

Create `packages/ui/src/components/live/vote-buttons.tsx`:

```tsx
import { cn } from "@workspace/ui/lib/utils";

const options = [
  {
    value: "sant" as const,
    label: "Sant",
    bg: "bg-[#4CAF50]",
    hover: "hover:bg-[#43A047]",
    glow: "shadow-[0_0_20px_rgba(76,175,80,0.4)]",
  },
  {
    value: "usant" as const,
    label: "Usant",
    bg: "bg-[#EF5350]",
    hover: "hover:bg-[#E53935]",
    glow: "shadow-[0_0_20px_rgba(239,83,80,0.4)]",
  },
  {
    value: "delvis" as const,
    label: "Delvis sant",
    bg: "bg-[#FF9800]",
    hover: "hover:bg-[#FB8C00]",
    glow: "shadow-[0_0_20px_rgba(255,152,0,0.4)]",
  },
] as const;

interface VoteButtonsProps {
  selected: "sant" | "usant" | "delvis" | null;
  onVote: (value: "sant" | "usant" | "delvis") => void;
  disabled?: boolean;
}

export function VoteButtons({ selected, onVote, disabled }: VoteButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onVote(opt.value)}
          disabled={disabled}
          className={cn(
            "rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition-all",
            opt.bg,
            opt.hover,
            selected === opt.value
              ? `scale-105 ${opt.glow} shadow-[0_4px_0_rgba(0,0,0,0.2)]`
              : "shadow-[0_3px_0_rgba(0,0,0,0.15)]",
            selected && selected !== opt.value && "opacity-50 scale-95",
            disabled && "pointer-events-none",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

Note: Added `disabled` prop for student use (disable after voting).

- [ ] **Step 6: Create timer-card.tsx**

Create `packages/ui/src/components/live/timer-card.tsx`:

```tsx
import { cn } from "@workspace/ui/lib/utils";
import { Play, Pause, Square } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface TimerCardProps {
  onComplete?: () => void;
}

export function TimerCard({ onComplete }: TimerCardProps) {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining, onComplete]);

  const setPreset = (seconds: number) => {
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setRunning(false);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="rounded-xl border-[1.5px] border-border bg-card p-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Tid igjen
      </div>
      <div className="mb-3 text-center font-mono text-4xl font-bold tabular-nums text-foreground">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="mb-3 flex justify-center gap-2">
        {[60, 180, 300].map((s) => (
          <button
            key={s}
            onClick={() => setPreset(s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              totalSeconds === s
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {s / 60} min
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {!running ? (
          <button
            onClick={() => {
              if (remaining === 0) setRemaining(totalSeconds);
              setRunning(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-[0_2px_0_oklch(0.35_0.16_295)]"
          >
            <Play className="size-3.5" /> Start
          </button>
        ) : (
          <>
            <button
              onClick={() => setRunning(false)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-bold text-foreground"
            >
              <Pause className="size-3.5" /> Pause
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setRemaining(totalSeconds);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-bold text-destructive"
            >
              <Square className="size-3.5" /> Stopp
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create distribution-chart.tsx**

Create `packages/ui/src/components/live/distribution-chart.tsx`:

```tsx
import { cn } from "@workspace/ui/lib/utils";

interface DistributionBar {
  label: string;
  value: number;
  color: string;
}

interface DistributionChartProps {
  bars: DistributionBar[];
  total: number;
  height?: number;
}

export function DistributionChart({ bars, total, height = 160 }: DistributionChartProps) {
  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="flex items-end justify-center gap-4" style={{ height }}>
      {bars.map((bar) => {
        const pct = total > 0 ? Math.round((bar.value / total) * 100) : 0;
        const barHeight = total > 0 ? (bar.value / maxValue) * (height - 40) : 0;
        return (
          <div key={bar.label} className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-foreground">{pct}%</span>
            <div
              className={cn("w-12 rounded-t-lg transition-all duration-500", bar.color)}
              style={{ height: Math.max(barHeight, 4) }}
            />
            <span className="text-xs font-semibold text-muted-foreground">{bar.label}</span>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 8: Commit shared components**

```bash
git add packages/ui/src/components/live/
git commit -m "feat: move live game components to shared UI package"
```

---

## Task 3: Update Dashboard to Use Shared Components

**Files:**
- Modify: `apps/dashboard/src/routes/liveokt.$id.tsx`
- Modify: `apps/dashboard/src/routes/liveokt.$id.lobby.tsx`
- Modify: `apps/dashboard/src/routes/liveokt.$id.steg.$step.tsx`
- Delete: `apps/dashboard/src/components/live/session-top-bar.tsx`
- Delete: `apps/dashboard/src/components/live/step-nav.tsx`
- Delete: `apps/dashboard/src/components/live/teacher-panel.tsx`
- Delete: `apps/dashboard/src/components/live/vote-buttons.tsx`
- Delete: `apps/dashboard/src/components/live/timer-card.tsx`
- Delete: `apps/dashboard/src/components/live/distribution-chart.tsx`

- [ ] **Step 1: Update liveokt.$id.tsx (setup page)**

In `apps/dashboard/src/routes/liveokt.$id.tsx`, change the SessionTopBar import and usage:

Old:
```tsx
import { SessionTopBar } from "@/components/live/session-top-bar";
```

New:
```tsx
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
```

And update the usage to pass `onExit`:
```tsx
<SessionTopBar title={fagprat.title} onExit={() => navigate({ to: "/min-samling" })} />
```

- [ ] **Step 2: Update liveokt.$id.lobby.tsx**

In `apps/dashboard/src/routes/liveokt.$id.lobby.tsx`, change imports:

Old:
```tsx
import { SessionTopBar } from "@/components/live/session-top-bar";
```

New:
```tsx
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
```

The lobby page also needs the `onExit` prop. Add `useNavigate` usage and pass `onExit`:

Add at the top of `LobbyPage()`:
```tsx
const exitNavigate = useNavigate();
```

Update SessionTopBar usage:
```tsx
<SessionTopBar title={fagprat.title} onExit={() => exitNavigate({ to: "/min-samling" })}>
```

Note: `useNavigate` is already imported from `@tanstack/react-router` in this file.

- [ ] **Step 3: Update liveokt.$id.steg.$step.tsx**

In `apps/dashboard/src/routes/liveokt.$id.steg.$step.tsx`, change imports:

Old:
```tsx
import { DistributionChart } from "@/components/live/distribution-chart";
import { SessionTopBar } from "@/components/live/session-top-bar";
import { StepNav } from "@/components/live/step-nav";
import { TeacherPanel } from "@/components/live/teacher-panel";
import { TimerCard } from "@/components/live/timer-card";
import { VoteButtons } from "@/components/live/vote-buttons";
```

New:
```tsx
import { DistributionChart } from "@workspace/ui/components/live/distribution-chart";
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
import { StepNav } from "@workspace/ui/components/live/step-nav";
import { TeacherPanel } from "@workspace/ui/components/live/teacher-panel";
import { TimerCard } from "@workspace/ui/components/live/timer-card";
import { VoteButtons } from "@workspace/ui/components/live/vote-buttons";
```

Update SessionTopBar usage to pass `onExit`. In the component, add navigation:

```tsx
const exitNavigate = useNavigate();
```

And update:
```tsx
<SessionTopBar title={fagprat.title} onExit={() => exitNavigate({ to: "/min-samling" })}>
```

Note: `useNavigate` is already imported in this file.

- [ ] **Step 4: Delete old dashboard component files**

```bash
rm apps/dashboard/src/components/live/session-top-bar.tsx
rm apps/dashboard/src/components/live/step-nav.tsx
rm apps/dashboard/src/components/live/teacher-panel.tsx
rm apps/dashboard/src/components/live/vote-buttons.tsx
rm apps/dashboard/src/components/live/timer-card.tsx
rm apps/dashboard/src/components/live/distribution-chart.tsx
```

Keep `option-card.tsx` and `stepper.tsx` in the dashboard — they're only used in the setup page.

- [ ] **Step 5: Verify dashboard still works**

Run: `pnpm --filter dashboard typecheck`

Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: update dashboard to use shared live components from @workspace/ui"
```

---

## Task 4: Dashboard Redirect to Play URL

**Files:**
- Modify: `apps/dashboard/src/routes/liveokt.$id.tsx`
- Modify: `apps/dashboard/.env.example`
- Modify: `apps/dashboard/.env.local` (add VITE_PLAY_URL)

- [ ] **Step 1: Add VITE_PLAY_URL to env files**

Add to `apps/dashboard/.env.example`:
```
# Play app URL (http://localhost:3000 for local dev)
VITE_PLAY_URL=
```

Add to `apps/dashboard/.env.local`:
```
VITE_PLAY_URL=http://localhost:3000
```

- [ ] **Step 2: Update handleLaunch to redirect cross-origin**

In `apps/dashboard/src/routes/liveokt.$id.tsx`, replace the `handleLaunch` function:

Old:
```tsx
  const handleLaunch = async () => {
    setLaunching(true);
    try {
      const sessionId = await createSession({
        fagpratId: fagprat._id,
        groupsEnabled,
        groupCount,
        transcriptionEnabled,
        selfEvalEnabled,
      });
      navigate({
        to: "/liveokt/$id/lobby",
        params: { id },
        search: { sessionId },
      });
    } catch {
      setLaunching(false);
    }
  };
```

New:
```tsx
  const handleLaunch = async () => {
    setLaunching(true);
    try {
      const sessionId = await createSession({
        fagpratId: fagprat._id,
        groupsEnabled,
        groupCount,
        transcriptionEnabled,
        selfEvalEnabled,
      });
      const playUrl = import.meta.env.VITE_PLAY_URL || "http://localhost:3000";
      window.location.href = `${playUrl}/liveokt/${sessionId}`;
    } catch {
      setLaunching(false);
    }
  };
```

Also remove the `useNavigate` import if it's no longer used elsewhere in the file. Check: the file still uses `navigate` in SessionTopBar's `onExit` (from Task 3), so `useNavigate` stays imported.

Wait — actually check: the setup page (`liveokt.$id.tsx`) doesn't have `onExit` yet since it was only addressed in Task 3 for lobby/step pages. Let me reconsider.

Looking at the current file: `SessionTopBar` is used without `onExit` in the setup page. Since we removed the hardcoded exit from SessionTopBar, we need to add `onExit` here too. The `useNavigate` import already exists.

Update the SessionTopBar usage in this file:
```tsx
<SessionTopBar title={fagprat.title} onExit={() => navigate({ to: "/min-samling" })} />
```

The `navigate` variable already exists from `const navigate = useNavigate();`.

- [ ] **Step 3: Verify dashboard typecheck**

Run: `pnpm --filter dashboard typecheck`

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/routes/liveokt.$id.tsx apps/dashboard/.env.example apps/dashboard/.env.local
git commit -m "feat: redirect teacher to play app after session creation"
```

---

## Task 5: Web App Infrastructure

**Files:**
- Create: `apps/web/src/lib/convex.ts`
- Create: `apps/web/src/lib/types.ts`
- Modify: `pnpm-workspace.yaml` (add qrcode.react)
- Modify: `apps/web/package.json` (add qrcode.react)

- [ ] **Step 1: Create convex.ts for the web app**

Create `apps/web/src/lib/convex.ts`:

```typescript
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

export const fagpratQueries = {
  getById: (id: Id<"fagprats">) => convexQuery(api.fagprats.getById, { id }),
};

export const liveSessionQueries = {
  getById: (id: Id<"liveSessions">) => convexQuery(api.liveSessions.getById, { id }),
  getByJoinCode: (joinCode: string) => convexQuery(api.liveSessions.getByJoinCode, { joinCode }),
  listStudents: (sessionId: Id<"liveSessions">) =>
    convexQuery(api.liveSessions.listStudents, { sessionId }),
  getStudent: (id: Id<"sessionStudents">) => convexQuery(api.liveSessions.getStudent, { id }),
  getVotes: (sessionId: Id<"liveSessions">, statementIndex: number) =>
    convexQuery(api.liveSessions.getVotes, { sessionId, statementIndex }),
};

export { api };
export type { Id };
```

- [ ] **Step 2: Create types.ts for the web app**

Create `apps/web/src/lib/types.ts`:

```typescript
import type { Doc, Id } from "@workspace/backend/convex/_generated/dataModel";

export type FagPrat = Doc<"fagprats">;
export type FagPratId = Id<"fagprats">;
export type LiveSession = Doc<"liveSessions">;
export type SessionStudent = Doc<"sessionStudents">;

export interface FagPratStatement {
  text: string;
  fasit: "sant" | "usant" | "delvis";
  explanation: string;
}
```

- [ ] **Step 3: Add qrcode.react to catalog and web app**

In `pnpm-workspace.yaml`, add to the `catalog:` section under the `# Utilities` group:

```yaml
  qrcode.react: ^4.2.0
```

In `apps/web/package.json`, add to `dependencies`:

```json
"qrcode.react": "catalog:"
```

- [ ] **Step 4: Install dependencies**

Run: `cd /Users/kevinminh/Developer/evalion && pnpm install`

Expected: Clean install with qrcode.react resolved.

- [ ] **Step 5: Verify web app typecheck**

Run: `pnpm --filter web typecheck`

Expected: No type errors (convex.ts and types.ts should compile).

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/convex.ts apps/web/src/lib/types.ts pnpm-workspace.yaml apps/web/package.json pnpm-lock.yaml
git commit -m "feat: add web app convex helpers and qrcode.react dependency"
```

---

## Task 6: Student Join Page — Game Code Submit

**Files:**
- Modify: `apps/web/src/routes/index.tsx`

- [ ] **Step 1: Rewrite the join page with game code submit handler**

Replace the entire contents of `apps/web/src/routes/index.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Play, LogOut, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { liveSessionQueries } from "@/lib/convex";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { isAuthenticated } = useRouteContext({ from: "/" });
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  // Live query for the entered code — only enabled when user submits
  const [submittedCode, setSubmittedCode] = useState("");
  const { data: foundSession, isFetching } = useQuery({
    ...liveSessionQueries.getByJoinCode(submittedCode.toUpperCase()),
    enabled: submittedCode.length === 6,
  });

  // Handle the result of the lookup
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) {
      setError("Koden må være 6 tegn");
      return;
    }
    setChecking(true);
    setSubmittedCode(trimmed);
  };

  // React to query result via useEffect (not in render body)
  useEffect(() => {
    if (!checking || isFetching || !submittedCode) return;
    if (foundSession && (foundSession.status === "lobby" || foundSession.status === "active")) {
      navigate({ to: "/delta", search: { code: submittedCode } });
    } else {
      setError(foundSession?.status === "ended" ? "Denne økten er avsluttet" : "Ugyldig spillkode");
      setChecking(false);
      setSubmittedCode("");
    }
  }, [checking, isFetching, submittedCode, foundSession, navigate]);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      {/* User info bar */}
      {isAuthenticated && session?.user && (
        <div className="fixed top-0 right-0 left-0 flex items-center justify-end gap-3 border-b bg-card px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
              {session.user.name ? (
                session.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              ) : (
                <User className="size-4" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {session.user.name || "Bruker"}
              </span>
              <span className="text-xs text-muted-foreground">{session.user.email}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="size-4" />
            Logg ut
          </Button>
        </div>
      )}

      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Evalion" className="h-12" />
          <p className="text-muted-foreground">Bli med i en FagPrat-økt</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <Input
            type="text"
            placeholder="Skriv inn spillkode"
            className="h-14 text-center text-lg uppercase"
            autoFocus
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
          />
          {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="h-14 text-lg" disabled={checking}>
            {checking ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Play data-icon="inline-start" />
            )}
            {checking ? "Sjekker..." : "PLAY"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">Spør læreren din om spillkoden</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter web typecheck`

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/index.tsx
git commit -m "feat: add game code validation and submit handler to join page"
```

---

## Task 7: Student Name Entry Page (`/delta`)

**Files:**
- Create: `apps/web/src/routes/delta.tsx`

- [ ] **Step 1: Create delta.tsx**

Create `apps/web/src/routes/delta.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { useMutation } from "convex/react";
import { useState } from "react";

import { api, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/delta")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) ?? "",
  }),
  component: DeltaPage,
});

function DeltaPage() {
  const { code } = Route.useSearch();
  const navigate = useNavigate();
  const { data: session, isPending } = useQuery(liveSessionQueries.getByJoinCode(code));
  const addStudent = useMutation(api.liveSessions.addStudent);

  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || session.status === "ended") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6">
        <p className="text-lg font-bold text-foreground">Økten ble ikke funnet</p>
        <p className="text-sm text-muted-foreground">
          Sjekk at du har riktig spillkode og prøv igjen.
        </p>
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="mr-1 inline size-4" />
          Tilbake
        </Link>
      </div>
    );
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Skriv inn navnet ditt");
      return;
    }
    setJoining(true);
    try {
      const studentId = await addStudent({
        sessionId: session._id,
        name: trimmed,
      });
      navigate({
        to: "/spill/$studentId",
        params: { studentId: studentId as string },
      });
    } catch {
      setError("Kunne ikke bli med. Prøv igjen.");
      setJoining(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Evalion" className="h-12" />
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-4 py-1.5">
            <span className="font-mono text-lg font-bold tracking-[0.15em] text-primary">
              {code}
            </span>
          </div>
        </div>

        <form onSubmit={handleJoin} className="flex w-full flex-col gap-4">
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-foreground">Hva heter du?</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Skriv inn navnet ditt for å bli med
            </p>
          </div>

          <Input
            type="text"
            placeholder="Ditt navn"
            className="h-14 text-center text-lg"
            autoFocus
            maxLength={30}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />
          {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="h-14 text-lg" disabled={joining}>
            {joining ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <UserPlus data-icon="inline-start" className="size-5" />
            )}
            {joining ? "Blir med..." : "Bli med"}
          </Button>
        </form>

        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="mr-1 inline size-3.5" />
          Endre spillkode
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter web typecheck`

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/delta.tsx
git commit -m "feat: add student name entry page at /delta"
```

---

## Task 8: Teacher Lobby on Web App

**Files:**
- Create: `apps/web/src/routes/liveokt.$sessionId.tsx`

- [ ] **Step 1: Create teacher lobby page**

Create `apps/web/src/routes/liveokt.$sessionId.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
import { useMutation } from "convex/react";
import { Users, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/liveokt/$sessionId")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: TeacherLobbyPage,
});

function WaitingDots() {
  return (
    <span className="ml-1 inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2.5 rounded-full bg-primary/40"
          style={{
            animation: "dotPulse 1.4s ease-in-out infinite both",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </span>
  );
}

function TeacherLobbyPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const typedSessionId = sessionId as Id<"liveSessions">;

  const { data: session, isPending: sessionLoading } = useQuery(
    liveSessionQueries.getById(typedSessionId),
  );
  const { data: fagprat, isPending: fagpratLoading } = useQuery({
    ...fagpratQueries.getById(session?.fagpratId!),
    enabled: !!session?.fagpratId,
  });
  const { data: students } = useQuery(liveSessionQueries.listStudents(typedSessionId));

  const removeStudentMutation = useMutation(api.liveSessions.removeStudent);
  const createGroupsMutation = useMutation(api.liveSessions.createGroups);
  const updateStepMutation = useMutation(api.liveSessions.updateStep);

  const isPending = sessionLoading || fagpratLoading;

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Laster...</p>
      </div>
    );
  }

  if (!session || !fagprat) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Økt ikke funnet.</p>
      </div>
    );
  }

  const studentList = students ?? [];
  const hasGroups = studentList.some((s) => s.groupIndex !== undefined);
  const showGroupButton = session.groupsEnabled && !hasGroups;
  const showStartButton = !session.groupsEnabled || hasGroups;

  const handleCreateGroups = async () => {
    await createGroupsMutation({
      sessionId: session._id,
      groupCount: session.groupCount,
    });
  };

  const handleStart = async () => {
    await updateStepMutation({ id: session._id, step: 0 });
    navigate({
      to: "/liveokt/$sessionId/steg/$step",
      params: { sessionId, step: "0" },
    });
  };

  const joinUrl = `${window.location.origin}/delta?code=${session.joinCode}`;

  // Group students for display
  const groupedStudents = hasGroups
    ? Array.from({ length: session.groupCount }, (_, gi) =>
        studentList.filter((s) => s.groupIndex === gi),
      )
    : null;

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SessionTopBar title={fagprat.title}>
        {showGroupButton && (
          <button
            onClick={handleCreateGroups}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.4_0.15_280)] transition-all hover:-translate-y-px hover:shadow-[0_4px_0_oklch(0.4_0.15_280)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.4_0.15_280)]"
          >
            <Users className="size-4" />
            Opprett grupper
          </button>
        )}
        {showStartButton && (
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary-teal px-5 py-2 text-sm font-bold text-white shadow-[0_3px_0_var(--secondary-teal-dark)] transition-all hover:-translate-y-px hover:shadow-[0_4px_0_var(--secondary-teal-dark)] active:translate-y-0.5 active:shadow-[0_1px_0_var(--secondary-teal-dark)]"
          >
            Start aktiviteten
          </button>
        )}
      </SessionTopBar>

      {/* Main content */}
      <div className="flex flex-1 pt-16">
        {/* Left: Join panel */}
        <div className="flex w-[38%] min-w-[340px] max-w-[480px] flex-col items-center justify-center gap-4 border-r border-border bg-card p-8">
          <img src="/logo.png" alt="Evalion" className="mb-2 h-16 object-contain" />

          <p className="text-sm text-muted-foreground">{window.location.host}</p>

          <p className="text-sm font-semibold text-muted-foreground">
            Skriv inn koden for å bli med:
          </p>

          {/* Game code */}
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-8 py-4">
            <span className="font-mono text-4xl font-bold tracking-[0.25em] text-primary">
              {session.joinCode}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">Eller skann</p>

          {/* QR code */}
          <div className="rounded-xl bg-white p-3">
            <QRCodeSVG value={joinUrl} size={130} />
          </div>
        </div>

        {/* Right: Students panel */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {groupedStudents === null ? (
              /* Ungrouped view */
              <div className="flex flex-wrap content-start gap-3">
                {studentList.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center gap-2 rounded-xl border-[1.5px] border-border bg-card p-2 pr-3 shadow-xs"
                    style={{ animation: "cardIn 0.3s ease" }}
                  >
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                        student.avatarColor,
                      )}
                    >
                      {student.name[0]}
                    </div>
                    <span className="text-sm font-bold text-foreground">{student.name}</span>
                    <button
                      onClick={() => removeStudentMutation({ id: student._id })}
                      className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Grouped view */
              <div className="flex flex-wrap gap-4">
                {groupedStudents.map((group, gi) => (
                  <div
                    key={gi}
                    className="w-[180px]"
                    style={{
                      animation: "groupFadeIn 0.4s ease both",
                      animationDelay: `${gi * 0.08}s`,
                    }}
                  >
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Gruppe {gi + 1}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl border-[1.5px] border-border bg-card p-3">
                      {group.map((student) => (
                        <div key={student._id} className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                              student.avatarColor,
                            )}
                          >
                            {student.name[0]}
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {student.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Venter på at elever kobler til
              <WaitingDots />
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <Users className="size-4" />
              {studentList.length}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.9) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes groupFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter web typecheck`

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/liveokt.\$sessionId.tsx
git commit -m "feat: add teacher lobby page on web app with QR code"
```

---

## Task 9: Teacher Game Steps on Web App

**Files:**
- Create: `apps/web/src/routes/liveokt.$sessionId.steg.$step.tsx`

- [ ] **Step 1: Create teacher game steps page**

Create `apps/web/src/routes/liveokt.$sessionId.steg.$step.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { DistributionChart } from "@workspace/ui/components/live/distribution-chart";
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
import { StepNav } from "@workspace/ui/components/live/step-nav";
import { TeacherPanel } from "@workspace/ui/components/live/teacher-panel";
import { TimerCard } from "@workspace/ui/components/live/timer-card";
import { VoteButtons } from "@workspace/ui/components/live/vote-buttons";
import { useMutation } from "convex/react";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/liveokt/$sessionId/steg/$step")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: LiveStepPage,
});

const VOTE_DOT_COLORS: Record<string, string> = {
  sant: "bg-sant",
  usant: "bg-usant",
  delvis: "bg-delvis",
};

const VOTE_LABELS: Record<string, string> = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
};

const STATEMENT_COLORS = [
  "bg-yellow-100 border-yellow-300",
  "bg-blue-100 border-blue-300",
  "bg-orange-100 border-orange-300",
  "bg-purple-100 border-purple-300",
  "bg-red-100 border-red-300",
];

const RATING_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
];

function LiveStepPage() {
  const { sessionId, step: stepParam } = Route.useParams();
  const navigate = useNavigate();
  const step = Number(stepParam);
  const typedSessionId = sessionId as Id<"liveSessions">;

  const { data: session } = useQuery(liveSessionQueries.getById(typedSessionId));
  const { data: fagprat, isPending } = useQuery({
    ...fagpratQueries.getById(session?.fagpratId!),
    enabled: !!session?.fagpratId,
  });
  const { data: students } = useQuery(liveSessionQueries.listStudents(typedSessionId));

  const updateStepMutation = useMutation(api.liveSessions.updateStep);

  const [selectedStatement, setSelectedStatement] = useState<number | null>(null);
  const [vote, setVote] = useState<"sant" | "usant" | "delvis" | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);
  const [recording, setRecording] = useState(false);

  const countdownTriggered = useRef(false);

  // Use session's current statement index if available
  const selectedIdx = selectedStatement ?? session?.currentStatementIndex ?? 0;
  const statement = fagprat?.statements[selectedIdx];

  // Get votes for current statement
  const { data: votes } = useQuery({
    ...liveSessionQueries.getVotes(typedSessionId, selectedIdx),
    enabled: !!fagprat,
  });

  const goToStep = async (n: number) => {
    await updateStepMutation({
      id: typedSessionId,
      step: n,
      ...(n === 0 ? {} : { statementIndex: selectedIdx }),
    });
    navigate({
      to: "/liveokt/$sessionId/steg/$step",
      params: { sessionId, step: String(n) },
    });
  };

  // Step 4 countdown effect
  useEffect(() => {
    if (step === 4 && !countdownTriggered.current) {
      countdownTriggered.current = true;
      setShowCountdown(true);
      setCountdownNumber(3);
      setCountdownDone(false);

      const t1 = setTimeout(() => setCountdownNumber(2), 600);
      const t2 = setTimeout(() => setCountdownNumber(1), 1200);
      const t3 = setTimeout(() => {
        setShowCountdown(false);
        setCountdownDone(true);
      }, 1800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    if (step !== 4) {
      countdownTriggered.current = false;
      setCountdownDone(false);
    }
  }, [step]);

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Laster...</p>
      </div>
    );
  }

  if (!fagprat) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">FagPrat ikke funnet.</p>
      </div>
    );
  }

  const studentList = students ?? [];
  const voteList = votes ?? [];

  const santCount = voteList.filter((v) => v.vote === "sant").length;
  const usantCount = voteList.filter((v) => v.vote === "usant").length;
  const delvisCount = voteList.filter((v) => v.vote === "delvis").length;
  const totalVotes = voteList.length;

  const voteBars = [
    { label: "Sant", value: santCount, color: "bg-sant" },
    { label: "Usant", value: usantCount, color: "bg-usant" },
    { label: "Delvis", value: delvisCount, color: "bg-delvis" },
  ];

  const statementCard = (
    <div className="mx-auto max-w-2xl rounded-2xl border-[1.5px] border-blue-200 bg-blue-50 p-6">
      <p className="text-center text-lg font-bold text-foreground">{statement?.text}</p>
    </div>
  );

  const studentVoteList = (
    <div className="space-y-2">
      {studentList.map((s) => {
        const studentVote = voteList.find((v) => v.studentId === s._id);
        return (
          <div key={s._id} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                studentVote ? VOTE_DOT_COLORS[studentVote.vote] : "bg-muted",
              )}
            />
            <span className="font-medium text-foreground">{s.name}</span>
            <span className="text-muted-foreground">
              {studentVote ? VOTE_LABELS[studentVote.vote] : "Venter..."}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 0: {
        const isOdd = fagprat.statements.length % 2 !== 0;
        return (
          <div className="flex flex-col items-center">
            <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground">
              Velg en påstand
            </h2>
            <div className="grid max-w-3xl grid-cols-2 gap-6">
              {fagprat.statements.map((s, i) => {
                const isSelected = selectedStatement === i;
                const hasSomeSelected = selectedStatement !== null;
                const isLast = i === fagprat.statements.length - 1;
                const colorClass = STATEMENT_COLORS[i % STATEMENT_COLORS.length];
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedStatement(i);
                      setTimeout(() => goToStep(1), 600);
                    }}
                    className={cn(
                      "rounded-2xl border-2 p-6 text-left text-sm font-semibold transition-all duration-300",
                      colorClass,
                      isSelected && "scale-105 ring-2 ring-primary",
                      hasSomeSelected && !isSelected && "opacity-40",
                      isOdd && isLast && "col-span-2 mx-auto max-w-[calc(50%-12px)]",
                    )}
                  >
                    {s.text}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      case 1:
        return (
          <div className="flex flex-col items-center gap-8 pt-8">
            {statementCard}
            <VoteButtons selected={vote} onVote={setVote} />
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center gap-6 pt-8">
            {statementCard}
            <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-center text-sm italic text-foreground/80">
                Snakk i gruppene. Hva tenker dere?
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center gap-8 pt-8">
            {statementCard}
            <VoteButtons selected={vote} onVote={setVote} />
          </div>
        );

      case 4: {
        const fasitLabel = statement ? (VOTE_LABELS[statement.fasit] ?? statement.fasit) : "";
        const fasitColor =
          statement?.fasit === "sant"
            ? "bg-sant"
            : statement?.fasit === "usant"
              ? "bg-usant"
              : "bg-delvis";

        return (
          <>
            {showCountdown && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
                <span
                  key={countdownNumber}
                  className="animate-ping text-8xl font-extrabold text-white"
                  style={{ animationDuration: "500ms", animationIterationCount: 1 }}
                >
                  {countdownNumber}
                </span>
              </div>
            )}
            <div className="flex flex-col items-center gap-6 pt-8">
              {countdownDone && (
                <span
                  className={cn(
                    "animate-bounce rounded-full px-6 py-2 text-lg font-extrabold text-white",
                    fasitColor,
                  )}
                >
                  {fasitLabel}
                </span>
              )}
              {statementCard}
            </div>
          </>
        );
      }

      case 5:
        return (
          <div className="mx-auto max-w-2xl pt-8">
            <div className="overflow-hidden rounded-2xl border-[1.5px] border-blue-200">
              <div className="bg-gradient-to-b from-blue-100 to-blue-50 p-6">
                <p className="text-center text-lg font-bold text-foreground">{statement?.text}</p>
              </div>
              <div className="bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-[96px] shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-3xl font-extrabold text-primary">P</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Forklaring
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {statement?.explanation}
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col items-center gap-8 pt-8">
            {statementCard}
            <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-center text-sm italic text-foreground/80">
                Vurder fra 1 til 5 hvor godt du forstår påstanden nå.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((n) => {
                const isSelected = rating === n;
                const hasRating = rating !== null;
                return (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={cn(
                      "rounded-xl px-6 py-4 text-lg font-bold text-white transition-all",
                      RATING_COLORS[n - 1],
                      isSelected && "scale-110 shadow-[0_0_20px_rgba(0,0,0,0.25)]",
                      hasRating && !isSelected && "opacity-40",
                    )}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTeacherContent = () => {
    switch (step) {
      case 0:
        return <p className="text-center text-sm text-muted-foreground">Venter på valg...</p>;

      case 1:
        return (
          <div className="space-y-4">
            <TimerCard />
            <div className="h-px bg-border" />
            {studentVoteList}
            <div className="h-px bg-border" />
            <DistributionChart bars={voteBars} total={totalVotes} />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <TimerCard />
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Transkript
            </div>
            <div className="space-y-3">
              <p className="text-xs italic text-foreground/70">
                Transkribering er ikke tilgjengelig ennå.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <TimerCard />
            <div className="h-px bg-border" />
            {studentVoteList}
            <div className="h-px bg-border" />
            <DistributionChart bars={voteBars} total={totalVotes} />
          </div>
        );

      case 4: {
        const correctCount = voteList.filter((v) => statement && v.vote === statement.fasit).length;
        return (
          <div className="space-y-4">
            <p className="text-sm font-bold text-foreground">
              {correctCount} av {totalVotes} svarte riktig
            </p>
            <DistributionChart bars={voteBars} total={totalVotes} />
          </div>
        );
      }

      case 5:
        return null;

      case 6: {
        const mockDistribution = [2, 3, 8, 6, 5];
        const mockTotal = mockDistribution.reduce((a, b) => a + b, 0);
        const ratingBars = mockDistribution.map((value, i) => ({
          label: String(i + 1),
          value,
          color: RATING_COLORS[i],
        }));
        return (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Gjennomsnitt
              </div>
              <p className="text-3xl font-extrabold text-foreground">3.4</p>
            </div>
            <DistributionChart bars={ratingBars} total={mockTotal} />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <SessionTopBar title={fagprat.title}>
        {(step === 2 || step === 4) && (
          <button
            onClick={() => setRecording(!recording)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
              recording ? "bg-foreground text-white" : "bg-muted text-muted-foreground",
            )}
          >
            {recording && <span className="size-2 rounded-full bg-red-500" />}
            <Mic className="size-4" />
            Opptak
          </button>
        )}
      </SessionTopBar>

      <div className="flex pt-16 pb-14">
        <main className="flex-1 px-8 py-8">{renderStepContent()}</main>
        <TeacherPanel defaultOpen={step !== 5}>{renderTeacherContent()}</TeacherPanel>
      </div>

      <StepNav currentStep={step} onStepClick={goToStep} />
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter web typecheck`

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/liveokt.\$sessionId.steg.\$step.tsx
git commit -m "feat: add teacher game steps page on web app"
```

---

## Task 10: Student Game View (`/spill/$studentId`)

**Files:**
- Create: `apps/web/src/routes/spill.$studentId.tsx`

- [ ] **Step 1: Create the student game view**

Create `apps/web/src/routes/spill.$studentId.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { VoteButtons } from "@workspace/ui/components/live/vote-buttons";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/spill/$studentId")({
  component: StudentGamePage,
});

const VOTE_LABELS: Record<string, string> = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
};

const RATING_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
];

function WaitingDots() {
  return (
    <span className="ml-1 inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2.5 rounded-full bg-primary/40"
          style={{
            animation: "dotPulse 1.4s ease-in-out infinite both",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </span>
  );
}

function StudentGamePage() {
  const { studentId } = Route.useParams();
  const typedStudentId = studentId as Id<"sessionStudents">;

  // Fetch student record to get sessionId
  const { data: student, isPending: studentLoading } = useQuery(
    liveSessionQueries.getStudent(typedStudentId),
  );

  // Fetch session
  const { data: session, isPending: sessionLoading } = useQuery({
    ...liveSessionQueries.getById(student?.sessionId!),
    enabled: !!student?.sessionId,
  });

  // Fetch fagprat for statements
  const { data: fagprat } = useQuery({
    ...fagpratQueries.getById(session?.fagpratId!),
    enabled: !!session?.fagpratId,
  });

  // Fetch students in session (for group display in step 2)
  const { data: students } = useQuery({
    ...liveSessionQueries.listStudents(student?.sessionId!),
    enabled: !!student?.sessionId,
  });

  // Fetch votes (for detecting existing vote)
  const statementIndex = session?.currentStatementIndex ?? 0;
  const { data: votes } = useQuery({
    ...liveSessionQueries.getVotes(student?.sessionId!, statementIndex),
    enabled: !!student?.sessionId && !!fagprat,
  });

  const castVoteMutation = useMutation(api.liveSessions.castVote);

  const [voteSent, setVoteSent] = useState(false);
  const [ratingSent, setRatingSent] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);

  const countdownTriggered = useRef(false);
  const prevStep = useRef<number | undefined>(undefined);

  // Reset vote/rating sent state when step changes
  useEffect(() => {
    if (session?.currentStep !== prevStep.current) {
      setVoteSent(false);
      setRatingSent(false);
      prevStep.current = session?.currentStep;
    }
  }, [session?.currentStep]);

  // Check if student already voted this round
  const currentStep = session?.currentStep ?? -1;
  const round = currentStep === 1 ? 1 : currentStep === 3 ? 2 : 0;
  const existingVote = votes?.find(
    (v) => v.studentId === typedStudentId && v.round === round,
  );
  const hasVoted = !!existingVote || voteSent;

  // Step 4 countdown
  useEffect(() => {
    if (currentStep === 4 && !countdownTriggered.current) {
      countdownTriggered.current = true;
      setShowCountdown(true);
      setCountdownNumber(3);
      setCountdownDone(false);

      const t1 = setTimeout(() => setCountdownNumber(2), 600);
      const t2 = setTimeout(() => setCountdownNumber(1), 1200);
      const t3 = setTimeout(() => {
        setShowCountdown(false);
        setCountdownDone(true);
      }, 1800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    if (currentStep !== 4) {
      countdownTriggered.current = false;
      setCountdownDone(false);
    }
  }, [currentStep]);

  if (studentLoading || sessionLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student || !session) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6">
        <p className="text-center text-lg font-bold text-foreground">
          Økten ble ikke funnet
        </p>
      </div>
    );
  }

  const statement = fagprat?.statements[statementIndex];

  // Group members for step 2
  const groupMembers =
    student.groupIndex !== undefined
      ? students?.filter(
          (s) => s.groupIndex === student.groupIndex && s._id !== student._id,
        ) ?? []
      : [];

  const handleVote = async (value: "sant" | "usant" | "delvis") => {
    if (hasVoted) return;
    setVoteSent(true);
    await castVoteMutation({
      sessionId: session._id,
      studentId: typedStudentId,
      statementIndex,
      round,
      vote: value,
    });
  };

  // Statement card reusable for student
  const studentStatementCard = statement && (
    <div className="mx-auto w-full max-w-md rounded-2xl border-[1.5px] border-blue-200 bg-blue-50 p-5">
      <p className="text-center text-base font-bold text-foreground">{statement.text}</p>
    </div>
  );

  // Render based on session state
  const renderContent = () => {
    // Waiting in lobby
    if (session.status === "lobby") {
      return (
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "flex size-16 items-center justify-center rounded-full text-2xl font-bold text-white",
              student.avatarColor,
            )}
          >
            {student.name[0]}
          </div>
          <h1 className="text-xl font-extrabold text-foreground">Hei, {student.name}!</h1>
          <div className="flex items-center text-muted-foreground">
            Venter på at læreren starter
            <WaitingDots />
          </div>
        </div>
      );
    }

    // Game ended
    if (session.status === "ended") {
      return (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-xl font-extrabold text-foreground">Økten er avsluttet</h1>
          <p className="text-muted-foreground">Takk for at du deltok!</p>
        </div>
      );
    }

    // Active game — render based on currentStep
    switch (currentStep) {
      // Step 0: Teacher selecting a statement
      case 0:
        return (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-bold text-foreground">Læreren velger en påstand</h2>
            <div className="flex items-center text-muted-foreground">
              Venter
              <WaitingDots />
            </div>
          </div>
        );

      // Step 1: First vote
      case 1:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              1. stemmerunde
            </h2>
            {studentStatementCard}
            {hasVoted ? (
              <div className="rounded-xl bg-primary/10 px-6 py-3">
                <p className="text-sm font-bold text-primary">
                  Sendt! {existingVote ? VOTE_LABELS[existingVote.vote] : ""}
                </p>
              </div>
            ) : (
              <VoteButtons selected={null} onVote={handleVote} />
            )}
          </div>
        );

      // Step 2: Discussion
      case 2:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Diskusjon
            </h2>
            {studentStatementCard}
            <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-center text-sm italic text-foreground/80">
                Diskuter med gruppen din. Hva tenker dere?
              </p>
            </div>
            {groupMembers.length > 0 && (
              <div className="w-full max-w-md">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Din gruppe
                </p>
                <div className="flex flex-wrap gap-2">
                  {groupMembers.map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 shadow-xs"
                    >
                      <div
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full text-xs font-bold text-white",
                          m.avatarColor,
                        )}
                      >
                        {m.name[0]}
                      </div>
                      <span className="text-sm font-medium text-foreground">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      // Step 3: Second vote
      case 3:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              2. stemmerunde
            </h2>
            {studentStatementCard}
            {hasVoted ? (
              <div className="rounded-xl bg-primary/10 px-6 py-3">
                <p className="text-sm font-bold text-primary">
                  Sendt! {existingVote ? VOTE_LABELS[existingVote.vote] : ""}
                </p>
              </div>
            ) : (
              <VoteButtons selected={null} onVote={handleVote} />
            )}
          </div>
        );

      // Step 4: Answer reveal
      case 4: {
        const fasitLabel = statement ? (VOTE_LABELS[statement.fasit] ?? statement.fasit) : "";
        const fasitColor =
          statement?.fasit === "sant"
            ? "bg-[#4CAF50]"
            : statement?.fasit === "usant"
              ? "bg-[#EF5350]"
              : "bg-[#FF9800]";

        return (
          <>
            {showCountdown && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
                <span
                  key={countdownNumber}
                  className="animate-ping text-8xl font-extrabold text-white"
                  style={{ animationDuration: "500ms", animationIterationCount: 1 }}
                >
                  {countdownNumber}
                </span>
              </div>
            )}
            <div className="flex w-full flex-col items-center gap-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Fasit
              </h2>
              {countdownDone && (
                <span
                  className={cn(
                    "animate-bounce rounded-full px-6 py-2 text-lg font-extrabold text-white",
                    fasitColor,
                  )}
                >
                  {fasitLabel}
                </span>
              )}
              {studentStatementCard}
            </div>
          </>
        );
      }

      // Step 5: Explanation
      case 5:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Forklaring
            </h2>
            <div className="w-full max-w-md overflow-hidden rounded-2xl border-[1.5px] border-blue-200">
              <div className="bg-gradient-to-b from-blue-100 to-blue-50 p-5">
                <p className="text-center text-base font-bold text-foreground">
                  {statement?.text}
                </p>
              </div>
              <div className="bg-white p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg font-extrabold text-primary">P</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Forklaring
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {statement?.explanation}
                </p>
              </div>
            </div>
          </div>
        );

      // Step 6: Self evaluation
      case 6:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Egenvurdering
            </h2>
            {studentStatementCard}
            <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-center text-sm italic text-foreground/80">
                Vurder fra 1 til 5 hvor godt du forstår påstanden nå.
              </p>
            </div>
            {ratingSent ? (
              <div className="rounded-xl bg-primary/10 px-6 py-3">
                <p className="text-sm font-bold text-primary">Takk!</p>
              </div>
            ) : (
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRatingSent(true)}
                    className={cn(
                      "rounded-xl px-5 py-3 text-lg font-bold text-white transition-all active:scale-95",
                      RATING_COLORS[n - 1],
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center text-muted-foreground">
            Venter
            <WaitingDots />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-8">
      {/* Student header */}
      <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b bg-card px-4 py-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-sm font-bold text-white",
              student.avatarColor,
            )}
          >
            {student.name[0]}
          </div>
          <span className="text-sm font-bold text-foreground">{student.name}</span>
        </div>
        <img src="/logo.png" alt="Evalion" className="h-6 object-contain" />
      </div>

      {/* Main content area */}
      <div className="flex w-full max-w-md flex-col items-center pt-8">
        {renderContent()}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter web typecheck`

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/spill.\$studentId.tsx
git commit -m "feat: add student reactive game view at /spill/:studentId"
```

---

## Task 11: Final Verification

- [ ] **Step 1: Run full typecheck across all workspaces**

Run: `pnpm typecheck`

Expected: No type errors in any workspace.

- [ ] **Step 2: Run lint**

Run: `pnpm lint`

Expected: No critical lint errors. Fix any issues.

- [ ] **Step 3: Manual integration test**

Start both apps:
```bash
pnpm --filter dashboard dev &
pnpm --filter web dev &
```

**Teacher flow test:**
1. Open http://localhost:3001 (dashboard)
2. Log in, navigate to a FagPrat, click "Start liveøkt"
3. Configure session options, click "Neste — opprett lobby"
4. Verify browser redirects to http://localhost:3000/liveokt/{sessionId}
5. Verify lobby shows game code, QR code, "Venter..." footer

**Student flow test:**
1. Open http://localhost:3000 in a separate browser/incognito
2. Enter the game code shown in teacher lobby
3. Click PLAY -> should navigate to /delta?code=...
4. Enter a name, click "Bli med"
5. Verify student appears in teacher's lobby in real-time
6. Verify student sees "Venter på at læreren starter..."

**Game flow test:**
1. Teacher clicks "Start aktiviteten"
2. Teacher selects a statement (step 0)
3. Verify student sees "Læreren velger en påstand..."
4. Teacher proceeds to step 1 (voting)
5. Student votes on their device -> vote appears in teacher panel
6. Continue through all 7 steps verifying student view updates reactively

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address issues found during integration testing"
```
