---
title: TypeScript Rules (Strictly Enforced by ESLint)
type: convention
tags: [typescript, eslint, strict]
---

# TypeScript Rules (Strictly Enforced by ESLint)

1. **Explicit return types on all functions** — `function foo(): void`, `const fn = (): string =>`
2. **`import type`** for type-only imports — `import type { IFoo } from '@/models/Foo.model'`
3. **No unused variables or parameters** — `noUnusedLocals`, `noUnusedParameters`
4. **Typed arrow function parameters** — `const fn = (x: string): void =>`
5. **`any` is allowed** — but prefer explicit types
6. **No `console.log`** — use `console.error` or `console.info` only
7. **Path alias** — always use `@/` for `src/` imports, never relative `../` paths beyond one level
