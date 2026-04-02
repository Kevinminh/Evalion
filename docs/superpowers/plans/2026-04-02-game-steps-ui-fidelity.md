# Game Steps UI Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the active game steps (steg 0-6) in the web app into visual alignment with the HTML mockups — adding the Professor character, fixing the countdown animation, adding fasit badge positioning, and polishing step indicators.

**Architecture:** Two new shared UI components (`Professor`, `FasitBadge`) in `packages/ui`, four CSS keyframe animations in `globals.css`, then integration into the two route files that render the game (`spill.$studentId.tsx` for students, `liveokt.$sessionId.steg.$step.tsx` for teachers).

**Tech Stack:** React 19, TanStack Router, Tailwind CSS 4, Lucide icons, `@workspace/ui` component library

**Note:** This is purely visual/UI work with no testable business logic. Instead of TDD, each task ends with a visual verification step and a commit. Run `pnpm typecheck` after each task to catch type errors.

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `packages/ui/src/styles/globals.css` | Edit | Add 4 keyframe animations |
| `packages/ui/src/components/live/professor.tsx` | Create | Professor avatar + optional speech bubble |
| `packages/ui/src/components/live/fasit-badge.tsx` | Create | Answer badge pill with bounce animation |
| `packages/ui/src/components/live/step-nav.tsx` | Edit | Label visibility + spacing polish |
| `apps/web/src/routes/liveokt.$sessionId.steg.$step.tsx` | Edit | Integrate professor, badge, countdown, colors, recording button |
| `apps/web/src/routes/spill.$studentId.tsx` | Edit | Integrate professor, badge, countdown for student view |

---

### Task 1: CSS Animations

**Files:**
- Modify: `packages/ui/src/styles/globals.css:140-150`

- [ ] **Step 1: Add keyframe animations**

