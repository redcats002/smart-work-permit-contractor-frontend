# PRE-002 — PreContractPrintPage

**Type:** feature · **Status:** not-started · **Module:** [pre-contract](../../context.md)

> **Frontend assumes the API already returns the borrower fields below.** The TypeScript
> interface is widened as part of this ticket and the UI is built against it. The matching
> backend change is tracked separately in [tickets/BACKEND-REQUEST.md](tickets/BACKEND-REQUEST.md)
> — until it ships, `อายุ` and the borrower address print blank at runtime while type-checking
> cleanly.

Print the loan-agreement document (`หนังสือสัญญากู้ยืมเงิน`) for a **pre-contract**, with
pixel-identical UI to the existing contract print page but sourced from the pre-contract API.

## Goal

| | Existing | New |
|---|---|---|
| Page | `src/pages/contract/pages/print/pages/ContractPrintPage.vue` | `PreContractPrintPage.vue` |
| Route | `/contract/print/:id` → `ContractPrintPage` | `/contract/pre-contract/print/:id` → `PreContractPrintPage` |
| Data | `ContractProvider.getContractFindOne` + `getContractAssets` | `PreContractProvider.getContractFindOne` only |
| Asset | separate `getContractAssets` call, takes `[0]` | `preAssets[0]` already on the findOne response |

UI must be **exactly** the same. That is the whole point of the refactor below — the document
body becomes one shared component so the two pages cannot drift.

## Known-broken right now

`useInitDetail.ts:90` already does:

```ts
router.push({ name: 'PreContractPrintPage', params: { id: contractId.value } })
```

That route **does not exist**. The print button on `PreContractDetailPage` is wired to a dead
route today — clicking it fails navigation. This ticket closes that gap; until it lands, the
button is broken in `dev`.

## Data gap analysis

Field-by-field, what `ContractPrintPage.vue` reads vs. what the pre-contract findOne returns:

| Template needs | Pre-contract findOne | Resolution |
|---|---|---|
| `contractedAt` | ✅ present | direct |
| `loanAmount` | ✅ present | direct |
| `annualInterestRate` | ✅ present | direct |
| `borrowers[].customer.fullName` | ✅ present | direct |
| `borrowers[].customer.idCard` | ✅ present | direct |
| asset `type` / `detail` / `realEstateForm` / `vehicleForm` | ✅ `preAssets[0]` | direct (no second API call) |
| `branch.name` | ✅ from `authStore` | unchanged |
| **`firstInstallmentDate`** | ❌ **absent** | **derived:** `contractedAt + 1 month` |
| **`finalInstallmentDate`** | ❌ **absent** | **derived:** `contractedAt + installmentCount months` |
| **`borrowers[].customer.birthDate`** | ❌ absent | widen the FE interface, [request from backend](tickets/BACKEND-REQUEST.md) |
| **`borrowers[].customer.mainAddress`** | ❌ absent | widen the FE interface, [request from backend](tickets/BACKEND-REQUEST.md) |

### Decision — installment dates derived client-side

A pre-contract is a *draft* agreement — the API has `contractedAt` and `installmentCount` but
no explicit schedule dates. The frontend derives:

- `firstInstallmentDate` = `contractedAt + 1 month`
- `finalInstallmentDate` = `contractedAt + installmentCount months`

Both are computed in `useInitPreContractPrint.ts` via dayjs and passed through the view-model
so `LoanAgreementDocument` renders them as real dates rather than blank underlines.

### Borrower `birthDate` and `mainAddress` — build against the widened interface

`IBorrowerCustomerList` (`src/models/modules/pre-contract/Borrower.model.ts`) is today:

```ts
{ id, idNo, idCard, email?, firstName, lastName, fullName }
```

The print template needs `birthDate` (for `อายุ`) and `mainAddress`
(`address`, `villageNo`, `subDistrict`, `district`, `province`) for **every** borrower.

**Widen the interface as part of this ticket** — both fields optional, mirroring
`IContractCustomer` on the contract API:

