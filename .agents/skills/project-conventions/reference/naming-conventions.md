---
title: Naming Conventions
type: convention
tags: [naming, typescript, files, prefixes]
---

# Naming Conventions

## TypeScript Types

- **Interfaces:** `I<Name>` — e.g., `ICustomer`, `IFormState`, `IBaseOption`
- **Type aliases:** `T<Name>` — e.g., `TBaseParamsId`, `TEntityStatus`
- **Enums:** `E<Name>` or `<Name>Enum` — e.g., `ETitleName`, `EntityStatusEnum`
- **Type derived from enum keys:** `type T<Name> = keyof typeof <Name>Enum`

## Component Prefixes

| Prefix | Usage |
|---|---|
| `Base*` | Generic layout/structural primitives (`BasePage`, `BaseTop`, `BaseContainer`) |
| `App*` | App-level chrome components (`AppDrawer`, `AppDrawerMenu`) |
| `*Button` | Semantic action buttons (`CreateButton`, `EditButton`, `DeleteButton`, `ConfirmButton`, `CancelButton`, `BackButton`, `DownloadButton`, `FilterButton`) |
| `Form*` | Form action bars (`FormAction`, `FormActionFilter`) |
| `Display*` | Read-only display components |

## Files

- Components: `PascalCase.vue`
- Composables: `use<Name>.ts` (camelCase)
- Stores: `<Name>.ts` (PascalCase, no "Store" suffix in filename)
- Utils: `<Name>.ts` (PascalCase)
- Models: `<Name>.model.ts`
- Enums: `<Name>.enum.ts`
- Providers: `<Name>Provider.ts`
- Router modules: `<DomainName>.route.ts`
