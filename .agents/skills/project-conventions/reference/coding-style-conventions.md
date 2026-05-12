---
title: Coding Style & Conventions
type: convention
tags: [eslint, typescript, imports, naming]
---

# Coding Style & Conventions

- **TypeScript strict mode**. All functions/types/interfaces must be explicitly typed.
- **Imports:** Use `@/` alias for all src imports. Use `import type` for type-only imports.
- **No unused variables/params**. ESLint enforced.
- **No `console.log`**. Use `console.error` or `console.info` only.
- **No relative imports beyond one level**.
- **Component/file naming:**
  - Components: `PascalCase.vue`
  - Composables: `useName.ts` (`use` prefix, camelCase filename)
  - Stores: `Name.ts` (PascalCase filename, no `Store` suffix; exported function is `useNameStore`)
  - Utils: `Name.ts` (PascalCase)
  - Models: `Name.model.ts` · Enums: `Name.enum.ts`
  - Providers: `Name.provider.ts` · Router modules: `Name.router.ts` · Schemas: `Name.schema.ts`
  - Type prefixes: `I<Name>` interfaces, `T<Name>` aliases, `E<Name>` or `<Name>Enum` enums