```ts
export interface IBorrowerCustomerList {
  id: number
  idNo: string
  idCard: string
  email?: string
  firstName: string
  lastName: string
  fullName: string
  birthDate?: string            // added — pending backend
  mainAddress?: IAddressRequest // added — pending backend
}
```

Optional keeps the build honest: the UI compiles and renders blanks until the API catches up,
and starts printing real values the moment it does — no follow-up frontend change needed.

**Rejected:** falling back to the top-level `customer` object. It carries both fields, but only
describes the primary customer. With co-borrowers it would print one person's address against
another's name on a legal document — worse than printing nothing.

Backend ask: [tickets/BACKEND-REQUEST.md](tickets/BACKEND-REQUEST.md).

## Refactor plan (do this first)

`ContractPrintPage.vue` is a 377-line page with the document markup, the data fetch, the Thai
date helpers, and the print styles all inlined. Copy-pasting it would guarantee the two prints
drift apart. Extract instead:

```
src/pages/contract/components/print/
├── LoanAgreementDocument.vue     ← whole document body, prop-driven
└── LoanAgreementSignatures.vue   ← signature block (single vs multi-borrower layouts)
```

**The seam is a normalized view-model.** Both pages map their own API shape into it, so
`LoanAgreementDocument` never knows which API it came from:

```ts
interface ILoanAgreementBorrower {
  id: number
  fullName: string
  idCard?: string
  birthDate?: string          // optional → blank underline
  mainAddress?: IAddressRequest  // optional → blank underline
}

interface ILoanAgreementDocument {
  branchName: string
  contractedAt: string
  loanAmount: number
  annualInterestRate: number
  borrowers: ILoanAgreementBorrower[]
  asset: IPrintAsset | null
  firstInstallmentDate?: string   // optional → derived for pre-contract
  finalInstallmentDate?: string   // optional → derived for pre-contract
}
```

Optional fields are what make the pre-contract case work without a second template: the
component renders the blank-underline idiom whenever a value is absent, and the contract page
simply always supplies them.

### Refactor gotchas

- **The `<style>` block is intentionally unscoped.** `.d-underline` and `.d-topic` are defined
  in a plain `<style>` (not `<style scoped>`) in `ContractPrintPage.vue`. Move them **with** the
  markup into `LoanAgreementDocument.vue`. If they get left behind or scoped incorrectly, the
  document silently loses its underlines and topic indents.
- **Thai date helpers** (`thaiDay` / `thaiMonth` / `thaiYear` / `ageYear`) are page-local
  functions over `useDayjs()`. They move into the shared component, not into both pages.
  `thaiYear` relies on the `BBBB` (Buddhist era) dayjs format — keep it.
- **`break-before-page`** on the ข้อ 6 wrapper is driven by `borrowers.length > 1`. It must key
  off the view-model's borrower count, not the raw API object.
- **Verify the refactor is a no-op for the existing page** before adding the new one. The
  contract print output must be byte-identical to what it renders today.

## Files this touches

**Refactor:**
- `src/pages/contract/pages/print/pages/ContractPrintPage.vue` — becomes thin, maps to view-model
- `src/pages/contract/components/print/LoanAgreementDocument.vue` — new
- `src/pages/contract/components/print/LoanAgreementSignatures.vue` — new

**New page:**
- `src/pages/contract/pages/pre-contract-print/pages/PreContractPrintPage.vue` — new
- `src/pages/contract/pages/pre-contract-print/composables/useInitPreContractPrint.ts` — new
- `src/router/modules/contract/index.ts` — add `PreContractPrintPage` route (`layout: 'blank'`, matching `ContractPrintPage`)

**Already done (no change needed):**
- `src/pages/contract/pages/pre-contract-detail/composables/useInitDetail.ts` — `onPrint` push already written
- `src/pages/contract/pages/pre-contract-detail/components/PreContractDetailMenuAction.vue` — `@print` already emitted
