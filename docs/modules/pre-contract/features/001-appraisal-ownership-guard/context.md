# PRE-001 — Appraisal confirmation ownership guard

**Type:** feature · **Status:** done · **Module:** [pre-contract](../../context.md)

## Rule

The "ยืนยันราคาประเมิน" (confirm appraisal) action in
`src/pages/contract/pages/pre-contract-detail/components/appraisal/ModalConfirmAppraisal.vue`
may only proceed if the current user is the contract's assigned appraiser (`sellMan`) or
holds an elevated role.

```ts
props.sellMan?.id === authStore.user.id
  || authStore.user.role === EmployeeRoleEnum.SUPER_ADMIN
  || authStore.user.role === EmployeeRoleEnum.ADMIN
```

## Enforcement point

The modal's `activator` click handler (`onActivatorClick`), **before the modal opens** — not
inside `onSubmit`. This stops an unauthorized user before they invest time filling the form,
and keeps the check colocated with the button that triggers it.

**On failure:** `toast.warn('คุณไม่ใช่พนักงานประเมินของสัญญานี้ ไม่สามารถยืนยันราคาประเมินได้')`,
modal does not open.

## Data flow

```
contract.sellMan  (PreContractDetailPage.vue)
  → :sell-man      PreContractAction.vue
    → :sell-man    ModalConfirmAppraisal.vue → canConfirm computed
```

`sellMan` is a required field on `PreContractRes.model.ts`. If a future refactor moves or
renames it, this three-hop chain must be re-wired — and note the guard **fails closed**:
an undefined `sellMan` blocks every non-admin user, which looks like correct behavior while
actually being a plumbing bug. Re-verify the field before changing the chain.

## Files

- `components/appraisal/ModalConfirmAppraisal.vue` — guard + toast
- `components/PreContractAction.vue` — prop pass-through
- `pages/PreContractDetailPage.vue` — binds `contract?.sellMan`

## Caveat

Client-side UX guard only. The API must independently enforce the same ownership check
server-side — **not verified in this work item, backend was out of scope.**
