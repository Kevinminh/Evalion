# Game Steps UI Fidelity — Design Spec

## Context

The active game steps (steg 0-6) in `apps/web` are functionally complete but visually diverge from the HTML mockups in `html-mockups/`. The biggest gaps are: no Professor character, wrong countdown animation, missing fasit badge positioning, and missing speech bubbles. This spec covers bringing the UI of both the student view (`spill.$studentId.tsx`) and teacher view (`liveokt.$sessionId.steg.$step.tsx`) into alignment with the mockups.

## Scope

- **In scope:** Professor component, speech bubbles, fasit badge, countdown animation, recording button, statement card colors, step indicator polish
- **Out of scope:** Backend changes (justifications, confidence scores), transcription integration, dashboard pages, new features beyond UI fidelity

---

## 1. New Components

### 1a. `packages/ui/src/components/live/professor.tsx`

A reusable Professor character with optional speech bubble.

**Props:**
```ts
interface ProfessorProps {
  size?: "sm" | "lg";       // sm=96px (in-step), lg=220px (step 0). Default: "sm"
  text?: string;             // Speech bubble content. Omit = no bubble.
  label?: string;            // Text below image (step 0: "Velg en påstand")
  animate?: boolean;         // fadeInUp on bubble. Default: true
  className?: string;
}
```

**Visual:**
- Circular container with `bg-primary/10` (light purple) background
- `GraduationCap` icon from Lucide centered inside (text-primary color)
- Size sm: 96px circle, icon ~40px. Size lg: 220px circle, icon ~80px.
- Optional `label` rendered below the circle in `text-sm font-medium text-muted-foreground`

**Speech Bubble:**
- White bg, `border border-border`, `rounded-2xl`, `px-5 py-4`
- Text: `text-base font-medium text-foreground/80`, italic
- Small `<div>` styled as a left-pointing triangle (CSS border trick: `border-8 border-transparent border-r-white`) positioned to the left of the bubble
- When `animate=true`: `animation: fadeInUp 0.5s ease 0.2s both`
- Bubble positioned to the right of professor (flex row) on desktop, below on mobile

### 1b. `packages/ui/src/components/live/fasit-badge.tsx`

Positioned answer badge for steps 4-6.

**Props:**
```ts
interface FasitBadgeProps {
  answer: "sant" | "usant" | "delvis";
  animated?: boolean;        // badge-bounce entrance (step 4) vs static (steps 5, 6)
  className?: string;
}
```

**Visual:**
- Pill shape: `rounded-full px-8 py-2.5`
- Colors: sant=`bg-[#4CAF50]`, usant=`bg-[#EF5350]`, delvis=`bg-[#FF9800]`
- Text: `text-lg font-extrabold text-white uppercase`
- Labels: "SANT", "USANT", "DELVIS SANT"
- When `animated=true`: `animation: badge-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both`
- Parent should position this with `relative` wrapper + badge centered above statement card

---

## 2. CSS Animations

Add to `packages/ui/src/styles/globals.css` inside `@layer base` or as standalone `@keyframes`:

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes countdown-pop {
  0% { opacity: 0; transform: scale(2); }
  50% { opacity: 1; transform: scale(0.95); }
  100% { opacity: 0; transform: scale(1); }
}

