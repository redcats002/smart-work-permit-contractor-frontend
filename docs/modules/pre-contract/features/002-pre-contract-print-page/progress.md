# PRE-002 — Progress Log

## 2026-08-05

**Status:** not-started — spec written, ready to implement.

### What's done

- [x] Gap analysis of `ContractPrintPage.vue` template reads vs. the pre-contract findOne
      response. Every field traced; results in [context.md](context.md).
- [x] Two decisions recorded (see below).
- [x] Refactor plan written: shared `LoanAgreementDocument` + `LoanAgreementSignatures`
      behind a normalized `ILoanAgreementDocument` view-model.
- [x] Task breakdown in [tickets/PRE-002.md](tickets/PRE-002.md).

### Decisions

- **Installment dates derived client-side.** A pre-contract has no agreed schedule dates in the
  API. `firstInstallmentDate` = `contractedAt + 1 month`, `finalInstallmentDate` =
  `contractedAt + installmentCount months`, computed in `useInitPreContractPrint.ts` via dayjs.
  Decision changed from "render blank underlines" — user override.
- **Borrower `birthDate` / `mainAddress` — build against a widened FE interface**, both optional,
  rather than waiting on the API. The UI compiles now and prints blanks; values appear on their
  own when the backend ships, with no second frontend change. Backend ask filed at
  [tickets/BACKEND-REQUEST.md](tickets/BACKEND-REQUEST.md).
  Falling back to the top-level `customer` object was rejected: with co-borrowers it would print
  the primary customer's address against a different borrower's name.

### Discovered

- **Live bug:** `useInitDetail.ts:90` pushes to route `PreContractPrintPage`, which does not
  exist. The print button on `PreContractDetailPage` is broken in `dev` until this ticket lands.
- The pre-contract page needs **one** API call, not two — `preAssets[0]` is already on the
  findOne response, whereas the contract page makes a separate `getContractAssets` call.

### What's next

All four tasks in [tickets/PRE-002.md](tickets/PRE-002.md) are unblocked and ordered:
refactor (visual no-op) → widen borrower model → data source → page + route.
Task 4 closes the broken-navigation bug.

### Pending (not blocking)

- **Backend:** `GET /api/v1/management/pre-contract/:id` should return `birthDate` and
  `mainAddress` on `borrowers[].customer` — request written at
  [tickets/BACKEND-REQUEST.md](tickets/BACKEND-REQUEST.md). **Still needs an owner to send it.**

## Files modified

None yet — this session produced the specification only.

## 2026-08-05 (implementation)

**Status:** done

### Tasks completed

1. **Refactor `ContractPrintPage`** — Extracted `LoanAgreementDocument.vue` (document body + Thai date helpers + unscoped `.d-underline`/`.d-topic` styles) and `LoanAgreementSignatures.vue` (single/multi-borrower signature layouts). `ContractPrintPage.vue` reduced to: fetch → map to `ILoanAgreementDocument` view-model → render. Visual no-op verified by code inspection (same template markup, same `formatter.fullName` call for borrower names, same `break-before-page` keyed off `doc.borrowers.length`).

2. **Widen `IBorrowerCustomerList`** — Added `birthDate?: string` and `mainAddress?: IAddressRequest` (both optional) to `src/models/modules/pre-contract/Borrower.model.ts`. UI compiles now, prints blanks until the API ships the fields.

3. **Create `useInitPreContractPrint`** — `src/pages/contract/pages/pre-contract-print/composables/useInitPreContractPrint.ts`. Uses `PreContractService.getContractFindOne(id)`, maps `IPreContractById` → `ILoanAgreementDocument`. Asset from `preAssets[0] ?? null` (no second API call). `firstInstallmentDate`/`finalInstallmentDate` derived from `contractedAt` + `installmentCount` via dayjs.

4. **Create page + route** — `PreContractPrintPage.vue` at `src/pages/contract/pages/pre-contract-print/pages/`. Route added to `src/router/modules/contract/index.ts` as `pre-contract/print/:id` with `name: 'PreContractPrintPage'`, `meta: { auth: true, layout: 'blank', title: 'พิมพ์สัญญา' }`. Print button on `PreContractDetailPage` (already wired in `useInitDetail.ts:90`) now resolves.

### Verification

- `bunx eslint` on all touched files — 0 errors.
- `bunx vue-tsc --noEmit` — no errors.
- `bunx vitest run` — 18 files, 234 tests passed.
- `bun run lint` fails on pre-existing `playwright-report/` directory (not in eslint ignores), unrelated to this change.

### Files modified

