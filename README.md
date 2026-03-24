# Evalion

Evalion er et digitalt verktøy for lærere som ønsker å skape mer engasjement og faglig dybde i klasserommet. Kjerneaktiviteten heter FagPrat – en strukturert diskusjonsøkt hvor læreren presenterer faglige påstander som elevene skal ta stilling til.

Slik fungerer det: elevene stemmer individuelt på om en påstand er sant, delvis sant eller usant, og oppgir hvor sikre de er. Deretter diskuterer de med hverandre, før de stemmer på nytt. Læreren avslører fasiten, og elevene forklarer og reflekterer over egen forståelse. Til slutt vurderer de selv hvor godt de forstår påstanden.

Mens aktiviteten pågår, gir Evalion læreren tilgang til live-statistikk som viser stemmefordeling, sikkerhetsnivå og hvilke elever som endrer standpunkt. Dette gjør det mulig å tilpasse samtalen i sanntid – for eksempel ved å løfte fram elever med gode forklaringer eller undersøke mulige misoppfatninger.

Etter hver økt genererer Evalion en rapport med detaljert analyse av hver påstand: hvem som endret standpunkt, gjennomsnittlig forståelse, og elevenes egne skriftlige forklaringer sortert etter riktig og feil standpunkt. Dette gir læreren et konkret grunnlag for videre undervisning og dokumentasjon av elevenes kompetanse over tid – i tråd med kravene i LK20.

Evalion passer på alle trinn og fag, og er enkelt å komme i gang med. Læreren kan bruke den innebygde påstandsgeneratoren til å lage gode påstander på under ett minutt, og aktiviteten kan organiseres på fire ulike måter avhengig av klassen og situasjonen.

---

A TypeScript + React monorepo built with TanStack Start, shadcn/ui, and Better Auth.

## Prerequisites

- Node.js >= 20
- pnpm 9.15.9

## Getting Started

```bash
pnpm install
pnpm dev
```

This starts all apps concurrently via Turborepo.

## Apps

| App | Stack | Port | Path |
|-----|-------|------|------|
| **web** | TanStack Start + Vite | 3000 | `apps/web` |
| **dashboard** | TanStack Start + Vite | 3001 | `apps/dashboard` |
| **landing** | Next.js 15 + Turbopack | 3002 | `apps/landing` |

Run a single app:

```bash
pnpm --filter web dev
```

## Packages

| Package | Name | Purpose |
|---------|------|---------|
| `packages/ui` | `@workspace/ui` | Shared UI components (shadcn/ui + Base UI + Tailwind CSS 4) |
| `packages/config` | `@evalion/config` | Shared TypeScript base configuration |

## Commands

| Task | Command |
|------|---------|
| Dev (all) | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Lint + fix | `pnpm lint:fix` |
| Format | `pnpm format` |
| Type check | `pnpm typecheck` |

## Adding UI Components

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Components are placed in `packages/ui/src/components/` and can be imported across all apps:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Dependency Management

Dependency versions are centralized in `pnpm-workspace.yaml` using the `catalog:` protocol. Add or update versions there, then reference them as `"package": "catalog:"` in individual `package.json` files.
