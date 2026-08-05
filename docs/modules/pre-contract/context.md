# Module: pre-contract

Scoped harness context for the pre-contract detail flow. Read this before touching
`src/pages/contract/pages/pre-contract-detail/**`. Update it in the same commit as any
change to routing, ownership rules, or the status state machine below — see
`AGENTS.md`'s module-map maintenance rule at the repo root, which this file extends.

## Location

- Routes: nested under `src/router/modules/contract/index.ts` (`/contract/pre-contract/*`), no dedicated router module.
- Pages: `src/pages/contract/pages/pre-contract-detail/`
  - `pages/PreContractDetailPage.vue` — entry page, owns `useInitDetail`/`useAppraisal`/`useMakeContract`/`useMortgage`/`usePreAsset` composables.
  - `components/` — `PreContractAction.vue` (status-driven action buttons), `PreContractInformation.vue`, `appraisal/`, `make-contract/`, `mortgage/`, `pre-asset/`.
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

## Business rule — appraisal confirmation ownership

**Rule:** the "ยืนยันราคาประเมิน" (confirm appraisal) action in
`components/appraisal/ModalConfirmAppraisal.vue` may only proceed if the current user is
the contract's assigned appraiser (`sellMan`) or holds an elevated role.

**Guard:**
```ts
props.sellMan?.id === authStore.user.id
  || authStore.user.role === EmployeeRoleEnum.SUPER_ADMIN
  || authStore.user.role === EmployeeRoleEnum.ADMIN
```

**Enforcement point:** the modal's `activator` click handler (`onActivatorClick`), before
the modal opens — not inside `onSubmit`. This stops an unauthorized user before they
invest time filling the form, and keeps the check colocated with the button that triggers it.

**On failure:** `toast.warn('คุณไม่ใช่พนักงานประเมินของสัญญานี้ ไม่สามารถยืนยันราคาประเมินได้')`, modal does not open.

**Data flow:** `contract.sellMan` (`PreContractDetailPage.vue`) → `PreContractAction`
prop `sellMan` → `ModalConfirmAppraisal` prop `sellMan`. If a future refactor changes
where `sellMan` lives on the response, this chain must be re-wired and this doc updated.

**This is a client-side UX guard, not a security boundary.** The API must independently
enforce the same ownership check server-side; do not treat the toast as the authoritative check.
