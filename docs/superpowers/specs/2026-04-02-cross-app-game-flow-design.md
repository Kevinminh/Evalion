# Cross-App Game Launch Flow: Dashboard to Play

## Context

Teachers create and configure FagPrat sessions on **dashboard.evalion.no**, but the live session (lobby + game) currently also lives on the dashboard. This means:
- The projected lobby screen shows a dashboard URL, not the student-facing URL
- Students join on a different domain (play.evalion.no) than where the teacher operates
- The play app has only a stub join page with no submit handler or game flow

**Goal**: Move the entire live session experience to **play.evalion.no** so both teacher and students operate on the same domain during a game. The dashboard becomes setup-only.

## Architecture: Separate Route Trees (Approach 1)

Teacher and student have fundamentally different experiences, so they get separate route trees on play.evalion.no.

### Routes

| Route | Purpose | Auth | View |
|---|---|---|---|
| `/` | Enter game code | None | Existing page, add submit logic |
| `/delta` | Enter name + join (`?code=ABC123`) | None | New page |
| `/spill/$studentId` | Student game (reactive, all steps) | None | New page |
| `/liveokt/$sessionId` | Teacher lobby | Required | Ported from dashboard |
| `/liveokt/$sessionId/steg/$step` | Teacher game steps | Required | Ported from dashboard |

### User Flows

**Teacher flow**:
1. Configure session on dashboard.evalion.no (`/liveokt/$fagpratId`)
2. Click "Neste -- opprett lobby" -> `createSession()` mutation
3. Redirect to `play.evalion.no/liveokt/{sessionId}` (cross-origin)
4. Auth carries over via cross-subdomain cookie (`COOKIE_DOMAIN=.evalion.no`)
5. Teacher sees lobby with game code, QR, live student list
6. Groups (if enabled) -> Start -> 7-step game flow

**Student flow**:
1. Open play.evalion.no (or scan QR code)
2. Enter game code on `/` -> validates via `getByJoinCode()`
3. Navigate to `/delta?code=ABC123` -> enter name
4. `addStudent()` mutation -> navigate to `/spill/{studentId}`
5. Reactive game view: waits for teacher to start, then follows `session.currentStep`

## Detailed Design

### 1. Dashboard Change

**File**: `apps/dashboard/src/routes/liveokt.$id.tsx`

