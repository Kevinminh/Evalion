# TypeScript Conventions

## Compiler Configuration

All apps use strict TypeScript with these key flags:

- `strict: true` — full strict mode
- `noUnusedLocals: true` — no dead variables
- `noUnusedParameters: true` — no unused function params
- `noFallthroughCasesInSwitch: true`
- `verbatimModuleSyntax: true` — requires explicit `type` keyword on type-only imports
- `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`

## Type Imports

Always use `type` keyword for type-only imports:

```tsx
// Correct
import type { ButtonProps } from "./button"
import { type VariantProps } from "class-variance-authority"

// Wrong — verbatimModuleSyntax will error
import { ButtonProps } from "./button"
```

## Prefer Inference

Let TypeScript infer types wherever possible. Don't add annotations the compiler can figure out:

```tsx
// Preferred — type is inferred
const count = 0
const items = posts.map((p) => p.title)

// Avoid — redundant annotation
const count: number = 0
const items: string[] = posts.map((p: Post) => p.title)
```

## Component Props

Use `React.ComponentProps<>` to extend native element props. Intersect with variant types:

```tsx
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive {...props} />
}
```

## No Type Casting

Avoid `as` casts and non-null assertions (`!`). If the type system doesn't agree, fix the types rather than override them. Rely on strict mode and proper typing.

## Path Aliases

- `@/*` — local source (`./src/*` in TanStack apps, `./app/*` in landing)
- `@workspace/ui/*` — shared UI package (`../../packages/ui/src/*`)

```tsx
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { getUser } from "@/lib/auth"
```