- `src/pages/contract/components/print/LoanAgreementDocument.vue` (new)
- `src/pages/contract/components/print/LoanAgreementSignatures.vue` (new)
- `src/pages/contract/pages/print/pages/ContractPrintPage.vue` (slimmed)
- `src/models/modules/pre-contract/Borrower.model.ts` (widened)
- `src/pages/contract/pages/pre-contract-print/composables/useInitPreContractPrint.ts` (new)
- `src/pages/contract/pages/pre-contract-print/pages/PreContractPrintPage.vue` (new)
- `src/router/modules/contract/index.ts` (route added)

### Pending (not blocking)

- **Backend:** `GET /api/v1/management/pre-contract/:id` should return `birthDate` and `mainAddress` on `borrowers[].customer` — see [tickets/BACKEND-REQUEST.md](tickets/BACKEND-REQUEST.md). Fields are optional on the FE interface, so the UI will start printing real values the moment the API ships.

## 2026-08-05 (bug discovery)

**Status:** in-progress — two new tickets filed.

### Discovered

- **Bug — only first asset rendered:** Both `useInitPrint.ts:24` and `useInitPreContractPrint.ts:31` take `asset[0]` / `preAssets[0]`. A contract can have multiple collateral assets; printing only the first is incorrect. Filed as [PRE-003](tickets/PRE-003.md).

- **Bug — apartment type not rendered:** `LoanAgreementDocument.vue` template only handles `isLand` and `isVehicle`. `APARTMENT_ROOM` assets fall through to a blank underline. Filed as part of [PRE-004](tickets/PRE-004.md).

- **Chore — inline template conditionals:** Asset-type-specific field mapping (`isLand`/`isVehicle` conditionals in template lines 104-121) should be a utility function, not template logic. Filed as [PRE-004](tickets/PRE-004.md).

### New tickets

| ID | Type | Name | Deps |
|---|---|---|---|
| [PRE-003](tickets/PRE-003.md) | bug | Multi-asset rendering on print pages | PRE-002 |
| [PRE-004](tickets/PRE-004.md) | chore | Extract asset detail formatting to utility | — |

### Recommended order

PRE-004 first (utility extraction) → PRE-003 (multi-asset, uses the utility).

### Files affected (not yet modified)

- `src/pages/contract/pages/print/composables/useInitPrint.ts`
- `src/pages/contract/pages/pre-contract-print/composables/useInitPreContractPrint.ts`
- `src/pages/contract/components/print/LoanAgreementDocument.vue`
- `src/pages/contract/pages/print/pages/ContractPrintPage.vue`
- `src/pages/contract/components/print/utils/formatAssetDetail.ts` (new)

## 2026-08-05 (PRE-003 + PRE-004 implementation)

**Status:** done

### Tasks completed

1. **Create `formatAssetDetail` utility** (PRE-004) — `src/pages/contract/components/print/utils/formatAssetDetail.ts`. Handles all 3 asset types: land (NS3*/TITLE_DEED*), vehicle (VEHICLE_*), apartment (APARTMENT_*). Returns Thai-formatted string with all relevant fields per type.

2. **Update `LoanAgreementDocument.vue`** (PRE-004 + PRE-003) — Changed `ILoanAgreementDocument.asset` (singular) to `assets` (array). Template now loops over all assets using `v-for` with `formatAssetDetail()`. Removed dead code: `isLand`/`isVehicle` wrapper functions, `asset` computed property, unused `TAssetType`/`isLandAllAsset`/`isVehicleAsset` imports.

3. **Update `useInitPrint.ts`** (PRE-003) — Changed from `asset: Ref<IContractAssetList | null>` to `assets: Ref<IContractAssetList[]>`. Fetch now returns full array: `assets.value = assetRes.data`.

4. **Update `useInitPreContractPrint.ts`** (PRE-003) — Changed mapping from `asset: data.preAssets[0] ?? null` to `assets: data.preAssets`.

5. **Update `ContractPrintPage.vue`** (PRE-003) — Changed destructured variable from `asset` to `assets`, view-model mapping from `asset: asset.value` to `assets: assets.value`.

### Verification

- `bunx eslint` on all touched files — 0 errors.
- `bunx vue-tsc --noEmit` — no errors.
- `bunx vitest run` — 18 files, 234 tests passed.

### Files modified

- `src/pages/contract/components/print/utils/formatAssetDetail.ts` (new)
- `src/pages/contract/components/print/LoanAgreementDocument.vue` (interface + template + dead code removed)
- `src/pages/contract/pages/print/composables/useInitPrint.ts` (asset → assets array)
- `src/pages/contract/pages/pre-contract-print/composables/useInitPreContractPrint.ts` (asset → assets)
- `src/pages/contract/pages/print/pages/ContractPrintPage.vue` (view-model mapping)
