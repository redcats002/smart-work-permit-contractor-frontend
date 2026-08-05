# Module: pre-contract

Module-level invariants for the pre-contract detail flow. Read this before touching
`src/pages/contract/pages/pre-contract-detail/**`.

Facts that hold across all work items live here. Anything specific to one feature, bug, or
chore lives in that work item's own folder — see [Harness layout](#harness-layout).

Update this file in the same commit as any change to routing, the status state machine, or
module-wide data flow — this extends the module-map maintenance rule in root `AGENTS.md`.

## Harness layout

```
docs/modules/pre-contract/
├── context.md            ← you are here (module invariants)
├── feature_list.json     ← registry of every work item, all types
└── <type>/<nnn-slug>/
    ├── context.md        ← what this item is, the rule it encodes, its data flow
    ├── progress.md       ← dated session log for this item only
    └── tickets/          ← ticket write-ups (PRE-nnn.md)
```

`<type>` is one of `features/`, `issues/`, `chores/`. Only the types that have work are
created — add `issues/` or `chores/` when the first such item lands, not before.

**Startup path for an agent:**

1. Read this file (module invariants).
2. Read `feature_list.json` — find the item whose `status` is not `done`.
3. Read only that item's `context.md` + `progress.md`. Do not load sibling items.

`<nnn>` is a zero-padded sequence shared across all types, so IDs never collide.
Ticket files use the `PRE-<nnn>` prefix.

## Location

- Routes: nested under `src/router/modules/contract/index.ts` (`/contract/pre-contract/*`), no dedicated router module.
- Pages: `src/pages/contract/pages/pre-contract-detail/`
  - `pages/PreContractDetailPage.vue` — entry page, owns `useInitDetail`/`useAppraisal`/`useMakeContract`/`useMortgage`/`usePreAsset` composables.
  - `components/` — `PreContractAction.vue` (status-driven action buttons), `PreContractInformation.vue`, `PreContractDetailMenuAction.vue`, `appraisal/`, `make-contract/`, `mortgage/`, `pre-asset/`.
  - `schema/` — zod schemas for each modal form (e.g. `confirm-appraisal.schema.ts`).
- Providers: `pre-contract`, `contract-asset`, `contract-document`, `contract-history`.
- Models: `src/models/response/pre-contract/PreContractRes.model.ts` — `sellMan: IEmployeeList` is required (non-optional) on this response.

## Status state machine (`TPreContractStatus`)

`PreContractAction.vue` switches its rendered action by `status`:

```
DRAFT / PENDING_EVALUATION → UNDER_EVALUATION → PENDING_MORTGAGE → PENDING_CONTRACT → PENDING_REVIEW
```

Each status maps to one action: request appraisal, confirm appraisal / re-appraise,
submit mortgage, confirm mortgage, create contract, confirm contract creation. `cancel`
is available from any non-`CANCELLED` status.

## Module-wide conventions

- **Client-side guards are UX, not security.** Any ownership or permission check in this
  module exists to stop a user before they waste effort. The API must enforce the same rule
  independently. Never treat a toast as the authoritative check.
- **Roles come from `EmployeeRoleEnum`** (`src/enums/modules/employee/EmployeeRole.enum.ts`),
  never string literals.
- **Auth access** is `const authStore = useAuthStore()` at setup scope, then
  `authStore.user.x` — do not destructure, it drops reactivity.