In `handleLaunch()`, after `createSession()`:
- Replace internal `navigate()` with cross-origin redirect
- Use `VITE_PLAY_URL` env var (localhost:3000 in dev, https://play.evalion.no in prod)
- `window.location.href = \`${playUrl}/liveokt/${sessionId}\``

**New env var**: Add `VITE_PLAY_URL` to `apps/dashboard/.env.local` and `.env.example`.

### 2. Teacher Lobby (`/liveokt/$sessionId`)

**New file**: `apps/web/src/routes/liveokt.$sessionId.tsx`

Ported from `apps/dashboard/src/routes/liveokt.$id.lobby.tsx` with these adaptations:
- Route param is `$sessionId` (Convex session ID) rather than `$id` (fagprat ID) + search param
- Auth guard in `beforeLoad`: check authenticated, then verify `session.teacherId === identity.subject`
- Uses shared live components from `@workspace/ui`

**Layout** (matching HTML mockup `fagprat-lobby.html`):
- **Top bar**: FagPrat logo + divider + session title | "Opprett grupper" + "Start aktiviteten" buttons
- **Left panel** (38% width, min 340px, max 480px):
  - Evalion logo (88px)
  - Join URL: `play.evalion.no`
  - "Skriv inn koden for a bli med:" label
  - Game code box: mono font, 2.5rem, tracking-[0.25em], primary color, bordered box
  - "Eller skann" label
  - **Real QR code** (130x130) pointing to `play.evalion.no/delta?code={joinCode}`
- **Right panel**: Student cards with avatars, remove buttons, grouped view with staggered fade-in animation
- **Footer**: "Venter pa at elever kobler til..." with animated dots + student count icon

**Real-time**: `listStudents(sessionId)` Convex query provides live updates.

**Actions**:
- "Opprett grupper": `createGroups(sessionId, groupCount)` -> toggles to grouped view
- "Start aktiviteten": `updateStep(sessionId, 0)` -> navigate to `/liveokt/${sessionId}/steg/0`

### 3. Teacher Game Steps (`/liveokt/$sessionId/steg/$step`)

**New file**: `apps/web/src/routes/liveokt.$sessionId.steg.$step.tsx`

Ported from `apps/dashboard/src/routes/liveokt.$id.steg.$step.tsx` with:
- Session ID from route param instead of search param
- Shared components from `@workspace/ui`
- Same 7-step content rendering and teacher panel

### 4. Student Join Page Enhancement (`/`)

**File**: `apps/web/src/routes/index.tsx`

Add to existing page:
- `useState` for game code input value
- On submit: `getByJoinCode(code.toUpperCase())`
  - If session found with status "lobby" or "active": navigate to `/delta?code={code}`
  - If not found or ended: show error message
- Auto-uppercase input, max 6 chars

### 5. Student Name Entry (`/delta`)

**New file**: `apps/web/src/routes/delta.tsx`

- Read `code` from search params via `validateSearch`
- Fetch session via `getByJoinCode(code)`
- Show: Session title, "Hva heter du?" heading, name input, "Bli med" button
- On submit: `addStudent(sessionId, name)` -> navigate to `/spill/{studentId}`
- If session not found: show error with link back to `/`
- Mobile-first centered layout, similar to home page styling

### 6. Student Game View (`/spill/$studentId`)

**New file**: `apps/web/src/routes/spill.$studentId.tsx`

A single reactive page -- no step navigation by the student.

**Data subscriptions**:
- `liveSessions.getStudent(studentId)` -> sessionId, name, avatarColor, groupIndex
- `liveSessions.getById(sessionId)` -> currentStep, currentStatementIndex, fagpratId, status
- `fagprats.getById(fagpratId)` -> statements
- `liveSessions.listStudents(sessionId)` -> for group display in step 2
- `liveSessions.getVotes(sessionId, statementIndex)` -> filter by studentId to detect existing vote

**Backend addition needed**: A query to get a single student by ID:
- `liveSessions.getStudent(studentId)` -> returns the student record

**Step rendering** (driven by `session.currentStep`):

| session.currentStep | Student view |
|---|---|
| null / lobby status | "Venter pa at laereren starter..." + animated dots |
| 0 | "Laereren velger en pastand..." + waiting animation |
| 1 | Statement card + 3 vote buttons (sant/usant/delvis). After voting: "Sendt!" + disabled buttons |
| 2 | "Diskuter i gruppen din" + statement + group members list (if groups enabled) |
| 3 | Statement card + vote buttons (round 2). Same vote-then-confirm pattern |
| 4 | Countdown 3-2-1 overlay -> correct answer badge + statement |
| 5 | Statement + explanation text (professor section) |
| 6 | Statement + 1-5 rating scale buttons. After rating: "Takk!" confirmation |

**Design principles**:
- Mobile-first: full viewport height, centered content, large touch targets (min 48px)
- No navigation controls -- student follows teacher's pace
- Votes disabled after submission (detect by checking `getVotes()` for existing vote with matching studentId + statementIndex + round)
- Clear visual feedback after each interaction

### 7. Shared Components (Move to packages/ui)

Move from `apps/dashboard/src/components/live/` to `packages/ui/src/components/live/`:

| Component | File | Used by |
|---|---|---|
| `SessionTopBar` | session-top-bar.tsx | Teacher lobby + steps |
| `StepNav` | step-nav.tsx | Teacher steps |
| `TeacherPanel` | teacher-panel.tsx | Teacher steps |
| `VoteButtons` | vote-buttons.tsx | Teacher steps + Student game |
| `TimerCard` | timer-card.tsx | Teacher steps |
| `DistributionChart` | distribution-chart.tsx | Teacher steps |
| `OptionCard` | option-card.tsx | Dashboard setup (stays) |
| `Stepper` | stepper.tsx | Dashboard setup (stays) |

Export via subpath: `@workspace/ui/components/live/session-top-bar`, etc.

Update dashboard imports to use the new `@workspace/ui` paths.

`OptionCard` and `Stepper` stay in dashboard since they're only used in setup.

### 8. QR Code Generation

- Add `qrcode.react` to `catalog:` in `pnpm-workspace.yaml`
- Add as dependency to `apps/web/package.json`
- In teacher lobby left panel:
  ```tsx
  import { QRCodeSVG } from "qrcode.react";
  <QRCodeSVG value={`${playUrl}/delta?code=${session.joinCode}`} size={130} />
  ```
- `playUrl` from `window.location.origin` (since we're already on play.evalion.no)

### 9. Cross-App Auth

**Already configured**:
- Both apps use Better Auth with same Convex backend
- `COOKIE_DOMAIN=.evalion.no` in production env
- Web app's `__root.tsx` calls `getToken()` in `beforeLoad`

**No additional auth work needed** -- the cookie carries the session across subdomains.

**Local dev consideration**: Cross-subdomain cookies don't work on `localhost:3000` / `localhost:3001`. Options:
- Use `VITE_PLAY_URL=http://localhost:3000` and rely on the same browser having auth cookies for both ports (Better Auth may already handle this since both talk to the same Convex backend)
- Or: both apps run on same host but different ports, with Convex auth tokens handled via the shared backend

### 10. Backend Additions

**New query** in `packages/backend/convex/liveSessions.ts`:
```typescript
export const getStudent = query({
  args: { id: v.id("sessionStudents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

This lets the student game view fetch their own record to get `sessionId`.

**No schema changes needed** -- the existing schema supports everything.

## Files to Create/Modify

### New files:
- `apps/web/src/routes/delta.tsx` -- Student name entry
- `apps/web/src/routes/spill.$studentId.tsx` -- Student game view
- `apps/web/src/routes/liveokt.$sessionId.tsx` -- Teacher lobby
- `apps/web/src/routes/liveokt.$sessionId.steg.$step.tsx` -- Teacher game steps

### Modified files:
- `apps/web/src/routes/index.tsx` -- Add game code submit handler
- `apps/dashboard/src/routes/liveokt.$id.tsx` -- Redirect to play URL
- `apps/dashboard/.env.local` + `.env.example` -- Add VITE_PLAY_URL
- `packages/backend/convex/liveSessions.ts` -- Add getStudent query
- `packages/ui/src/components/live/` -- Move shared components here
- `packages/ui/package.json` -- Add live component exports
- `apps/dashboard/src/routes/liveokt.$id.lobby.tsx` -- Update imports to @workspace/ui
- `apps/dashboard/src/routes/liveokt.$id.steg.$step.tsx` -- Update imports to @workspace/ui
- `pnpm-workspace.yaml` -- Add qrcode.react to catalog
- `apps/web/package.json` -- Add qrcode.react dependency

## Verification Plan

1. **Dev setup**: `pnpm --filter dashboard dev` + `pnpm --filter web dev` (ports 3001 + 3000)
2. **Dashboard redirect**: Create session on dashboard -> verify browser navigates to localhost:3000/liveokt/{sessionId}
3. **Teacher lobby**: Verify lobby loads with game code, QR code, student list area, "Venter..." footer
4. **Student join**: Open localhost:3000 -> enter game code -> enter name -> verify student card appears in teacher's lobby in real-time
5. **QR code**: Verify QR encodes correct URL with join code
6. **Groups**: Click "Opprett grupper" -> verify students shuffle into group columns with animation
7. **Teacher game flow**: Click "Start aktiviteten" -> navigate through all 7 steps -> verify teacher panel, timer, vote distribution work
8. **Student game flow**: Verify student sees each step as teacher progresses -> vote in step 1 -> confirm vote appears in teacher panel -> vote in step 3 -> see countdown + answer in step 4 -> see explanation in step 5 -> rate in step 6
9. **Cross-domain auth**: Verify teacher auth cookie carries from dashboard.evalion.no to play.evalion.no (test in staging/prod environment)