Open `packages/ui/src/styles/globals.css`. After the closing `}` of `@layer base` (line 150), append:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes countdown-pop {
  0% {
    opacity: 0;
    transform: scale(2);
  }
  50% {
    opacity: 1;
    transform: scale(0.95);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes badge-bounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
```

- [ ] **Step 2: Verify types compile**

Run: `pnpm --filter @workspace/ui typecheck`

Expected: No errors (CSS-only change, but ensures no accidental breakage).

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/styles/globals.css
git commit -m "feat: add fadeInUp, countdown-pop, badge-bounce, blink keyframe animations"
```

---

### Task 2: Professor Component

**Files:**
- Create: `packages/ui/src/components/live/professor.tsx`

- [ ] **Step 1: Create the Professor component**

Create `packages/ui/src/components/live/professor.tsx` with this content:

```tsx
import { cn } from "@workspace/ui/lib/utils";
import { GraduationCap } from "lucide-react";

interface ProfessorProps {
  size?: "sm" | "lg";
  text?: string;
  label?: string;
  animate?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { container: "size-24", icon: "size-10" },
  lg: { container: "size-[220px]", icon: "size-20" },
};

export function Professor({
  size = "sm",
  text,
  label,
  animate = true,
  className,
}: ProfessorProps) {
  const { container, icon } = sizeConfig[size];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-primary/10",
            container,
          )}
        >
          <GraduationCap className={cn("text-primary", icon)} />
        </div>
        {label && (
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        )}
      </div>
      {text && (
        <div className="relative flex items-center">
          <div
            className="absolute -left-2 size-0 border-8 border-transparent border-r-white"
            style={{ filter: "drop-shadow(-1px 0 0 var(--border))" }}
          />
          <div
            className={cn(
              "rounded-2xl border border-border bg-white px-5 py-4",
              animate && "animate-[fadeInUp_0.5s_ease_0.2s_both]",
            )}
          >
            <p className="text-base font-medium italic text-foreground/80">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify types compile**

Run: `pnpm --filter @workspace/ui typecheck`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/live/professor.tsx
git commit -m "feat: add Professor component with speech bubble and graduation cap icon"
```

---

### Task 3: FasitBadge Component

**Files:**
- Create: `packages/ui/src/components/live/fasit-badge.tsx`

- [ ] **Step 1: Create the FasitBadge component**

Create `packages/ui/src/components/live/fasit-badge.tsx` with this content:

```tsx
import { cn } from "@workspace/ui/lib/utils";

const FASIT_CONFIG = {
  sant: { label: "SANT", bg: "bg-[#4CAF50]" },
  usant: { label: "USANT", bg: "bg-[#EF5350]" },
  delvis: { label: "DELVIS SANT", bg: "bg-[#FF9800]" },
} as const;

interface FasitBadgeProps {
  answer: "sant" | "usant" | "delvis";
  animated?: boolean;
  className?: string;
}

export function FasitBadge({ answer, animated = false, className }: FasitBadgeProps) {
  const { label, bg } = FASIT_CONFIG[answer];

  return (
    <span
      className={cn(
        "inline-block rounded-full px-8 py-2.5 text-lg font-extrabold uppercase text-white",
        bg,
        animated && "animate-[badge-bounce_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]",
        className,
      )}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Verify types compile**

Run: `pnpm --filter @workspace/ui typecheck`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/live/fasit-badge.tsx
git commit -m "feat: add FasitBadge component with animated bounce entrance"
```

---

### Task 4: Integrate into Teacher View

**Files:**
- Modify: `apps/web/src/routes/liveokt.$sessionId.steg.$step.tsx`

This is the largest task — it touches the teacher's game control page for all 7 steps. Changes:
1. Import new components
2. Update statement card colors (step 0)
3. Add Professor to steps 0-3, 5-6
4. Add FasitBadge to steps 4-6
5. Fix countdown animation (step 4)
6. Enhance recording button with blink dot and timer
7. Add Professor layout to step 0 (flex row)

- [ ] **Step 1: Add imports**

At the top of `apps/web/src/routes/liveokt.$sessionId.steg.$step.tsx`, add these imports after the existing ones (line 11):

```tsx
import { FasitBadge } from "@workspace/ui/components/live/fasit-badge";
import { Professor } from "@workspace/ui/components/live/professor";
```

- [ ] **Step 2: Replace STATEMENT_COLORS**

Replace the `STATEMENT_COLORS` array (lines 38-44) with:

```tsx
const STATEMENT_COLORS = [
  { bg: "#FFFDE7", border: "#FFE082" },
  { bg: "#E3F1FC", border: "#B8DAF0" },
  { bg: "#FFF3E0", border: "#FFCC80" },
  { bg: "#F3E5F5", border: "#CE93D8" },
  { bg: "#FFEBEE", border: "#EF9A9A" },
];
```

- [ ] **Step 3: Add recording timer state**

After the `recording` state declaration (line 76), add:

```tsx
const [recordingTime, setRecordingTime] = useState(0);
```

And add a `useEffect` for the recording timer after the countdown effect (after line 127):

```tsx
// Recording timer
useEffect(() => {
  if (!recording) {
    setRecordingTime(0);
    return;
  }
  const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  return () => clearInterval(interval);
}, [recording]);
```

- [ ] **Step 4: Update step 0 — add Professor and inline style colors**

Replace the step 0 case in `renderStepContent` (lines 189-224) with:

```tsx
case 0: {
  const isOdd = fagprat.statements.length % 2 !== 0;
  return (
    <div className="flex items-start gap-10">
      <Professor size="lg" label="Velg en påstand" className="flex-col pt-8" />
      <div className="grid flex-1 grid-cols-2 gap-6">
        {fagprat.statements.map((s, i) => {
          const isSelected = selectedStatement === i;
          const hasSomeSelected = selectedStatement !== null;
          const isLast = i === fagprat.statements.length - 1;
          const color = STATEMENT_COLORS[i % STATEMENT_COLORS.length];
          return (
            <button
              key={i}
              onClick={() => {
                setSelectedStatement(i);
                setTimeout(() => goToStep(1), 600);
              }}
              style={{
                backgroundColor: color.bg,
                borderColor: color.border,
              }}
              className={cn(
                "rounded-2xl border-2 p-6 text-left text-base font-semibold transition-all duration-300 hover:scale-[1.03]",
                isSelected && "scale-105 ring-2 ring-primary",
                hasSomeSelected && !isSelected && "scale-[0.97] opacity-40",
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
```

- [ ] **Step 5: Update step 1 — add Professor**

Replace the step 1 case (lines 226-232) with:

```tsx
case 1:
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      {statementCard}
      <Professor size="sm" text="Stem uten å avsløre hva du tenker..." />
      <VoteButtons selected={vote} onVote={setVote} />
    </div>
  );
```

- [ ] **Step 6: Update step 2 — add Professor**

Replace the step 2 case (lines 234-244) with:

```tsx
case 2:
  return (
    <div className="flex flex-col items-center gap-6 pt-8">
      {statementCard}
      <Professor
        size="sm"
        text="Diskuter med læringspartneren din. Forklar til hverandre hva dere tenker."
      />
    </div>
  );
```

- [ ] **Step 7: Update step 3 — add Professor**

Replace the step 3 case (lines 246-252) with:

```tsx
case 3:
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      {statementCard}
      <Professor size="sm" text="Har du endret mening etter diskusjonen? Stem på nytt!" />
      <VoteButtons selected={vote} onVote={setVote} />
    </div>
  );
```

- [ ] **Step 8: Update step 4 — fix countdown animation + add FasitBadge**

Replace the step 4 case (lines 254-291) with:

```tsx
case 4: {
  return (
    <>
      {showCountdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <span
            key={countdownNumber}
            className="text-[160px] font-extrabold text-white animate-[countdown-pop_0.8s_ease_both]"
          >
            {countdownNumber}
          </span>
        </div>
      )}
      <div className="flex flex-col items-center gap-6 pt-8">
        {countdownDone && statement && (
          <FasitBadge answer={statement.fasit} animated />
        )}
        {statementCard}
      </div>
    </>
  );
}
```

- [ ] **Step 9: Update step 5 — add FasitBadge above combined card**

Replace the step 5 case (lines 293-315) with:

```tsx
case 5:
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 pt-8">
      {statement && <FasitBadge answer={statement.fasit} />}
      <div className="w-full overflow-hidden rounded-2xl border-[1.5px] border-blue-200">
        <div className="bg-gradient-to-b from-blue-100 to-blue-50 p-6">
          <p className="text-center text-lg font-bold text-foreground">
            {statement?.text}
          </p>
        </div>
        <div className="bg-white p-6">
          <div className="flex gap-4">
            <Professor size="sm" className="shrink-0" />
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Forklaring
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {statement?.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
```

- [ ] **Step 10: Update step 6 — add FasitBadge + Professor**

Replace the step 6 case (lines 317-347) with:

```tsx
case 6:
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      {statement && <FasitBadge answer={statement.fasit} />}
      {statementCard}
      <Professor
        size="sm"
        text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå."
      />
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
```

- [ ] **Step 11: Update recording button with blink dot and timer**

Replace the recording button in the return JSX (lines 441-452) with:

```tsx
{(step === 2 || step === 4) && (
  <button
    onClick={() => setRecording(!recording)}
    className={cn(
      "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
      recording ? "bg-foreground text-white" : "bg-muted text-muted-foreground",
    )}
  >
    {recording && (
      <span className="size-2 rounded-full bg-red-500 animate-[blink_1s_ease-in-out_infinite]" />
    )}
    <Mic className="size-4" />
    {recording
      ? `${String(Math.floor(recordingTime / 60)).padStart(2, "0")}:${String(recordingTime % 60).padStart(2, "0")}`
      : "Opptak"}
  </button>
)}
```

- [ ] **Step 12: Verify types compile**

Run: `pnpm --filter web typecheck`

Expected: No errors.

- [ ] **Step 13: Commit**

```bash
git add apps/web/src/routes/liveokt.\$sessionId.steg.\$step.tsx
git commit -m "feat: integrate Professor, FasitBadge, countdown animation, and recording timer into teacher game view"
```

---

### Task 5: Integrate into Student View

**Files:**
- Modify: `apps/web/src/routes/spill.$studentId.tsx`

- [ ] **Step 1: Add imports**

At the top of `apps/web/src/routes/spill.$studentId.tsx`, add after the existing imports (after line 7):

```tsx
import { FasitBadge } from "@workspace/ui/components/live/fasit-badge";
import { Professor } from "@workspace/ui/components/live/professor";
```

- [ ] **Step 2: Update step 1 (first vote) — add Professor**

Replace the step 1 case (lines 267-284) with:

```tsx
case 1:
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        1. stemmerunde
      </h2>
      {studentStatementCard}
      <Professor size="sm" text="Stem uten å avsløre hva du tenker..." />
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
```

- [ ] **Step 3: Update step 2 (discussion) — add Professor**

Replace the step 2 case (lines 287-325) with:

```tsx
case 2:
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Diskusjon
      </h2>
      {studentStatementCard}
      <Professor
        size="sm"
        text="Diskuter med læringspartneren din. Hva tenker dere?"
      />
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
```

- [ ] **Step 4: Update step 3 (second vote) — add Professor**

Replace the step 3 case (lines 328-345) with:

```tsx
case 3:
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        2. stemmerunde
      </h2>
      {studentStatementCard}
      <Professor size="sm" text="Har du endret mening? Stem på nytt!" />
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
```

- [ ] **Step 5: Update step 4 (answer reveal) — fix countdown + add FasitBadge**

Replace the step 4 case (lines 348-388) with:

```tsx
case 4: {
  return (
    <>
      {showCountdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <span
            key={countdownNumber}
            className="text-[160px] font-extrabold text-white animate-[countdown-pop_0.8s_ease_both]"
          >
            {countdownNumber}
          </span>
        </div>
      )}
      <div className="flex w-full flex-col items-center gap-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Fasit
        </h2>
        {countdownDone && statement && (
          <FasitBadge answer={statement.fasit} animated />
        )}
        {studentStatementCard}
      </div>
    </>
  );
}
```

- [ ] **Step 6: Update step 5 (explanation) — add FasitBadge + Professor in combined card**

Replace the step 5 case (lines 391-418) with:

```tsx
case 5:
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Forklaring
      </h2>
      {statement && <FasitBadge answer={statement.fasit} />}
      <div className="w-full max-w-md overflow-hidden rounded-2xl border-[1.5px] border-blue-200">
        <div className="bg-gradient-to-b from-blue-100 to-blue-50 p-5">
          <p className="text-center text-base font-bold text-foreground">
            {statement?.text}
          </p>
        </div>
        <div className="bg-white p-5">
          <div className="flex gap-3">
            <Professor size="sm" className="shrink-0" />
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Forklaring
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {statement?.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
```

- [ ] **Step 7: Update step 6 (self-evaluation) — add FasitBadge + Professor**

Replace the step 6 case (lines 421-466) with:

```tsx
case 6:
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Egenvurdering
      </h2>
      {statement && <FasitBadge answer={statement.fasit} />}
      {studentStatementCard}
      <Professor
        size="sm"
        text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå."
      />
      {ratingSent ? (
        <div className="rounded-xl bg-primary/10 px-6 py-3">
          <p className="text-sm font-bold text-primary">Takk!</p>
        </div>
      ) : (
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={async () => {
                setRatingSent(true);
                try {
                  await submitRatingMutation({
                    sessionId: session._id,
                    studentId: typedStudentId,
                    statementIndex,
                    rating: n,
                  });
                } catch {
                  setRatingSent(false);
                }
              }}
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
```

- [ ] **Step 8: Verify types compile**

Run: `pnpm --filter web typecheck`

Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/routes/spill.\$studentId.tsx
git commit -m "feat: integrate Professor, FasitBadge, and countdown animation into student game view"
```

---

### Task 6: Step Indicator Polish

**Files:**
- Modify: `packages/ui/src/components/live/step-nav.tsx`

- [ ] **Step 1: Update StepNav label visibility and spacing**

Replace the entire content of `packages/ui/src/components/live/step-nav.tsx` with:

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
    <div className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-center gap-3 border-t bg-card px-6 py-3">
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
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

Changes from original:
- `gap-2` → `gap-3` (more breathing room between steps)
- `hidden lg:inline` → `hidden sm:inline` (show labels on tablet and up)

- [ ] **Step 2: Verify types compile**

Run: `pnpm --filter @workspace/ui typecheck`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/live/step-nav.tsx
git commit -m "feat: polish step indicator spacing and label visibility"
```

---

### Task 7: Visual Verification

- [ ] **Step 1: Start dev servers**

Run: `pnpm dev`

Open teacher dashboard at `http://localhost:3001` and student app at `http://localhost:3000`.

- [ ] **Step 2: Create and start a live session**

In the dashboard, navigate to a FagPrat and start a live session. In another tab, join as a student via the code at `http://localhost:3000`.

- [ ] **Step 3: Verify each step visually**

Walk through all 7 steps and confirm:

| Step | Teacher View | Student View |
|------|-------------|-------------|
| 0 | Professor (lg) on left, colored cards on right | "Venter" screen (unchanged) |
| 1 | Professor bubble "Stem uten å avsløre...", vote buttons | Professor bubble, vote buttons |
| 2 | Professor bubble "Diskuter med læringspartneren...", recording button has blink dot when active | Professor bubble, group members |
| 3 | Professor bubble "Har du endret mening...", vote buttons | Professor bubble, vote buttons |
| 4 | Countdown: large numbers with pop animation (not ping), FasitBadge bounces in | Same countdown + badge |
| 5 | FasitBadge above combined card, professor inline with explanation | Same layout |
| 6 | FasitBadge, professor "Vurder fra 1 til 5...", rating buttons | Same |

- [ ] **Step 4: Run typecheck and lint**

Run: `pnpm typecheck && pnpm lint`

Expected: No errors.

- [ ] **Step 5: Final commit if any fixes were needed**

If any visual issues were spotted and fixed during verification, commit those fixes.