@keyframes badge-bounce {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
```

Register as Tailwind utilities via `@theme inline` or `@utility`:
- `animate-fade-in-up` → `fadeInUp 0.5s ease both`
- `animate-countdown-pop` → `countdown-pop 0.8s ease both`
- `animate-badge-bounce` → `badge-bounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both`
- `animate-blink` → `blink 1s ease-in-out infinite`

---

## 3. Statement Card Colors

Replace Tailwind color classes in `STATEMENT_COLORS` with exact mockup hex values:

```ts
const STATEMENT_COLORS = [
  { bg: "#FFFDE7", border: "#FFE082" },   // Yellow
  { bg: "#E3F1FC", border: "#B8DAF0" },   // Blue
  { bg: "#FFF3E0", border: "#FFCC80" },   // Orange
  { bg: "#F3E5F5", border: "#CE93D8" },   // Purple
  { bg: "#FFEBEE", border: "#EF9A9A" },   // Red
];
```

Applied via inline `style` prop on statement cards in step 0 (both teacher and student views).

---

## 4. Step-by-Step Integration

### Step 0 — Choose Statement

**Teacher view (`liveokt.$sessionId.steg.$step.tsx`):**
- Add `<Professor size="lg" label="Velg en påstand" />` positioned on the left
- Layout: flex row → professor (left, shrink-0) + statement cards grid (right, flex-1)
- Update statement cards to use new `STATEMENT_COLORS` with inline styles
- Card hover: `hover:scale-[1.03]` (already similar, fine-tune shadow)
- Card text: bump to `text-base font-semibold` (from text-sm)

**Student view (`spill.$studentId.tsx`):**
- Step 0 currently shows "Læreren velger en påstand" waiting state — this stays as-is (student doesn't select)

### Step 1 — First Vote

**Teacher view:**
- Add `<Professor size="sm" text="Stem uten å avsløre hva du tenker..." />` between statement card and vote buttons
- Layout: statement card → professor row → vote buttons (vertical stack)

**Student view:**
- Add `<Professor size="sm" text="Stem uten å avsløre hva du tenker..." />` between statement card and vote buttons

### Step 2 — Discussion

**Teacher view:**
- Add `<Professor size="sm" text="Diskuter med læringspartneren din. Forklar til hverandre hva dere tenker." />`
- Enhance recording button (see Section 5)

**Student view:**
- Add `<Professor size="sm" text="Diskuter med læringspartneren din. Hva tenker dere?" />`

### Step 3 — Second Vote

**Teacher view:**
- Add `<Professor size="sm" text="Har du endret mening etter diskusjonen? Stem på nytt!" />`

**Student view:**
- Add `<Professor size="sm" text="Har du endret mening? Stem på nytt!" />`

### Step 4 — Answer Reveal

**Both views — Countdown:**
- Replace `animate-ping` with `animate-countdown-pop`
- Each number gets its own animation cycle: render via `key={countdownNumber}` (already done)
- Increase text size: `text-[160px]` or `text-9xl`
- Keep existing timing (600ms stagger) — matches mockup

**Both views — Badge:**
- After countdown, render `<FasitBadge answer={statement.fasit} animated />` centered above statement card
- Wrap statement card in a `relative` container, badge positioned with `mb-4` above card (not absolute, just vertical flow)

### Step 5 — Explanation

**Teacher view:**
- Render `<FasitBadge answer={statement.fasit} />` (static) above combined card
- Combined card layout: statement section (blue gradient top) + explanation section (white bottom with professor inline)
- Professor (sm, 96px) on left of explanation text, text on right — flex row inside the white section
- This is already close to current code, just needs the FasitBadge above and professor sizing refinement

**Student view:**
- Same combined card layout with FasitBadge above
- Professor inside explanation section

### Step 6 — Self-Evaluation

**Teacher view:**
- Add `<FasitBadge answer={statement.fasit} />` (static) above statement card
- Add `<Professor size="sm" text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå." />`
- Rating buttons already correct

**Student view:**
- Add `<FasitBadge answer={statement.fasit} />` (static) above statement card
- Add `<Professor size="sm" text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå." />`

---

## 5. Recording Button Enhancement

In `liveokt.$sessionId.steg.$step.tsx`, update the recording button (steps 2 and 4):

**Idle state:**
- `bg-muted text-muted-foreground` (current, fine)
- Icon + "Opptak" label

**Recording state:**
- `bg-foreground text-white` (dark background)
- Red dot with `animate-blink` animation: `<span className="size-2 rounded-full bg-red-500 animate-blink" />`
- Timer display: `useState` for elapsed time, `useEffect` interval incrementing every second
- Format as `MM:SS` next to the mic icon
- Stop button behavior: clicking again stops recording

---

## 6. Step Indicator Polish

Update `packages/ui/src/components/live/step-nav.tsx`:

- Keep current structure (it's close to mockup already)
- Show labels on all screen sizes (remove `hidden lg:inline`, add `hidden sm:inline` instead for slightly better mobile)
- Ensure step numbers display correctly: step 0 shows "0" (already does)
- Active step: `bg-primary text-primary-foreground` circle (already correct)
- Completed step: green circle with check (already correct)
- Inactive step: `bg-muted/60` (already close)
- Minor tweak: increase gap between steps for breathing room

---

## 7. Files Modified

| File | Action |
|------|--------|
| `packages/ui/src/components/live/professor.tsx` | **Create** — Professor + speech bubble component |
| `packages/ui/src/components/live/fasit-badge.tsx` | **Create** — Answer badge with bounce animation |
| `packages/ui/src/styles/globals.css` | **Edit** — Add keyframe animations + Tailwind utilities |
| `apps/web/src/routes/spill.$studentId.tsx` | **Edit** — Add professor, fasit badge, update countdown |
| `apps/web/src/routes/liveokt.$sessionId.steg.$step.tsx` | **Edit** — Add professor, fasit badge, update countdown, statement colors, recording button |
| `packages/ui/src/components/live/step-nav.tsx` | **Edit** — Minor label visibility + spacing polish |

---

## 8. Verification

1. Run `pnpm dev` and open both apps
2. **Teacher flow:** Dashboard → start live session → lobby → start activity → navigate through all 7 steps
3. **Student flow:** Join via code → wait in lobby → play through all 7 steps
4. **Per-step checks:**
   - Step 0: Professor (lg) visible on left, colored cards on right
   - Step 1: Professor with speech bubble, vote buttons below
   - Step 2: Professor with discussion prompt, recording button has blink dot when active
   - Step 3: Professor with re-vote prompt
   - Step 4: Countdown uses pop animation (not ping), fasit badge bounces in above card
   - Step 5: Combined card with fasit badge above, professor inline with explanation
   - Step 6: Fasit badge above, professor with rating prompt, rating buttons work
5. Run `pnpm typecheck` and `pnpm lint` to verify no regressions
